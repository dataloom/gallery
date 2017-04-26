import React, { PropTypes } from 'react';
import { Timeline, TimelineEvent } from 'react-event-timeline';
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
    this.state = { datesToProps: this.getDatesToProps(props.organizedNeighbors, props.dateProps) };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ datesToProps: this.getDatesToProps(nextProps.organizedNeighbors, nextProps.dateProps) });
  }

  getPropDetails = (propertyType, propertyValues, dateProps, row) => {
    const dateFqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
    const date = new Date(propertyValues[dateFqn]);
    const body = { propertyType, row };
    const dateValues = (dateProps[date]) ? dateProps[date].concat(body) : [body];
    return { [date]: dateValues };
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

  renderEvent = (date, dateDetails) => {
    const neighborId = (dateDetails.row.neighborEntitySet) ? dateDetails.row.neighborEntitySet.id : NO_NEIGHBOR;
    const neighborTitle = (dateDetails.row.neighborEntitySet) ? dateDetails.row.neighborEntitySet.title : '';
    const title = (dateDetails.row.src)
      ? `${dateDetails.row.associationEntitySet.title} ${neighborTitle}: ${dateDetails.propertyType.title}`
      : `${neighborTitle} ${dateDetails.row.associationEntitySet.title}: ${dateDetails.propertyType.title}`;
    const dateObj = new Date(date);
    const formattedDate = `${dateObj.toDateString()} ${dateObj.toLocaleTimeString()}`;
    return (
      <TimelineEvent
          title={<div className={styles.timelineTitle}>{title}</div>}
          createdAt={<div className={styles.timelineDate}>{formattedDate}</div>}>
        {this.props.renderNeighborGroupFn([dateDetails.row], neighborId, false)}
      </TimelineEvent>
    );
  }

  renderTimelineEvents = (datesToProps) => {
    const orderedDates = Object.keys(datesToProps).sort((date1, date2) => {
      return new Date(date1).getTime() > new Date(date2).getTime();
    });
    const events = [];
    orderedDates.forEach((date) => {
      datesToProps[date].forEach((dateDetails) => {
        events.push(this.renderEvent(date, dateDetails));
      });
    });
    return events;
  }

  render() {
    return (
      <Timeline>
        {this.renderTimelineEvents(this.state.datesToProps)}
      </Timeline>
    );
  }
}
