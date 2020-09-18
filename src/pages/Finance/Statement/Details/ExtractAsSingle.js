import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Field } from 'formik'
import { withStyles } from '@material-ui/core'
import Yup from '@/utils/yup'

import {
  withFormikExtend,
  EditableTableGrid,
  dateFormatLong,
  notification,
  Checkbox,
  Select,
} from '@/components'

const styles = theme => ({})
const statementSchema = Yup.object().shape({
  copayerFK: Yup.number().required(),
  isTransferToExistingStatement: Yup.boolean(),
  existingStatementFK: Yup.number().when('isTransferToExistingStatement', {
    is: val => val,
    then: Yup.number().required(),
    otherwise: Yup.number(),
  }),
})
@connect(({ statement }) => ({
  statement,
}))
@withFormikExtend({
  mapPropsToValues: ({ selectedRows }) => {
    let newRowData = selectedRows.map(t => {
      return {
        recentStatementNoList: [],
        ...t,
        isTransferToExistingStatement: false,
      }
    })
    return {
      rows: newRowData,
    }
  },

  handleSubmit: (values, { props }) => {
    const { rows } = values
    const invoiceExtractionDetails = rows.map(o => {
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
    }).then(r => {
      if (r) {
        if (onConfirm) {
          onConfirm()
        }
        notification.success({ message: 'Extracted success' })
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
      { name: 'isTransferToExistingStatement', title: ' ' },
      { name: 'existingStatementFK', title: 'Statement No.' },
    ],
    columnExtensions: [
      {
        columnName: 'patientName',
        disabled: true,
      },
      {
        columnName: 'isTransferToExistingStatement',
        width: 0,
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
        onChange: ({ option, row }) => {
          const { statement, setFieldValue, values } = this.props
          const { statementNoList } = statement
          const { rows } = values
          if (statementNoList) {
            const correspStatementNo = statementNoList.filter(
              s => s.copayerFK === row.copayerFK,
            )
            setFieldValue(
              'rows',
              rows.map(o => ({
                ...o,
                existingStatementFK: null,
                recentStatementNoList: correspStatementNo,
              })),
            )
          }
        },
      },
      {
        columnName: 'existingStatementFK',
        type: 'select',
        labelField: 'statementNo',
        valueField: 'id',
        sortingEnabled: false,
        options: row => {
          return row.recentStatementNoList ?? []
        },
      },
    ],
  }

  handleCommitChanges = ({ rows }) => {
    const { setFieldValue } = this.props
    setFieldValue('rows', rows)
  }

  render () {
    const { props } = this
    const {
      columns,
      columnExtensions,
      transferToExistingStatement,
    } = this.state
    const {
      theme,
      footer,
      dispatch,
      statement,
      handleSubmit,
      setFieldValue,
      values,
    } = props
    const { rows } = values
    console.log(values)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(2) }}>
          <p
            style={{ margin: theme.spacing(1), marginLeft: 0, marginRight: 0 }}
          >
            <Checkbox
              name='isTransferToExistingStatement'
              simple
              onChange={e => {
                if (!statement.statementNoList) {
                  dispatch({
                    type: 'statement/queryRecentStatementNo',
                    payload: {
                      count: 5,
                    },
                  })
                }
                setFieldValue(
                  'rows',
                  rows.map(o => ({
                    ...o,
                    existingStatementFK: e.target.value ? o.existingStatementFK : null,
                    recentStatementNoList: e.target.value ? o.recentStatementNoList : [],
                    isTransferToExistingStatement: e.target.value,
                  })),
                )
                this.setState({
                  transferToExistingStatement: e.target.value,
                })
              }}
              label='Transfer invoice(s) to an existing statement'
            />
          </p>
          <EditableTableGrid
            rows={rows || []}
            columns={columns}
            forceRender
            columnExtensions={columnExtensions}
            schema={statementSchema}
            FuncProps={{ pager: false }}
            EditingProps={{ onCommitChanges: this.handleCommitChanges }}
          />
          <p
            style={{ margin: theme.spacing(1), marginLeft: 0, marginRight: 0 }}
          >
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
