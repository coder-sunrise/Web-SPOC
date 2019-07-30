import React from 'react'
import { connect } from 'dva'
// common components
import { CardContainer } from '@/components'
import UserProfileForm from '../UserProfileForm'

@connect(({ settingUserProfile }) => ({ settingUserProfile }))
class UserProfileDetails extends React.Component {
  componentDidMount () {
    const { match, dispatch } = this.props
    const { params } = match
    if (params && params.id) {
      dispatch({
        type: 'settingUserProfile/fetchUserProfileByID',
        id: params.id,
      })
    }
  }

  handleChangePassword = () => {
    this.props.dispatch({
      type: 'global/updateAppState',
      payload: {
        showChangePasswordModal: true,
      },
    })
  }

  render () {
    const { currentSelectedUser } = this.props.settingUserProfile
    return (
      <CardContainer hideHeader>
        <UserProfileForm
          selectedUser={currentSelectedUser}
          onChangePasswordClick={this.handleChangePassword}
        />
      </CardContainer>
    )
  }
}

export default UserProfileDetails
