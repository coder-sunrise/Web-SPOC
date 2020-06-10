import React, { useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'
import {
  GridContainer,
  EditableTableGrid,
  dateFormatLong,
  CommonModal,
} from '@/components'
import Yup from '@/utils/yup'
import DeleteConfirmation from '@/pages/Finance/Invoice/components/modal/DeleteConfirmation'

const purchaseOrderPaymentSchema = Yup.object().shape({
  paymentModeFK: Yup.number().required(),
  paymentDate: Yup.date().required(),
  paymentAmount: Yup.number()
    .min(0)
    .max(Yup.ref('outstandingAmt'), (e) => {
      return `Payment Amount must be less than or equal to ${e.max.toFixed(2)}`
    })
    .required(),
})

let commitCount = 1000 // uniqueNumber
const Grid = ({ dispatch, values, setFieldValue, getTotalPaid }) => {
  const [
    creditCardTypeList,
    setCreditCardTypeList,
  ] = useState([])
  const [
    paymentModeList,
    setPaymentModeList,
  ] = useState([])
  const [
    selection,
    setSelection,
  ] = useState([])

  const [
    showDeleteConfirmation,
    setShowDeleteConfirmation,
  ] = useState(false)

  const [
    allRows,
    setAllRows,
  ] = useState()

  const [
    deletedRow,
    setDeletedRow,
  ] = useState()

  const [
    obj,
    setObj,
  ] = useState({})

  const getCreditCardList = async () => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctCreditCardType',
      },
    }).then((v) => {
      setCreditCardTypeList(v)
    })
  }
  const getPaymentModeList = async () => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctPaymentMode',
      },
    }).then((v) => {
      setPaymentModeList(v)
    })
  }

  useEffect(
    () => {
      if (paymentModeList.length > 0 && creditCardTypeList.length > 0) {
        let tempList = []
        paymentModeList.forEach((o) => {
          if (o.displayValue === 'Credit Card') {
            // TODO: find a better way to do this
            let tempId = 9999 // temp id for payment mode list - credit card type
            creditCardTypeList.forEach((i) => {
              tempList.push({
                value: tempId + o.id,
                name: `${o.displayValue} (${i.name})`,
                typeId: i.id,
                type: i.name,
                creditCardId: o.id,
                creditCardTypeName: i.name,
                paymentModeTypeName: o.displayValue,
              })
              tempId += 1
            })
          } else {
            tempList.push({
              value: o.id,
              name: o.displayValue,
              paymentModeTypeName: o.displayValue,
            })
          }
        })

        setSelection(tempList)
      }
    },
    [
      paymentModeList,
      creditCardTypeList,
    ],
  )

  useEffect(() => {
    getCreditCardList()
    getPaymentModeList()
  }, [])

  useEffect(
    () => {
      dispatch({
        // force current edit row components to update
        type: 'global/updateState',
        payload: {
          commitCount: (commitCount += 1),
        },
      })
    },
    [
      selection,
    ],
  )
  const compareString = (a, b) => a.localeCompare(b)
  const tableParas = {
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
        compare: compareString,
      },
      {
        columnName: 'paymentDate',
        type: 'date',
        restrictFromTo: [
          values.purchaseOrderDetails &&
            values.purchaseOrderDetails.purchaseOrderDate,
          moment().formatUTC(),
        ],
        format: dateFormatLong,
        compare: compareString,
        isDisabled: (row) => row.id > 0,
      },
      {
        columnName: 'paymentModeFK',
        type: 'select',
        options: selection,
        sortingEnabled: false,
        isDisabled: (row) => row.id > 0,
        onChange: (p) => {
          const { option, row } = p
          if (option) {
            row.typeId = option.typeId
            row.creditCardId = option.creditCardId || option.value
            row.paymentModeTypeName = option.paymentModeTypeName
            row.creditCardTypeName = option.creditCardTypeName
          }
        },
      },
      {
        columnName: 'referenceNo',
        compare: compareString,
        isDisabled: (row) => row.id > 0,
      },
      {
        columnName: 'paymentAmount',
        type: 'number',
        currency: true,
        isDisabled: (row) => row.id > 0,
      },
      {
        columnName: 'remark',
        compare: compareString,
        isDisabled: (row) => row.id > 0,
      },
    ],
  }

  const voidPayment = (reason) => {
    deletedRow.isDeleted = true
    deletedRow.cancelReason = reason
    setFieldValue('purchaseOrderPayment', allRows)
    setShowDeleteConfirmation(false)
  }

  const onCommitChanges = ({ rows, deleted }) => {
    if (deleted) {
      const currentRow = rows.find((v) => v.id === deleted[0])
      if (currentRow.paymentNo) {
        setAllRows(rows)
        setDeletedRow(currentRow)
        setObj({ type: 'Payment', itemID: currentRow.paymentNo })
        setShowDeleteConfirmation(true)
      } else {
        currentRow.isDeleted = true
        const setRows = rows.filter(
          (o) => o.id > 0 || (o.isNew && !o.isDeleted),
        )

        setFieldValue('purchaseOrderPayment', setRows)
      }
    } else {
      rows[0].isDeleted = false
      if (rows[0].referenceNo === undefined) {
        rows[0].referenceNo = ''
      }

      if (rows[0].remark === undefined) {
        rows[0].remark = ''
      }

      const newRows = rows.map((o) => {
        if (o.isNew && !o.isDeleted) {
          const outstandingAmt =
            values.invoiceAmount - getTotalPaid() + (o.paymentAmount || 0)
          return {
            ...o,
            outstandingAmt,
            paymentAmount: o.paymentAmount || outstandingAmt,
          }
        }

        return {
          ...o,
        }
      })
      setFieldValue('purchaseOrderPayment', newRows)
      return newRows
    }

    return rows
  }
  const closeDeleteConfirmationModal = () => setShowDeleteConfirmation(false)
  const onAddedRowsChange = (addedRows) => {
    const outstandingAmt = values.invoiceAmount - getTotalPaid()
    return addedRows.map((row) => ({
      paymentDate: moment(),
      outstandingAmt,
      paymentAmount: outstandingAmt,
      ...row,
    }))
  }
  const isFullyPaid = values.invoiceAmount === getTotalPaid()
  return (
    <GridContainer>
      <EditableTableGrid
        rows={values.purchaseOrderPayment}
        schema={purchaseOrderPaymentSchema}
        FuncProps={{
          edit: false,
          pager: false,
        }}
        EditingProps={{
          showAddCommand: !isFullyPaid,
          showEditCommand: false,
          showDeleteCommand: true,
          onCommitChanges,
          onAddedRowsChange,
        }}
        {...tableParas}
      />
      <CommonModal
        open={showDeleteConfirmation}
        title='Void Payment'
        onConfirm={closeDeleteConfirmationModal}
        onClose={closeDeleteConfirmationModal}
        maxWidth='sm'
      >
        <DeleteConfirmation
          handleSubmit={(reason) => voidPayment(reason)}
          {...obj}
        />
      </CommonModal>
    </GridContainer>
  )
}

export default Grid
