import React, { PureComponent } from 'react'
import router from 'umi/router'
import { connect } from 'dva'
import qs from 'query-string'
import { ChangePassword } from 'medisys-components'
import { CommonModal, SimpleModal } from '@/components'
import PatientDetail from '@/pages/PatientDatabase/Detail'
import VisitRegistration from '@/pages/Reception/Queue/NewVisit'
import Consultation from '@/pages/PatientDashboard/Consultation'
import Dispense from '@/pages/Dispense'
import Billing from '@/pages/Dispense/Billing'
import UserProfileForm from '@/pages/Setting/UserProfile/UserProfileForm'
import Adjustment from '@/pages/Shared/Adjustment'

import { sleep, getRemovedUrl } from '@/utils/utils'

@connect(({ global, loading, user }) => ({
  global,
  loggedInUserID: user.data.id,
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

  closeUserProfile = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'global/updateAppState',
      payload: {
        showUserProfile: false,
      },
    })
    dispatch({
      type: 'user/saveProfileDetails',
      profileDetails: undefined,
    })
    dispatch({
      type: 'settingUserProfile/updateCurrentSelected',
      userProfile: {},
    })
  }

  render () {
    const { global, dispatch, loggedInUserID, history } = this.props

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
          open={global.showConsultationPanel}
          title='Consultation'
          observe={[
            'ConsultationPage',
            'OrderPage',
          ]}
          authority='consultation'
          bodyNoPadding
          onClose={(e) => {
            dispatch({
              type: 'consultation/closeConsultationModal',
            })
          }}
          fullScreen
          showFooter={false}
        >
          {global.showConsultationPanel && <Consultation {...this.props} />}
        </CommonModal>
        <CommonModal
          open={global.showDispensePanel}
          title='Dispensing'
          observe='Dispense'
          authority='dispense'
          bodyNoPadding
          onClose={(e) => {
            dispatch({
              type: 'dispense/closeDispenseModal',
            })
          }}
          fullScreen
          showFooter={false}
        >
          {global.showDispensePanel && <Dispense />}
        </CommonModal>
        <CommonModal
          open={global.showBillingPanel}
          title='Billing'
          observe='Billing'
          authority='billing'
          bodyNoPadding
          onClose={(e) => {
            dispatch({
              type: 'billing/closeBillingModal',
            })
          }}
          fullScreen
          showFooter={false}
        >
          {global.showBillingPanel && <Billing />}
        </CommonModal>
        <CommonModal
          open={global.showPatientInfoPanel}
          title='Patient Profile'
          observe='PatientDetail'
          authority='patient'
          onClose={(e) => {
            dispatch({
              type: 'patient/closePatientModal',
            })
          }}
          // onConfirm={this.toggleModal}
          fullScreen
          showFooter={false}
        >
          {global.showPatientInfoPanel && <PatientDetail {...this.props} />}
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
          <ChangePassword userID={loggedInUserID} />
        </CommonModal>
        <CommonModal
          title='My Account'
          open={global.showUserProfile}
          onClose={this.closeUserProfile}
          onConfirm={this.closeUserProfile}
        >
          <UserProfileForm />
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
          onConfirm={() => {
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

        <CommonModal
          open={global.showVisitRegistration}
          title='Visit Registration'
          overrideLoading
          onClose={() => {
            dispatch({
              type: 'visitRegistration/closeModal',
            })
          }}
          onConfirm={() => {
            dispatch({
              type: 'visitRegistration/closeModal',
            })
          }}
          maxWidth='lg'
          observe='VisitRegistration'
        >
          <VisitRegistration />
        </CommonModal>

        <CommonModal
          open={global.openConfirm}
          title={global.openConfirmTitle}
          cancelText='Cancel'
          maxWidth='sm'
          onClose={(e) => {
            clearTimeout(this._timer)
            dispatch({
              type: 'global/updateAppState',
              payload: {
                openConfirm: false,
              },
            })
          }}
          onConfirm={() => {
            dispatch({
              type: 'global/updateAppState',
              payload: {
                openConfirm: false,
              },
            })
            if (global.onOpenConfirm) {
              global.onOpenConfirm()
            }
          }}
          showFooter
        >
          <div style={{ textAlign: 'center' }}>
            <h3>{global.openConfirmContent || 'Confirm to proceed?'}</h3>
          </div>
        </CommonModal>

        <CommonModal
          open={global.openAdjustment}
          title={global.openAdjustmentTitle}
          cancelText='Cancel'
          maxWidth='sm'
          onClose={(e) => {
            dispatch({
              type: 'global/updateAppState',
              payload: {
                openAdjustment: false,
                openAdjustmentConfig: undefined,
                openAdjustmentValue: undefined,
              },
            })
          }}
          onConfirm={() => {
            dispatch({
              type: 'global/updateAppState',
              payload: {
                openAdjustment: false,
                openAdjustmentConfig: undefined,
              },
            })
            if (global.onAdjustmentConfirm) {
              global.onAdjustmentConfirm()
            }
          }}
        >
          <Adjustment />
        </CommonModal>
      </div>
    )
  }
}
export default GlobalModalContainer
