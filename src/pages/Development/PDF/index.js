import React, { PureComponent } from 'react'
import axios from 'axios'
import moment from 'moment'
import * as Yup from 'yup'
import classNames from 'classnames'
import { FastField, Field, withFormik } from 'formik'
import { Lock } from '@material-ui/icons'
import { FormControl, InputLabel, Input, withStyles } from '@material-ui/core'
import { DatePicker } from 'antd'
import {
  PDFViewer,
  BlobProvider,
  Document,
  Font,
  Page,
  Text,
  Image,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CommonHeader,
  CommonModal,
  Checkbox,
  DatePicker as MUIDatePicker,
  EditableTableGrid,
  GridContainer,
  GridItem,
  OutlinedTextField,
  RadioGroup,
  Select,
  TextField,
  MyDocument,
  NumberInput,
} from '@/components'
import BaseInput from '@/components/TimeInput/BaseInput'
import TimeInput from '@/components/TimeInput'
// assets
import { cardTitle } from 'assets/jss'
// sub components
import TestPDF from './TestPDF'

const columns = [
  { name: 'invoiceNo', title: 'Invoice No' },
  { name: 'invoiceDate', title: 'Invoice Date' },
  { name: 'statementDate', title: 'Statement Date' },
  { name: 'patientName', title: 'Patient Name' },
  { name: 'amount', title: 'Payable Amount' },
  { name: 'outstandingBalance', title: 'O/S Balance' },
]
const currencyColumns = [
  'amount',
  'outstandingBalance',
]
const dateColumns = [
  'invoiceDate',
  'statementDate',
]
const textColumns = [
  'invoiceNo',
  'patientName',
]

const FuncProps = { edit: true }

const styles = (theme) => ({
  cardContainer: {
    marginBottom: 0,
  },
  cardBody: {
    padding: '0 20px',
  },
  cardTitle: { ...cardTitle, color: 'white' },
  companyName: {
    fontWeight: '600',
    color: 'white',
  },
})

const ValidationSchema = Yup.object().shape({
  timing2: Yup.string().required(),
  input_1: Yup.string().required(),
})
@withFormik({
  validationSchema: ValidationSchema,
  mapPropsToValues: () => ({
    Test: 'Testing multiple lines of input',
    timing2: '08:30',
  }),
})
class DevelopmentPage extends PureComponent {
  state = {
    testHour: 12,
  }

  onNumberInputChange = (event) => {
    const { target } = event
    this.setState({ testHour: target.value })
  }

  getCodeTable = () => {
    // const codetableName = 'Country'
    // const url = 'http://localhost:55314/api/CodeTable?ctnames='
    // const method = 'GET'
    // caches.open('test').then((cache) => {
    //   // axios({
    //   //   method,
    //   //   url: `${url}${codetableName}`,
    //   // })
    //   //   .then((response) => {
    //   //     const toSave = new Response(response.body)
    //   //     // cache.put('CT_Country', response)
    //   //     console.log('saved response', toSave)
    //   //     return toSave
    //   //   })
    //   fetch(`${url}${codetableName}`, {
    //     method,
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }).then((response) => {
    //     cache.put('CT_Country', response)
    //   })
    // })
  }

  getCache = () => {
    // caches.open('test').then((cache) => {
    //   cache.match('CT_Country').then((response) => {
    //     console.log('cached response', response)
    //     if (response) {
    //       response.json().then((data) => {
    //         console.log('json data', data)
    //       })
    //     }
    //   })
    // })
  }

  render () {
    const { classes, theme, values } = this.props
    return (
      <CommonHeader Icon={<Lock />}>
        <GridContainer>
          <GridItem xs md={2}>
            <Field
              name='timing2'
              render={(args) => (
                <NumberInput {...args} time number={false} label='Timing' />
              )}
            />
          </GridItem>
          <GridItem xs md={2}>
            <Button onClick={this.getCodeTable}>Get A codetable</Button>
          </GridItem>
          <GridItem xs md={2}>
            <Button onClick={this.getCache}>Get cache</Button>
          </GridItem>
        </GridContainer>
      </CommonHeader>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DevelopmentPage)
