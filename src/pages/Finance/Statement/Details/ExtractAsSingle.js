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
  Field,
} from '@/components'

const styles = (theme) => ({})
const medicationSchema = Yup.object().shape({
  coPayer: Yup.number().required(),
})
@connect(({ statement }) => ({
  statement,
}))
@withFormikExtend({
  mapPropsToValues: ({ selectedRows }) => {
    return {
      rows: selectedRows,
    }
  },
  validationSchema: Yup.object().shape({
    rows: Yup.array().of(
      Yup.object().shape({
        copayerFK: Yup.number().required(),
      }),
    ),
  }),
  handleSubmit: (values, { props }) => {
    const { rows } = values
    const invoiceExtractionDetails = rows.map((o) => {
      return {
        invoiceId: o.invoiceFK,
        copayerFK: o.copayerFK,
      }
    })

    const { dispatch, onConfirm, statement, onClose } = props
    dispatch({
      type: 'statement/extractAsSingle',
      payload: {
        id: statement.entity.id,
        statement: statement.entity,
        invoiceExtractionDetails,
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) {
          onConfirm()
        }
        // dispatch({
        //   type: 'statement/query',
        // })
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
        columnName: 'invoiceNo',
        width: 120,
      },
      {
        columnName: 'invoiceDate',
        type: 'date',
        format: { dateFormatLong },
        width: 120,
      },
      {
        columnName: 'invoiceAmt',
        type: 'number',
        currency: true,
        width: 120,
      },
      {
        columnName: 'coPayer',

        render: (row) => {
          return (
            <FastField
              name={`rows[${row.rowIndex}].copayerFK`}
              render={(args) => (
                <CodeSelect
                  code='ctCopayer'
                  labelField='displayValue'
                  {...args}
                />
              )}
            />
          )
        },
      },
    ],
  }

  render () {
    const { props } = this
    const { columns, columnExtensions } = this.state
    const { theme, footer, selectedRows, handleSubmit, values } = props
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(2) }}>
          <CommonTableGrid
            rows={selectedRows || []}
            columns={columns}
            columnExtensions={columnExtensions}
            schema={medicationSchema}
            FuncProps={{ pager: false }}
          />
          <p style={{ margin: theme.spacing(1) }}>
            <i>
              Changing the co-payer will update co-payer in patient invoice.
            </i>
          </p>
        </div>
        {footer &&
          selectedRows.length > 0 &&
          footer({
            onConfirm: handleSubmit,
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
