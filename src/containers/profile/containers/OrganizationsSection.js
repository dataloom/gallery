import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { PrincipalsApi, OrganizationsApi } from 'loom-data';

class OrganizationsSection extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  getContent = () => {
  //   const { organizations } = this.props;
  //   console.log('organizations:', organizations);
    // "9176e1c9-da83-451b-b933-0fbf8277456e", "285e155c-fccc-483d-80b7-d16e2eb66dc7"
    const userId = JSON.parse(window.localStorage.profile).user_id;
    const orgs = PrincipalsApi.getUser(userId)
    .then((data) => {
      return data.organization;
    });
    console.log('orgs', orgs);
    // const orgs = PrincipalsApi.getUser(userId)
    // .then((data) => {
    //   return data.organization;
    // })
    // .then((data) => {
    //   data.forEach((org) => {
    //     OrganizationsApi.getOrganization(org)
    //       .then((orgObj) => {
    //         console.log('ORG OBJ:', orgObj);
    //       });
    //   });
    // });
    // // const user = Promise.resolve(PrincipalsApi.getUser(userId));
    // console.log('orgs', orgs);

    // return orgs;
  }

  render() {
    return (
      <div>
        fack
        {this.getContent()}
      </div>
    );
  }
}

function mapStateToProps() {
  const profile = JSON.parse(window.localStorage.getItem('profile'));

  return {
    organizations: profile.organizations
  };
}

export default connect(mapStateToProps)(OrganizationsSection);


// const emailDetails = {
//   key: 'email',
//   value: email,
//   label: 'Email address'
// };
