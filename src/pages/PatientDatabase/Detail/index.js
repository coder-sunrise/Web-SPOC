import React, { PureComponent } from 'react'
import Loadable from 'react-loadable'
import { connect } from 'dva'
import moment from 'moment'
import _ from 'lodash'

import avatar from '@/assets/img/faces/marc.jpg'
import {
  withFormikExtend,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  CardContainer,
  notification,
} from '@/components'
import Loading from '@/components/PageLoading/index'
import { withStyles, MenuItem, MenuList, Divider } from '@material-ui/core'
import Authorized from '@/utils/Authorized'
import { getRemovedUrl, getAppendUrl } from '@/utils/utils'
import schema from './schema'

const styles = () => ({})

@connect(({ patient, global }) => ({
  patient,
  global,
}))
@withFormikExtend({
  authority: {
    view: 'patient.view',
    edit: 'patient.edit',
  },
  mapPropsToValues: ({ patient }) => {
    return patient.entity || patient.default
  },
  validationSchema: schema,

  handleSubmit: (values, component) => {
    const { props, resetForm, onConfirm } = component
    const { dispatch, history, patient } = props
    dispatch({
      type: 'patient/upsert',
      payload: values,
    }).then((r) => {
      if (r) {
        if (r.id) {
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
        dispatch({
          type: 'patient/query',
          payload: {
            id: r.id || patient.entity.id,
          },
        }).then((value) => {
          resetForm(value)
        })
        if (onConfirm) onConfirm()
      }
    })
  },

  displayName: 'PatientDetail',
})
class PatientDetail extends PureComponent {
  state = {}

  constructor (props) {
    console.log('PatientDetail constructor')
    super(props)
    this.widgets = [
      {
        id: '1',
        name: 'Demographic',
        access: 'patient.view',
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
        access: 'patient.view',
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
        access: 'patient.view',
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
        access: 'patient.view',
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
        access: 'patient.view',
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
        access: 'patient.view',
        component: Loadable({
          loader: () => import('./PatientHistory'),
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
    if (this.props.patient.currentId) {
      this.props
        .dispatch({
          type: 'patient/query',
          payload: {
            id: this.props.patient.currentId,
          },
        })
        .then((o) => {
          this.props.resetForm(o)
        })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { errors, dispatch, patient } = nextProps

    const menuErrors = {}
    Object.keys(errors).forEach((k) => {
      this.widgets.forEach((w) => {
        menuErrors[w.id] = !!(w.schema && w.schema[k])
      })
    })
    if (!_.isEqual(patient.menuErrors, menuErrors)) {
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

    const {
      patient,
      global,
      handleSubmit,
      resetForm,
      values,
      dispatch,
    } = resetProps
    if (!patient) return null
    const { currentComponent, currentId, menuErrors } = patient
    const currentMenu =
      this.widgets.find((o) => o.id === currentComponent) || {}
    const CurrentComponent = currentMenu.component

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={2} style={{ paddingTop: 20 }}>
          <Card profile>
            {currentId ? (
              <CardAvatar profile>
                <a href='#pablo' onClick={(e) => e.preventDefault()}>
                  <img src={avatar} alt='...' />
                </a>
              </CardAvatar>
            ) : (
              <PictureUpload style={{ marginTop: '-50px' }} />
            )}
            <CardBody profile>
              {currentId && (
                <React.Fragment>
                  <h6 className={classes.cardCategory}>G1234567X</h6>
                  <h4 className={classes.cardTitle}>Alec Thompson</h4>
                  <h6>{moment().format('DD-MMM-YYYY')}</h6>
                </React.Fragment>
              )}

              <Divider light />
              <div
                ref='sidebarWrapper'
                style={{
                  maxHeight: 'calc(100vh - 329px)',
                  position: 'relative',
                }}
              >
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
                            dispatch({
                              type: 'patient/updateState',
                              payload: {
                                entity: values,
                              },
                            })
                            this.props.history.push(
                              getAppendUrl({
                                md: 'pt',
                                cmt: o.id,
                              }),
                            )
                          }}
                        >
                          <span
                            style={{
                              color: menuErrors[o.id] ? 'red' : 'inherit',
                            }}
                          >
                            {o.name}
                          </span>
                        </MenuItem>
                      </Authorized>
                    ))}
                </MenuList>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={10}>
          <CardContainer style={{ marginTop: 0 }} hideHeader>
            <div
              style={
                height > 0 ? (
                  { height: height - 88 - 20, overflow: 'auto', padding: 4 }
                ) : (
                  { padding: 4 }
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
              onReset:
                values && values.id
                  ? () => {
                      resetForm(patient.entity)
                    }
                  : undefined,
              onCancel: () => {
                dispatch({
                  type: 'patient/closePatientModal',
                })
              },
              onConfirm: handleSubmit,
              confirmBtnText: 'Save',
            })}
          </div>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientDetail)
