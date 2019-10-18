import React, { PureComponent } from 'react'
import moment from 'moment'
import {
  GridContainer,
  EditableTableGrid,
  withFormikExtend,
  dateFormatLong,
} from '@/components'
import Yup from '@/utils/yup'

const purchaseOrderPaymentSchema = (outstandingAmount) =>
  Yup.object().shape({
    // paymentNo: Yup.string().required(),
    // paymentDate: Yup.string().required(),
    paymentModeFK: Yup.string().required(),
    // reference: Yup.string().required(),
    paymentAmount: Yup.number().min(0).max(outstandingAmount).required(),
    // Remarks: Yup.string().required(),
  })

class Grid extends PureComponent {
  state = {
    outstandingAmount: 0,
  }

  tableParas = {
    columns: [
      { name: 'paymentNo', title: 'Payment No.' },
      { name: 'paymentDate', title: 'Date' },
      { name: 'paymentModeFK', title: 'Payment Mode' },
      { name: 'referenceNo', title: 'Reference' },
      { name: 'paymentAmount', title: 'Payment Amount' },
      { name: 'remark', title: 'Remarks' },
    ],
    columnExtensions: [
      {
        columnName: 'paymentNo',
        disabled: true,
      },
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
        labelField: 'displayValue',
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
      rows.find((v) => v.id === deleted[0]).isDeleted = true
      this.setState((prevState) => {
        return {
          outstandingAmount:
            prevState.outstandingAmount - deleted[0].paymentAmount,
        }
      })
      setFieldValue('purchaseOrderPayment', rows)
    } else {
      rows[0].isDeleted = false
      this.setState((prevState) => {
        return {
          outstandingAmount:
            prevState.outstandingAmount - rows[0].paymentAmount,
        }
      })
      setFieldValue('purchaseOrderPayment', rows)
    }

    return rows
  }

  componentDidMount = () => {
    const { outstandingAmount } = this.props.values.purchaseOrderDetails
    this.setState({ outstandingAmount })
  }

  render () {
    const { values, isEditable } = this.props

    return (
      <GridContainer>
        <EditableTableGrid
          rows={values.purchaseOrderPayment}
          schema={purchaseOrderPaymentSchema(this.state.outstandingAmount)}
          FuncProps={{
            edit: false,
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
