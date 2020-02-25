/* eslint-disable no-nested-ternary */
import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'dva'
import router from 'umi/router'
import Loadable from 'react-loadable'
import classnames from 'classnames'
// material ui
import { withStyles, List, ListItem, ListItemText } from '@material-ui/core'
// common components
import {
  GridContainer,
  GridItem,
  TextField,
  Select,
  DatePicker,
  ProgressButton,
  CardContainer,
  Accordion,
  withFormikExtend,
  Skeleton,
} from '@/components'
import Authorized from '@/utils/Authorized'

import Loading from '@/components/PageLoading/index'
import AuthorizedContext from '@/components/Context/Authorized'
// utils
import { findGetParameter } from '@/utils/utils'
import { VISIT_TYPE_NAME, VISIT_TYPE, CLINIC_TYPE } from '@/utils/constants'
import * as WidgetConfig from './config'

// import model from './models'

// window.g_app.replaceModel(model)

const styles = (theme) => ({
  root: {},
  hide: {
    display: 'none',
  },
  title: {
    fontSize: '1em',
  },
  note: {
    fontSize: '0.85em',
    fontWeight: 400,
    // marginTop: -3,
    lineHeight: '10px',
  },
  listRoot: {
    width: '100%',
  },
  listItemRoot: {
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: '0.85em',
  },
  listItemDate: {
    position: 'absolute',
    right: '21%',
  },
  paragraph: {
    marginLeft: theme.spacing(1),
  },
  leftPanel: {
    position: 'sticky',
    width: 400,
    top: 0,
    float: 'left',
    marginRight: theme.spacing(1),
    marginTop: 0,
  },
  rightPanel: {
    marginTop: 0,

    '& h5': {
      textDecoration: 'underline',
      marginTop: theme.spacing(2),
      fontSize: '1em',
    },
    // '& h5:not(:first-of-type)': {
    //   marginTop: theme.spacing(2),
    // },
  },
  integratedLeftPanel: {
    width: '100%',
  },
})
@withFormikExtend({
  mapPropsToValues: ({ patientHistory }) => {
    // console.log(patientHistory)
    // return patientHistory.entity ? patientHistory.entity : patientHistory.default
  },
  // validationSchema: Yup.object().shape({
  //   name: Yup.string().required(),
  //   dob: Yup.date().required(),
  //   patientAccountNo: Yup.string().required(),
  //   genderFK: Yup.string().required(),
  //   dialect: Yup.string().required(),
  //   contact: Yup.object().shape({
  //     contactAddress: Yup.array().of(
  //       Yup.object().shape({
  //         line1: Yup.string().required(),
  //         postcode: Yup.number().required(),
  //         countryFK: Yup.string().required(),
  //       }),
  //     ),
  //   }),
  // }),

  // handleSubmit: () => {},
  // displayName: 'PatientHistory',
})
@connect(({ patientHistory, clinicInfo, clinicSettings, codetable, user }) => ({
  patientHistory,
  clinicSettings,
  codetable,
  user,
  clinicInfo,
}))
class PatientHistory extends Component {
  static defaultProps = {
    mode: 'split',
  }

  constructor (props) {
    super(props)
    // const { clinicInfo } = props
    // const { clinicTypeFK = CLINIC_TYPE.GP } = clinicInfo
    // // console.log(clinicInfo)
    // this.widgets = WidgetConfig.gpWidgets(props)
    // switch (clinicTypeFK) {
    //   case CLINIC_TYPE.DENTAL:

    //     break
    //   default:
    //     break
    // }
    this.myRef = React.createRef()

    this.widgets = WidgetConfig.widgets(props).filter((o) => {
      const { rights } = Authorized.check(o.authority)
      // console.log(rights)
      return rights !== 'hidden'
    })
    this.state = {
      selectedItems: this.widgets.map((widget) => widget.id),
    }
  }

  componentWillMount () {
    const { dispatch, mode } = this.props
    const codeTableNameArray = [
      'ctComplication',
      'ctMedicationUsage',
      'ctMedicationDosage',
      'ctMedicationUnitOfMeasurement',
      'ctMedicationFrequency',
      'ctVaccinationUsage',
      'ctVaccinationUnitOfMeasurement',
    ]
    dispatch({
      type: 'codetable/batchFetch',
      payload: {
        codes: codeTableNameArray,
      },
    })

    dispatch({
      type: 'patientHistory/initState',
      payload: {
        queueID: Number(findGetParameter('qid')) || 0,
        version: Number(findGetParameter('v')) || undefined,
        visitID: findGetParameter('visit'),
        patientID: Number(findGetParameter('pid')) || 0,
        mode,
      },
    })

    dispatch({
      type: 'patientHistory/updateState',
      payload: {
        selected: '',
        selectedSubRow: '',
      },
    })
  }

  onSelectChange = (val) => {
    this.setState({
      selectedItems: val,
    })
  }

  getContent = (row) => {
    const { patientHistory, mode, clinicSettings } = this.props
    const { settings = [] } = clinicSettings
    const { selectedSubRow } = patientHistory
    const isRetailVisit = row.visitPurposeFK === VISIT_TYPE.RETAIL
    let newArray = []

    if (isRetailVisit) {
      newArray.push(row)
    } else if (
      settings.showConsultationVersioning === false ||
      settings.showConsultationVersioning === undefined
    ) {
      if (row.coHistory.length >= 1) {
        newArray.push(row.coHistory[0])
      }
    } else {
      newArray = row.coHistory
    }
    return (
      <List
        component='nav'
        classes={{
          root: this.props.classes.listRoot,
        }}
        disablePadding
        onClick={() => {}}
      >
        {newArray.map((o) => {
          const _title = o.userTitle ? `${o.userTitle} ` : ''

          return (
            <React.Fragment>
              <ListItem
                style={{ paddingLeft: 15 }}
                alignItems='flex-start'
                classes={{
                  root: this.props.classes.listItemRoot,
                }}
                selected={selectedSubRow && o.id === selectedSubRow.id}
                divider
                disableGutters
                button
                onClick={() => {
                  if (
                    mode === 'integrated' &&
                    selectedSubRow &&
                    selectedSubRow.id === o.id
                  ) {
                    this.props.dispatch({
                      type: 'patientHistory/updateState',
                      payload: {
                        selectedSubRow: undefined,
                      },
                    })
                    return
                  }
                  if (isRetailVisit) {
                    this.handleRetailVisitHistory(row)
                  } else
                    this.props
                      .dispatch({
                        type: 'patientHistory/queryOne',
                        payload: o.id,
                      })
                      .then((r) => {
                        if (r) {
                          this.props.dispatch({
                            type: 'patientHistory/updateState',
                            payload: {
                              selected: row,
                              selectedSubRow: o,
                            },
                          })
                          // this.props.dispatch({
                          //   type: 'consultationDocument/updateState',
                          //   payload: {
                          //     rows: r.documents,
                          //   },
                          // })
                        }
                      })
                }}
              >
                <ListItemText
                  primary={
                    <div
                      style={{
                        width: '100%',
                        paddingRight: 20,
                      }}
                    >
                      <GridContainer>
                        <GridItem sm={12} style={{ fontWeight: 500 }}>
                          <TextField text value={row.visitPurposeName} />
                          {row.visitDate && (
                            <span style={{ position: 'relative' }}>
                              &nbsp; (
                              <DatePicker
                                text
                                showTime
                                format='DD MMM YYYY h:mm a'
                                value={
                                  row.visitPurposeFK === VISIT_TYPE.RETAIL ? (
                                    row.visitDate
                                  ) : (
                                    o.signOffDate
                                  )
                                }
                              />)
                            </span>
                          )}
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem sm={7}>
                          <TextField
                            text
                            value={
                              settings.showConsultationVersioning &&
                              !isRetailVisit ? (
                                `V${o.versionNumber}, ${_title}${o.userName}`
                              ) : (
                                `${_title}${o.userName}`
                              )
                            }
                          />
                        </GridItem>
                      </GridContainer>
                    </div>
                  }
                />
              </ListItem>
              {selectedSubRow &&
              selectedSubRow.id === o.id &&
              mode === 'integrated' && <div>{this.getDetailPanel()}</div>}
            </React.Fragment>
          )
        })}
      </List>
    )
  }

  getTitle = (row) => {
    const { visitPurposeName = '' } = row
    const visitTitleLabel = visitPurposeName

    return (
      <div className={this.props.classes.title}>
        <GridContainer>
          <GridItem sm={12}>
            <p>
              <span>{visitTitleLabel}</span>
              <span style={{ position: 'relative' }}>
                &nbsp; (<DatePicker text value={row.visitDate} />)
              </span>
              <div className={this.props.classes.note}>
                {row.userTitle} {row.userName}
              </div>
            </p>
          </GridItem>
        </GridContainer>
      </div>
    )
  }

  // <GridItem sm={5} style={{ textAlign: 'right' }}>
  //           <span style={{ whiteSpace: 'nowrap', position: 'relative' }}>
  //             ( <DatePicker text value={row.visitDate} /> )
  //           </span>
  //           <div className={this.props.classes.note}>&nbsp;</div>
  //         </GridItem>

  // eslint-disable-next-line camelcase
  // UNSAFE_componentWillReceiveProps (nextProps) {
  //   // console.log(this.props, nextProps, nextProps.patientHistory.version)
  //   if (
  //     nextProps.patientHistory.version &&
  //     this.props.patientHistory.version !== nextProps.patientHistory.version
  //   ) {
  //     nextProps
  //       .dispatch({
  //         type: 'patientHistory/query',
  //         payload: {
  //           patientProfileFK: nextProps.patientHistory.patientID,
  //           sorting: [
  //             {
  //               columnName: 'VisitDate',
  //               direction: 'desc',
  //             },
  //           ],
  //           version:
  //         },
  //       })
  //       .then((o) => {
  //         // this.props.resetForm(o)
  //         nextProps.dispatch({
  //           type: 'patientHistory/updateState',
  //           payload: {
  //             selected: undefined,
  //             selectedSubRow: undefined,
  //             entity: undefined,
  //           },
  //         })
  //       })
  //   }
  // }

  getDetailPanel = () => {
    const {
      theme,
      classes,
      override = {},
      patientHistory,
      dispatch,
      widget,
      showEditPatient,
      codetable,
      user,
    } = this.props

    const { entity, selected, patientID } = patientHistory
    const { id: visitId } = selected
    const { visitPurposeFK } = selected
    const maxItemTagCount = this.state.selectedItems.length <= 1 ? 1 : 0
    // console.log({ maxItemTagCount, selected: this.state.selectedItems })

    const { location } = window

    const fromConsultation = location.pathname.includes('consultation')

    const isRetailVisit = selected.visitPurposeFK === VISIT_TYPE.RETAIL

    return (
      <CardContainer
        hideHeader
        size='sm'
        className={classnames({
          [classes.rightPanel]: true,
          [override.rightPanel]: true,
        })}
        // style={{ marginLeft: theme.spacing.unit * 2 }}
      >
        {!isRetailVisit && (
          <GridContainer gutter={0} alignItems='center'>
            <GridItem md={2}>
              <Select
                // simple
                value={this.state.selectedItems}
                allValue='0'
                // prefix='Filter By'
                mode='multiple'
                // maxTagCount={4}
                options={this.widgets.map((item) => ({
                  name: item.name,
                  value: item.id,
                }))}
                style={{ marginBottom: theme.spacing(1) }}
                onChange={this.onSelectChange}
                maxTagCount={maxItemTagCount}
              />
            </GridItem>
            <Authorized authority='patientdashboard.editconsultation'>
              <GridItem md={3}>
                {!fromConsultation && (
                  <ProgressButton
                    color='primary'
                    style={{ marginLeft: theme.spacing(2) }}
                    size='sm'
                    onClick={() => {
                      dispatch({
                        type: `consultation/edit`,
                        payload: {
                          id: selected.id,
                          version: patientHistory.version,
                        },
                      }).then((o) => {
                        if (o) {
                          if (o.updateByUserFK !== user.data.id) {
                            const { clinicianprofile = [] } = codetable
                            const version = Date.now()
                            const editingUser = clinicianprofile.find(
                              (m) => m.userProfileFK === o.updateByUserFK,
                            ) || {
                              name: 'Someone',
                            }
                            dispatch({
                              type: 'global/updateAppState',
                              payload: {
                                openConfirm: true,
                                openConfirmContent: `${editingUser.name} is currently editing the patient note, do you want to overwrite?`,
                                onConfirmSave: () => {
                                  dispatch({
                                    type: `consultation/overwrite`,
                                    payload: {
                                      id: selected.id,
                                      version,
                                    },
                                  }).then((c) => {
                                    dispatch({
                                      type: 'patient/closePatientModal',
                                    })
                                    router.push(
                                      `/reception/queue/consultation?qid=${visitId}&pid=${patientID}&cid=${c.id}&v=${version}`,
                                    )
                                  })
                                },
                              },
                            })
                          } else {
                            dispatch({
                              type: 'patient/closePatientModal',
                            })
                            router.push(
                              `/reception/queue/consultation?qid=${visitId}&pid=${patientID}&cid=${o.id}&v=${patientHistory.version}`,
                            )
                          }
                        }
                      })
                    }}
                  >
                    Edit Consultation
                  </ProgressButton>
                )}
              </GridItem>
            </Authorized>
            <GridItem md={7} style={{ textAlign: 'right' }}>
              Updated Date:&nbsp;
              {patientHistory.selectedSubRow.signOffDate && (
                <DatePicker
                  text
                  value={patientHistory.selectedSubRow.signOffDate}
                />
              )}
            </GridItem>
          </GridContainer>
        )}

        <AuthorizedContext.Provider
          value={{
            rights: 'disable',
          }}
        >
          {visitPurposeFK === VISIT_TYPE.RETAIL ? (
            this.widgets.filter((o) => o.id === '7').map((o) => {
              const Widget = o.component
              return (
                <div>
                  <h5 style={{ fontWeight: 500 }}>{o.name}</h5>
                  <Widget
                    current={entity || {}}
                    {...this.props}
                    setFieldValue={this.props.setFieldValue}
                  />
                </div>
              )
            })
          ) : (
            this.widgets
              .filter(
                (o) =>
                  this.state.selectedItems.indexOf('0') >= 0 ||
                  this.state.selectedItems.indexOf(o.id) >= 0,
              )
              .map((o) => {
                const Widget = o.component
                return (
                  <div>
                    <h5 style={{ fontWeight: 500 }}>{o.name}</h5>
                    <Widget
                      current={entity || {}}
                      {...this.props}
                      setFieldValue={this.props.setFieldValue}
                    />
                  </div>
                )
              })
          )}
          {/* {entity &&
            this.widgets
              .filter(
                (o) =>
                  this.state.selectedItems.indexOf('0') >= 0 ||
                  this.state.selectedItems.indexOf(o.id) >= 0,
              )
              .map((o) => {
                const Widget = o.component
                return (
                  <div>
                    <h5 style={{ fontWeight: 500 }}>{o.name}</h5>
                    <Widget
                      current={entity || {}}
                      {...this.props}
                      setFieldValue={this.props.setFieldValue}
                    />
                  </div>
                )
              })} */}
        </AuthorizedContext.Provider>
      </CardContainer>
    )
  }

  handleRetailVisitHistory = (v) => {
    this.props
      .dispatch({
        type: 'patientHistory/queryRetailHistory',
        payload: {
          id: v.invoiceFK,
        },
      })
      .then((r) => {
        if (r) {
          this.props.dispatch({
            type: 'patientHistory/updateState',
            payload: {
              selected: v,
              selectedSubRow: v,
            },
          })
        }
      })
  }

  render () {
    const {
      theme,
      style,
      classes,
      override = {},
      patientHistory,
      dispatch,
      widget,
      clinicSettings,
      mode,
    } = this.props
    const { settings = [] } = clinicSettings
    const { entity, visitInfo, selected } = patientHistory
    const cfg = {}

    if (!clinicSettings) return null

    if (mode === 'split') {
      cfg.style = style
    } else if (mode === 'integrated') {
      cfg.style = {}
    }

    let sortedPatientHistory = ''

    sortedPatientHistory = patientHistory.list
      ? patientHistory.list.filter(
          (o) =>
            o.visitPurposeFK === VISIT_TYPE.RETAIL || o.coHistory.length >= 1,
        )
      : ''

    // console.log({
    //   sortedPatientHistory,
    //   settings: settings.showConsultationVersioning,
    // })
    // console.log(this.myRef)
    return (
      <div {...cfg}>
        <CardContainer
          hideHeader
          size='sm'
          className={classnames({
            [classes.leftPanel]: !widget,
            [classes.integratedLeftPanel]: mode === 'integrated',
            [override.leftPanel]: !widget,
          })}
        >
          {sortedPatientHistory ? sortedPatientHistory.length >
          0 ? settings.showConsultationVersioning === false ||
          settings.showConsultationVersioning === undefined ? (
            sortedPatientHistory.map((o) => this.getContent(o))
          ) : (
            <div ref={this.myRef}>
              <Accordion
                defaultActive={0}
                onChange={(event, p, expanded) => {
                  if (expanded) {
                    setTimeout(() => {
                      $(this.myRef.current)
                        .find('div[aria-expanded=true]')
                        .next()
                        .find('div[role="button"]:eq(0)')
                        .trigger('click')
                    }, 1)
                  }
                }}
                collapses={sortedPatientHistory.map((o) => {
                  const isRetailVisit = o.visitPurposeFK === VISIT_TYPE.RETAIL
                  const returnValue = {
                    title: this.getTitle(o),
                    content: this.getContent(o),
                    hideExpendIcon: isRetailVisit,
                  }
                  if (isRetailVisit) {
                    return {
                      ...returnValue,
                      onClickSummary: () => this.handleRetailVisitHistory(o),
                    }
                  }
                  return {
                    ...returnValue,
                  }
                })}
              />
            </div>
          ) : (
            <p>No Visit Record Found</p>
          ) : (
            <React.Fragment>
              <Skeleton height={30} />
              <Skeleton height={30} width='80%' />
              <Skeleton height={30} width='80%' />
              <Skeleton height={30} />
              <Skeleton height={30} width='80%' />
              <Skeleton height={30} width='80%' />
            </React.Fragment>
          )}
        </CardContainer>

        {selected && mode === 'split' && this.getDetailPanel()}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientHistory)
