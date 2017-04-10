import React, { PropTypes } from 'react';
import { FormGroup, InputGroup, FormControl, Button, ControlLabel } from 'react-bootstrap';
import securableObjectStyles from '../securableobject/securableobject.module.css';
import searchStyles from './styles.module.css';

export default class AdvancedSearchBox extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    initialSearches: PropTypes.object
  }

  constructor(props) {
    super(props);
    const searches = props.initialSearches || {};
    props.propertyTypes.forEach((propertyType) => {
      searches[propertyType.id] = '';
    });
    this.state = { searches };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialSearches) {
      this.setState({ searches: nextProps.initialSearches });
    }
  }

  onChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state.searches);
  }

  updateSearch = (e, propertyTypeId) => {
    if (e) {
      const searches = Object.assign({}, this.state.searches, { [propertyTypeId]: e.target.value });
      this.setState({ searches });
    }
  }

  renderSearchBoxes = () => {
    return this.props.propertyTypes.map((propertyType) => {
      return (
        <InputGroup key={propertyType.id}>
          <ControlLabel>{propertyType.title}</ControlLabel>
          <br />
          <div className={searchStyles.formItemWrapper}>
            <FormControl
                bsClass={searchStyles.advancedSearchBox}
                value={this.state.searches[propertyType.id]}
                type="text"
                onChange={(e) => {
                  this.updateSearch(e, propertyType.id);
                }} />
            <div className={searchStyles.advancedSearchCheckbox}>
              <input type="checkbox" aria-label="Exact Match" />
            </div>
          </div>
        </InputGroup>
      );
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className={securableObjectStyles.search}>
        <FormGroup className={securableObjectStyles.keyword}>
          <div className={searchStyles.exactMatchLabel}>Exact?</div>
          {this.renderSearchBoxes()}
        </FormGroup>
        <Button type="submit" bsStyle="primary" className={securableObjectStyles.submitButton}>Search</Button>
      </form>
    );
  }

}
