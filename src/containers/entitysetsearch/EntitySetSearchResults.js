/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { EntityDataModelApi, SearchApi, Models } from 'lattice';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router';

import DataTable from './components/DataTable';
import PersonCard from './components/PersonCard';
import RowImage from './components/RowImage';
import EventTimeline from './EventTimeline';
import EdmConsts from '../../utils/Consts/EdmConsts';
import { FIRST_NAMES, LAST_NAMES } from '../../utils/Consts/StringConsts';
import { getTitleV2 } from '../../utils/EntityTypeTitles';

import styles from './styles.module.css';

type SetMultiMap = Map<string, Set<any>>;
type ListSetMultiMap = List<SetMultiMap>;

const {
  FullyQualifiedName
} = Models;

// TODO: REMOVE
const NEIGHBOR_ENTITY_SET_MISSING = 'NEIGHBOR_ENTITY_SET_MISSING';
// TODO: REMOVE

const BreadcrumbsContainer = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
`;

const Breadcrumb = styled.span`
  color: ${(props :Object) => {
    return props.link ? '#337ab7' : '#777777';
  }};
  ${(props :Object) => {
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
    entitySetPropertyMetadata: PropTypes.object.isRequired,
    hidePaginationFn: PropTypes.func.isRequired
  }

  static defaultProps = {
    hidePaginationFn: () => {}
  }

  state :{
    breadcrumbs :Object[],
    searchResults :List<Map<string, any>>,
    neighborView :string,
    neighborDateProps :Object,
    neighborResults :Map<string, Map<string, any>>,
    selectedEntity :Map<string, any>,
    selectedEntityId :UUID,
    selectedEntitySet :Map<string, any>
  }

  constructor(props :Object) {

    super(props);

    const searchResults :List<Map<string, any>> = Immutable.fromJS(props.results);

    this.state = {
      searchResults,
      breadcrumbs: [],
      neighborView: 'TABLE',
      neighborDateProps: {},
      neighborResults: Immutable.Map(),
      selectedEntity: Immutable.Map(),
      selectedEntityId: undefined,
      selectedEntitySet: Immutable.Map()
    };
  }

  componentWillReceiveProps(nextProps :Object) {

    const searchResults :List<Map<string, any>> = Immutable.fromJS(nextProps.results);

    this.setState({
      searchResults
    });
  }

  processNeighborResults = (neighbors :Object[]) => {

    // TODO: dateProps logic is just copied over from RowNeighbors. consider redoing this.
    const dateProps = {};
    const organizedNeighbors = {};

    neighbors.forEach((neighbor :Object) => {
      if (!neighbor) {
        return;
      }
      const associationEntitySetId :UUID = neighbor.associationEntitySet.id;
      if (associationEntitySetId) {
        if (!organizedNeighbors[associationEntitySetId]) {
          organizedNeighbors[associationEntitySetId] = {};
          neighbor.associationPropertyTypes.forEach((propertyType) => {
            if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype)) {
              if (dateProps[associationEntitySetId]) {
                dateProps[associationEntitySetId].push(propertyType.id);
              }
              else {
                dateProps[associationEntitySetId] = [propertyType.id];
              }
            }
          });
        }
        const neighborEntitySetId :UUID | string = (neighbor.neighborEntitySet)
          ? neighbor.neighborEntitySet.id
          : NEIGHBOR_ENTITY_SET_MISSING;
        if (!organizedNeighbors[associationEntitySetId][neighborEntitySetId]) {
          organizedNeighbors[associationEntitySetId][neighborEntitySetId] = [neighbor];
          if (neighbor.neighborPropertyTypes) {
            neighbor.neighborPropertyTypes.forEach((propertyType) => {
              if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype)) {
                if (dateProps[neighborEntitySetId]) {
                  dateProps[neighborEntitySetId].push(propertyType.id);
                }
                else {
                  dateProps[neighborEntitySetId] = [propertyType.id];
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

  personPropertiesExist = (properties :any[]) => {

    if (!properties || properties.length === 0) {
      return false;
    }

    let hasFirstName :boolean = false;
    let hasLastName :boolean = false;
    let hasMugshot :boolean = false;

    properties.forEach((property :string | FullyQualifiedName) => {
      if (property) {
        const value :string = (typeof property === 'string') ? property : property.getName();
        if (FIRST_NAMES.includes(value.toLowerCase())) {
          hasFirstName = true;
        }
        if (LAST_NAMES.includes(value.toLowerCase())) {
          hasLastName = true;
        }
        if (value.toLowerCase() === 'mugshot') {
          hasMugshot = true;
        }
      }
    });

    return hasFirstName && hasLastName && hasMugshot;
  }

  onEntitySelect = (selectedEntityId :UUID, selectedEntitySetId :UUID, selectedEntity :Map<string, any>) => {

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

  jumpToSelectedEntity = (index :number) => {
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

    this.state.breadcrumbs.forEach((crumb :Object, index :number) => {

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

  renderNoResults = () => {
    return (
      <div>There are no results to display.</div>
    );
  }

  getSearchResultsDataTableHeaders = () => {

    // TODO: make this more standard. headers is a list of objects, where each object has an id and a value
    let headers = Immutable.List().withMutations((list :List<Map<string, string>>) => {
      this.props.propertyTypes.forEach((propertyType :Object) => {
        const title :string = (this.props.entitySetPropertyMetadata[propertyType.id])
          ? this.props.entitySetPropertyMetadata[propertyType.id].title
          : propertyType.title;
        try {
          const fqn :FullyQualifiedName = new FullyQualifiedName(propertyType.type);
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

    let showCountColumn = false;
    this.state.searchResults.forEach((result) => {
      if (result.has('count')) {
        showCountColumn = true;
      }
    });

    if (showCountColumn) {
      headers = headers.unshift(Immutable.fromJS({
        id: 'count',
        value: 'Count'
      }));
    }

    return headers;
  }

  renderSearchResultsDataTable = () => {

    const headers :List<Map<string, string>> = this.getSearchResultsDataTableHeaders();

    const onClick = (selectedRowIndex :number, selectedRowData) => {
      const selectedEntityId :UUID = this.state.searchResults.getIn([selectedRowIndex, 'id', 0]);
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

    const headers :List<Map<string, string>> = this.getSearchResultsDataTableHeaders();

    const personList = [];
    this.state.searchResults.forEach((personResult :Map<string, any>) => {

      const onClick = () => {
        const selectedEntityId :UUID = personResult.getIn(['id', 0]);
        const selectedEntity = Immutable.fromJS({
          headers,
          data: personResult
        });
        this.onEntitySelect(selectedEntityId, this.props.entitySetId, selectedEntity);
      };

      personList.push(
        <PersonCard key={`person-${getKeyCounter()}`} data={personResult} onClick={onClick} />
      );
    });

    return personList;
  }


  getImageCellData(data) {

    const images = data.map((imgSrc :string) => {
      return <RowImage key={`img-${getKeyCounter()}`} imgSrc={imgSrc} />;
    });

    return (
      <ImageCellContainer>
        {images}
      </ImageCellContainer>
    );
  }

  renderSelectedEntityDataTable = () => {

    const propertyHeader :string = 'Property';
    const dataHeader :string = 'Data';
    const headers :List<string> = Immutable.fromJS([
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
    const data :ListSetMultiMap = Immutable.List().withMutations((list :ListSetMultiMap) => {
      this.state.selectedEntity.get('headers', []).forEach((header :Map<string, string>) => {

        const headerId :string = header.get('id');
        if (this.state.selectedEntity.hasIn(['data', headerId])) {

          let dataValue :any = this.state.selectedEntity.getIn(['data', headerId]);

          // HACK: for displaying images in the table
          if (headerId.toLowerCase().indexOf('mugshot') !== -1) {
            dataValue = getImageCellData(dataValue);
          }

          const item :Map<string, any> = Immutable.Map()
            .set(propertyHeader, header.get('value'))
            .set(dataHeader, dataValue);
          list.push(item);
        }
      });
    });

    const headerIds :FullyQualifiedName[] = this.state.selectedEntity
      .get('headers', Immutable.List())
      .map((header :Map<string, string>) => {
        try {
          return new FullyQualifiedName(header.get('id'));
        }
        catch (e) {
          header.get('id');
        }
      })
      .toJS();

    return (
      <div>
        {
          (this.personPropertiesExist(headerIds))
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

  getNeighborGroupDataTableTitle = (neighbor :Map<string, any>) => {

    let entitySetTitle :string = '';
    if (this.state.selectedEntitySet.has('title')) {
      entitySetTitle = this.state.selectedEntitySet.get('title');
    }

    const neighborEntitySetId :UUID = neighbor.getIn(['neighborEntitySet', 'id']);
    const neighborEntitySetTitle :UUID = neighbor.getIn(['neighborEntitySet', 'title']);
    const associationEntitySetTitle :UUID = neighbor.getIn(['associationEntitySet', 'title']);

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

  getNeighborGroupHeaders = (neighborGroup :List<any>) => {

    return Immutable.List().withMutations((headers :List<Map<string, string>>) => {
      // each neighbor in the neighbor group has identical PropertyTypes, so we only need one neighbor
      neighborGroup.first().get('associationPropertyTypes', Immutable.List())
        .forEach((propertyType :Map<string, any>) => {
          const fqn :FullyQualifiedName = new FullyQualifiedName(propertyType.get('type').toJS());
          headers.push(Immutable.Map({
            id: fqn.getFullyQualifiedName(),
            value: propertyType.get('title')
          }));
        });
      neighborGroup.first().get('neighborPropertyTypes', Immutable.List())
        .forEach((propertyType :Map<string, any>) => {
          const fqn :FullyQualifiedName = new FullyQualifiedName(propertyType.get('type').toJS());
          headers.push(Immutable.Map({
            id: fqn.getFullyQualifiedName(),
            value: propertyType.get('title')
          }));
        });
    });
  }

  getNeighborGroupData = (neighborGroup :List<any>) => {

    return neighborGroup.map((neighbor :Map<string, any>) => {

      const associationDetails :Map<string, any> = neighbor.get('associationDetails', Immutable.Map());
      const neighborDetails :Map<string, any> = neighbor.get('neighborDetails', Immutable.Map());

      // TODO: how do we handle duplicate keys with different values? is that even possible?
      let mergedDetails :Map<string, any> = associationDetails.mergeDeep(neighborDetails);

      if (neighbor.has('neighborId')) {
        mergedDetails = mergedDetails.set('id', neighbor.get('neighborId'));
      }

      return mergedDetails;
    });
  }

  getNeighborGroupDataTable = (neighborGroup, neighborGroupData, neighborGroupHeaders) => {

    const firstNeighbor :Map<string, any> = neighborGroup.first();
    const title :string = this.getNeighborGroupDataTableTitle(firstNeighbor);
    const neighborEntitySetId :UUID = firstNeighbor.getIn(['neighborEntitySet', 'id']);

    const onClick = (selectedRowIndex :number, selectedRowData) => {
      const neighborEntityId :UUID = neighborGroup.getIn([selectedRowIndex, 'neighborId']);
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

    this.state.neighborResults.forEach((associationGroup :Map<UUID, List<any>>, associationEntitySetId :UUID) => {

      const neighborGroupSection = [];

      associationGroup.forEach((neighborGroup :List<any>, neighborEntitySetId :UUID) => {

        if (neighborEntitySetId === NEIGHBOR_ENTITY_SET_MISSING) {
          console.log('no neighborEntitySetId')
        }

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

      const title :string = associationGroup.first().first().getIn(['associationEntitySet', 'title']);

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

    const properties :FullyQualifiedName[] = this.props.propertyTypes.map((propertyType) => {
      try {
        return new FullyQualifiedName(propertyType.type);
      }
      catch (e) {
        console.error('EntitySetSearchResults', e);
        return '';
      }
    });

    return (
      <div>
        {this.renderBreadcrumbs()}
        {
          (this.personPropertiesExist(properties))
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
