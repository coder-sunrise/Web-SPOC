import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import Yup from '@/utils/yup'

import {
  withFormikExtend,
  FastField,
  GridItem,
  EditableTableGrid,
  CodeSelect,
  dateFormatLong,
  Field,
  notification,
} from '@/components'

const styles = (theme) => ({})
const medicationSchema = Yup.object().shape({
  copayerFK: Yup.number().required(),
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
        notification.success({ message: 'Extracted success' })
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
      { name: 'copayerFK', title: 'Co-Payer' },
    ],
    columnExtensions: [
      {
        columnName: 'patientName',
        disabled: true,
      },
      {
        columnName: 'invoiceNo',
        width: 120,
        disabled: true,
      },
      {
        columnName: 'invoiceDate',
        type: 'date',
        format: dateFormatLong,
        width: 120,
        disabled: true,
      },
      {
        columnName: 'invoiceAmt',
        type: 'number',
        currency: true,
        width: 120,
        disabled: true,
      },
      {
        columnName: 'copayerFK',
        type: 'codeSelect',
        code: 'ctcopayer',
        valueField: 'id',
        labelField: 'displayValue',
        remoteFilter: { coPayerTypeFK: 1 },
      },
    ],
  }

  handleCommitChanges = ({ rows }) => {
    const { setFieldValue } = this.props
    setFieldValue('rows', rows)
  }

  render () {
    const { props } = this
    const { columns, columnExtensions } = this.state
    const { theme, footer, handleSubmit, values } = props
    const { rows } = values
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(2) }}>
          <EditableTableGrid
            rows={rows || []}
            columns={columns}
            columnExtensions={columnExtensions}
            schema={medicationSchema}
            FuncProps={{ pager: false }}
            EditingProps={{ onCommitChanges: this.handleCommitChanges }}
          />
          <p style={{ margin: theme.spacing(1) }}>
            <i>
              Changing the co-payer will update co-payer in patient invoice.
            </i>
          </p>
        </div>
        {footer &&
          rows.length > 0 &&
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
