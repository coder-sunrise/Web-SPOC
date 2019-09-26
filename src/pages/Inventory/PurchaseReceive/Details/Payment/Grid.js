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
  paymentDate: Yup.string().required(),
  paymentMode: Yup.string().required(),
  //reference: Yup.string().required(),
  paymentAmount: Yup.number().min(0).required(),
  //Remarks: Yup.string().required(),
})

@withFormikExtend({
  mapPropsToValues: ({ purchaseOrderPayment }) =>
    purchaseOrderPayment.entity || purchaseOrderPayment.default,
  displayName: 'purchaseOrderPayment',
})
class Grid extends PureComponent {
  tableParas = {
    columns: [
      { name: 'paymentNo', title: 'Payment No.' },
      { name: 'paymentDate', title: 'Date' },
      { name: 'paymentMode', title: 'Payment Mode' },
      { name: 'reference', title: 'Reference' },
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
        columnName: 'paymentMode',
        type: 'codeSelect',
        code: 'CTCreditCardType',
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
    setFieldValue('payment_list', rows)
  }

  render () {
    const { values, isEditable } = this.props
    //console.log('Payment Grid', this.props)

    return (
      <GridContainer>
        <EditableTableGrid
          rows={values.payment_list}
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
            //onAddedRowsChange: this.onAddedRowsChange,
          }}
          {...this.tableParas}
        />
      </GridContainer>
    )
  }
}

export default Grid
