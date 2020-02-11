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
} from '@/components'
import avatar from '@/assets/img/faces/marc.jpg'
import Authorized from '@/utils/Authorized'

import schema from './schema'
import { queryList } from '@/services/patient'

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

const mapEntityToValues = (entity) => {
  const mappedValues = {
    ...entity,
    pdpaConsent: entity.patientPdpaConsent.reduce(
      (consents, item) =>
        item.isConsent
          ? [
              ...consents,
              item.pdpaConsentTypeFK,
            ]
          : [
              ...consents,
            ],
      [],
    ),
  }
  return {
    ...mappedValues,
    nationalityFK: entity.id ? entity.nationalityFK : 173,
  }
}

@connect(({ patient, global }) => ({
  patient,
  global,
}))
@withFormikExtend({
  authority: 'patientdatabase.patientprofiledetails',
  enableReinitialize: false,
  mapPropsToValues: ({ patient }) => {
    // const mappedValues = {
    //   ...(patient.entity || patient.default),
    //   pdpaConsent: (patient.entity || patient.default).patientPdpaConsent
    //     .reduce(
    //       (consents, item) =>
    //         item.isConsent
    //           ? [
    //               ...consents,
    //               item.pdpaConsentTypeFK,
    //             ]
    //           : [
    //               ...consents,
    //             ],
    //       [],
    //     ),
    // }
    // return {
    //   ...mappedValues,
    //   nationalityFK: patient.entity ? patient.entity.nationalityFK : 173,
    // }
    return mapEntityToValues(patient.entity || patient.default)
  },
  validationSchema: schema,

  handleSubmit: (values, component) => {
    const { props, resetForm } = component
    const { dispatch, history, patient, onConfirm } = props
    const { location } = history
    const shouldCloseForm = location.pathname
      ? !location.pathname.includes('patientdb')
      : false

    const cfg = {
      message: 'Patient profile saved.',
    }
    dispatch({
      type: 'patient/upsert',
      payload: {
        ...values,
        patientScheme: values.patientScheme.map((ps) => {
          if (ps.isDeleted)
            return {
              ...ps,
              schemeTypeFK: ps.schemeTypeFK || ps.preSchemeTypeFK,
            }
          return ps
        }),
        cfg,
      },
    }).then((r) => {
      dispatch({
        type: 'patient/updateState',
        payload: {
          shouldQueryOnClose: location.pathname.includes('patientdb'),
        },
      })
      if (r) {
        // POST request -> r.id === true
        // PUT request -> r.id === false
        if (r.id) {
          if (!patient.callback) {
            history.push(
              getRemovedUrl(
                [
                  'new',
                ],
                getAppendUrl({
                  pid: r.id,
                }),
              ),
            )
          }
        }
        dispatch({
          type: 'patient/query',
          payload: {
            id: r.id || values.id,
          },
        }).then((response) => {
          if (patient.callback) patient.callback(r.id)
          const newEntity = mapEntityToValues(response)
          resetForm(newEntity)
        })

        if (onConfirm && shouldCloseForm) {
          onConfirm()
        }

        // if (!shouldCloseForm) {
        //   dispatch({
        //     type: 'patientSearch/query',
        //     payload: {
        //       sorting: [
        //         // { columnName: 'isActive', direction: 'asc' },
        //         { columnName: 'name', direction: 'asc' },
        //       ],
        //     },
        //   })
        // }
      }
    })
  },
  displayName: 'PatientDetail',
})
class PatientDetail extends PureComponent {
  state = {}

  constructor (props) {
    super(props)
    this.widgets = [
      {
        id: '1',
        name: 'Demographic',
        access: 'patientdatabase.patientprofiledetails',
        schema: schema.demographic,
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
        access: 'patientdatabase.patientprofiledetails',
        schema: schema.emergencyContact,
        component: Loadable({
          loader: () => import('./EmergencyContact'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return (
              <Cmpnet
                schema={
                  schema.emergencyContact.patientEmergencyContact._subType
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
        access: 'patientdatabase.patientprofiledetails',
        schema: schema.allergies,
        component: Loadable({
          loader: () => import('./Allergies'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet schema={schema.allergies} {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '4',
        name: 'Schemes',
        access: 'patientdatabase.patientprofiledetails',
        schema: schema.schemes,
        component: Loadable({
          loader: () => import('./Schemes'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet schema={schema.schemes} {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '5',
        name: 'Appointment History',
        access: 'patientdatabase.patientprofiledetails',
        component: Loadable({
          loader: () => import('./AppointmentHistory'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '6',
        name: 'Patient History',
        access: 'patientdatabase.patientprofiledetails',
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
        access: 'patientdatabase.patientprofiledetails',
        component: Loadable({
          loader: () => import('./PatientDocument'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...p} />
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

  // componentDidMount () {
  //   console.log('PatientDetail componentDidMount')
  // }

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

  // componentDidMount () {
  //   setTimeout(() => {
  //     if (this.props.patient.entity) {
  //       this.props.resetForm(this.props.patient.entity)
  //     }
  //   }, 2000)
  // }

  componentWillUnmount () {
    const {dispatch} = this.props
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
    const { handleSubmit, dispatch, values } = this.props

    if (values.patientAccountNo === undefined || values.patientAccountNo === '')
      return handleSubmit()

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
      if (data.length === 1)
        shouldPromptSaveConfirmation = data[0].id !== values.id
      else if (data.length > 1) {
        shouldPromptSaveConfirmation = true
      }
    }

    if (shouldPromptSaveConfirmation) {
      return dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          openConfirmTitle: '',
          openConfirmText: 'OK',
          openConfirmContent:
            'Duplicate Account No. found. OK to continue or Cancel to make changes',
          onConfirmSave: handleSubmit,
        },
      })
    }

    // if (data && data.totalRecords > 0) {
    //   return dispatch({
    //     type: 'global/updateAppState',
    //     payload: {
    //       openConfirm: true,
    //       openConfirmTitle: '',
    //       openConfirmText: 'OK',
    //       openConfirmContent:
    //         'Duplicate Account No. found. OK to continue or Cancel to make changes',
    //       onConfirmSave: handleSubmit,
    //     },
    //   })
    // }
    return handleSubmit()
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

    const { patient, global, resetForm, values, dispatch } = resetProps
    if (!patient) return null
    const { currentComponent, currentId, menuErrors, entity } = patient

    const isCreatingPatient = entity
      ? Object.prototype.hasOwnProperty.call(entity, 'id')
      : false

    const currentMenu =
      this.widgets.find(
        (o) => o.id === (this.state.selectedMenu || currentComponent),
      ) || {}
    const CurrentComponent = currentMenu.component

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={2}>
          <Card profile>
            <CardBody profile>
              <PatientInfoSideBanner entity={entity} {...this.props} />
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
                          onMenuClick(e, o)
                          // console.log('here', entity, values)
                          dispatch({
                            type: 'patient/updateState',
                            payload: {
                              entity: entity || undefined,
                            },
                          })
                          this.setState({
                            selectedMenu: o.id,
                          })
                          // this.props.history.push(
                          //   getAppendUrl({
                          //     md: 'pt',
                          //     cmt: o.id,
                          //   }),
                          // )
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
              {isCreatingPatient && (
                <Button
                  color='primary'
                  style={{ marginTop: theme.spacing(1) }}
                  onClick={this.registerVisit}
                >
                  Register Visit
                </Button>
              )}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={10}>
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
              <CurrentComponent {...resetProps} />
            </div>
          </CardContainer>

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
              onConfirm: this.validatePatient,
              confirmBtnText: 'Save',
            })}
          </div>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientDetail)
