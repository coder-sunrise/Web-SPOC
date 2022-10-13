import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'dva'
import moment from 'moment'
import { dateFormatLong, Checkbox } from '@/components'
import { Table } from 'antd'
import { defaultData, defaultColumns } from './utils'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'
import { TESTTYPES, GENDER } from '@/utils/constants'
import TestResultLabel from './TestResultLabel'
import tablestyles from './index.less'
import { set } from 'lodash'

const styles = theme => ({})
@connect(({ clinicSettings }) => ({ clinicSettings }))
class BasicData extends Component {
  constructor(props) {
    super(props)
    this.visitTypeSetting = JSON.parse(
      props.clinicSettings.settings.visitTypeSetting,
    )
    const { genderFK } = props
    this.state = {
      data: defaultData,
      columns: defaultColumns(genderFK),
      currentPage: 0,
      total: 0,
      loadedData: [],
    }
  }

  componentDidMount() {
    this.searchData()
  }

  componentWillReceiveProps(nextProps) {
    this.searchData()
  }

  searchData = () => {
    if (!this.props.patientProfileFK || this.state.isLoaded) return
    this.setState({ isLoaded: true })
    const { genderFK } = this.props
    this.setState(
      {
        data: defaultData,
        columns: defaultColumns(genderFK),
        currentPage: 0,
        total: 0,
        loadedData: [],
      },
      () => {
        this.loadData()
      },
    )
  }

  loadData = () => {
    const { dispatch, patientProfileFK, visitFK } = this.props
    dispatch({
      type: 'patientResults/queryBasicDataList',
      payload: {
        apiCriteria: { visitFK, patientProfileFK },
        current: this.state.currentPage + 1,
      },
    }).then(response => {
      if (response && response.status === '200') {
        this.setState(
          {
            currentPage: this.state.currentPage + 1,
            total: response.data.totalRecords,
            loadedData: [...this.state.loadedData, ...response.data.data],
          },
          this.updateData,
        )
      }
    })
  }

  hasAnyValue = row => {
    if (
      !Object.keys(row).find(
        key => key.includes('valueColumn') && hasValue(row[key]),
      )
    ) {
      return false
    }
    return true
  }

  updateData = () => {
    const { genderFK } = this.props
    let newData = defaultData.filter(
      d =>
        genderFK !== GENDER.MALE ||
        [TESTTYPES.PREGNANCY, TESTTYPES.MENSES].indexOf(d.testCode) < 0,
    )

    const showData = this.state.loadedData.filter(
      c => !this.state.isOnlySearchMC || c.visitPurposeFK === 4,
    )

    newData = newData.map(row => {
      let insertVisit = {}
      let index = 0
      showData.forEach(data => {
        let value
        if (!row.isGroup && row.fieldName) {
          if (
            row.testCode === TESTTYPES.WAIST &&
            (data.isChild || data.isPregnancy)
          ) {
            value = 'NA'
          } else {
            value = data[row.fieldName]
          }
        }
        insertVisit = {
          ...insertVisit,
          [`valueColumn${index + 1}`]: value,
        }
        if (row.testCode === TESTTYPES.COLORVISIONTEST) {
          insertVisit = {
            ...insertVisit,
            [`colorVisionRemarksColumn${index + 1}`]: data?.remarks,
          }
        }
        index = index + 1
      })

      return { ...row, ...insertVisit }
    })

    newData = newData.filter(x => x.isGroup || this.hasAnyValue(x))

    for (let index = 1; index <= 5; index++) {
      if (!newData.find(x => x.groupFK === index)) {
        newData = newData.filter(x => x.groupID !== index)
      }
    }

    let newColumns = defaultColumns(genderFK).filter(
      c => c.dataIndex !== 'action',
    )
    showData.forEach((data, i) => {
      const visitPurpose = this.visitTypeSetting.find(
        x => x.id === data.visitPurposeFK,
      )
      let newColumn = {
        dataIndex: `valueColumn${i + 1}`,
        align: 'right',
        title: (
          <div
            style={{
              padding: '4px',
            }}
          >
            <div style={{ height: 16 }}>
              {moment(data.visitDate).format(dateFormatLong)}
            </div>
            <div style={{ height: 16 }}>({visitPurpose?.code})</div>
          </div>
        ),
        width: 100,
        render: (text, row) => {
          let tooltip
          if (row.testCode === TESTTYPES.COLORVISIONTEST) {
            tooltip = row[`colorVisionRemarksColumn${i + 1}`]
          }

          if (
            row.testCode === TESTTYPES.WAIST &&
            row[`valueColumn${i + 1}`] === 'NA'
          ) {
            tooltip =
              'Waist circumference is not available for children or pregnant women'
          }

          return (
            <div
              style={{
                padding: '2px 4px',
              }}
            >
              <TestResultLabel
                value={row[`valueColumn${i + 1}`]}
                tooltip={tooltip}
                format={row.format}
                valueType={row.valueType}
                testCode={row.testCode}
                genderFK={genderFK}
              />
            </div>
          )
        },
      }
      if (i === 0) {
        newColumn = {
          ...newColumn,
          onCell: row => {
            if (row.isGroup)
              return {
                colSpan:
                  Object.keys(row).filter(name => name.includes('valueColumn'))
                    .length + 1,
                style: { backgroundColor: '#daecf5' },
              }
            return { colSpan: 1, style: { backgroundColor: '#daecf5' } }
          },
        }
      }
      newColumns.push(newColumn)
    })

    newColumns = [
      ...newColumns,
      defaultColumns(genderFK).find(c => c.dataIndex === 'action'),
    ]

    this.setState({
      data: newData,
      columns: newColumns,
    })
  }

  render() {
    const { height, clinicSettings } = this.props
    const { total, currentPage } = this.state
    const showLoadMore = currentPage * 10 < total
    return (
      <div>
        <div style={{ position: 'relative', height: 40 }}>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 8,
            }}
          >
            {showLoadMore && (
              <a
                style={{ textDecoration: 'underline', fontStyle: 'italic' }}
                onClick={this.loadData}
              >
                Load More
              </a>
            )}
          </div>
        </div>
        <Table
          size='small'
          bordered
          pagination={false}
          columns={this.state.columns}
          dataSource={this.state.data}
          className={tablestyles.table}
          scroll={{ y: height - 80 }}
        />
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(BasicData)
