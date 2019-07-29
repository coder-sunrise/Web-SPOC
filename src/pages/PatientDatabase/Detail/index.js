import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import PerfectScrollbar from 'perfect-scrollbar'
import Yup from '@/utils/yup'
import _ from 'lodash'
import Link from 'umi/link'
import { withStyles, MenuItem, MenuList, Divider } from '@material-ui/core'
import {
  withFormikExtend,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  Transition,
  ProgressButton,
  CardContainer,
  Button,
  notification,
} from '@/components'
import avatar from '@/assets/img/faces/marc.jpg'
import { getRemovedUrl, getAppendUrl } from '@/utils/utils'
import Replay from '@material-ui/icons/Replay'
import Clear from '@material-ui/icons/Clear'

import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'

let ps

const styles = (theme) => ({
  hide: {
    display: 'none',
  },
})

// prettier-ignore
const _multiples = [2,7,6,5,4,3,2]
Yup.addMethod(Yup.string, 'NRIC', function (message) {
  return this.test('isValidNRIC', message, function (value = '') {
    const { parent, createError } = this
    const { patientAccountNoTypeFK, dob } = parent

    const firstChar = value[0] || ''
    const lastChar = value[value.length - 1] || ''
    let outputChars = []
    switch (patientAccountNoTypeFK) {
      case 1: // fin
        if (firstChar === 'F')
          // prettier-ignore
          outputChars = ['X','W','U','T','R','Q','P','N','M','L','K']
        else if (firstChar === 'G')
          // prettier-ignore
          outputChars = ['R','Q','P','N','M','L','K','X','W','U','T']
        break
      case 5:
      case 6:
      case 10:
      case 11:
      case 12:
      case 13:
        // nric
        if (firstChar === 'S')
          // prettier-ignore
          outputChars = ['J','Z','I','H','G','F','E','D','C','B','A']
        else if (firstChar === 'T')
          // prettier-ignore
          outputChars = ['G','F','E','D','C','B','A','J','Z','I','H']
        break

      default:
        return true
    }
    if (value.length !== 9)
      return createError({
        message: 'Account number must be 9 digits',
      })
    value = value.toUpperCase()

    const numericNRICString = value.substring(1, value.length - 2)

    if (!new RegExp(/^\d+$/).test(numericNRICString))
      return createError({
        message: ' Invalid account number structure',
      })
    let numberNRIC = Number(numericNRICString)
    let total = 0
    let count = 0
    while (numberNRIC !== 0) {
      total += (numberNRIC % 10) * _multiples[_multiples.length - (1 + count++)]
      numberNRIC /= 10
      numberNRIC = Math.floor(numberNRIC)
    }
    if (total % 11 > outputChars.length - 1)
      return createError({
        message: ' Invalid account number structure',
      })

    if (dob) {
      switch (patientAccountNoTypeFK) {
        case 5:
        case 6:
        case 10:
        case 11:
        case 12:
        case 13:
          // nric
          const mDob = moment(dob)
          if (mDob.year() >= 2000) {
            if (firstChar !== 'T') {
              return createError({
                message: 'Invalid date of birth',
              })
            }
          } else if (firstChar !== 'S') {
            return createError({
              message: 'Invalid date of birth',
            })
          }
          if (
            patientAccountNoTypeFK === 13 &&
            Math.abs(mDob.diff(moment(), 'year')) >= 15
          ) {
            return createError({
              message:
                'For Singaporean age 15 and above, please choose others than SG Birth Cert',
            })
          }
          break

        default:
          return true
      }
    }
    return true
  })
})

const schemaDemographic = {
  name: Yup.string().required(),
  dob: Yup.date().required(),
  patientAccountNoTypeFK: Yup.number().required(),
  patientAccountNo: Yup.string().NRIC().required(),
  genderFK: Yup.number().required(),

  referredBy: Yup.string(),
  referralRemarks: Yup.string().when('referredBy', {
    is: 'Company',
    then: Yup.string().required(),
  }),
  referredByPatientFK: Yup.number().when('referredBy', {
    is: 'Patient',
    then: Yup.number().required(),
  }),
  // dialect: Yup.string().required(),
  // contact.mobileContactNumber.number:Yup.string().render(),
  contact: Yup.object().shape({
    // contactAddress: Yup.array().compact((v) => v.isDeleted).of(
    //   Yup.object().shape({
    //     postcode: Yup.number().required(),
    //     countryFK: Yup.string().required(),
    //   }),
    // ),
    contactEmailAddress: Yup.object().shape({
      emailAddress: Yup.string().email(),
    }),
    mobileContactNumber: Yup.object().shape({
      number: Yup.string().required(),
    }),
  }),
}

const pecValidationSchema = Yup.object().shape({
  accountNoTypeFK: Yup.string().required(),
  accountNo: Yup.string().NRIC().required(),
  name: Yup.string().required(),
  relationshipFK: Yup.number().required(),
})
const schemaEmergencyContact = {
  patientEmergencyContact: Yup.array()
    .compact((v) => v.isDeleted)
    .of(pecValidationSchema),
}

const schemaAllergies = {
  patientAllergyMetaData: Yup.array().compact((v) => v.isDeleted).of(
    Yup.object().shape({
      noAllergies: Yup.boolean(),
      g6PDFK: Yup.number(),
    }),
  ),
  patientAllergy: Yup.array().compact((v) => v.isDeleted).of(
    Yup.object().shape({
      type: Yup.string().required(),
      allergyFK: Yup.number().required(),
      allergyName: Yup.string().required(),
      allergyReaction: Yup.string().required(),
      patientAllergyStatusFK: Yup.number().required(),
      adverseReaction: Yup.string(),
      onsetDate: Yup.date(),
    }),
  ),
}

const schemaSchemes = {
  patientScheme: Yup.array()
    .unique((v) => v.schemeTypeFK, 'error', () => {
      notification.error({
        message: 'The Schemes record already exists in the system',
      })
    })
    .compact((v) => v.isDeleted)
    .of(
      Yup.object().shape({
        schemeTypeFK: Yup.number().required(),
      }),
    ),
  schemePayer: Yup.array().compact((v) => v.isDeleted).of(
    Yup.object().shape({
      payerName: Yup.string().required(),
      dob: Yup.date(),
    }),
  ),
}
// console.log(pecValidationSchema, schemaAllergies)
@connect(({ patient, global }) => ({
  patient,
  global,
}))
@withFormikExtend({
  mapPropsToValues: ({ patient }) => {
    console.log('mapPropsToValues', patient)
    return patient.entity || patient.default
  },
  validationSchema: ({ patient, dispatch }) => {
    const { currentComponent } = patient
    return Yup.object().shape({
      ...schemaDemographic,
      ...schemaEmergencyContact,
      ...schemaAllergies,
      ...schemaSchemes,
    })
  },

  handleSubmit: (values, component) => {
    const { props, setValues, onConfirm } = component
    const { dispatch, history, patient } = props
    // return
    dispatch({
      type: 'patient/upsert',
      payload: values,
    }).then((r) => {
      // console.log(r)
      // console.debug(123)
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
          setValues(value)
        })
        if (onConfirm) onConfirm()
      }
    })
  },

  displayName: 'PatientDetail',
})
class PatientDetail extends PureComponent {
  state = {
    // selectedIndex: null,
    // menuErrors: [],
  }

  constructor (props) {
    console.log('PatientDetail constructor')
    super(props)
    this.widgets = [
      {
        id: '1',
        name: 'Demographic',
        schema: schemaDemographic,
        component: Loadable({
          loader: () => import('./Demographics'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            // console.log(props, p)
            return <Cmpnet {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '2',
        name: 'Emergency Contact',
        schema: schemaEmergencyContact,
        component: Loadable({
          loader: () => import('./EmergencyContact'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet schema={pecValidationSchema} {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '3',
        name: 'Allergies',
        schema: schemaAllergies,
        component: Loadable({
          loader: () => import('./Allergies'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet schema={schemaAllergies} {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '4',
        name: 'Schemes',
        schema: schemaSchemes,
        component: Loadable({
          loader: () => import('./Schemes'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet schema={schemaSchemes} {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '5',
        name: 'Appointment History',
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

  // handleListItemClick = (e, i) => {
  //   this.setState({ selectedIndex: i })
  // }

  componentDidMount () {
    // if (navigator.platform.indexOf('Win') > -1 && this.refs.sidebarWrapper) {
    //   ps = new PerfectScrollbar(this.refs.sidebarWrapper, {
    //     suppressScrollX: true,
    //     suppressScrollY: false,
    //   })
    // }
    if (this.props.patient.currentId) {
      this.props
        .dispatch({
          type: 'patient/query',
          payload: {
            id: this.props.patient.currentId,
          },
        })
        .then((o) => {
          console.log(o)
          this.props.resetForm(o)
        })
    }

    // dispatch({
    //   type: 'updateState',
    //   payload: {
    //     currentComponent: query.cmt,
    //     currentId: query.pid,
    //   },
    // })
  }

  componentWillReceiveProps (nextProps) {
    const { values, errors, dispatch, patient } = nextProps
    // console.log(schemaDemographic, schemaEmergencyContact, errors)

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

  componentWillUnmount () {
    if (navigator.platform.indexOf('Win') > -1 && ps) {
      ps.destroy()
    }
    // this.props.dispatch({
    //   type: 'patient/updateState',
    //   payload: {
    //     entity: undefined,
    //   },
    // })
  }

  filterList = (item) => {
    const { columns } = this.state
    const cols = columns.map((col) => col.name)
    const list = Object.keys(item).reduce((filtered, key) => {
      return cols.includes(key)
        ? { ...filtered, [key]: item[key] }
        : { ...filtered }
    }, {})
    return list
  }

  render () {
    const {
      theme,
      classes,
      height,
      linkProps = {},
      onMenuClick = (p) => p,
      footer,
      ...resetProps
    } = this.props
    console.log(this.props)

    const {
      patient,
      global,
      history,
      handleSubmit,
      resetForm,
      values,
      dispatch,
    } = resetProps
    if (!patient) return null
    const { currentComponent, currentId, menuErrors } = patient
    // console.log(values, this.state)
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
