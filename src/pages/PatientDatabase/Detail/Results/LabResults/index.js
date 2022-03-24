import React, { Component, Fragment } from 'react'
import * as ReactDOM from 'react-dom'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'dva'
import moment from 'moment'
import { Tooltip } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import { useVisitTypes } from '@/utils/hooks'
import Print from '@material-ui/icons/Print'
import { Link } from 'umi'
import { CommonModal } from '@/components'
import { ReportViewer } from '@/components/_medisys'
import { FileCopySharp } from '@material-ui/icons'
import ResultDetails from '@/pages/MedicalCheckup/Worklist/components/ReportingDetails/ResultDetails'
import {
  TreeGridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Filter,
  Toolbar,
  Page,
  Freeze,
} from '@syncfusion/ej2-react-treegrid'
import { GridContainer, GridItem, Checkbox, RadioGroup } from '@/components'
import './index.css'
import { Button } from 'antd'
import { useEffect } from 'react'
import { getMappedVisitType } from '@/utils/utils'
import { formatDatesToUTC } from '@/utils/dateUtils'
const styles = theme => ({})

@connect(({ workitem, clinicSettings }) => ({
  workitem,
  clinicSettings,
}))
class LabResults extends React.PureComponent {
  componentDidMount() {
    console.log(this.props, 1111)
    const { dispatch, patientProfileFK, clinicSettings } = this.props
    const { visitTypeSetting } = clinicSettings.settings
    // need to preload the visit type data before treegrid data render
    // if use useVisitType hook function will cause treegrid ui render issue
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctvisitpurpose',
      },
    }).then(v => {
      let visitTypeSettingsObj = undefined
      let visitTypes = []
      if (visitTypeSetting) {
        try {
          visitTypeSettingsObj = JSON.parse(visitTypeSetting)
        } catch {}
      }

      if ((v || []).length > 0) {
        visitTypes = getMappedVisitType(v, visitTypeSettingsObj)
      }
      // get all the active test panel item first
      this.setState({ visitType: visitTypes }, () => {
        dispatch({
          type: 'workitem/getTestPanelItemWithRefRange',
          payload: { patientProfileFK },
        }).then(data => {
          if (data) {
            // prepare the tree structure by test category and test panel item
            this.constructTestPanelItem(data)
            // load first page data
            this.loadData(true)
          }
        })
      })
    })
  }
  constructor(props) {
    super(props)
    const { dispatch, patientProfileFK, visitFK } = props
    this.state = {
      data: [],
      allRetrieved: false,
      onlyMC: false,
      showModal: false,
      showResultDetails: false,
      visitType: [],
      targetVisitId: undefined,
      outOfRangeLatest: false,
      outOfRangeAll: false,
      currentVisitId: visitFK,
    }
  }

  disableLoadMore() {
    console.log('x')
    if (this.treegridObj) {
      this.treegridObj?.toolbarModule?.enableItems(
        [this.treegridObj?.element?.id + '_gridcontrol_loadMore'],
        false,
      )
    }
  }
  getVisitTypeCode = typeFK => {
    const currentVisitType = this.state.visitType?.find(
      item => item.id === typeFK,
    )
    return currentVisitType?.code
  }
  loadData = includeCurrentVisit => {
    const { dispatch, patientProfileFK } = this.props
    dispatch({
      type: 'workitem/getLabResults',
      payload: {
        patientProfileFK: patientProfileFK,
        currentVisitId: this.state.currentVisitId,
        pageSize: 2,
        includeCurrentVisit: includeCurrentVisit ?? false,
      },
    }).then(data => {
      if (data) {
        if (data.labResultDetails?.length > 0) {
          this.prepareData(data)
        } else {
          this.setState({ allRetrieved: true })
          this.treegridObj.refresh()
        }
      }
    })
  }
  prepareData = data => {
    let newData = this.state.data
    // iterate the returned data and based on the test panel item FK to update the value of each test panel item
    data.labResultDetails.forEach(visitData => {
      visitData.testPanelItemResults.forEach(result => {
        newData.forEach(d => {
          var target = d.testPanelItems.find(
            x => x.id === result.testPanelItemFK,
          )
          if (target) {
            target[`v_${visitData.visitId}_finalResult`] = result.finalResult
            target[`v_${visitData.visitId}_shouldFlag`] = result.shouldFlag
              ? '__true'
              : '__false'
            target[`v_${visitData.visitId}_referenceRange`] =
              result.referenceRange
            // as long as there is a matched test panel item result returned, then update the "hasData" column to true
            // by default the table will only show the test panel item which has at least one result.
            target.hasData = '__yes'
          }
        })
      })
    })
    this.setState(
      {
        data: newData,
        currentVisitId: _.minBy(data.labResultDetails, 'visitId').visitId,
        allRetrieved: data.allRetrieved,
      },
      () => {
        // base on returned visit record to push column
        data.labResultDetails.map((x, index) => {
          this.treegridObj.columns.push({
            width: 170,
            customAttributes: {
              // use this to highlight the latest visit record
              class:
                this.treegridObj.columns.length == 3 ? 'customcss' : 'normal',
              visitTypeFK: x.visitTypeFK,
            },
            visible: x.visitTypeFK !== 4 ? !this.state.onlyMC : true,
            // filed set to 'shouldFlag' is only for out of range filter usage.
            field: `v_${x.visitId}_shouldFlag`,
            textAlign: 'Right',
            headerText: `${moment(x.visitDate).format('DD MMM YYYY')}`,
            headerTemplate: () => {
              return (
                <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
                  <div>
                    {`${moment(x.visitDate).format(
                      'DD MMM YYYY',
                    )} (${this.getVisitTypeCode(x.visitTypeFK)})`}
                    <Tooltip
                      style={{ display: 'inline-block' }}
                      title='Print Lab Report'
                    >
                      <Print
                        style={{
                          position: 'relative',
                          top: 4,
                          cursor: 'pointer',
                          color: '#4255bd',
                          left: 3,
                        }}
                        onClick={() => {
                          this.setState({
                            targetVisitId: x.visitId,
                            showModal: true,
                          })
                        }}
                      />
                    </Tooltip>
                    {x.hasLabRemarks && (
                      <Tooltip
                        style={{ display: 'inline-block' }}
                        title='Result Details'
                      >
                        <FileCopySharp
                          style={{
                            width: 15,
                            height: 15,
                            position: 'relative',
                            top: 4,
                            cursor: 'pointer',
                            color: '#4255bd',
                            left: 5,
                          }}
                          onClick={() => {
                            this.setState({
                              targetVisitId: x.visitId,
                              showResultDetails: true,
                            })
                          }}
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              )
            },
            template: props => {
              return (
                <Tooltip
                  title={props.taskData[`v_${x.visitId}_referenceRange`]}
                >
                  <span
                    style={{
                      color:
                        props.taskData[`v_${x.visitId}_shouldFlag`] === '__true'
                          ? 'red'
                          : 'inherit',
                    }}
                  >
                    {props.taskData[`v_${x.visitId}_finalResult`]}
                  </span>
                </Tooltip>
              )
            },
          })
        })
        this.treegridObj.refreshColumns()
        this.treegridObj.refresh()
        if (this.state.outOfRangeAll) {
          this.filterOutOfRangeOfAll()
        } else {
          // after data filtering, always show the test panel item which has data
          this.treegridObj.search('__yes')
          // need to clear the current filter condtion then trigger based on if only show out of range of latest..
          this.treegridObj.clearFiltering()
          if (this.state.outOfRangeLatest) {
            this.filterOutOfRangeOfLatest()
          }
        }
      },
    )
  }
  constructTestPanelItem = data => {
    let category = _.uniqWith(
      data.map(item => {
        return {
          testCategoryFK: item.testCategoryFK,
          itemName: item.testCategory,
        }
      }),
      _.isEqual,
    )
    category.forEach(item => {
      item.testPanelItems = data
        .filter(x => x.testCategoryFK === item.testCategoryFK)
        .map(subItem => {
          return {
            testCategoryFK: subItem.testCategoryFK,
            testCategory: subItem.testCategory,
            id: subItem.id,
            itemName: subItem.displayValue,
            testPanelFK: subItem.testPanelFK,
            referenceRange: subItem.referenceRange,
            hasData: 'no',
          }
        })
    })
    this.setState({ data: category })
  }
  // filter MC by hide/show column based on visit type fk.
  filterMC = () => {
    if (this.state.onlyMC) {
      this.treegridObj.hideColumns(
        this.treegridObj
          .getColumns()
          .filter(
            x => x.customAttributes && x.customAttributes.visitTypeFK != 4,
          )
          .map(x => x.field),
        'field',
      )
    } else {
      this.treegridObj.showColumns(
        this.treegridObj
          .getColumns()
          .map(x => x.field)
          .filter(column => column != 'hasData'),
        'field',
      )
    }
  }
  onCloseReport = () => {
    this.setState({ showModal: false })
    // need to call the refresh so that the treegrid able to render correctly
    this.treegridObj.refresh()
  }
  onCloseResultDetails = () => {
    this.setState({ showResultDetails: false })
    // need to call the refresh so that the treegrid able to render correctly
    this.treegridObj.refresh()
  }
  filterOutOfRangeOfLatest = () => {
    this.treegridObj.search('__yes')
    var latestColumnName = this.treegridObj.getColumns()[3].field
    if (this.state.outOfRangeLatest) {
      if (this.state.outOfRangeAll) {
        this.setState({ outOfRangeAll: false })
      }
      this.treegridObj.filterByColumn(latestColumnName, 'startswith', '__t')
    } else {
      this.treegridObj.clearFiltering()
    }
  }
  filterOutOfRangeOfAll = () => {
    this.treegridObj.clearFiltering()
    var allColumns = this.treegridObj.getColumns().filter(x => x.index > 1)
    if (this.state.outOfRangeAll) {
      if (this.state.outOfRangeLatest) {
        this.setState({ outOfRangeLatest: false })
      }
      this.treegridObj.search('__true')
    } else {
      this.treegridObj.search('__yes')
    }
  }
  render() {
    console.log(this.state)
    return (
      <div>
        <GridContainer>
          <GridItem md={9}>
            <Checkbox
              label='Display MC Only'
              style={{
                display: 'inline-block',
                fontSize: '14px!important',
                width: 160,
              }}
              onChange={e => {
                this.setState({ onlyMC: e.target.value }, () => {
                  this.filterMC()
                })
              }}
            ></Checkbox>
            <Checkbox
              style={{
                display: 'inline-block',
                width: 210,
              }}
              label='Out of Range (Latest Visit)'
              checked={this.state.outOfRangeLatest}
              onChange={e => {
                this.setState({ outOfRangeLatest: e.target.value }, () => {
                  this.filterOutOfRangeOfLatest(e.target.value)
                })
              }}
            ></Checkbox>
            <Checkbox
              style={{
                display: 'inline-block',
                width: 200,
              }}
              label='Out of Range (All Visit)'
              checked={this.state.outOfRangeAll}
              onChange={e => {
                this.setState({ outOfRangeAll: e.target.value }, () => {
                  this.filterOutOfRangeOfAll(e.target.value)
                })
              }}
            ></Checkbox>
          </GridItem>
          <GridItem md={3}>
            {!this.state.allRetrieved && (
              <Link
                style={{
                  float: 'right',
                  position: 'relative',
                  textDecoration: 'underline',
                  marginRight: -8,
                  top: 3,
                }}
                onClick={e => {
                  e.preventDefault()
                  this.loadData()
                }}
              >
                <span>Load More</span>
              </Link>
            )}
          </GridItem>
        </GridContainer>
        <div className='control-pane'>
          <div className='control-section'>
            <div>
              <TreeGridComponent
                frozenColumns={2}
                dataSource={this.state.data}
                allowFiltering='true'
                treeColumnIndex={0}
                childMapping='testPanelItems'
                height={this.props.height - 130}
                gridLines='Both'
                enableHover='true'
                rowHeight={30}
                filterSettings={{ type: 'Menu', hierarchyMode: 'Both' }}
                searchSettings={{ hierarchyMode: 'Both' }}
                clipMode='Ellipsis'
                // toolbar={this.toolbarOptions}
                ref={treegrid => (this.treegridObj = treegrid)}
                // toolbarClick={this.toolbarClick.bind(this)}
              >
                <ColumnsDirective>
                  <ColumnDirective
                    field='itemName'
                    headerText='Test Name'
                    width='150'
                    template={props => {
                      return (
                        <Tooltip title={props.itemName}>
                          {props.itemName}
                        </Tooltip>
                      )
                    }}
                  ></ColumnDirective>
                  <ColumnDirective
                    field='referenceRange'
                    // customAttributes={{ class: 'customcss' }}
                    headerText='Reference Range'
                    width='150'
                    textAlign='Right'
                    template={props => {
                      return (
                        <Tooltip title={props.referenceRange}>
                          <span>{props.referenceRange}</span>
                        </Tooltip>
                      )
                    }}
                  ></ColumnDirective>
                  <ColumnDirective
                    field='hasData'
                    visible={false}
                  ></ColumnDirective>
                </ColumnsDirective>
                <Inject services={[Filter, Freeze, Toolbar, Page]} />
              </TreeGridComponent>
            </div>
          </div>
        </div>

        <CommonModal
          open={this.state.showModal}
          onClose={this.onCloseReport}
          title='Lab Result Report'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={94}
            reportParameters={{ visitId: this.state.targetVisitId }}
          />
        </CommonModal>
        <CommonModal
          open={this.state.showResultDetails}
          onClose={this.onCloseResultDetails}
          title='Result Details'
          maxWidth='md'
        >
          <ResultDetails
            showResultDetails={true}
            visitId={this.state.targetVisitId}
          />
        </CommonModal>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(LabResults)
