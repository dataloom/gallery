import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import PhotoUpload from '../../../components/photos/PhotoUpload';
import UserProfileIcon from '../../../images/user-profile-icon.png';

class AvatarUpload extends React.Component {
  static propTypes = {
    // avatar: photo
  }

  getAvatar = () => {
    const avatar = this.props.avatar || UserProfileIcon;
    return avatar;
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
  // TODO: Add ability to save and get avatar
  return {

  };
}

export default connect(mapStateToProps)(AvatarUpload);
