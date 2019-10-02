import React, { PureComponent } from 'react'
import {
  GridContainer,
  EditableTableGrid,
  withFormikExtend,
  dateFormatLong,
} from '@/components'
import Yup from '@/utils/yup'
import moment from 'moment'

const purchaseOrderPaymentSchema = Yup.object().shape({
  paymentNo: Yup.string().required(),
  // paymentDate: Yup.string().required(),
  paymentModeFK: Yup.string().required(),
  // reference: Yup.string().required(),
  paymentAmount: Yup.number().min(0).required(),
  // Remarks: Yup.string().required(),
})

class Grid extends PureComponent {
  tableParas = {
    columns: [
      { name: 'paymentNo', title: 'Payment No.' },
      { name: 'paymentDate', title: 'Date' },
      { name: 'paymentModeFK', title: 'Payment Mode' },
      { name: 'referenceNo', title: 'Reference' },
      { name: 'paymentAmount', title: 'Payment Amount' },
      { name: 'remarks', title: 'Remarks' },
    ],
    columnExtensions: [
      {
        columnName: 'paymentDate',
        type: 'date',
        format: { dateFormatLong },
        value: moment(),
        disabled: true,
      },
      {
        columnName: 'paymentModeFK',
        type: 'codeSelect',
        code: 'CTPaymentMode',
      },
      {
        columnName: 'paymentAmount',
        type: 'number',
        currency: true,
      },
    ],
  }

  onCommitChanges = ({ rows, deleted }) => {
    const { setFieldValue } = this.props
    if (deleted) {
      console.log('onCommitChangesDelete', { deleted, rows })
    } else {
      console.log('onCommitChangesAdd', rows)
    }

    setFieldValue('purchaseOrderPayment', rows)
    return rows
  }

  render () {
    const { values, isEditable } = this.props

    return (
      <GridContainer>
        <EditableTableGrid
          rows={values.purchaseOrderPayment}
          schema={purchaseOrderPaymentSchema}
          FuncProps={{
            edit: isEditable,
            pager: false,
          }}
          EditingProps={{
            showAddCommand: isEditable,
            showEditCommand: false,
            showDeleteCommand: true,
            onCommitChanges: this.onCommitChanges,
            // onAddedRowsChange: this.onAddedRowsChange,
          }}
          {...this.tableParas}
        />
      </GridContainer>
    )
  }
}

export default Grid
