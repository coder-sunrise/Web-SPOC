import React, { PureComponent } from 'react'
import { connect } from 'dva'
import qs from 'query-string'
import { CommonModal, SimpleModal } from '@/components'
import PatientDetail from '@/pages/PatientDatabase/Detail'
import { ChangePassword } from 'medisys-components'

import { sleep, getRemovedUrl } from '@/utils/utils'

@connect(({ global, loading }) => ({
  global,
}))
class GlobalModalContainer extends PureComponent {
  // componentDidMount () {
  //   const para = qs.parse(location.search)
  //   console.log(para)
  // }

  constructor (props) {
    super(props)
    this._timer = null
  }

  componentDidUpdate (preProps) {
    if (
      !preProps.global.showSessionTimeout &&
      this.props.global.showSessionTimeout === true
    ) {
      clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        this.props.dispatch({
          type: 'login/logout',
        })
      }, 10000)
    }
  }

  render () {
    const { global, dispatch, history } = this.props
    return (
      <div>
        {/* <SimpleModal
          title={`Are you sure to void the Payment ${this.state
            .currentItemCode} ?`}
          open={this.state.openModal}
          status={this.props.status}
          onCancel={() => this.hideAlert()}
          onConfirm={() => {
            this.props.handleSubmit()
          }}
        /> */}
        <CommonModal
          open={global.showPatientInfoPanel}
          title='Patient Profile'
          onClose={(e) => {
            history.push(
              getRemovedUrl([
                'md',
                'cmt',
                'pid',
                'new',
              ]),
            )
            dispatch({
              type: 'global/updateAppState',
              payload: {
                showPatientInfoPanel: false,
                fullscreen: false,
                currentPatientId: null,
              },
            })
          }}
          // onConfirm={this.toggleModal}
          fullScreen
          showFooter={false}
        >
          <PatientDetail {...this.props} />
          {/* {global.currentPatientId} */}
        </CommonModal>

        <CommonModal
          title='Change Password'
          open={global.showChangePasswordModal}
          onClose={() => {
            dispatch({
              type: 'global/updateAppState',
              payload: {
                showChangePasswordModal: false,
              },
            })
          }}
          onConfirm={() => {
            dispatch({
              type: 'global/updateAppState',
              payload: {
                showChangePasswordModal: false,
              },
            })
          }}
          maxWidth='sm'
        >
          <ChangePassword />
        </CommonModal>

        <CommonModal
          open={global.showSessionTimeout}
          title='Session Timeout'
          maxWidth='sm'
          onClose={(e) => {
            clearTimeout(this._timer)
            dispatch({
              type: 'global/updateAppState',
              payload: {
                showSessionTimeout: false,
              },
            })
          }}
          onConfimr={() => {
            this.props.dispatch({
              type: 'login/logout',
            })
          }}
          showFooter
        >
          <div
            style={{
              textAlign: 'center',
              minHeight: 100,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            Your session will be disconnected in 1 minutes
          </div>
        </CommonModal>
      </div>
    )
  }
}
export default GlobalModalContainer
