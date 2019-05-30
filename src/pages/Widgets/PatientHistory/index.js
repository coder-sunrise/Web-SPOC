import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { connect } from 'dva'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'

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

import model from './models'

window.g_app.replaceModel(model)

const styles = (theme) => {
  return {
    note: {
      fontSize: 10,
      fontWeight: 400,
      marginTop: -3,
      lineHeight: '10px',
    },
    listRoot: {
      width: '100%',
    },
    listItemRoot: {
      paddingTop: 4,
      paddingBottom: 4,
    },
    listItemTextRoot: {
      padding: 0,
    },
    listItemDate: {
      position: 'absolute',
      right: '21%',
    },
    paragraph: {
      marginLeft: theme.spacing.unit,
    },
    rightPanel: {
      padding: `0 ${theme.spacing.unit}px`,
      border,
      '& h6': {
        textDecoration: 'underline',
      },
      '& h6:not(:first-child)': {
        marginTop: theme.spacing.unit,
      },
      '& p': {
        fontSize: '0.8em',
        lineHeight: '1em',
      },
    },
  }
}
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
@withFormik({
  // mapPropsToValues: ({ patientHistory }) => {
  //   console.log(patientHistory)
  //   return patientHistory.entity ? patientHistory.entity : patientHistory.default
  // },
  // validationSchema: Yup.object().shape({
  //   name: Yup.string().required(),
  //   dob: Yup.date().required(),
  //   patientAccountNo: Yup.string().required(),
  //   genderFk: Yup.string().required(),
  //   dialect: Yup.string().required(),
  //   contact: Yup.object().shape({
  //     contactAddress: Yup.array().of(
  //       Yup.object().shape({
  //         line1: Yup.string().required(),
  //         postcode: Yup.number().required(),
  //         countryFk: Yup.string().required(),
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
  render () {
    const { theme, classes } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem sm={4}>
            <FastField
              name='start'
              render={(args) => {
                return <DatePicker label='From' {...args} />
              }}
            />
          </GridItem>
          <GridItem sm={4}>
            <FastField
              name='end'
              render={(args) => {
                return <DatePicker label='To' {...args} />
              }}
            />
          </GridItem>
          <GridItem sm={4}>
            <div style={{ lineHeight: standardRowHeight }}>
              <Button size='small' color='primary'>
                Search
              </Button>
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer gutter={0}>
          <GridItem md={5} lg={4}>
            <List
              component='nav'
              classes={{
                root: this.props.classes.listRoot,
              }}
              disablePadding
            >
              {data.map((o) => (
                <ListItem
                  alignItems='flex-start'
                  classes={{
                    root: classes.listItemRoot,
                  }}
                  divider
                  disableGutters
                  button
                >
                  <ListItemText
                    primaryTypographyProps={{
                      style: { fontSize: 12 },
                    }}
                    classes={{
                      root: classes.listItemTextRoot,
                    }}
                    primary={
                      <div style={{ width: '100%' }}>
                        <GridContainer>
                          <GridItem sm={7}>
                            <p>{o.name}</p>
                            <i style={{ fontSize: '0.6rem' }}>{o.doctor}</i>
                          </GridItem>
                          <GridItem sm={5}>{o.date}</GridItem>
                        </GridContainer>
                      </div>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </GridItem>
          <GridItem md={7} lg={8}>
            <div className={classes.rightPanel}>
              <h6>Chief Complaints</h6>
              <div className={classes.paragraph}>
                <p>A *paragraph* of text</p>
                <p>A _second_ row of text</p>
              </div>

              <h6>Plan</h6>
              <p>A *paragraph* of text</p>
              <p>A _second_ row of text</p>
              <h6>Diagnosis</h6>
              <p>1. Asthma (12 Apr 2019)</p>
              <p>2. Fever (12 Apr 2019)</p>
              <p>3. Cough (12 Apr 2019)</p>
              <h6>Medical Certificate</h6>
              <p>
                <a>Medical Certificate</a>
              </p>
              <h6>Medication List</h6>
              <p>1. Augmentin 625 mg FC tab</p>
              <p>Take 1 Tab/s Every Night For 2 Days</p>
              <p>2. Biogesic tab 500 mg</p>
              <p>Take Twice A Day</p>
              <h6>Vaccination List</h6>
              <p>1. Augmentin 625 mg FC tab</p>
              <p>2. CYCLOGYL 1 %</p>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientHistory)
