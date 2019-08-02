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
  CodeSelect,
  dateFormatLong,
  DatePicker,
} from '@/components'
import Loading from '@/components/PageLoading/index'
import { withStyles, MenuItem, MenuList, Divider } from '@material-ui/core'
import Authorized from '@/utils/Authorized'
import { getRemovedUrl, getAppendUrl } from '@/utils/utils'
import schema from './schema'

moment.updateLocale('en', {
  relativeTime: {
    past: '%s',
    yy: '%d yr',
  },
})

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
    const { currentComponent, currentId, menuErrors, entity } = patient
    const currentMenu =
      this.widgets.find((o) => o.id === currentComponent) || {}
    const CurrentComponent = currentMenu.component
    // console.log(patient)

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={2}>
          <Card profile>
            <CardBody profile>
              {entity && (
                <React.Fragment>
                  <h4
                    className={classes.cardCategory}
                    style={{ marginBottom: theme.spacing(1), fontWeight: 500 }}
                  >
                    <CodeSelect
                      // authority='none'
                      text
                      code='ctSalutation'
                      value={entity.salutationFK}
                    />{' '}
                    {entity.name}
                  </h4>
                  <p>{entity.patientReferenceNo}</p>
                  <p>
                    {entity.patientAccountNo},{' '}
                    <CodeSelect
                      text
                      code='ctNationality'
                      value={entity.nationalityFK}
                    />
                  </p>

                  <p>
                    <DatePicker
                      text
                      format={dateFormatLong}
                      value={entity.dob}
                    />{' '}
                    ({moment(entity.dob).fromNow()})
                  </p>
                  <Divider light />
                  <div
                    style={{
                      textAlign: 'left',
                      fontSize: '0.8rem',
                      paddingTop: theme.spacing(1),
                      maxHeight: height - 455 - 20,
                      overflow: 'auto',
                    }}
                  >
                    {entity.patientScheme.map((o) => {
                      return (
                        <div style={{ marginBottom: theme.spacing(1) }}>
                          <p style={{ fontWeight: 500 }}>
                            <CodeSelect
                              text
                              code='ctSchemeType'
                              value={o.schemeTypeFK}
                            />
                            <CodeSelect
                              text
                              // code='ctSchemeType'
                              options={[
                                { value: 1, name: 'Test 01' },
                                { value: 2, name: 'Test 02' },
                                { value: 3, name: 'Test 03' },
                              ]}
                              value={o.coPaymentSchemeFK}
                            />
                          </p>
                          {o.validFrom && (
                            <p>
                              Validity:{' '}
                              <DatePicker
                                text
                                format={dateFormatLong}
                                value={o.validFrom}
                              />{' '}
                              -{' '}
                              <DatePicker
                                text
                                format={dateFormatLong}
                                value={o.validTo}
                              />
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <Divider light />
                </React.Fragment>
              )}
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
