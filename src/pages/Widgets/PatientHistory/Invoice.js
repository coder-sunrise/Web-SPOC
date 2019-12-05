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
  CommonTableGrid,
  DatePicker,
  NumberInput,
} from '@/components'

import AmountSummary from '@/pages/Shared/AmountSummary'

export default ({ classes, current, theme, setFieldValue }) => {
  const amountProps = {
    text: true,
    currency: true,
    rightAlign: true,
  }

  let invoiceItemData = []
  let invoiceAdjustmentData = []

  if (current.invoice) {
    const { invoiceItem = [], invoiceAdjustment = [] } = current.invoice
    invoiceItemData = invoiceItem
    invoiceAdjustmentData = invoiceAdjustment
  }

  return (
    <div>
      {current.invoice ? (
        <GridContainer>
          <GridItem xs={12}>
            <TextField
              prefix='Invoice No: '
              text
              value={current.invoice.invoiceNo}
              noUnderline
            />
          </GridItem>
          <GridItem xs={12}>
            <DatePicker
              prefix='Invoice Date: '
              text
              value={current.invoice.invoiceDate}
              noUnderline
            />
          </GridItem>
        </GridContainer>
      ) : (
        ''
      )}

      <CommonTableGrid
        size='sm'
        rows={current.invoice ? current.invoice.invoiceItem : []}
        columns={[
          { name: 'itemType', title: 'Type' },
          { name: 'itemName', title: 'Name' },
          { name: 'quantity', title: 'Quantity' },
          { name: 'adjAmt', title: 'Adj' },
          { name: 'totalAfterItemAdjustment', title: 'Total' },
        ]}
        FuncProps={{ pager: false }}
        columnExtensions={[
          { columnName: 'adjAmt', type: 'number', currency: true },
          {
            columnName: 'totalAfterItemAdjustment',
            type: 'number',
            currency: true,
          },
        ]}
      />
      <GridContainer
        // direction='column'
        // justify='center'
        // alignItems='flex-end'
        style={{ paddingTop: theme.spacing(2) }}
      >
        <GridItem xs={4} md={7} />
        <GridItem xs={8} md={5}>
          <AmountSummary
            showAdjustment
            rows={invoiceItemData}
            adjustments={invoiceAdjustmentData}
            config={{
              isGSTInclusive: current.invoice
                ? current.invoice.isGSTInclusive
                : '',
              totalField: 'totalAfterItemAdjustment',
              adjustedField: 'totalAfterOverallAdjustment',
              gstValue: current.invoice.gstValue,
            }}
            onValueChanged={(v) => {
              // console.log('onValueChanged', v)
              if (setFieldValue) {
                setFieldValue(
                  'current.invoice.invoiceTotalAftGST',
                  v.summary.totalWithGST,
                )
                setFieldValue(
                  'current.invoice.invoiceAdjustment',
                  v.adjustments,
                )
              }
            }}
          />
        </GridItem>
      </GridContainer>
    </div>
  )
}
