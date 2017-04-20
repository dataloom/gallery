import React, { PropTypes } from 'react';
import { FormGroup, InputGroup, FormControl, Button, ControlLabel } from 'react-bootstrap';
import securableObjectStyles from '../securableobject/securableobject.module.css';
import searchStyles from './styles.module.css';

export default class AdvancedSearchBox extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    propertyTypes: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    const searches = {};
    props.propertyTypes.forEach((propertyType) => {
      searches[propertyType.id] = {
        searchTerm: '',
        property: propertyType.id,
        exact: false
      };
    });
    this.state = { searches };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.propertyTypes.length > 0) {
      const searches = this.state.searches;
      nextProps.propertyTypes.forEach((propertyType) => {
        if (!searches[propertyType.id]) {
          searches[propertyType.id] = {
            searchTerm: '',
            property: propertyType.id,
            exact: false
          };
        }
      });
      this.setState({ searches });
    }
  }

  onChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state.searches);
  }

  updateSearch = (e, propertyTypeId, exactCheckboxUpdate) => {
    if (e) {
      const prevSearch = this.state.searches[propertyTypeId];
      const searchTerm = (exactCheckboxUpdate) ? prevSearch.searchTerm : e.target.value;
      const exact = (exactCheckboxUpdate) ? e.target.checked : prevSearch.exact;
      const searchDetails = Object.assign({}, prevSearch, { searchTerm, exact });
      const searches = Object.assign({}, this.state.searches, { [propertyTypeId]: searchDetails });
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
                value={this.state.searches[propertyType.id].searchTerm}
                type="text"
                onChange={(e) => {
                  this.updateSearch(e, propertyType.id, false);
                }} />
            <div className={searchStyles.advancedSearchCheckbox}>
              <input
                  type="checkbox"
                  aria-label="Exact Match"
                  onChange={(e) => {
                    this.updateSearch(e, propertyType.id, true);
                  }} />
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
