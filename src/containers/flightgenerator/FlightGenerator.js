import React from 'react';
import { EntityDataModelApi, AuthorizationApi } from 'lattice';
import { ButtonGroup, Button, Modal } from 'react-bootstrap';

import Page from '../../components/page/Page';
import Entity from './Entity';
import Association from './Association';

import { Permission } from '../../core/permissions/Permission';
import styles from './styles.module.css';

const DEFAULT_ENTITY = {
  entitySetId: '',
  alias: '',
  properties: {}
};

const DEFAULT_ASSOCIATION = {
  src: '',
  dst: '',
  entitySetId: '',
  alias: '',
  properties: {}
};

const PARSE_FNS = {
  Int16: 'parseShort',
  Int32: 'parseInt',
  Int64: 'parseLong',
  Double: 'parseDouble',
  Decimal: 'parseDouble'
};

export default class FlightGenerator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allEntitySetsAsMap: {},
      allEntityTypesAsMap: {},
      allPropertyTypesAsMap: {},
      allAssociationTypesAsMap: {},
      entityMappings: [],
      associationMappings: [],
      generatedFlight: '',
      generateModalOpen: false,
      generateValidateMessage: ''
    };
  }

  componentDidMount() {
    EntityDataModelApi.getEntityDataModel()
    .then((edm) => {
      const allEntitySetsAsMap = {};
      const allEntityTypesAsMap = {};
      const allPropertyTypesAsMap = {};
      const allAssociationTypesAsMap = {};
      edm.entityTypes.forEach((entityType) => {
        allEntityTypesAsMap[entityType.id] = entityType;
      });
      edm.propertyTypes.forEach((propertyType) => {
        allPropertyTypesAsMap[propertyType.id] = propertyType;
      });
      edm.associationTypes.forEach((associationType) => {
        allAssociationTypesAsMap[associationType.entityType.id] = associationType;
      });

      EntityDataModelApi.getAllEntitySets()
      .then((entitySets) => {
        const entitySetsById = {};
        const accessChecks = entitySets.map((entitySet) => {
          entitySetsById[entitySet.id] = entitySet;
          return {
            aclKey: [entitySet.id],
            permissions: [Permission.WRITE.name]
          };
        });
        AuthorizationApi.checkAuthorizations(accessChecks)
        .then((authorizations) => {
          authorizations.forEach((authorization) => {
            if (authorization.permissions[Permission.WRITE.name]) {
              const entitySet = entitySetsById[authorization.aclKey[0]];
              allEntitySetsAsMap[entitySet.id] = entitySet;
            }
          });
          this.setState({ allEntitySetsAsMap, allEntityTypesAsMap, allPropertyTypesAsMap, allAssociationTypesAsMap });
        });
      });

    });
  }

  entityIsValid = (entity) => {
    if (entity.entitySetId.length && entity.alias.length) {
      if (Object.values(entity.properties).filter(((value) => {
        return value.length;
      })).length) return true;
    }
    return false;
  }

  associationIsValid = (association) => {
    if (!association.src.length || !association.dst.length) return false;
    return this.entityIsValid(association);
  }

  tryGenerate = () => {
    let entitiesAreValid = true;
    let associationsAreValid = true;
    this.state.entityMappings.forEach((entityMapping) => {
      if (!this.entityIsValid(entityMapping)) entitiesAreValid = false;
    });
    this.state.associationMappings.forEach((associationMapping) => {
      if (!this.associationIsValid(associationMapping)) associationsAreValid = false;
    });
    if (entitiesAreValid && associationsAreValid) this.generate();
    else {
      let msg = 'At least one entity and at least one association are invalid and will not be written.';
      if (!entitiesAreValid && associationsAreValid) {
        msg = 'At least one entity is invalid and will not be written.';
      }
      if (entitiesAreValid && !associationsAreValid) {
        msg = 'At least one association is invalid and will not be written.';
      }
      this.setState({
        generateModalOpen: true,
        generateValidateMessage: msg
      });
    }

  }

  getPropertyFlightText = (properties, dateFormats) => {
    let text = '';
    Object.keys(properties).forEach((propertyTypeId) => {
      if (properties[propertyTypeId].length) {
        const property = this.state.allPropertyTypesAsMap[propertyTypeId];
        const fqn = `${property.type.namespace}.${property.type.name}`;
        const simple = `\n.addProperty( "${fqn}", "${properties[propertyTypeId]}" )`;
        const warning = `\n// Property ${fqn} uses datatype ${property.datatype} and may require additional parsing`;
        if (property.datatype !== 'String') {
          if (PARSE_FNS[property.datatype]) {
            // property is something we can parse
            text = text.concat(`\n.addProperty( "${fqn}" ).value( row -> Parsers.${PARSE_FNS[property.datatype]}( row.getAs( "${properties[propertyTypeId]}" ) ) ).ok()`);
          }
          else if (property.datatype === 'Date') {
            if (dateFormats && dateFormats[property.id]) {
              // property is a date and has a parser
              text = text.concat(`\n.addProperty( "${fqn}" ).value( row -> Parsers.parseDate( row.getAs( "${properties[propertyTypeId]}" ), "${dateFormats[property.id]}" ) ).ok()`);
            }
            else {
              // property is a date but no parser is specified for it
              text = text.concat(warning).concat(simple);
            }
          }
          else {
            // property is something other than a string that we don't have a parser for
            text = text.concat(warning).concat(simple);
          }
        }
        // property is a string. how nice for us
        else text = text.concat(simple);
      }
    });
    return text;
  }

  getEntityFlightText = (entity) => {
    let text = `\n.addEntity( "${entity.alias}" )`;
    text = text.concat(`\n.to( "${this.state.allEntitySetsAsMap[entity.entitySetId].name}" )`);
    text = text.concat(this.getPropertyFlightText(entity.properties, entity.dateFormats));
    text = text.concat('\n.endEntity()\n');
    return text;
  }

  getAssociationFlightText = (association, index) => {
    let text = `\n.addAssociation( "association${index}" )`;
    text = text.concat(`\n.to( "${this.state.allEntitySetsAsMap[association.entitySetId].name}" )`);
    text = text.concat(`\n.fromEntity( "${association.src}" )`);
    text = text.concat(`\n.toEntity( "${association.dst}" )`);
    text = text.concat(this.getPropertyFlightText(association.properties, association.dateFormats));
    text = text.concat('\n.endAssociation()\n');
    return text;
  }

  generate = () => {
    const entities = this.state.entityMappings.filter((entity) => {
      return this.entityIsValid(entity);
    });
    const associations = this.state.associationMappings.filter((association) => {
      return this.associationIsValid(association);
    });
    let flight = 'Flight flight = Flight.newFlight()';
    flight = flight.concat('\n.createEntities()\n');
    entities.forEach((entity) => {
      flight = flight.concat(this.getEntityFlightText(entity));
    });
    flight = flight.concat('\n.endEntities()');
    if (associations.length) {
      flight = flight.concat('\n.createAssociations()\n');
      associations.forEach((association, index) => {
        flight = flight.concat(this.getAssociationFlightText(association, index));
      });
      flight = flight.concat('\n.endAssociations()');
    }
    flight = flight.concat('\n.done();');

    this.setState({
      generatedFlight: flight,
      generateModalOpen: false,
      generateValidateMessage: ''
    });
  }

  addNewEntity = () => {
    const entityMappings = this.state.entityMappings;
    entityMappings.push(Object.assign({}, DEFAULT_ENTITY));
    this.setState({ entityMappings });
  }

  renderNewEntityButton = () => {
    return (
      <Button
          onClick={() => {
            this.addNewEntity();
          }}>
        Add entity
      </Button>
    );
  }

  onEntityChange = (entity, index) => {
    const entityMappings = this.state.entityMappings;
    entityMappings[index] = entity;
    this.setState({ entityMappings });
  }

  onEntityDelete = (index) => {
    const entityMappings = this.state.entityMappings;
    entityMappings.splice(index, 1);
    this.setState({ entityMappings });
  }

  onAssociationChange = (association, index) => {
    const associationMappings = this.state.associationMappings;
    associationMappings[index] = association;
    this.setState({ associationMappings });
  }

  onAssociationDelete = (index) => {
    const associationMappings = this.state.associationMappings;
    associationMappings.splice(index, 1);
    this.setState({ associationMappings });
  }

  closeValidateModal = () => {
    this.setState({
      generateModalOpen: false,
      generateValidateMessage: ''
    });
  }

  renderEntities = () => {
    const { allEntitySetsAsMap, allEntityTypesAsMap, allPropertyTypesAsMap } = this.state;
    const entityAliases = this.state.entityMappings.map((entity) => {
      return entity.alias;
    });
    const entities = this.state.entityMappings.map((entityMapping, index) => {
      const usedAliases = entityAliases.filter((alias, aIndex) => {
        return aIndex !== index;
      });
      return (
        <div key={index}>
          <Entity
              index={index}
              entity={entityMapping}
              onChange={this.onEntityChange}
              onDelete={this.onEntityDelete}
              allEntitySetsAsMap={allEntitySetsAsMap}
              allEntityTypesAsMap={allEntityTypesAsMap}
              allPropertyTypesAsMap={allPropertyTypesAsMap}
              usedAliases={usedAliases} />
          <hr />
        </div>
      );
    });
    return (
      <div>
        <h1>Entities</h1>
        {entities}
      </div>
    );
  }

  renderAssociations = () => {
    const {
      allEntitySetsAsMap,
      allAssociationTypesAsMap,
      allPropertyTypesAsMap,
      allEntityTypesAsMap,
      entityMappings
    } = this.state;
    const associations = this.state.associationMappings.map((associationMapping, index) => {
      return (
        <div key={index}>
          <Association
              index={index}
              association={associationMapping}
              onChange={this.onAssociationChange}
              onDelete={this.onAssociationDelete}
              allEntitySetsAsMap={allEntitySetsAsMap}
              allAssociationTypesAsMap={allAssociationTypesAsMap}
              allPropertyTypesAsMap={allPropertyTypesAsMap}
              allEntityTypesAsMap={allEntityTypesAsMap}
              entities={entityMappings} />
          <hr />
        </div>
      );
    });
    return associations;
  }

  addNewAssociation = () => {
    const associationMappings = this.state.associationMappings;
    associationMappings.push(Object.assign({}, DEFAULT_ASSOCIATION));
    this.setState({ associationMappings });
  }

  renderNewAssociationButton = () => {
    return (
      <Button
          onClick={() => {
            this.addNewAssociation();
          }}>
        Add association
      </Button>
    );
  }

  renderAssociationSection = () => {
    if (this.state.entityMappings.length < 2) return null;
    return (
      <div>
        <h1>Associations</h1>
        {this.renderAssociations()}
        {this.renderNewAssociationButton()}
      </div>
    );
  }

  renderGenerateButton = () => {
    return (
      <div className={styles.generateButton}>
        <Button
            bsStyle="primary"
            onClick={this.tryGenerate}>
          Generate Flight
        </Button>
      </div>
    );
  }

  renderValidateModal = () => {
    return (
      <Modal
          show={this.state.generateModalOpen}
          onHide={this.closeValidateModal}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.generateValidateMessage}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.center}>
            <ButtonGroup>
              <Button onClick={this.closeValidateModal}>Cancel</Button>
              <Button bsStyle="danger" onClick={this.generate}>Generate Anyway</Button>
            </ButtonGroup>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  renderFlight = () => {
    return (
      <div className={styles.flight}>{this.state.generatedFlight}</div>
    );
  }

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Flight Generator</Page.Title>
        </Page.Header>
        <Page.Body>
          {this.renderEntities()}
          {this.renderNewEntityButton()}
          {this.renderAssociationSection()}
          {this.renderGenerateButton()}
          {this.renderValidateModal()}
          {this.renderFlight()}
        </Page.Body>
      </Page>
    );
  }
}
