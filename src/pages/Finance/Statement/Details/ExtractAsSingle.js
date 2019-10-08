import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import Yup from '@/utils/yup'

import {
  withFormikExtend,
  FastField,
  GridItem,
  CommonTableGrid,
  CodeSelect,
  dateFormatLong,
} from '@/components'

const styles = (theme) => ({})
@connect(({ statement }) => ({
  statement,
}))
@withFormikExtend({
  mapPropsToValues: ({ selectedRows }) => selectedRows,
  // validationSchema: Yup.object().shape({
  //   code: Yup.string().required(),
  //   displayValue: Yup.string().required(),
  //   effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  // }),
  handleSubmit: (values, { props }) => {
    const invoiceExtractionDetails = values.map((o) => {
      return {
        invoiceId: o.id,
        copayerFK: o.copayerFK,
      }
    })

    const { dispatch, onConfirm, statement } = props
    dispatch({
      type: 'statement/extractAsSingle',
      payload: {
        id: statement.entity.id,
        invoiceExtractionDetails,
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'statement/query',
        })
      }
    })
  },
  displayName: 'statementExtract',
})
class ExtractAsSingle extends PureComponent {
  state = {
    columns: [
      { name: 'patientName', title: 'Patient Name' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'invoiceAmt', title: 'Invoice Amount' },
      { name: 'coPayer', title: 'Co-Payer' },
    ],
    columnExtensions: [
      {
        columnName: 'invoiceDate',
        type: 'date',
        format: { dateFormatLong },
      },
      {
        columnName: 'invoiceAmt',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'coPayer',
        render: (row) => {
          return (
            <GridItem xs={8}>
              <FastField
                name={`[${row.rowIndex}].copayerFK`}
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
    const { theme, footer, selectedRows } = props
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(2) }}>
          <CommonTableGrid
            rows={selectedRows}
            columns={columns}
            columnExtensions={columnExtensions}
            FuncProps={{ pager: false }}
          />
        </div>
        {footer &&
          selectedRows.length > 0 &&
          footer({
            onConfirm: props.handleSubmit,
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
