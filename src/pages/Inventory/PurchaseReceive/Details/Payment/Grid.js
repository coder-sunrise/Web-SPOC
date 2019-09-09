import React, { PureComponent } from 'react'
import {
  GridContainer,
  EditableTableGrid,
  withFormikExtend,
} from '@/components'
import moment from 'moment'

@withFormikExtend({
  mapPropsToValues: ({ purchaseReceivePayment }) =>
    purchaseReceivePayment.entity || purchaseReceivePayment.default,
  displayName: 'purchaseReceivePayment',
})
class Grid extends PureComponent {
  tableParas = {
    columns: [
      { name: 'paymentNo', title: 'Payment No.' },
      { name: 'paymentDate', title: 'Date' },
      { name: 'paymentMode', title: 'Payment Mode' },
      { name: 'reference', title: 'Reference' },
      { name: 'paymentAmount', title: 'Payment Amount' },
      { name: 'Remarks', title: 'Remarks' },
    ],
    columnExtensions: [
      {
        columnName: 'paymentDate',
        type: 'date',
        format: 'DD MMM YYYY',
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
    const isEditable = true
    const { values } = this.props
    //console.log('Payment Grid', this.props)

    return (
      <GridContainer>
        <EditableTableGrid
          rows={values.payment_list}
          //schema={receivingDetailsSchema}
          FuncProps={{
            edit: isEditable,
            pager: false,
          }}
          EditingProps={{
            showAddCommand: isEditable,
            showEditCommand: false,
            showDeleteCommand: isEditable,
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
