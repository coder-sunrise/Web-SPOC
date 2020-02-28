import React from 'react'
import { connect } from 'dva'
import Main from './Main'

@connect(({ settingUserRole }) => ({
  settingUserRole,
}))
class UserRoleDetail extends React.Component {
  componentDidMount = () => {
    const rowId = this.props.match.params.id
    if (rowId) {
      this.props.dispatch({
        type: 'settingUserRole/fetchUserRoleByID',
        payload: {
          id: rowId,
          isEdit: true,
        },
      })
    } else if (this.props.location.state) {
      const newId = this.props.location.state.id
      this.props.dispatch({
        type: 'settingUserRole/fetchUserRoleByID',
        payload: {
          id: newId,
          isEdit: false,
        },
      })
    } else {
      this.props.dispatch({
        type: 'settingUserRole/fetchDefaultAccessRight',
        payload: { isEdit: false },
      })
    }
  }

  render () {
    if (!this.props.settingUserRole.currentSelectedUserRole) return null
    return <Main />
  }
}

export default UserRoleDetail
