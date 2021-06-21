import React, { useState } from 'react'
import numeral from 'numeral'
import {
  CommonTableGrid,
  dateFormatLong,
  RadioGroup,
} from '@/components'
import withWebSocket from '@/components/Decorator/withWebSocket'
import { getRawData, getReportContext } from '@/services/report'

const BatchPrintStatement = ({
  rows = [],
  mainDivHeight,
  footer,
  onConfirm,
  handlePrint,
}) => {
  const [
    selectedRows,
    setSelectedRows,
  ] = useState([])

  const [
    reportGroupBy,
    setReportGroupBy,
  ] = useState('AsInvoice')

  let height = mainDivHeight - 200
  if (height < 300) height = 300

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection)
  }

  const printStatement = async () => {
    const data = await getRawData(25, {
      StatementId: selectedRows.join('|'),
      GroupBy: reportGroupBy,
    })
    const payload = [
      {
        ReportId: 25,
        ReportData: JSON.stringify({
          ...data,
          ReportContext: data.ReportContext.map((o) => {
            const {
              customLetterHeadHeight = 0,
              isDisplayCustomLetterHead = false,
              standardHeaderInfoHeight = 0,
              isDisplayStandardHeader = false,
              footerInfoHeight = 0,
              isDisplayFooterInfo = false,
              footerDisclaimerHeight = 0,
              isDisplayFooterInfoDisclaimer = false,
              ...restProps
            } = o
            return {
              customLetterHeadHeight,
              isDisplayCustomLetterHead,
              standardHeaderInfoHeight,
              isDisplayStandardHeader,
              footerInfoHeight,
              isDisplayFooterInfo,
              footerDisclaimerHeight,
              isDisplayFooterInfoDisclaimer,
              ...restProps,
            }
          }),
          PaymentDetails: data.PaymentDetails.map((p) => {
            return {
              ...p,
              paymentRefNo: p.paymentRefNo || '',
              paymentRemarks: p.paymentRemarks || '',
            }
          }),
        }),
      },
    ]
    handlePrint(JSON.stringify(payload))
    onConfirm()
  }

  return (
    <di>
      <div style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
        <div
          style={{ display: 'inline-Block', fontWeight: 500, marginRight: 10 }}
        >
          Group By:
        </div>
        <RadioGroup
          style={{ display: 'inline-Block' }}
          label='Group By'
          simple
          defaultValue={reportGroupBy}
          options={[
            {
              value: 'AsInvoice',
              label: 'As Invoice',
            },
            {
              value: 'Patient',
              label: 'By Patient',
            },
            {
              value: 'Doctor',
              label: 'By Doctor',
            },
            {
              value: 'Item',
              label: 'By Item',
            },
          ]}
          onChange={(v) => {
            setReportGroupBy(v.target.value)
          }}
        />
      </div>
      <CommonTableGrid
        style={{ marginLeft: 10, marginRight: 10 }}
        forceRender
        rows={rows}
        columns={[
          { name: 'statementNo', title: 'Statement No.' },
          { name: 'statementDate', title: 'Statement Date' },
          { name: 'company', title: 'Company' },
          { name: 'payableAmount', title: 'Payable Amount' },
          { name: 'totalPaid', title: 'Paid' },
          { name: 'outstandingAmount', title: 'Outstanding' },
          { name: 'dueDate', title: 'Due Date' },
          { name: 'remark', title: 'Remarks' },
        ]}
        columnExtensions={[
          {
            columnName: 'statementNo',
            width: 110,
            sortingEnabled: false,
          },
          {
            columnName: 'company',
            sortingEnabled: false,
          },
          {
            columnName: 'payableAmount',
            type: 'number',
            currency: true,
            sortingEnabled: false,
            width: 120,
          },
          {
            columnName: 'totalPaid',
            type: 'number',
            currency: true,
            sortingEnabled: false,
            width: 120,
          },
          {
            columnName: 'outstandingAmount',
            type: 'number',
            currency: true,
            width: 120,
            sortingEnabled: false,
          },
          {
            columnName: 'statementDate',
            type: 'date',
            format: dateFormatLong,
            sortingEnabled: false,
            width: 110,
          },
          {
            columnName: 'dueDate',
            type: 'date',
            format: dateFormatLong,
            sortBy: 'DueDate',
            width: 100,
            sortingEnabled: false,
          },
          {
            columnName: 'remark',
            sortingEnabled: false,
          },
        ]}
        TableProps={{
          height,
        }}
        FuncProps={{
          pager: false,
          selectable: true,
          selectConfig: {
            showSelectAll: true,
            rowSelectionEnabled: (row) => true,
          },
        }}
        selection={selectedRows}
        onSelectionChange={handleSelectionChange}
        getRowId={(row) => row.id}
      />
      {footer &&
        footer({
          onConfirm: printStatement,
          confirmBtnText: 'Print',
          confirmProps: {
            disabled: !selectedRows.length,
          },
        })}
    </di>
  )
}

export default withWebSocket()(BatchPrintStatement)
