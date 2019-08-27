import React, { Component } from 'react'
import moment from 'moment'
import { Editor } from 'react-draft-wysiwyg'
import { connect } from 'dva'
import Yup from '@/utils/yup'
import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'
import classnames from 'classnames'
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
} from '@/components'
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

import Orders from './Orders'
import ConsultationDocument from './ConsultationDocument'
import ResultHistory from './ResultHistory'
import Invoice from './Invoice'
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
})
const data = [
  {
    id: 1,
    name: 'Consultation Visit',
    doctor: 'Dr Levine',
    date: '12 Apr 2019',
  },
  {
    id: 2,
    name: 'Consultation Visit',
    doctor: 'Dr Levine',
    date: '01 Apr 2019',
  },
  {
    id: 3,
    name: 'Consultation Visit',
    doctor: 'Dr Levine',
    date: '01 Jan 2019',
  },
  {
    id: 4,
    name: 'Consultation Visit',
    doctor: 'Dr Levine',
    date: '12 Dec 2018',
  },
  {
    id: 5,
    name: 'Consultation Visit',
    doctor: 'Dr Levine',
    date: '08 Dec 2018',
  },
]
@withFormikExtend({
  // mapPropsToValues: ({ patientHistory }) => {
  //   console.log(patientHistory)
  //   return patientHistory.entity ? patientHistory.entity : patientHistory.default
  // },
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

  handleSubmit: () => {},
  displayName: 'PatientHistory',
})
@connect(({ patientHistory }) => ({
  patientHistory,
}))
class PatientHistory extends Component {
  state = {
    selectedItems: [
      '0',
    ],
  }

  constructor (props) {
    super(props)
    this.widgets = [
      {
        id: '1',
        name: 'Chief Complaints',
        component: Loadable({
          loader: () => import('./ChiefComplaints'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} />
          },
          loading: Loading,
        }),
      },
      {
        id: '2',
        name: 'Plan',
        component: Loadable({
          loader: () => import('./Plan'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} />
          },
          loading: Loading,
        }),
      },
      {
        id: '3',
        name: 'Diagnosis',
        component: Loadable({
          loader: () => import('./Diagnosis'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} />
          },
          loading: Loading,
        }),
      },
      {
        id: '4',
        name: 'Orders',
        component: Loadable({
          loader: () => import('./Orders'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} />
          },
          loading: Loading,
        }),
      },
      {
        id: '5',
        name: 'Consultation Document',
        component: Loadable({
          loader: () => import('./ConsultationDocument'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} />
          },
          loading: Loading,
        }),
      },
      {
        id: '6',
        name: 'Result History',
        component: Loadable({
          loader: () => import('./ResultHistory'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} />
          },
          loading: Loading,
        }),
      },
      {
        id: '7',
        name: 'Invoice',
        component: Loadable({
          loader: () => import('./Invoice'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} />
          },
          loading: Loading,
        }),
      },
    ]
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
    if (
      nextProps.patientHistory.patientID &&
      this.props.patientHistory.patientID !== nextProps.patientHistory.patientID
    ) {
      nextProps
        .dispatch({
          type: 'patientHistory/query',
          payload: {
            patientProfileFK: nextProps.patientHistory.patientID,
            sorting: [
              {
                columnName: 'VisitDate',
                direction: 'asc',
              },
            ],
          },
        })
        .then((o) => {
          this.props.resetForm(o)
        })
    }
  }

  // componentDidMount () {

  // }

  getTitle = (row) => (
    <div className={this.props.classes.title}>
      <GridContainer>
        <GridItem sm={7}>
          <p
            onClick={() => {
              console.log(row)
              this.props.dispatch({
                type: 'patientHistory/queryOne',
                payload: row.coHistory[0].id,
              })
            }}
          >
            <span>Consultation Visit</span>
            <div className={this.props.classes.note}>
              V4, {row.doctorTitle} {row.doctorName}
            </div>
          </p>
        </GridItem>
        <GridItem sm={5}>
          <span style={{ whiteSpace: 'nowrap', position: 'relative' }}>
            {/* <DateRange style={{ position: 'absolute', left: 0 }} /> */}
            12 Apr 2019
          </span>
          <div className={this.props.classes.note}>&nbsp;</div>
        </GridItem>
      </GridContainer>
    </div>
  )

  getContent = (row) => {
    return (
      <List
        component='nav'
        classes={{
          root: this.props.classes.listRoot,
        }}
        disablePadding
      >
        {row.coHistory.map((o) => {
          return (
            <ListItem
              alignItems='flex-start'
              classes={{
                root: this.props.classes.listItemRoot,
              }}
              divider
              disableGutters
              button
            >
              <ListItemText
                primary={
                  <div style={{ width: '100%', paddingRight: 20 }}>
                    <GridContainer>
                      <GridItem sm={7}>
                        V{o.versionNumber}, {row.doctorTitle} {row.doctorName}
                      </GridItem>
                      <GridItem sm={5}>
                        <DatePicker text defaultValue={moment(row.visitDate)} />
                      </GridItem>
                    </GridContainer>
                  </div>
                }
              />
            </ListItem>
          )
        })}
      </List>
    )
  }

  onSelectChange = (val) => {
    this.setState({
      selectedItems: val,
    })
  }

  render () {
    const { theme, style, classes, override = {}, patientHistory } = this.props
    return (
      <div style={style}>
        <CardContainer
          hideHeader
          size='sm'
          className={classnames({
            [classes.leftPanel]: true,
            [override.leftPanel]: true,
          })}
        >
          <Accordion
            active={0}
            collapses={[
              {
                title: this.getTitle(),
                content: this.getContent(),
              },
              {
                title: this.getTitle(),
                content: this.getContent(),
              },
              {
                title: this.getTitle(),
                content: this.getContent(),
              },
            ]}
          />
        </CardContainer>
        <CardContainer
          hideHeader
          size='sm'
          className={classnames({
            [classes.rightPanel]: true,
            [override.rightPanel]: true,
          })}
          // style={{ marginLeft: theme.spacing.unit * 2 }}
        >
          <Select
            noWrapper
            defautValue={this.state.selectedItems}
            all='0'
            prefix='Filter By'
            mode='multiple'
            options={[
              { name: 'All', value: '0' },
              { name: 'Chief Complaints', value: '1' },
              { name: 'Plan', value: '2' },
              { name: 'Diagnosis', value: '3' },
              { name: 'Consultation Document', value: '4' },
              { name: 'Orders', value: '5' },
              { name: 'Result History', value: '6' },
              { name: 'Invoice', value: '7' },
            ]}
            label='Filter By'
            maxTagCount={3}
            style={{ marginBottom: theme.spacing(1) }}
            onChange={this.onSelectChange}
          />
          {this.widgets
            .filter(
              (o) =>
                this.state.selectedItems.length === 0 ||
                this.state.selectedItems.indexOf('0') >= 0 ||
                this.state.selectedItems.indexOf(o.id) >= 0,
            )
            .map((o) => {
              const Widget = o.component
              return (
                <div>
                  <h5>{o.name}</h5>
                  <Widget />
                </div>
              )
            })}
        </CardContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientHistory)
