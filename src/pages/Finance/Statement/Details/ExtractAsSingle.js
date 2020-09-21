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
  transferToStatementFK: Yup.number().when('isTransferToExistingStatement', {
    is: val => val,
    then: Yup.number().required(),
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
    transferToExistingStatement: false,
    columns: [
      { name: 'patientName', title: 'Patient Name' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'invoiceAmt', title: 'Invoice Amount' },
      { name: 'copayerFK', title: 'Co-Payer' },
      { name: 'isTransferToExistingStatement', title: ' ' },
      { name: 'transferToStatementFK', title: 'Statement No.' },
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
          let recentStatementNoList = []
          if (this.state.transferToExistingStatement) {
            recentStatementNoList = statementNoList.filter(
              s => s.copayerFK === row.copayerFK,
            )
          } 
          setFieldValue(
            'rows',
            rows.map(o => ({
              ...o,
              _errors: undefined,
              transferToStatementFK: o.id === row.id ? undefined : o.transferToStatementFK,
              recentStatementNoList: o.id === row.id ? recentStatementNoList : o.recentStatementNoList,
            })),
          )
        },
      },
      {
        columnName: 'transferToStatementFK',
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
                this.setState({
                  transferToExistingStatement: e.target.value,
                })
                if (!statement.statementNoList) { 
                  statement.statementNoList = JSON.parse(
                    '[{"statementNo":"SM-000069","copayerFK":4,"id":69,"isDeleted":false,"concurrencyToken":28263},{"statementNo":"SM-000058","copayerFK":4,"id":58,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000057","copayerFK":4,"id":57,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000031","copayerFK":4,"id":31,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000029","copayerFK":4,"id":29,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000068","copayerFK":3,"id":68,"isDeleted":false,"concurrencyToken":28237},{"statementNo":"SM-000064","copayerFK":3,"id":64,"isDeleted":false,"concurrencyToken":26561},{"statementNo":"SM-000055","copayerFK":3,"id":55,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000027","copayerFK":3,"id":27,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000023","copayerFK":3,"id":23,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000067","copayerFK":7,"id":67,"isDeleted":false,"concurrencyToken":26690},{"statementNo":"SM-000063","copayerFK":7,"id":63,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000060","copayerFK":7,"id":60,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000056","copayerFK":7,"id":56,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000052","copayerFK":7,"id":52,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000066","copayerFK":2,"id":66,"isDeleted":false,"concurrencyToken":27556},{"statementNo":"SM-000054","copayerFK":2,"id":54,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000053","copayerFK":2,"id":53,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000047","copayerFK":2,"id":47,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000045","copayerFK":2,"id":45,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000065","copayerFK":5,"id":65,"isDeleted":false,"concurrencyToken":27595},{"statementNo":"SM-000061","copayerFK":5,"id":61,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000051","copayerFK":5,"id":51,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000049","copayerFK":5,"id":49,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000042","copayerFK":5,"id":42,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000044","copayerFK":6,"id":44,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000043","copayerFK":6,"id":43,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000015","copayerFK":6,"id":15,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000014","copayerFK":6,"id":14,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000007","copayerFK":6,"id":7,"isDeleted":false,"concurrencyToken":7747},{"statementNo":"SM-000016","copayerFK":1,"id":16,"isDeleted":false,"concurrencyToken":7747}]',
                  )
                  // dispatch({
                  //   type: 'statement/queryRecentStatementNo',
                  //   payload: {
                  //     count: 5,
                  //   },
                  // })
                }
                setFieldValue(
                  'rows',
                  rows.map(o => ({
                    ...o,
                    _errors: undefined,
                    transferToStatementFK: e.target.value ? o.transferToStatementFK : undefined,
                    recentStatementNoList: e.target.value ? (statement.statementNoList.filter(
                      s => s.copayerFK === o.copayerFK,
                    )) : [],
                    isTransferToExistingStatement: e.target.value,
                  })),
                )
                console.log(rows)
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
