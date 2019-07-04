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
  DatePicker,
  NumberInput,
} from '@/components'

const Invoice = (props) => {
  const amountProps = {
    style: { margin: 0 },
    noUnderline: true,
    currency: true,
    disabled: true,
    rightAlign: true,
    normalText: true,
  }
  return (
    <div>
      <GridContainer>
        <GridItem xs={6}>
          <TextField label='Invoice No' disabled defaultValue='INV/123456' />
        </GridItem>
        <GridItem xs={6}>
          <DatePicker label='Invoice Date' disabled defaultValue={moment()} />
        </GridItem>
      </GridContainer>

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
      <GridContainer>
        <GridItem xs={2} md={9} />
        <GridItem xs={10} md={3}>
          <NumberInput
            prefix='Sub Total:'
            defaultValue={190}
            {...amountProps}
          />
        </GridItem>
        <GridItem xs={2} md={9} />
        <GridItem xs={10} md={3}>
          <NumberInput
            prefix='GST (7%):'
            defaultValue={13.3}
            {...amountProps}
          />
        </GridItem>
        <GridItem xs={2} md={9} />
        <GridItem xs={10} md={3}>
          <NumberInput prefix='Total:' defaultValue={203.3} {...amountProps} />
        </GridItem>
      </GridContainer>
    </div>
  )
}
export default Invoice
