import React, { PureComponent } from 'react'
import withWebSocket from '@/components/Decorator/withWebSocket'
import * as Yup from 'yup'
import _ from 'lodash'
import { getRawData } from '@/services/report'
import { connect } from 'dva'
import { REPORT_ID } from '@/utils/constants'
// common components
import { withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  NumberInput,
  Checkbox,
  EditableTableGrid,
  CheckboxGroup,
  CommonTableGrid,
} from '@/components'
import { Alert } from 'antd'

@connect(({ clinicSettings }) => ({
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
class DrugLeafletSelection extends PureComponent {
  state = {
    data: [],
    selectedRows: [],
    printlanguage: ['EN'],
  }

  columns = [
    {
      name: 'displayName',
      title: 'Item',
    },
  ]
  colExtensions = [
    {
      columnName: 'displayName',
      render: row => {
        console.log(row)
        return <div>{row.displayName}</div>
      },
    },
  ]

  tableConfig = {
    FuncProps: {
      pager: false,
      selectable: true,
      selectConfig: {
        showSelectAll: true,
        selectByRowClick: false,
        rowSelectionEnabled: () => true,
      },
    },
  }
  componentWillMount = () => {
    let { visitid, dispatch } = this.props
    this.setState({ printlanguage: ['EN'] })
  }
  constructor(props) {
    super(props)
  }

  handleSelectionChange = rows => {
    this.setState(() => ({
      selectedRows: rows,
    }))
  }

  handleCommitChanges = ({ rows }) => {
    this.setState({
      data: [...rows],
    })
  }
  printLeaflet = async (printData = {}) => {
    console.log(printData)
    const { visitid } = this.props
    const visitinvoicedrugids = _.join(
      printData.map(x => {
        return x.id
      }),
    )
    console.log(visitinvoicedrugids)
    const instructionIds = _.join(
      printData
        // skip drug mixture
        .filter(xx => xx.instructionId && xx.instructionId.length > 0)
        .map(x => {
          return _.join(x.instructionId, ',')
        }),
    )
    console.log(instructionIds)
    this.state.printlanguage.forEach(async lan => {
      const data = await getRawData(REPORT_ID.PATIENT_INFO_LEAFLET, {
        visitinvoicedrugids,
        instructionIds,
        language: lan,
        visitId: visitid,
      })
      const payload = [
        {
          ReportId: REPORT_ID.PATIENT_INFO_LEAFLET,
          ReportData: JSON.stringify({
            ...data,
          }),
        },
      ]
      this.props.handlePrint(JSON.stringify(payload))
      this.props.onConfirmPrintLeaflet()
    })
  }

  render() {
    const {
      onConfirmPrintLeaflet,
      footer,
      rows,
      classes,
      handlePrint,
      clinicSettings,
      showInvoiceAmountNegativeWarning,
    } = this.props
    const {
      primaryPrintoutLanguage = 'EN',
      secondaryPrintoutLanguage = '',
    } = clinicSettings
    return (
      <div>
        <GridContainer>
          <GridItem md={12}>
            {this.state.data && (
              <div className={classes.tableContainer}>
                <CommonTableGrid
                  size='sm'
                  columns={this.columns}
                  columnExtensions={this.colExtensions}
                  rows={rows}
                  {...this.tableConfig}
                  selection={this.state.selectedRows}
                  onSelectionChange={this.handleSelectionChange}
                />
              </div>
            )}
          </GridItem>
          <GridItem>
            {secondaryPrintoutLanguage !== '' && (
              <CheckboxGroup
                value={this.state.printlanguage}
                options={[
                  { value: 'EN', label: 'EN' },
                  { value: 'JP', label: 'JP' },
                ]}
                onChange={v => {
                  this.setState({
                    printlanguage: v.target.value,
                  })
                }}
              />
            )}
          </GridItem>
        </GridContainer>
        {footer({
          onConfirm: () => {
            const { selectedRows } = this.state
            const selectedData = rows.filter(item =>
              selectedRows.includes(item.id),
            )
            this.printLeaflet(selectedData)
          },
          confirmBtnText: 'Confirm',
        })}
      </div>
    )
  }
}

export default withWebSocket()(DrugLeafletSelection)
