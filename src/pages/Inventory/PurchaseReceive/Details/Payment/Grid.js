import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { GridContainer, EditableTableGrid, dateFormatLong } from '@/components'
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
let commitCount = 1000 // uniqueNumber
const Grid = ({
  dispatch,
  values,
  isEditable,
  setFieldValue,
  recalculateOutstandingAmount,
}) => {
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
            let tempId = -99
            creditCardTypeList.forEach((i) => {
              tempList.push({
                value: tempId - o.id,
                name: `${o.displayValue} (${i.name})`,
                typeId: i.id,
                type: i.name,
                creditCardId: o.id,
              })
              tempId -= 1
            })
          } else {
            tempList.push({ value: o.id, name: o.displayValue })
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
        format: { dateFormatLong },
        value: moment(),
        disabled: true,
        compare: compareString,
      },
      {
        columnName: 'paymentModeFK',
        type: 'select',
        options: selection,
        sortingEnabled: false,
        onChange: (p) => {
          const { option, row } = p
          if (option) {
            row.typeId = option.typeId
            row.creditCardId = option.creditCardId || option.value
          }
        },
      },
      {
        columnName: 'referenceNo',
        compare: compareString,
      },
      {
        columnName: 'paymentAmount',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'remark',
        compare: compareString,
      },
    ],
  }

  const onCommitChanges = ({ rows, deleted }) => {
    if (deleted) {
      rows.find((v) => v.id === deleted[0]).isDeleted = true
      recalculateOutstandingAmount('delete', deleted[0].paymentAmount)
      setFieldValue('purchaseOrderPayment', rows)
    } else {
      rows[0].isDeleted = false
      if (rows[0].referenceNo === undefined) {
        rows[0].referenceNo = ''
      }

      if (rows[0].remark === undefined) {
        rows[0].remark = ''
      }
      recalculateOutstandingAmount('add', rows[0].paymentAmount)
      setFieldValue('purchaseOrderPayment', rows)
    }

    return rows
  }
  return (
    <GridContainer>
      <EditableTableGrid
        rows={values.purchaseOrderPayment}
        schema={purchaseOrderPaymentSchema(values.outstandingAmt)}
        FuncProps={{
          edit: false,
          pager: false,
        }}
        EditingProps={{
          showAddCommand: values.outstandingAmt > 0,
          showEditCommand: false,
          showDeleteCommand: true,
          onCommitChanges,
          // onAddedRowsChange: this.onAddedRowsChange,
        }}
        {...tableParas}
      />
    </GridContainer>
  )
}

export default Grid
