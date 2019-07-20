import React from 'react';
import styled from 'styled-components';

import StyledInput from '../../../components/controls/StyledInput';
import StyledSelect from '../../../components/controls/StyledSelect';
import InfoButton from '../../../components/buttons/InfoButton';

import { DATA_SQL_TYPES, exportTemplate } from '../utils/IntegrationYamlUtils';

type Props = {
  orgId :string,
  orgName :string,
  orgUsername :string,
  orgPassword :string
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
  margin-top: 15px;

  div {
    font-size: 16px;
    font-weight: 600;
    line-height: normal;
    margin: 0 20px 0 0;
  }

  span {
    color: #8e929b;
    margin: 10px 0;
  }
`;

export default class IntegrationConfigGenerator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSqlType: '',
      server: '',
      port: '',
      dbName: ''
    };
  }

  onSubmit = () => {
    const {
      dataSqlType,
      server,
      port,
      dbName
    } = this.state;

    const {
      orgId,
      orgName,
      orgUsername,
      orgPassword
    } = this.props;

    exportTemplate({
      dataSqlType,
      server,
      port,
      dbName,
      orgId,
      orgName,
      orgUsername,
      orgPassword
    });
  }

  getOnChange = field => ({ target }) => {
    this.setState({ [field]: target.value })
  }

  isReadyToSubmit = () => {
    const {
      dataSqlType,
      server,
      port,
      dbName
    } = this.state;

    return dataSqlType && server && port && dbName;
  }

  render() {
    const {
      dataSqlType,
      server,
      port,
      dbName
    } = this.state;

    return (
      <Container>
        <InputRow>
          <div>Target Server</div>
          <span>ex. PD database hostname</span>
          <StyledInput value={server} onChange={this.getOnChange('server')} />
        </InputRow>
        <InputRow>
          <div>Target Port</div>
          <span>ex. PD database port</span>
          <StyledInput value={port} onChange={this.getOnChange('port')} />
        </InputRow>
        <InputRow>
          <div>Target Database</div>
          <span>ex. PD SQL database name</span>
          <StyledInput value={dbName} onChange={this.getOnChange('dbName')} />
        </InputRow>
        <InputRow>
          <div>Target Database SQL Type</div>
          <StyledSelect value={dataSqlType} onChange={this.getOnChange('dataSqlType')}>
            <option value="" />
            {
              Object.keys(DATA_SQL_TYPES).map(name => <option value={name}>{name}</option>)
            }
          </StyledSelect>
        </InputRow>
        <InfoButton disabled={!this.isReadyToSubmit()} onClick={this.onSubmit}>Export</InfoButton>
      </Container>
    );
  }
}
