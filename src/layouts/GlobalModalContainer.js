import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import { ChangePassword } from 'medisys-components'
import { CommonModal, Button } from '@/components'
import PatientDetail from '@/pages/PatientDatabase/Detail'
import VisitRegistration from '@/pages/Reception/Queue/NewVisit'
import Consultation from '@/pages/PatientDashboard/Consultation'
// import Dispense from '@/pages/Dispense'
// import Billing from '@/pages/Dispense/Billing'
import UserProfileForm from '@/pages/Setting/UserProfile/UserProfileForm'
import Adjustment from '@/pages/Shared/Adjustment'

const styles = (theme) => ({
  patientModal: {
    // zIndex: '1390 !important',
  },
})

@connect(({ global, user }) => ({
  global,
  loggedInUserID: user.data && user.data.id,
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

  closeVisitRegistration = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'visitRegistration/closeModal',
    })
    dispatch({
      type: 'patient/updateState',
      payload: { entity: null },
    })
  }

  render () {
    const { global, dispatch, loggedInUserID, classes } = this.props
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
          title='Change Password'
          open={global.showChangePasswordModal}
          displayCloseIcon={false}
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
        {/* <CommonModal
          open={global.showDispensePanel}
          title='Dispensing'
          observe={[
            'DispensePage',
            'ConsultationDocumentList',
          ]}
          authority='dispense'
          bodyNoPadding
          onClose={() => {
            dispatch({
              type: 'dispense/closeModal',
            })
          }}
          fullScreen
          showFooter={false}
        >
          {global.showDispensePanel && <Dispense />}
        </CommonModal> */}
        <CommonModal
          open={global.showConsultationPanel}
          title='Consultation'
          observe={[
            'ConsultationPage',
            'OrderPage',
          ]}
          authority='consultation'
          bodyNoPadding
          onClose={() => {
            dispatch({
              type: 'consultation/closeModal',
            })
          }}
          fullScreen
          displayCloseIcon={false}
          showFooter={false}
        >
          {global.showConsultationPanel && <Consultation {...this.props} />}
        </CommonModal>

        {/* <CommonModal
          open={global.showBillingPanel}
          title='Billing'
          observe='BillingForm'
          authority='billing'
          bodyNoPadding
          onClose={() => {
            dispatch({
              type: 'billing/closeModal',
            })
          }}
          fullScreen
          showFooter={false}
          overrideLoading
        >
          {global.showBillingPanel && <Billing />}
        </CommonModal> */}
        <CommonModal
          open={global.showPatientInfoPanel}
          title='Patient Profile'
          observe='PatientDetail'
          authority='patient'
          onClose={() => {
            dispatch({
              type: 'patient/closePatientModal',
              payload: {
                history: this.props.history,
              },
            })
          }}
          onConfirm={() => {
            dispatch({
              type: 'patient/closePatientModal',
              payload: {
                history: this.props.history,
              },
            })
          }}
          // onConfirm={this.toggleModal}
          fullScreen
          className={classes.patientModal}
          showFooter={false}
        >
          {global.showPatientInfoPanel && <PatientDetail {...this.props} />}
          {/* {global.currentPatientId} */}
        </CommonModal>

        <CommonModal
          title='My Account'
          open={global.showUserProfile}
          onClose={this.closeUserProfile}
          onConfirm={this.closeUserProfile}
          observe='UserProfile'
        >
          <UserProfileForm />
        </CommonModal>

        <CommonModal
          overrideLoading
          open={global.showSessionTimeout}
          title='Session Timeout'
          maxWidth='sm'
          onClose={() => {
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
          onClose={this.closeVisitRegistration}
          onConfirm={this.closeVisitRegistration}
          maxWidth='lg'
          observe='VisitRegistration'
        >
          <VisitRegistration history={this.props.history} />
        </CommonModal>

        <CommonModal
          open={global.openConfirm}
          title={global.openConfirmTitle}
          cancelText='Cancel'
          maxWidth='sm'
          confirmText={global.openConfirmText || 'Confirm'}
          footProps={{
            extraButtons: global.onConfirmDiscard ? (
              <Button
                color='primary'
                onClick={() => {
                  dispatch({
                    type: 'global/updateAppState',
                    payload: {
                      openConfirm: false,
                    },
                  })
                  if (global.onConfirmDiscard) {
                    global.onConfirmDiscard()
                  }
                }}
              >
                Confirm
              </Button>
            ) : null,
            onConfirm: global.onConfirmSave
              ? () => {
                  dispatch({
                    type: 'global/updateAppState',
                    payload: {
                      openConfirm: false,
                    },
                  })
                  global.onConfirmSave()
                }
              : undefined,
          }}
          onClose={() => {
            global.onConfirmClose ? global.onConfirmClose() : null
            clearTimeout(this._timer)
            dispatch({
              type: 'global/updateAppState',
              payload: {
                openConfirm: false,
                openConfirmTitle: undefined,
                openConfirmText: 'Confirm',
              },
            })
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
          onClose={() => {
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
export default withStyles(styles, { name: 'GlobalModalContainer' })(
  GlobalModalContainer,
)
