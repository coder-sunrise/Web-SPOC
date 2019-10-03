import React, { PureComponent } from 'react'
import _ from 'lodash'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core'
import Yup from '@/utils/yup'

import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  CommonTableGrid,
  CodeSelect,
  dateFormatLong,
} from '@/components'

const styles = (theme) => ({})

class ExtractAsSingle extends PureComponent {
  state = {
    columns: [
      { name: 'patientName', title: 'Patient Name' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'invoiceAmount', title: 'Invoice Amount' },
      { name: 'coPayer', title: 'Co-Payer' },
    ],
    columnExtensions: [
      {
        columnName: 'invoiceDate',
        type: 'date',
        format: { dateFormatLong },
      },
      {
        columnName: 'invoiceAmount',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'coPayer',
        render: (row) => {
          return (
            <GridItem xs={8}>
              <FastField
                name={`packageValueDto[${row.rowIndex}].itemValue`}
                render={(args) => <CodeSelect code='ctCopayer' {...args} />}
              />
            </GridItem>
          )
        },
      },
    ],
  }

  render () {
    const { props } = this
    const { columns, columnExtensions } = this.state
    const { classes, theme, footer, values, selectedRows } = props
    console.log('detail', selectedRows)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <CommonTableGrid
            rows={selectedRows}
            columns={columns}
            columnExtensions={columnExtensions}
            FuncProps={{ pager: false }}
          />
        </div>
        {footer &&
          footer({
            onConfirm: () => {
              if (props.onConfirm) props.onConfirm()
            },
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ExtractAsSingle)
