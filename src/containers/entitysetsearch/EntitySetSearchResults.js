import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Constants, EntityDataModelApi, SearchApi, Models } from 'lattice';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router';

import DataTable from './components/DataTable';
import PersonCard from './components/PersonCard';
import RowImage from './components/RowImage';
import EventTimeline from './EventTimeline';
import EdmConsts from '../../utils/Consts/EdmConsts';
import { COUNT_FQN, FIRST_NAMES, LAST_NAMES } from '../../utils/Consts/StringConsts';
import { getTitleV2 } from '../../utils/EntityTypeTitles';

import styles from './styles.module.css';

const {
  FullyQualifiedName
} = Models;

const {
  OPENLATTICE_ID_FQN
} = Constants;

// TODO: REMOVE
const NEIGHBOR_ENTITY_SET_MISSING = 'NEIGHBOR_ENTITY_SET_MISSING';
// TODO: REMOVE

const BreadcrumbsContainer = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
`;

const Breadcrumb = styled.span`
  color: ${(props) => {
    return props.link ? '#337ab7' : '#777777';
  }};
  ${(props) => {
    if (props.link) {
      return css`
        &:hover {
          color: #23527c;
          cursor: pointer;
          text-decoration: underline;
        }
      `;
    }
    return '';
  }}
`;

const ImageCellContainer = styled.div`
  display: flex;
`;

const ViewTab = styled.div`
  margin-bottom: 10px;
`;

let keyCounter = 0;
const getKeyCounter = () => {
  keyCounter += 1;
  return keyCounter;
};

export default class EntitySetSearchResults extends React.Component {

  static propTypes = {
    results: PropTypes.array.isRequired,
    entitySetId: PropTypes.string.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    propertyTypesByFqn: PropTypes.object.isRequired,
    entitySetPropertyMetadata: PropTypes.object.isRequired,
    hidePaginationFn: PropTypes.func.isRequired
  }

  static defaultProps = {
    hidePaginationFn: () => {}
  }

  constructor(props) {

    super(props);

    const searchResults = Immutable.fromJS(props.results);

    this.state = {
      searchResults,
      breadcrumbs: [],
      neighborView: 'TABLE',
      neighborDateProps: {},
      neighborResults: Immutable.Map(),
      selectedEntity: Immutable.Map(),
      selectedEntityId: undefined,
      selectedEntitySet: Immutable.Map(),
      personPropertiesExist: false,
      renderPersonView: undefined
    };
  }

  componentDidMount() {

    const personPropertiesExist = this.personPropertiesExist(this.props.propertyTypes);
    let { renderPersonView } = this.state;
    if (renderPersonView === undefined && personPropertiesExist) renderPersonView = true;

    this.setState({
      personPropertiesExist,
      renderPersonView
    });
  }

  componentWillReceiveProps(nextProps) {

    const searchResults = Immutable.fromJS(nextProps.results);
    const personPropertiesExist = this.personPropertiesExist(nextProps.propertyTypes);
    let { renderPersonView } = this.state;
    if (renderPersonView === undefined && personPropertiesExist) renderPersonView = true;

    this.setState({
      searchResults,
      personPropertiesExist,
      renderPersonView
    });
  }

  processNeighborResults = (neighbors) => {

    // TODO: dateProps logic is just copied over from RowNeighbors. consider redoing this.
    const dateProps = {};
    const organizedNeighbors = {};

    neighbors.forEach((neighbor) => {
      if (!neighbor) {
        return;
      }
      const associationEntitySetId = neighbor.associationEntitySet.id;
      if (associationEntitySetId) {
        if (!organizedNeighbors[associationEntitySetId]) {
          organizedNeighbors[associationEntitySetId] = {};
          Object.keys(neighbor.associationDetails).forEach((fqn) => {
            const propertyType = this.props.propertyTypesByFqn[fqn];
            if (propertyType) {
              if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype)) {
                if (dateProps[associationEntitySetId]) {
                  dateProps[associationEntitySetId].push(propertyType.id);
                }
                else {
                  dateProps[associationEntitySetId] = [propertyType.id];
                }
              }
            }
          });
        }
        const neighborEntitySetId = (neighbor.neighborEntitySet)
          ? neighbor.neighborEntitySet.id
          : NEIGHBOR_ENTITY_SET_MISSING;
        if (!organizedNeighbors[associationEntitySetId][neighborEntitySetId]) {
          organizedNeighbors[associationEntitySetId][neighborEntitySetId] = [neighbor];
          if (neighbor.neighborDetails) {
            Object.keys(neighbor.neighborDetails).forEach((fqn) => {
              const propertyType = this.props.propertyTypesByFqn[fqn];
              if (propertyType) {
                if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype)) {
                  if (dateProps[neighborEntitySetId]) {
                    dateProps[neighborEntitySetId].push(propertyType.id);
                  }
                  else {
                    dateProps[neighborEntitySetId] = [propertyType.id];
                  }
                }
              }
            });
          }
        }
        else {
          organizedNeighbors[associationEntitySetId][neighborEntitySetId].push(neighbor);
        }
      }
    });

    return {
      neighborDateProps: dateProps,
      neighborResults: Immutable.fromJS(organizedNeighbors)
    };
  }

  personPropertiesExist = (propertyTypes) => {

    const properties = propertyTypes.map((propertyType) => {
      try {
        return new FullyQualifiedName(propertyType.type);
      }
      catch (e) {
        console.error('EntitySetSearchResults', e);
        return '';
      }
    });

    if (properties && properties.length > 0) {

      let hasFirstName = false;
      let hasLastName = false;
      let hasPicture = false;

      properties.forEach((property) => {
        if (property) {
          const value = (typeof property === 'string') ? property : property.getName();
          if (FIRST_NAMES.includes(value.toLowerCase())) {
            hasFirstName = true;
          }
          if (LAST_NAMES.includes(value.toLowerCase())) {
            hasLastName = true;
          }
          if (value.toLowerCase() === 'mugshot' || value.toLowerCase() === 'picture') {
            hasPicture = true;
          }
        }
      });

      if (hasFirstName && hasLastName && hasPicture) {
        return true;
      }
    }
    return false;
  }

  onEntitySelect = (selectedEntityId, selectedEntitySetId, selectedEntity) => {

    if (selectedEntityId === this.state.selectedEntityId) {
      return;
    }

    this.props.hidePaginationFn(true);

    EntityDataModelApi
      .getEntitySet(selectedEntitySetId)
      .then((entitySet) => {
        EntityDataModelApi
          .getEntityType(entitySet.entityTypeId)
          .then((entityType) => {
            SearchApi
              .searchEntityNeighbors(selectedEntitySetId, selectedEntityId)
              .then((neighbors) => {
                const neighborList = neighbors || [];
                const { neighborDateProps, neighborResults } = this.processNeighborResults(neighborList);
                const selectedEntitySet = Immutable.fromJS(entitySet);
                const crumb = {
                  neighborResults,
                  selectedEntity,
                  selectedEntityId,
                  selectedEntitySet,
                  title: getTitleV2(entityType, selectedEntity)
                };
                this.setState({
                  neighborDateProps,
                  neighborResults,
                  selectedEntity,
                  selectedEntityId,
                  selectedEntitySet,
                  breadcrumbs: this.state.breadcrumbs.concat(crumb)
                });
              });
          });
      });
  }

  backToSearchResults = () => {
    this.setState({
      breadcrumbs: [],
      neighborResults: Immutable.Map(),
      selectedEntity: Immutable.Map(),
      selectedEntityId: undefined,
      selectedEntitySet: Immutable.Map()
    });
    this.props.hidePaginationFn(false);
  }

  jumpToSelectedEntity = (index) => {
    const crumb = this.state.breadcrumbs[index];
    this.setState({
      breadcrumbs: this.state.breadcrumbs.slice(0, index + 1),
      neighborResults: crumb.neighborResults,
      selectedEntity: crumb.selectedEntity,
      selectedEntityId: crumb.selectedEntityId,
      selectedEntitySet: crumb.selectedEntitySet
    });
  }

  renderBreadcrumbs = () => {

    if (this.state.searchResults.size === 0) {
      return null;
    }

    const breadcrumbs = [];

    breadcrumbs.push(
      <Breadcrumb key={`bc-${getKeyCounter()}`}>{'/ '}</Breadcrumb>
    );

    if (this.state.breadcrumbs.length === 0) {
      breadcrumbs.push(
        <Breadcrumb key={`bc-${getKeyCounter()}`}>{'Search Results'}</Breadcrumb>
      );
    }
    else {
      breadcrumbs.push(
        <Breadcrumb
            link
            key={`bc-${getKeyCounter()}`}
            onClick={this.backToSearchResults}>
          {'Search Results'}
        </Breadcrumb>
      );
    }

    this.state.breadcrumbs.forEach((crumb, index) => {

      breadcrumbs.push(<Breadcrumb key={`bc-${getKeyCounter()}`}>{' / '}</Breadcrumb>);

      if (index + 1 === this.state.breadcrumbs.length) {
        breadcrumbs.push(<Breadcrumb key={`bc-${getKeyCounter()}`}>{crumb.title}</Breadcrumb>);
      }
      else {
        breadcrumbs.push(
          <Breadcrumb
              link
              key={`bc-${getKeyCounter()}`}
              onClick={() => {
                this.jumpToSelectedEntity(index);
              }}>
            {crumb.title}
          </Breadcrumb>
        );
      }
    });

    return (
      <BreadcrumbsContainer>
        {breadcrumbs}
      </BreadcrumbsContainer>
    );
  }

  renderViewTab = () => {
    if (!this.state.personPropertiesExist) return null;
    return (
      <ViewTab className={styles.viewToolbar}>
        <ButtonGroup>
          <Button
              onClick={() => {
                this.setState({ renderPersonView: true });
              }}
              active={this.state.renderPersonView}>
            Person View
          </Button>
          <Button
              onClick={() => {
                this.setState({ renderPersonView: false });
              }}
              active={!this.state.renderPersonView}>
            Table View
          </Button>
        </ButtonGroup>
      </ViewTab>
    );
  }

  renderNoResults = () => {
    return (
      <div>There are no results to display.</div>
    );
  }

  getSearchResultsDataTableHeaders = () => {
    let showCountColumn = false;
    let hasCustomHeaders = false;
    this.state.searchResults.forEach((result) => {
      if (result.has(COUNT_FQN)) {
        showCountColumn = true;
      }
      if (result.has('count.Headers')) {
        hasCustomHeaders = true;
      }
    });
    // TODO: make this more standard. headers is a list of objects, where each object has an id and a value
    const headers = Immutable.List().withMutations((list) => {
      if (showCountColumn) {
        list.unshift(Immutable.fromJS({
          id: COUNT_FQN,
          value: 'Count'
        }));
      }

      if (hasCustomHeaders) {
        this.state.searchResults.first().get('count.Headers').forEach((countHeader) => {
          const newId = countHeader.get('id');
          const newValue = countHeader.get('value');
          list.push(Immutable.fromJS({
            id: newId,
            value: newValue
          }));
        });
      }

      this.props.propertyTypes.forEach((propertyType) => {
        const title = (this.props.entitySetPropertyMetadata[propertyType.id])
          ? this.props.entitySetPropertyMetadata[propertyType.id].title
          : propertyType.title;
        try {
          const fqn = new FullyQualifiedName(propertyType.type);
          list.push(Immutable.fromJS({
            id: fqn.getFullyQualifiedName(),
            value: title
          }));
        }
        catch (e) {
          console.error('EntitySetSearchResults', e);
        }
      });
    });

    return headers;
  }

  renderSearchResultsDataTable = () => {

    let headers = this.getSearchResultsDataTableHeaders();

    // it doesn't make sense to show pictures in the data table as they are base64 encoded strings
    // removing the picture column also helps with performance since the picture string is very large
    headers = headers.filterNot((header) => {
      const id = header.get('id', '').toLowerCase();
      return id.includes('mugshot') || id.includes('picture') || id.endsWith('.signature');
    });

    const onClick = (selectedRowIndex, selectedRowData) => {
      const selectedEntityId = this.state.searchResults.getIn([selectedRowIndex, OPENLATTICE_ID_FQN, 0]);
      const selectedEntity = Immutable.fromJS({
        headers,
        data: selectedRowData
      });
      this.onEntitySelect(selectedEntityId, this.props.entitySetId, selectedEntity);
    };

    return (
      <DataTable
          data={this.state.searchResults}
          headers={headers}
          onRowClick={onClick} />
    );
  }

  renderSearchResultsPersonList = () => {

    const headers = this.getSearchResultsDataTableHeaders();

    const personList = [];
    this.state.searchResults.forEach((personResult, index) => {

      const onClick = () => {
        const selectedEntityId = personResult.getIn([OPENLATTICE_ID_FQN, 0]);
        const selectedEntity = Immutable.fromJS({
          headers,
          data: personResult
        });
        this.onEntitySelect(selectedEntityId, this.props.entitySetId, selectedEntity);
      };

      personList.push(
        <PersonCard key={`person-${getKeyCounter()}`} data={personResult} onClick={onClick} index={index + 1} />
      );
    });

    return personList;
  }


  getImageCellData(data) {
    const images = data.map((imgSrc) => {
      const key = `img-${getKeyCounter()}`;
      return <RowImage key={key} tooltipId={key} imgSrc={imgSrc} />;
    });

    return (
      <ImageCellContainer>
        {images}
      </ImageCellContainer>
    );
  }

  renderSelectedEntityDataTable = () => {

    const propertyHeader = 'Property';
    const dataHeader = 'Data';
    const headers = Immutable.fromJS([
      { id: propertyHeader, value: propertyHeader },
      { id: dataHeader, value: dataHeader }
    ]);

    const getImageCellData = this.getImageCellData.bind(this);

    /*
     * we need to convert the selected row into the correct structure which DataTable expects for the 'data' prop.
     * in other words, we need to expand/invert the selected row into a list, where each element of the list is a
     * property from the selected row. in other words, we need to convert the selected row, which is an object
     * structured as SetMultiMap, into an object structured as ListSetMultiMap.
     *
     * in other words, turn this (the selected row):
     *
     *   { "id": ["some_id"], "fqn.1": ['some_data'], "fqn.2": ["some_more_data"] }
     *
     * ... into this (what DataTable expects for the 'data' prop):
     *
     *   [
     *     { "Property": ["id"], "Data": ["some_id"] },
     *     { "Property": ["fqn.1"], "Data": ["some_data"] },
     *     { "Property": ["fqn.2"], "Data": ["some_more_data"] },
     *   ]
     */
    const data = Immutable.List().withMutations((list) => {
      this.state.selectedEntity.get('headers', []).forEach((header) => {

        const headerId = header.get('id', '');
        if (this.state.selectedEntity.hasIn(['data', headerId])) {

          let dataValue :any = this.state.selectedEntity.getIn(['data', headerId]);

          // HACK: for displaying images in the table
          const headerIdLC = headerId.toLowerCase();
          if (headerIdLC.includes('mugshot') || headerIdLC.includes('picture') || headerIdLC.endsWith('.signature')) {
            dataValue = getImageCellData(dataValue);
          }

          const item = Immutable.Map()
            .set(propertyHeader, header.get('value'))
            .set(dataHeader, dataValue);
          list.push(item);
        }
      });
    });

    return (
      <div>
        {
          (this.state.renderPersonView)
            ? <PersonCard data={this.state.selectedEntity.get('data')} />
            : null
        }
        <DataTable
            data={data}
            excludeEmptyColumns={false}
            headers={headers} />
      </div>
    );
  }

  renderNeighborsViewToolbar = () => {

    return (
      <div className={styles.viewToolbar}>
        <ButtonGroup>
          <Button
              onClick={() => {
                this.setState({ neighborView: 'TABLE' });
              }}
              active={this.state.neighborView === 'TABLE'}>
            Table
          </Button>
          <Button
              onClick={() => {
                this.setState({ neighborView: 'TIMELINE' });
              }}
              active={this.state.neighborView === 'TIMELINE'}>
            Timeline
          </Button>
        </ButtonGroup>
      </div>
    );
  }


  renderNeighborsTimeline = () => {

    return (
      <EventTimeline
          organizedNeighbors={this.state.neighborResults.toJS()}
          dateProps={this.state.neighborDateProps}
          renderNeighborGroupFn={(dateFilteredNeighbors) => {
            const neighborGroup = Immutable.fromJS(dateFilteredNeighbors);
            const neighborGroupHeaders = this.getNeighborGroupHeaders(neighborGroup);
            const neighborGroupData = this.getNeighborGroupData(neighborGroup);
            return this.getNeighborGroupDataTable(neighborGroup, neighborGroupData, neighborGroupHeaders);
          }} />
    );
  }

  getNeighborGroupDataTableTitle = (neighbor) => {

    let entitySetTitle = '';
    if (this.state.selectedEntitySet.has('title')) {
      entitySetTitle = this.state.selectedEntitySet.get('title');
    }

    const neighborEntitySetId = neighbor.getIn(['neighborEntitySet', 'id']);
    const neighborEntitySetTitle = neighbor.getIn(['neighborEntitySet', 'title']);
    const associationEntitySetTitle = neighbor.getIn(['associationEntitySet', 'title']);

    const neighborTitle = (neighborEntitySetId === NEIGHBOR_ENTITY_SET_MISSING)
      ? (
        <span className={styles.missingTitle}>?</span>
      )
      : (
        <Link to={`/entitysets/${neighborEntitySetId}`} className={styles.neighborGroupDataTableTitleLink}>
          {neighborEntitySetTitle}
        </Link>
      );

    return (neighbor.get('src'))
      ? (
        <div className={styles.neighborGroupDataTableTitle}>
          <p>{entitySetTitle}</p>
          <p>{associationEntitySetTitle}</p>
          <p>{neighborTitle}</p>
        </div>
      )
      : (
        <div className={styles.neighborGroupDataTableTitle}>
          <p>{neighborTitle}</p>
          <p>{associationEntitySetTitle}</p>
          <p>{entitySetTitle}</p>
        </div>
      );
  }

  getNeighborGroupHeaders = (neighborGroup) => {

    return Immutable.List().withMutations((headers) => {
      // each neighbor in the neighbor group has identical PropertyTypes, so we only need one neighbor
      neighborGroup.first().get('associationDetails', Immutable.Map()).keySeq()
        .forEach((fqn) => {
          const propertyType = this.props.propertyTypesByFqn[fqn];
          if (propertyType) {
            headers.push(Immutable.Map({
              id: fqn,
              value: propertyType.title
            }));
          }
        });
      let neighbor = neighborGroup.first().get('neighborDetails', Immutable.Map()).keySeq();
      if (neighbor === null || neighbor === undefined) {
        neighbor = Immutable.List();
      }
      neighbor.forEach((fqn) => {
        const propertyType = this.props.propertyTypesByFqn[fqn];
        if (propertyType) {
          headers.push(Immutable.Map({
            id: fqn,
            value: propertyType.title
          }));
        }
      });
    });
  }

  removeDuplicates = (list1, list2) => {
    let valueSet = Immutable.Set();
    list1.concat(list2).forEach((val) => {
      valueSet = valueSet.add(val);
    });
    return valueSet.toList();
  }

  getNeighborGroupData = (neighborGroup) => {

    return neighborGroup.map((neighbor) => {

      const associationDetails = neighbor.get('associationDetails', Immutable.Map());
      const neighborDetails = neighbor.get('neighborDetails', Immutable.Map());

      // TODO: how do we handle duplicate keys with different values? is that even possible?
      let mergedDetails = associationDetails.mergeWith(this.removeDuplicates, neighborDetails);

      if (neighbor.has('neighborId')) {
        mergedDetails = mergedDetails.set('id', neighbor.get('neighborId'));
      }

      return mergedDetails;
    });
  }

  getNeighborGroupDataTable = (neighborGroup, neighborGroupData, neighborGroupHeaders) => {

    const firstNeighbor = neighborGroup.first();
    const title = this.getNeighborGroupDataTableTitle(firstNeighbor);
    const neighborEntitySetId = firstNeighbor.getIn(['neighborEntitySet', 'id']);

    const onClick = (selectedRowIndex, selectedRowData) => {
      const neighborEntityId = neighborGroup.getIn([selectedRowIndex, 'neighborId']);
      const selectedEntity = Immutable.fromJS({
        data: selectedRowData,
        headers: neighborGroupHeaders
      });
      this.onEntitySelect(neighborEntityId, neighborEntitySetId, selectedEntity);
    };

    return (
      <div key={`${neighborEntitySetId}-${getKeyCounter()}`}>
        {title}
        <DataTable
            data={neighborGroupData}
            headers={neighborGroupHeaders}
            onRowClick={onClick} />
      </div>
    );
  }

  renderNeighborDataTables = () => {

    if (!this.state.neighborResults || this.state.neighborResults.isEmpty()) {
      return null;
    }

    const associationGroupSection = [];

    this.state.neighborResults.forEach((associationGroup, associationEntitySetId) => {

      const neighborGroupSection = [];

      associationGroup.forEach((neighborGroup) => {

        const neighborGroupData = this.getNeighborGroupData(neighborGroup);
        const neighborGroupHeaders = this.getNeighborGroupHeaders(neighborGroup);
        const neighborGroupDataTable = this.getNeighborGroupDataTable(
          neighborGroup,
          neighborGroupData,
          neighborGroupHeaders
        );

        neighborGroupSection.push(
          neighborGroupDataTable
        );
      }); // end associationGroup.forEach()

      const title = associationGroup.first().first().getIn(['associationEntitySet', 'title']);

      associationGroupSection.push((
        <div key={`${associationEntitySetId}-${getKeyCounter()}`}>
          <div className={styles.spacerSmall} />
          <hr />
          <div className={styles.spacerSmall} />
          <div className={styles.associationGroupTitle}>{title}</div>
          {neighborGroupSection}
        </div>
      ));

    }); // end neighborResults.forEach()

    return associationGroupSection;
  }


  renderNeighbors = () => {

    return (
      <div>
        {this.renderNeighborsViewToolbar()}
        {
          (this.state.neighborView === 'TABLE')
            ? this.renderNeighborDataTables()
            : this.renderNeighborsTimeline()
        }
      </div>
    );
  }

  renderSearchResultsContent = () => {

    return (
      <div>
        {this.renderBreadcrumbs()}
        {this.renderViewTab()}
        {
          (this.state.renderPersonView)
            ? this.renderSearchResultsPersonList()
            : this.renderSearchResultsDataTable()
        }
      </div>
    );
  }

  renderSelectedEntityContent = () => {

    return (
      <div>
        {this.renderBreadcrumbs()}
        {this.renderSelectedEntityDataTable()}
        {this.renderNeighbors()}
      </div>
    );
  }

  render() {

    if (this.state.searchResults.size === 0) {
      return this.renderNoResults();
    }

    return (
      <div>
        {
          (this.state.selectedEntityId)
            ? this.renderSelectedEntityContent()
            : this.renderSearchResultsContent()
        }
      </div>
    );
  }
}
