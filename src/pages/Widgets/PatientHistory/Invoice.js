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
import { VISIT_TYPE } from '@/utils/constants'

const baseColumns = [
  { name: 'itemType', title: 'Type' },
  { name: 'itemName', title: 'Name' },
  { name: 'quantity', title: 'Quantity' },
  { name: 'adjAmt', title: 'Adj' },
  { name: 'totalAfterItemAdjustment', title: 'Total' },
]

export default ({ classes, current, theme, setFieldValue }) => {
  const amountProps = {
    text: true,
    currency: true,
    rightAlign: true,
  }

  let invoiceItemData = []
  let invoiceAdjustmentData = []
  let columns = baseColumns
  if (current.invoice) {
    const {
      invoiceItem = [],
      invoiceAdjustment = [],
      visitPurposeFK = VISIT_TYPE.CONS,
    } = current.invoice
    invoiceItemData = invoiceItem
    invoiceAdjustmentData = invoiceAdjustment

    if (visitPurposeFK === VISIT_TYPE.BILL_FIRST) {
      columns = [
        { name: 'itemType', title: 'Type' },
        { name: 'itemName', title: 'Name' },
        {
          name: 'description',
          title: 'Description',
        },
        { name: 'quantity', title: 'Quantity' },
        { name: 'adjAmt', title: 'Adj' },
        { name: 'totalAfterItemAdjustment', title: 'Total' },
      ]
    }
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
        columns={columns}
        FuncProps={{ pager: false }}
        columnExtensions={[
          { columnName: 'itemType', width: 150 },
          { columnName: 'description', width: 'auto' },
          { columnName: 'quantity', width: 90 },
          { columnName: 'adjAmt', type: 'number', currency: true, width: 120 },
          {
            columnName: 'totalAfterItemAdjustment',
            type: 'number',
            currency: true,
            width: 120,
          },
        ]}
      />
      <GridContainer
        // direction='column'
        // justify='center'
        // alignItems='flex-end'
        style={{ paddingTop: theme.spacing(2) }}
      >
        <GridItem xs={2} md={9} />
        <GridItem xs={10} md={3}>
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
              gstValue: current.invoice ? current.invoice.gstValue : undefined,
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
