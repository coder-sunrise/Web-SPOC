import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
  GridContainer,
  EditableTableGrid,
  dateFormatLong,
  CommonModal,
  Tooltip,
  NumberInput,
} from '@/components'
import { roundTo } from '@/utils/utils'
import Yup from '@/utils/yup'
import DeleteConfirmation from '@/pages/Finance/Invoice/components/modal/DeleteConfirmation'

const receivingGoodsPaymentSchema = Yup.object().shape({
  paymentModeFK: Yup.number().required(),
  paymentDate: Yup.date().required(),
  paymentAmount: Yup.number()
    .min(0)
    .max(Yup.ref('outstandingAmt'), e => {
      return `Payment Amount must be less than or equal to ${e.max.toFixed(2)}`
    })
    .required(),
})

let commitCount = 1000
const Grid = ({
  dispatch,
  values,
  setFieldValue,
  getTotalPaid,
  receivingGoodsDetails: {
    receivingGoods: { totalAftGST },
  },
  height,
}) => {
  const [creditCardTypeList, setCreditCardTypeList] = useState([])
  const [paymentModeList, setPaymentModeList] = useState([])
  const [selection, setSelection] = useState([])

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const [allRows, setAllRows] = useState()

  const [deletedRow, setDeletedRow] = useState()

  const [obj, setObj] = useState({})

  const getCreditCardList = async () => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctCreditCardType',
      },
    }).then(v => {
      setCreditCardTypeList(v)
    })
  }
  const getPaymentModeList = async () => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctPaymentMode',
      },
    }).then(v => {
      setPaymentModeList(v)
    })
  }

  useEffect(() => {
    if (paymentModeList.length > 0 && creditCardTypeList.length > 0) {
      let tempList = []
      paymentModeList.forEach(o => {
        if (o.displayValue === 'Credit Card') {
          let tempId = 9999
          creditCardTypeList.forEach(i => {
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
  }, [paymentModeList, creditCardTypeList])

  useEffect(() => {
    getCreditCardList()
    getPaymentModeList()
  }, [])

  useEffect(() => {
    dispatch({
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }, [selection])
  const compareString = (a = '', b = '') => a.localeCompare(b)
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
        width: 120,
        render: row => {
          const { isCancelled = false, cancelReason } = row
          if (isCancelled)
            return (
              <Tooltip title={`Void Reason: ${cancelReason}`}>
                <span style={{ textDecorationLine: 'line-through' }}>
                  {row.paymentNo}
                </span>
              </Tooltip>
            )
          return <span>{row.paymentNo}</span>
        },
      },
      {
        columnName: 'paymentDate',
        type: 'date',
        width: 140,
        restrictFromTo: [
          values.receivingGoodsDetails &&
            values.receivingGoodsDetails.receivingGoodsDate,
          moment().formatUTC(),
        ],
        format: dateFormatLong,
        isDisabled: row => row.id > 0,
        render: row => {
          const { isCancelled = false } = row

          if (isCancelled)
            return (
              <span style={{ textDecorationLine: 'line-through' }}>
                {moment(row.paymentDate).format('DD MMM YYYY')}
              </span>
            )

          return <span>{moment(row.paymentDate).format('DD MMM YYYY')}</span>
        },
      },
      {
        columnName: 'paymentModeFK',
        type: 'select',
        width: 200,
        options: selection,
        sortingEnabled: false,
        isDisabled: row => row.id > 0,
        onChange: p => {
          const { option, row } = p
          if (option) {
            row.typeId = option.typeId
            row.creditCardId = option.creditCardId || option.value
            row.paymentModeTypeName = option.paymentModeTypeName
            row.creditCardTypeName = option.creditCardTypeName
          }
        },
        render: row => {
          const { isCancelled = false } = row

          const selectMode = selection.find(x => x.value === row.paymentModeFK)
          if (isCancelled)
            return (
              <span style={{ textDecorationLine: 'line-through' }}>
                {selectMode ? selectMode.name : ''}
              </span>
            )

          return <span>{selectMode ? selectMode.name : ''}</span>
        },
      },
      {
        columnName: 'referenceNo',
        compare: compareString,
        width: 180,
        isDisabled: row => row.id > 0,
        render: row => {
          const { isCancelled = false } = row

          if (isCancelled)
            return (
              <span style={{ textDecorationLine: 'line-through' }}>
                {row.referenceNo}
              </span>
            )

          return <span> {row.referenceNo}</span>
        },
      },
      {
        columnName: 'paymentAmount',
        isDisabled: row => row.id > 0,
        align: 'right',
        width: 140,
        render: row => {
          const { isCancelled = false } = row
          return (
            <NumberInput
              currency
              text
              value={row.paymentAmount}
              style={{ textDecorationLine: isCancelled ? 'line-through' : '' }}
            />
          )
        },
      },
      {
        columnName: 'remark',
        compare: compareString,
        isDisabled: row => row.id > 0,
        render: row => {
          const { isCancelled = false } = row

          if (isCancelled)
            return (
              <span style={{ textDecorationLine: 'line-through' }}>
                {row.remark}
              </span>
            )

          return <span> {row.remark}</span>
        },
      },
    ],
  }

  const voidPayment = reason => {
    deletedRow.isDeleted = false
    deletedRow.isCancelled = true
    deletedRow.isUpdate = true
    deletedRow.cancelReason = reason
    setFieldValue('receivingGoodsPayment', allRows)
    setShowDeleteConfirmation(false)
  }

  const onCommitChanges = ({ rows, deleted }) => {
    if (deleted) {
      const currentRow = rows.find(v => v.id === deleted[0])
      if (currentRow.paymentNo) {
        setAllRows(rows)
        setDeletedRow(currentRow)
        setObj({ type: 'Payment', itemID: currentRow.paymentNo })
        setShowDeleteConfirmation(true)
      } else {
        currentRow.isDeleted = true
        const setRows = rows.filter(o => o.id > 0 || (o.isNew && !o.isDeleted))
        setFieldValue('receivingGoodsPayment', setRows)
      }
    } else {
      const newRows = rows.map(o => {
        if (o.isNew && !o.isDeleted) {
          const outstandingAmt =
            totalAftGST - getTotalPaid() + (o.paymentAmount || 0)
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
      setFieldValue('receivingGoodsPayment', newRows)
      return newRows
    }

    return rows
  }
  const closeDeleteConfirmationModal = () => setShowDeleteConfirmation(false)
  const onAddedRowsChange = addedRows => {
    const outstandingAmt = totalAftGST - getTotalPaid()
    return addedRows.map(row => ({
      paymentDate: moment(),
      outstandingAmt: roundTo(outstandingAmt),
      paymentAmount: roundTo(outstandingAmt),
      isCancelled: false,
      ...row,
    }))
  }
  const isFullyPaid = totalAftGST === getTotalPaid()
  return (
    <GridContainer>
      <EditableTableGrid
        rows={values.receivingGoodsPayment}
        schema={receivingGoodsPaymentSchema}
        FuncProps={{
          edit: false,
          pager: false,
        }}
        forceRender
        EditingProps={{
          showAddCommand: !isFullyPaid,
          showEditCommand: false,
          showDeleteCommand: true,
          onCommitChanges,
          onAddedRowsChange,
          isDeletable: row => !row.isCancelled,
        }}
        {...tableParas}
        TableProps={{
          height,
        }}
      />
      <CommonModal
        open={showDeleteConfirmation}
        title='Void Payment'
        onConfirm={closeDeleteConfirmationModal}
        onClose={closeDeleteConfirmationModal}
        maxWidth='sm'
      >
        <DeleteConfirmation
          handleSubmit={reason => voidPayment(reason)}
          {...obj}
        />
      </CommonModal>
    </GridContainer>
  )
}

export default Grid
