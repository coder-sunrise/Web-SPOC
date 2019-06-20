import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import PerfectScrollbar from 'perfect-scrollbar'
import Link from 'umi/link'
import DateRange from '@material-ui/icons/DateRange'
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
import {
  PictureUpload,
  GridContainer,
  GridItem,
  CardContainer,
  Transition,
  TextField,
  AntdInput,
  Select,
  Accordion,
  Button,
  CommonTableGrid2,
} from '@/components'

const Invoice = (props) => {
  const invoiceNo = 'INV/123456'
  const invoiceDate = '02 May 2019'
  return (
    <GridContainer>
      <GridItem xs={12}>Invoice No: {invoiceNo}</GridItem>
      <GridItem xs={12}>Invoice Date: {invoiceDate}</GridItem>
      <GridItem>
        <CommonTableGrid2
          size='sm'
          rows={[
            {
              id: 1,
              type: 'Medication',
              name: 'Biogesic tab 500 mg',
              quantity: 1,
              total: 40,
            },
            {
              id: 2,
              type: 'Medication',
              name: 'AMLODIPINE 5MG',
              quantity: 1,
              total: 40,
            },
            {
              id: 3,
              type: 'Vaccination',
              name: 'ACTACEL Vaccine Injection (0.5 mL)',
              quantity: 2,
              total: 40,
            },
            {
              id: 4,
              type: 'Vaccination',
              name: 'BOOSTRIX POLIO Vaccine',
              quantity: 2,
              total: 40,
            },
            {
              id: 5,
              type: 'Service',
              name: 'Consultation Service',
              quantity: 3,
              total: 30,
            },
          ]}
          columns={[
            { name: 'type', title: 'Type' },
            { name: 'name', title: 'Name' },
            { name: 'quantity', title: 'Quantity' },
            { name: 'total', title: 'Total' },
          ]}
          FuncProps={{ pager: false }}
          columnExtensions={[
            { columnName: 'total', type: 'number', currency: true },
          ]}
        />
      </GridItem>
      <GridItem xs={12} />
      <GridItem xs={10} />
      <GridItem xs={2}>Sub Total : $190.00</GridItem>
      <GridItem xs={10} />
      <GridItem xs={2}>GST (7%) : $13.30</GridItem>
      <GridItem xs={10} />
      <GridItem xs={2}>Total : $203.30</GridItem>
    </GridContainer>
  )
}
export default Invoice
