import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { Button, ButtonGroup, Collapse } from 'react-bootstrap';
import { Timeline, TimelineEvent } from 'react-event-timeline';

import { defaultColorList } from '../../utils/Consts/ColorConsts';
import styles from './styles.module.css';

const NO_NEIGHBOR = 'NO_NEIGHBOR';

export default class EventTimeline extends React.Component {
  static propTypes = {
    dateProps: PropTypes.object,
    organizedNeighbors: PropTypes.object,
    renderNeighborGroupFn: PropTypes.func
  }

  constructor(props) {
    super(props);
    const datesToProps = this.getDatesToProps(props.organizedNeighbors, props.dateProps);
    const dateOptions = this.getDateOptions(datesToProps, props.dateProps);
    const selectedProps = this.getPropNamesFromDateProps(props.dateProps);
    this.state = {
      datesToProps,
      dateOptions,
      selectedProps,
      sortDesc: true,
      showDisplayPrefences: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const datesToProps = this.getDatesToProps(nextProps.organizedNeighbors, nextProps.dateProps);
    const dateOptions = this.getDateOptions(datesToProps, nextProps.dateProps);
    const selectedProps = this.getPropNamesFromDateProps(nextProps.dateProps);
    this.setState({ datesToProps, dateOptions, selectedProps });
  }

  getPropNamesFromDateProps = (dateProps) => {
    const propNames = new Set();
    Object.keys(dateProps).forEach((entitySetId) => {
      dateProps[entitySetId].forEach((propertyTypeId) => {
        propNames.add(this.getPropAclKeyAsString(entitySetId, propertyTypeId));
      });
    });
    return propNames;
  }

  getPropDetails = (propertyType, propertyValues, dateProps, row) => {
    const dateDetails = {};
    const dateFqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
    if (propertyValues[dateFqn]) {
      propertyValues[dateFqn].forEach((dateStr) => {
        const date = moment.parseZone(dateStr);
        const body = { propertyType, row };
        const dateValues = (dateProps[date]) ? dateProps[date].concat(body) : [body];
        dateDetails[date] = dateValues;
      });
    }
    return dateDetails;
  }

  getPropDetailsForRow = (row, dateProps, datesToProps) => {
    const rowDatesToProps = datesToProps;
    if (dateProps[row.associationEntitySet.id]) {
      row.associationPropertyTypes.forEach((property) => {
        if (dateProps[row.associationEntitySet.id].includes(property.id)) {
          Object.assign(rowDatesToProps, this.getPropDetails(property, row.associationDetails, rowDatesToProps, row));
        }
      });
    }
    if (row.neighborEntitySet && dateProps[row.neighborEntitySet.id]) {
      row.neighborPropertyTypes.forEach((property) => {
        if (dateProps[row.neighborEntitySet.id].includes(property.id)) {
          Object.assign(rowDatesToProps, this.getPropDetails(property, row.neighborDetails, rowDatesToProps, row));
        }
      });
    }
    return rowDatesToProps;
  }

  getDatesToProps = (organizedNeighbors, dateProps) => {
    let datesToProps = {};
    Object.keys(organizedNeighbors).forEach((associationId) => {
      Object.keys(organizedNeighbors[associationId]).forEach((neighborId) => {
        if (dateProps[associationId] || dateProps[neighborId]) {
          organizedNeighbors[associationId][neighborId].forEach((row) => {
            datesToProps = this.getPropDetailsForRow(row, dateProps, datesToProps);
          });
        }
      });
    });
    return datesToProps;
  }

  getPropAclKeyAsString = (entitySetId, propertyTypeId) => {
    return `${entitySetId}|${propertyTypeId}`;
  }

  getPropAclKeyFromString = (aclKeyString) => {
    return aclKeyString.split('|');
  }

  getCheckboxTitle = (propAndRow) => {
    let esTitle = '';
    const assocTitle = propAndRow.row.associationEntitySet.title;
    const neighborTitle = (propAndRow.row.neighborEntitySet) ? propAndRow.row.neighborEntitySet.title : '';
    esTitle = (propAndRow.row.src) ? `${assocTitle} ${neighborTitle}` : `${neighborTitle} ${assocTitle}`;
    return `${esTitle}: ${propAndRow.propertyType.title}`;
  }

  getDateOptions = (datesToProps, dateProps) => {
    const dateOptions = {};
    Object.values(datesToProps).forEach((propAndRowList) => {
      propAndRowList.forEach((propAndRow) => {
        const propertyTypeId = propAndRow.propertyType.id;
        const associationEntitySet = propAndRow.row.associationEntitySet;
        if (dateProps[associationEntitySet.id] && dateProps[associationEntitySet.id].includes(propertyTypeId)) {
          const aclKeyString = this.getPropAclKeyAsString(associationEntitySet.id, propertyTypeId);
          if (!dateOptions[aclKeyString]) {
            const dateNum = Object.keys(dateOptions).length;
            const color = defaultColorList[dateNum % defaultColorList.length];
            const title = this.getCheckboxTitle(propAndRow);
            dateOptions[aclKeyString] = { title, color };
          }

        }

        const neighborEntitySet = propAndRow.row.neighborEntitySet;
        if (neighborEntitySet && dateProps[neighborEntitySet.id]
          && dateProps[neighborEntitySet.id].includes(propertyTypeId)) {
          const aclKeyString = this.getPropAclKeyAsString(neighborEntitySet.id, propertyTypeId);
          if (!dateOptions[aclKeyString]) {
            const dateNum = Object.keys(dateOptions).length;
            const color = defaultColorList[dateNum % defaultColorList.length];
            const title = this.getCheckboxTitle(propAndRow);
            dateOptions[aclKeyString] = { title, color };
          }
        }
      });
    });
    return dateOptions;
  }

  updateChecked = (e, aclKeyString) => {
    const selectedProps = this.state.selectedProps;
    if (e.target.checked) {
      selectedProps.add(aclKeyString);
    }
    else {
      selectedProps.delete(aclKeyString);
    }
    this.setState({ selectedProps });
  }

  renderCheckbox = (aclKeyString) => {
    const { title, color } = this.state.dateOptions[aclKeyString];
    return (
      <div key={aclKeyString}>
        <input
            type="checkbox"
            id={aclKeyString}
            name={aclKeyString}
            checked={this.state.selectedProps.has(aclKeyString)}
            onChange={(e) => {
              this.updateChecked(e, aclKeyString);
            }} />
        <label htmlFor={aclKeyString} className={styles.checkboxLabel}>{title}</label>
        <div className={styles.colorSample} style={{ background: color }} />
      </div>
    );
  }

  renderSortOrderButtons = () => {
    return (
      <ButtonGroup>
        <Button
            onClick={() => {
              this.setState({ sortDesc: true });
            }}
            active={this.state.sortDesc}>
          <FontAwesome name="long-arrow-down" />
        </Button>
        <Button
            onClick={() => {
              this.setState({ sortDesc: false });
            }}
            active={!this.state.sortDesc}>
          <FontAwesome name="long-arrow-up" />
        </Button>
      </ButtonGroup>
    );
  }

  renderDisplayPreferencesBody = () => {
    const checkboxes = Object.keys(this.state.dateOptions).map((aclKeyString) => {
      return this.renderCheckbox(aclKeyString);
    });

    return (
      <Collapse in={this.state.showDisplayPrefences}>
        <div className={styles.checkboxContainer}>
          <div className={styles.checkboxTitle}>Select properties to display on the timeline.</div>
          {checkboxes}
          <br />
          <div className={styles.checkboxTitle}>Select sorted order.</div>
          {this.renderSortOrderButtons()}
        </div>
      </Collapse>
    );
  }

  renderDisplayPreferences = () => {
    const buttonName = (this.state.showDisplayPrefences) ? 'angle-up' : 'angle-down';
    return (
      <div>
        <div className={styles.displayPreferencesTitleBar}>
          <div>Display Preferences</div>
        </div>
        {this.renderDisplayPreferencesBody()}
        <button
            className={styles.expandDisplayPreferencesButton}
            onClick={() => {
              this.setState({ showDisplayPrefences: !this.state.showDisplayPrefences });
            }}>
          <FontAwesome name={buttonName} size="2x" />
        </button>
      </div>
    );
  }

  renderEvent = (date, dateDetailsRows, key) => {
    const dateDetails = dateDetailsRows[0];
    const propertyType = dateDetails.propertyType;
    const associationEntitySet = dateDetails.row.associationEntitySet;
    const neighborEntitySet = dateDetails.row.neighborEntitySet;
    const associationAclKey = this.getPropAclKeyAsString(associationEntitySet.id, propertyType.id);
    const neighborAclKey = (neighborEntitySet) ?
      this.getPropAclKeyAsString(neighborEntitySet.id, propertyType.id) : null;
    let color;
    if (neighborEntitySet && this.state.selectedProps.has(neighborAclKey)) {
      color = this.state.dateOptions[neighborAclKey].color;
    }
    else if (this.state.selectedProps.has(associationAclKey)) {
      color = this.state.dateOptions[associationAclKey].color;
    }
    else return null;

    const neighborId = (neighborEntitySet) ? neighborEntitySet.id : NO_NEIGHBOR;
    const neighborTitle = (neighborEntitySet) ? neighborEntitySet.title : '';
    const title = (dateDetails.row.src)
      ? `${associationEntitySet.title} ${neighborTitle}: ${propertyType.title}`
      : `${neighborTitle} ${associationEntitySet.title}: ${propertyType.title}`;
    const dateObj = moment.parseZone(date);
    const formattedDate = dateObj.format('MMMM Do YYYY, h:mm:ss a');
    const neighbors = dateDetailsRows.map((obj) => {
      return obj.row;
    });
    return (
      <TimelineEvent
          key={key}
          title={<div className={styles.timelineTitle}>{title}</div>}
          createdAt={<div className={styles.timelineDate}>{formattedDate}</div>}
          contentStyle={{ boxShadow: 'none' }}
          iconColor={color}>
        {this.props.renderNeighborGroupFn(neighbors, neighborId, false)}
      </TimelineEvent>
    );
  }

  renderTimelineEvents = (datesToProps) => {
    const orderedDates = Object.keys(datesToProps).sort((date1, date2) => {
      const firstIsEarliest = moment.parseZone(date1).isBefore(moment.parseZone(date2));
      if ((firstIsEarliest && this.state.sortDesc) || (!firstIsEarliest && !this.state.sortDesc)) return 1;
      return -1;
    });
    const events = [];
    orderedDates.forEach((date, dateIndex) => {
      Object.values(groupBy(datesToProps[date], (obj) => {
        const ptId = obj.propertyType.id;
        const esId = obj.row.neighborEntitySet.id;
        return `${ptId}-${esId}`;
      })).forEach((neighborGroup) => {
        events.push(this.renderEvent(date, neighborGroup, dateIndex));
      });
    });
    return events;
  }

  renderTimeline = () => {
    if (this.state.selectedProps.size === 0) return null;
    return (
      <div className={styles.timelineContainer}>
        <Timeline>
          {this.renderTimelineEvents(this.state.datesToProps)}
        </Timeline>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderDisplayPreferences()}
        {this.renderTimeline()}
      </div>
    );
  }
}
