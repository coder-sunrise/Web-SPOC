import React, { PureComponent } from 'react'
import Loadable from 'react-loadable'
import { connect } from 'dva'
import moment from 'moment'
import _ from 'lodash'
import { history } from 'umi'
import $ from 'jquery'

// medisys-components
import { PatientInfoSideBanner } from 'medisys-components'
import {
  withStyles,
  MenuItem,
  MenuList,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import Error from '@material-ui/icons/Error'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import { navigateDirtyCheck, getRemovedUrl, getAppendUrl } from '@/utils/utils'
import Loading from '@/components/PageLoading/index'

import {
  withFormikExtend,
  NumberInput,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  CardContainer,
  notification,
  CodeSelect,
  dateFormatLong,
  DateRangePicker,
  DatePicker,
  Button,
  ProgressButton,
} from '@/components'
import Authorized from '@/utils/Authorized'

import services from '@/services/patient'
import { getBizSession } from '@/services/queue'
import schema from './schema'
import { mapEntityToValues, upsertPatient } from './utils'

const { duplicateCheck } = services
// moment.updateLocale('en', {
//   relativeTime: {
//     past: '%s',
//     yy: '%d',
//   },

// })

const styles = () => ({
  menuItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
})

@connect(({ patient, global, clinicSettings }) => ({
  patient,
  global,
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
@withFormikExtend({
  authority: [
    'patientdatabase.newpatient',
    'patientdatabase.patientprofiledetails',
  ],
  enableReinitialize: false,
  mapPropsToValues: ({ patient }) => {
    return mapEntityToValues(patient.entity || patient.default)
  },
  validationSchema: schema,

  handleSubmit: (values, component) => {
    const { props, resetForm } = component
    const { dispatch, history, patient, onConfirm } = props
    const { location } = history

    upsertPatient({
      values,
      history,
      dispatch,
      patient,
      resetForm,
      onConfirm,
    })
  },
  displayName: 'PatientDetail',
})
class PatientDetail extends PureComponent {
  state = {
    moduleAccessRight: {
      name: 'patientdatabase',
      rights: 'enable',
    },
    hasActiveSession: false,
  }

  constructor (props) {
    super(props)
    let schemas = schema(props)
    this.widgets = [
      {
        id: '1',
        name: 'Demographic',
        access: [
          'patientdatabase.newpatient',
          'patientdatabase.patientprofiledetails',
        ],
        schema: schemas.demographic,
        component: Loadable({
          loader: () => import('./Demographics'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '2',
        name: 'Emergency Contact',
        access: [
          'patientdatabase.newpatient',
          'patientdatabase.patientprofiledetails',
        ],
        schema: schemas.emergencyContact,
        component: Loadable({
          loader: () => import('./EmergencyContact'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return (
              <Cmpnet
                schema={
                  schemas.emergencyContact.patientEmergencyContact._subType
                }
                {...p}
              />
            )
          },
          loading: Loading,
        }),
      },
      {
        id: '3',
        name: 'Allergies',
        access: [
          'patientdatabase.newpatient',
          'patientdatabase.patientprofiledetails',
        ],
        schema: schemas.allergies,
        component: Loadable({
          loader: () => import('./Allergies'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet schema={schemas.allergies} {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '9',
        name: 'Medical History',
        component: Loadable({
          loader: () => import('./MedicalHistory'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '4',
        name: 'Schemes',
        access: [
          'patientdatabase.newpatient',
          'patientdatabase.patientprofiledetails',
        ],
        schema: schemas.schemes,
        component: Loadable({
          loader: () => import('./Schemes'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet schema={schemas.schemes} {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '5',
        name: 'Patient Results',
        access: [
          'patientdatabase.newpatient',
          'patientdatabase.patientprofiledetails',
        ],
        component: Loadable({
          loader: () => import('./Results'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...p} widget mode='integrated' />
          },
          loading: Loading,
        }),
      },
      {
        id: '6',
        name: 'Patient History',
        access: [
          'patientdatabase.newpatient',
          'patientdatabase.patientprofiledetails',
        ],
        component: Loadable({
          loader: () => import('./PatientHistory'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...p} widget mode='integrated' />
          },
          loading: Loading,
        }),
      },
      {
        id: '7',
        name: 'Patient Document',
        access: [
          'patientdatabase.newpatient',
          'patientdatabase.patientprofiledetails',
        ],
        component: Loadable({
          loader: () => import('./PatientDocument'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return (
              <Cmpnet
                {...p}
                onClose={e => {
                  const { preSelectedMenu } = this.state
                  $('input')
                    .eq(0)
                    .focus()
                  this.setState({
                    selectedMenu: preSelectedMenu,
                    preSelectedMenu: undefined,
                  })
                }}
              />
            )
          },
          loading: Loading,
        }),
      },
      {
        id: '8',
        name: 'Admission',
        access: 'demorights', // 'wardmanagement',
        component: Loadable({
          loader: () => import('./Admission'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '10',
        name: 'Package Drawdown',
        access: [
          'patientdatabase.newpatient',
          'patientdatabase.patientprofiledetails',
        ],
        component: Loadable({
          loader: () => import('./PatientPackageDrawdown'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '11',
        name: 'Pre-Order List',
        // access: [
        //   'patientdatabase.newpatient',
        //   'patientdatabase.patientprofiledetails',
        // ],
        component: Loadable({
          loader: () => import('./Pre-Order'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...p} />
          },
          loading: Loading,
        }),
      },
    ]

    const accessRight = Authorized.check(
      'patientdatabase.patientprofiledetails.medicalhistory',
    )
    if (accessRight) {
      const hiddenMedicalHistoryByAccessRight = accessRight.rights === 'hidden'
      if (hiddenMedicalHistoryByAccessRight) {
        this.widgets = this.widgets.filter(t => t.id !== '9')
      }
    }

    const SchemeAccessRight = Authorized.check('scheme.schemedetails')
    if (SchemeAccessRight) {
      const hiddenSchemeByAccessRight = SchemeAccessRight.rights === 'hidden'
      if (hiddenSchemeByAccessRight) {
        this.widgets = this.widgets.filter(t => t.id !== '4')
      }
    }

    const { clinicSettings } = this.props
    if (!clinicSettings.isEnablePackage) {
      this.widgets = this.widgets.filter(w => w.id !== '10')
    }
  }

  componentDidMount () {
    this.checkHasActiveSession()
  }

  componentWillUnmount () {
    const { dispatch } = this.props
    const menuErrors = {}
    dispatch({
      type: 'patient/updateState',
      payload: {
        menuErrors,
      },
    })
  }

  registerVisit = e => {
    navigateDirtyCheck({
      onProceed: () => {
        this.props
          .dispatch({
            type: 'patient/closePatientModal',
          })
          .then(() => {
            history.push(
              `/reception/queue?md=visreg&pid=${this.props.patient.entity.id}`,
            )
          })
      },
    })(e)
  }

  handleOpenReplacementModal = () =>
    this.setState({ showReplacementModal: true })

  handleCloseReplacementModal = () =>
    this.setState({ showReplacementModal: false })

  validatePatient = async () => {
    const { handleSubmit, dispatch, values, validateForm } = this.props
    dispatch({
      type: 'global/updateState',
      payload: {
        disableSave: true,
      },
    })
    if (
      values.patientAccountNo === undefined ||
      values.patientAccountNo === ''
    ) {
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: false,
        },
      })
      return handleSubmit()
    }

    const response = await duplicateCheck({
      id: values.id,
      patientAccountNo: values.patientAccountNo,
      name: values.name,
      dob: values.dob,
    })

    const { data } = response

    let shouldPromptSaveConfirmation = false
    let content
    if (data) {
      const {
        isDuplicateAccountNo = false,
        isDuplicateNameAndDOB = false,
      } = data
      shouldPromptSaveConfirmation =
        isDuplicateAccountNo || isDuplicateNameAndDOB

      if (isDuplicateAccountNo && isDuplicateNameAndDOB) {
        content = 'Duplicated Account No., Patient Name and DOB found.'
      } else if (isDuplicateAccountNo) {
        content = 'Duplicated Account No. found.'
      } else if (isDuplicateNameAndDOB) {
        content = 'Duplicated Patient Name and DOB found.'
      }
    }
    if (shouldPromptSaveConfirmation) {
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: false,
        },
      })
      return dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          openConfirmTitle: '',
          openConfirmText: 'OK',
          openConfirmContent: () => {
            return (
              <div style={{ fontSize: '1.4rem', fontWeight: 300 }}>
                {content}
              </div>
            )
          },
          additionalInfo: (
            <div style={{ marginTop: 0, fontSize: '1.4rem', fontWeight: 300 }}>
              Do you wish to proceed?
            </div>
          ),
          onConfirmSave: handleSubmit,
        },
      })
    }
    const isFormValid = await validateForm()
    if (!_.isEmpty(isFormValid)) {
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: false,
        },
      })
    }
    return handleSubmit()
  }

  checkHasActiveSession = async () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    const result = await getBizSession(bizSessionPayload)
    const { data } = result.data

    this.setState(() => {
      return {
        hasActiveSession: data.length > 0,
      }
    })
  }

  onActiveStatusChanged = async status => {
    const { setFieldValue, dispatch, values } = this.props
    const { effectiveStartDate, effectiveEndDate } = values

    const { selectedMenu } = this.state

    if (status === true) {
      await setFieldValue('effectiveStartDate', moment().formatUTC())
      await setFieldValue('effectiveEndDate', moment('2099-12-31').formatUTC())
    } else {
      await setFieldValue('effectiveEndDate', moment().formatUTC())
    }
    dispatch({
      type: 'global/updateState',
      payload: {
        disableSave: true,
      },
    })

    this.setState({ selectedMenu: undefined })
    const response = await upsertPatient(this.props)
    if (response === false) {
      // reset Effective Date
      await setFieldValue('effectiveStartDate', effectiveStartDate)
      await setFieldValue('effectiveEndDate', effectiveEndDate)
    }
    this.setState({ selectedMenu })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { errors, dispatch, patient, values, validateForm } = nextProps
    // validateForm(values).then((o) => {
    //   console.log(o)
    // })
    const menuErrors = {}
    Object.keys(errors).forEach(k => {
      this.widgets.forEach(w => {
        menuErrors[w.id] = !!(w.schema && w.schema[k])
      })
    })
    if (!_.isEqual(patient.menuErrors, menuErrors)) {
      const { currentComponent, currentId, entity } = patient
      const currentMenu =
        this.widgets.find(o => o.id === currentComponent) || {}
      dispatch({
        type: 'patient/updateState',
        payload: {
          menuErrors,
        },
      })
    }
  }

  render () {
    const {
      theme,
      classes,
      height,
      onMenuClick = p => p,
      footer,
      ...resetProps
    } = this.props
    const { hasActiveSession } = this.state

    const { patient, global, resetForm, values, dispatch } = resetProps
    if (!patient) return null
    const { currentComponent, currentId, menuErrors, entity } = patient
    const patientIsActiveOrCreating = !entity || entity.isActive

    const isCreatingPatient = entity
      ? Object.prototype.hasOwnProperty.call(entity, 'id') && entity.isActive
      : false

    const currentMenu =
      this.widgets.find(
        o => o.id === (this.state.selectedMenu || currentComponent),
      ) || {}
    const CurrentComponent = currentMenu.component
    const currentItemDisabled =
      ['1', '2', '3', '4'].includes(currentMenu.id) &&
      !patientIsActiveOrCreating

    return (
      <Authorized
        authority={[
          'patientdatabase.patientprofiledetails',
          'patientdatabase.newpatient',
        ]}
      >
        <GridContainer>
          <GridItem xs={12} sm={12} md={2}>
            <Card profile>
              <CardBody profile>
                <PatientInfoSideBanner
                  allowChangePatientStatus
                  onActiveStatusChange={this.onActiveStatusChanged}
                  entity={entity}
                  {...this.props}
                />
                <MenuList>
                  {this.widgets
                    .filter(
                      o =>
                        (!!patient.entity && !!patient.entity.id) ||
                        Number(o.id) <= 4 ||
                        Number(o.id) === 9,
                    )
                    .map(o => (
                      <Authorized authority={o.access}>
                        <MenuItem
                          key={o.name}
                          className={classes.menuItem}
                          selected={currentMenu.name === o.name}
                          disabled={
                            global.disableSave && currentMenu.name !== o.name
                          }
                          onClick={e => {
                            onMenuClick(e, o)
                            dispatch({
                              type: 'patient/updateState',
                              payload: {
                                entity: entity || undefined,
                              },
                            })
                            this.setState(pre => ({
                              selectedMenu: o.id,
                              preSelectedMenu: pre.selectedMenu,
                            }))
                          }}
                        >
                          <ListItemIcon style={{ minWidth: 25 }}>
                            <KeyboardArrowRight />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <span
                                style={{
                                  color: menuErrors[o.id] ? 'red' : 'inherit',
                                }}
                              >
                                {o.name}
                                {menuErrors[o.id] ? (
                                  <Error
                                    style={{
                                      position: 'absolute',
                                      top: 13,
                                      right: 8,
                                    }}
                                  />
                                ) : null}
                              </span>
                            }
                          />
                        </MenuItem>
                      </Authorized>
                    ))}
                </MenuList>
                {isCreatingPatient && <Divider light />}
                {hasActiveSession && isCreatingPatient && (
                  <Authorized authority='queue.registervisit'>
                    <Button
                      color='primary'
                      style={{ marginTop: theme.spacing(1) }}
                      onClick={this.registerVisit}
                    >
                      Register Visit
                    </Button>
                  </Authorized>
                )}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={10}>
            <CardContainer hideHeader title={currentMenu.name}>
              <div
                style={
                  height > 0
                    ? {
                      height: height - 95 - 20,
                      overflow: 'auto',
                      padding: 4,
                      paddingTop: 20,
                    }
                    : { padding: 4, paddingTop: 20 }
                }
              >
                <Authorized.Context.Provider
                  value={{
                    rights: currentItemDisabled ? 'disable' : 'enable', //
                  }}
                >
                  <CurrentComponent {...resetProps} />
                </Authorized.Context.Provider>
              </div>
            </CardContainer>

            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                padding: 8,
              }}
            >
              <Button
                color='danger'
                onClick={() => {
                  dispatch({
                    type: 'patient/closePatientModal',
                    payload: {
                      history: this.props.history,
                    },
                  })
                }}
              >
                Close
              </Button>
              <ProgressButton
                color='primary'
                onClick={
                  patientIsActiveOrCreating ? this.validatePatient : undefined
                }
              >
                Save
              </ProgressButton>
            </div>
          </GridItem>
        </GridContainer>
      </Authorized>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientDetail)
