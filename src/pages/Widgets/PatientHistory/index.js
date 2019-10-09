/* eslint-disable no-nested-ternary */
import React, { Component } from 'react'
import moment from 'moment'
import { Editor } from 'react-draft-wysiwyg'
import { connect } from 'dva'
import router from 'umi/router'
import Loadable from 'react-loadable'
import classnames from 'classnames'
import {
  withStyles,
  MenuItem,
  MenuList,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core'
import { standardRowHeight, border } from 'assets/jss'
import DeleteIcon from '@material-ui/icons/Delete'
import {
  Button,
  CommonHeader,
  CommonModal,
  NavPills,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  Accordion,
  withFormikExtend,
  Skeleton,
} from '@/components'
import Loading from '@/components/PageLoading/index'
import Yup from '@/utils/yup'
import { findGetParameter } from '@/utils/utils'

import Orders from './Orders'
import ConsultationDocument from './ConsultationDocument'
import ResultHistory from './ResultHistory'
import Invoice from './Invoice'
import AuthorizedContext from '@/components/Context/Authorized'

// import ChiefComplaints from './ChiefComplaints'
// import ChiefComplaints from './ChiefComplaints'

import model from './models'

window.g_app.replaceModel(model)

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
// @withFormikExtend({
//   // mapPropsToValues: ({ patientHistory }) => {
//   //   console.log(patientHistory)
//   //   return patientHistory.entity ? patientHistory.entity : patientHistory.default
//   // },
//   // validationSchema: Yup.object().shape({
//   //   name: Yup.string().required(),
//   //   dob: Yup.date().required(),
//   //   patientAccountNo: Yup.string().required(),
//   //   genderFK: Yup.string().required(),
//   //   dialect: Yup.string().required(),
//   //   contact: Yup.object().shape({
//   //     contactAddress: Yup.array().of(
//   //       Yup.object().shape({
//   //         line1: Yup.string().required(),
//   //         postcode: Yup.number().required(),
//   //         countryFK: Yup.string().required(),
//   //       }),
//   //     ),
//   //   }),
//   // }),

//   handleSubmit: () => {},
//   displayName: 'PatientHistory',
// })
@connect(({ patientHistory, clinicSettings }) => ({
  patientHistory,
  clinicSettings,
}))
class PatientHistory extends Component {
  state = {
    selectedItems: [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '7',
    ],
  }

  constructor (props) {
    super(props)
    this.widgets = [
      {
        id: '1',
        name: 'Clinician Note',
        component: Loadable({
          loader: () => import('./ClinicalNotes'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '2',
        name: 'Chief Complaints',
        component: Loadable({
          loader: () => import('./ChiefComplaints'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '3',
        name: 'Plan',
        component: Loadable({
          loader: () => import('./Plan'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '4',
        name: 'Diagnosis',
        component: Loadable({
          loader: () => import('./Diagnosis'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '5',
        name: 'Orders',
        component: Loadable({
          loader: () => import('./Orders'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} {...p} />
          },
          loading: Loading,
        }),
      },
      {
        id: '6',
        name: 'Consultation Document',
        component: Loadable({
          loader: () => import('./ConsultationDocument'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} {...p} />
          },
          loading: Loading,
        }),
      },
      // {
      //   id: '6',
      //   name: 'Result History',
      //   component: Loadable({
      //     loader: () => import('./ResultHistory'),
      //     render: (loaded, p) => {
      //       let Cmpnet = loaded.default
      //       return <Cmpnet {...props} {...p} />
      //     },
      //     loading: Loading,
      //   }),
      // },
      {
        id: '7',
        name: 'Invoice',
        component: Loadable({
          loader: () => import('./Invoice'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} {...p} />
          },
          loading: Loading,
        }),
      },
    ]
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'patientHistory/initState',
      payload: {
        queueID: Number(findGetParameter('qid')) || 0,
        version: Number(findGetParameter('v')) || undefined,
        visitID: findGetParameter('visit'),
        patientID: Number(findGetParameter('pid')) || 0,
      },
    })

    this.props.dispatch({
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
    const { selectedSubRow } = patientHistory

    let newArray = []
    if (clinicSettings.settings.ShowConsultationVersioning === false) {
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
      >
        {newArray.map((o) => {
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
                        <GridItem sm={7}>
                          <TextField text value={row.visitPurposeName} />
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem sm={7}>
                          <TextField
                            text
                            value={`V${o.versionNumber}, ${o.doctorTitle} ${o.doctorName}`}
                          />
                        </GridItem>
                        <GridItem sm={5} style={{ textAlign: 'right' }}>
                          {row.visitDate && (
                            <DatePicker
                              text
                              showTime
                              format='DD MMM YYYY h:mm a'
                              value={o.signOffDate}
                            />
                          )}
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
    const { coHistory } = row
    const latest = coHistory[coHistory.length] || {}
    return (
      <div className={this.props.classes.title}>
        <GridContainer>
          <GridItem sm={7}>
            <p>
              <span>Consultation Visit</span>
              <div className={this.props.classes.note}>
                {row.doctorTitle} {row.doctorName}
              </div>
            </p>
          </GridItem>
          <GridItem sm={5} style={{ textAlign: 'right' }}>
            <span style={{ whiteSpace: 'nowrap', position: 'relative' }}>
              <DatePicker text value={row.visitDate} />
            </span>
            <div className={this.props.classes.note}>&nbsp;</div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }

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
    } = this.props
    const { entity, selected } = patientHistory

    const maxItemTagCount = this.state.selectedItems.length <= 1 ? 1 : 0
    // console.log({ maxItemTagCount, selected: this.state.selectedItems })
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
        <GridContainer gutter={0} alignItems='center'>
          <GridItem md={2}>
            <Select
              // simple
              value={this.state.selectedItems}
              allValue='0'
              // prefix='Filter By'
              mode='multiple'
              maxTagCount={4}
              options={[
                { name: 'Chief Complaints', value: '1' },
                { name: 'Plan', value: '2' },
                { name: 'Diagnosis', value: '3' },
                { name: 'Consultation Document', value: '4' },
                { name: 'Orders', value: '5' },
                // { name: 'Result History', value: '6' },
                { name: 'Invoice', value: '7' },
              ]}
              style={{ marginBottom: theme.spacing(1) }}
              onChange={this.onSelectChange}
              maxTagCount={maxItemTagCount}
            />
          </GridItem>
          <GridItem md={3}>
            {(!widget || showEditPatient) && (
              <ProgressButton
                color='primary'
                style={{ marginLeft: theme.spacing(2) }}
                size='sm'
                onClick={() => {
                  if (showEditPatient) {
                    dispatch({
                      type: 'patient/closePatientModal',
                    })
                  } else {
                    dispatch({
                      type: `consultation/edit`,
                      payload: {
                        id: selected.id,
                        version: patientHistory.version,
                      },
                    }).then((o) => {
                      if (o)
                        router.push(
                          `/reception/queue/patientdashboard?qid=${patientHistory.queueID}&cid=${o.id}&v=${patientHistory.version}&md2=cons`,
                        )
                    })
                  }
                }}
              >
                Edit Consultation
              </ProgressButton>
            )}
          </GridItem>
          <GridItem md={7} style={{ textAlign: 'right' }}>
            Update Date:
            {patientHistory.selectedSubRow.signOffDate && (
              <DatePicker
                text
                value={patientHistory.selectedSubRow.signOffDate}
              />
            )}
          </GridItem>
        </GridContainer>

        <AuthorizedContext.Provider
          value={{
            rights: 'disable',
          }}
        >
          {entity &&
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
                    <h5>{o.name}</h5>
                    <Widget current={entity || {}} {...this.props} />
                  </div>
                )
              })}
        </AuthorizedContext.Provider>
      </CardContainer>
    )
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
      mode = 'split',
    } = this.props

    const { entity, visitInfo, selected } = patientHistory
    const cfg = {}
    if (mode === 'split') {
      cfg.style = style
    } else if (mode === 'integrated') {
      cfg.style = {}
    }

    let sortedPatientHistory = ''

    sortedPatientHistory = patientHistory.list
      ? patientHistory.list.filter((o) => o.coHistory.length >= 1)
      : ''

    return (
      <div {...cfg}>
        <CardContainer
          hideHeader
          size='sm'
          className={classnames({
            [classes.leftPanel]: !widget ? true : false,
            [classes.integratedLeftPanel]: mode === 'integrated',
            [override.leftPanel]: !widget ? true : false,
          })}
        >
          {sortedPatientHistory ? sortedPatientHistory.length >
          0 ? clinicSettings.settings.ShowConsultationVersioning === false ? (
            sortedPatientHistory.map((o) => this.getContent(o))
          ) : (
            <Accordion
              defaultActive={0}
              collapses={sortedPatientHistory.map((o) => ({
                title: this.getTitle(o),
                content: this.getContent(o),
              }))}
            />
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
