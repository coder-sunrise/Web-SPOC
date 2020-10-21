import React, { PureComponent } from 'react'
import Loadable from 'react-loadable'
import { connect } from 'dva'
import moment from 'moment'
import _ from 'lodash'
import router from 'umi/router'

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
  CommonModal,
  withFormik,
  TextField,
} from '@/components'
import Authorized from '@/utils/Authorized'

import { queryList } from '@/services/patient'
import { getBizSession } from '@/services/queue'
import schema from './schema'
import { mapEntityToValues, upsertPatient } from './utils'
import PatientDocument from './PatientDocument'

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
                onClose={() => {
                  console.log('onclose patient docuemnt')
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
    ]
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

  registerVisit = (e) => {
    navigateDirtyCheck({
      onProceed: () => {
        this.props
          .dispatch({
            type: 'patient/closePatientModal',
          })
          .then(() => {
            router.push(
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

    const search = {
      eql_patientAccountNo: values.patientAccountNo,
      neql_id: values.id ? `${values.id}` : undefined,
    }

    const response = await queryList({
      // ...search,
      // combineCondition: 'and',
      apiCriteria: {
        searchValue: values.patientAccountNo,
      },
    })

    const { data } = response

    let shouldPromptSaveConfirmation = false
    if (data) {
      const { totalRecords, data: patientList } = data
      shouldPromptSaveConfirmation = totalRecords > 1

      if (totalRecords === 1) {
        shouldPromptSaveConfirmation = patientList[0].id !== values.id
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
          openConfirmContent: 'Duplicated Account No. found.',
          additionalInfo: (
            <h3 style={{ marginTop: 0 }}>Do you wish to proceed?</h3>
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

  onActiveStatusChanged = async (status) => {
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
    Object.keys(errors).forEach((k) => {
      this.widgets.forEach((w) => {
        menuErrors[w.id] = !!(w.schema && w.schema[k])
      })
    })
    if (!_.isEqual(patient.menuErrors, menuErrors)) {
      const { currentComponent, currentId, entity } = patient
      const currentMenu =
        this.widgets.find((o) => o.id === currentComponent) || {}
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
      onMenuClick = (p) => p,
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
        (o) => o.id === (this.state.selectedMenu || currentComponent),
      ) || {}
    const CurrentComponent = currentMenu.component
    const currentItemDisabled =
      [
        '1',
        '2',
        '3',
        '4',
      ].includes(currentMenu.id) && !patientIsActiveOrCreating

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
                      (o) =>
                        (!!patient.entity && !!patient.entity.id) ||
                        Number(o.id) <= 4,
                    )
                    .map((o) => (
                      <Authorized authority={o.access}>
                        <MenuItem
                          key={o.name}
                          className={classes.menuItem}
                          selected={currentMenu.name === o.name}
                          disabled={
                            global.disableSave && currentMenu.name !== o.name
                          }
                          onClick={(e) => {
                            if (o.id === '7') {
                              this.setState({ showPatientDocument: true })
                            } else {
                              onMenuClick(e, o)
                              dispatch({
                                type: 'patient/updateState',
                                payload: {
                                  entity: entity || undefined,
                                },
                              })
                              this.setState({
                                selectedMenu: o.id,
                              })
                            }
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
                {hasActiveSession &&
                isCreatingPatient && (
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
            {this.state.showPatientDocument ? (
              <CommonModal
                title='Patient Profile'
                fullScreen
                open
                onClose={() => {
                  console.log('close patient document')
                  this.setState({ showPatientDocument: false })
                }}
              >
                <PatientDocument {...resetProps} />
              </CommonModal>
            ) : (
              <CardContainer hideHeader title={currentMenu.name}>
                <div
                  style={
                    height > 0 ? (
                      {
                        height: height - 95 - 20,
                        overflow: 'auto',
                        padding: 4,
                        paddingTop: 20,
                      }
                    ) : (
                      { padding: 4, paddingTop: 20 }
                    )
                  }
                >
                  <Authorized.Context.Provider
                    value={{
                      rights: currentItemDisabled ? 'disable' : 'enable', //
                    }}
                  >
                    <div style={{ width: 0, height: 0, overflow: 'hidden' }}>
                      <TextField autoFocus />
                    </div>
                    <CurrentComponent {...resetProps} />
                  </Authorized.Context.Provider>
                </div>
              </CardContainer>
            )}

            <div
              style={{
                position: 'relative',
              }}
            >
              {footer({
                align: 'center',
                // onReset:
                //   values && values.id
                //     ? () => {
                //         resetForm(patient.entity)
                //       }
                //     : undefined,
                onCancel: () => {
                  dispatch({
                    type: 'patient/closePatientModal',
                    payload: {
                      history: this.props.history,
                    },
                  })
                },
                onConfirm: patientIsActiveOrCreating
                  ? this.validatePatient
                  : undefined,
                confirmBtnText: 'Save',
              })}
            </div>
          </GridItem>
        </GridContainer>
      </Authorized>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientDetail)
