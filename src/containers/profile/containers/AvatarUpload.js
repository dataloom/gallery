import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Avatar from 'react-avatar';

import PhotoUpload from '../../../components/photos/PhotoUpload';
import UserProfileIcon from '../../../images/user-profile-icon.png';

class AvatarUpload extends React.Component {
  static propTypes = {
    // avatar: photo
  }

  getAvatar = () => {
    const { name, id } = this.props;
    // id = id.slice()
    console.log('id:', id);
    return <Avatar name={name} googleId={id} />;
  }

  render() {
    return (
      <PhotoUpload
          header={'Avatar'}
          content={this.getAvatar()} />
    );
  }
}

function mapStateToProps() {
  const profile = JSON.parse(window.localStorage.profile);

  return {
    name: profile.name,
    id: profile.identities[0].user_id
  };
}

export default connect(mapStateToProps)(AvatarUpload);
