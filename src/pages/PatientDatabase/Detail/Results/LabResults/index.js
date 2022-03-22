import React, { Component, Fragment } from 'react'
import * as ReactDOM from 'react-dom'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'dva'
import moment from 'moment'
import { Tooltip } from 'antd'
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
const styles = theme => ({})

@connect(({ workitem }) => ({
  workitem,
}))
class LabResults extends React.PureComponent {
  componentDidMount() {
    const { dispatch, patientProfileFK } = this.props
    dispatch({
      type: 'workitem/getTestPanelItemWithRefRange',
      payload: { patientProfileFK },
    }).then(data => {
      if (data) {
        console.log(data)
        // this.setState({ data: data })
        this.constructTestPanelItem(data)
        this.loadData()
      }
    })
  }
  constructor(props) {
    super(props)
    const { dispatch, patientProfileFK } = props
    this.state = {
      data: [],
      allRetrieved: false,
      onlyMC: false,
      outOfRangeLatest: false,
      outOfRangeAll: false,
    }
    this.toolbarOptions = [
      'ExpandAll',
      'CollapseAll',
      { text: 'Load More', tooltipText: 'Load More', id: 'loadMore' },
    ]
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
  loadData = () => {
    // this.treegridObj?.destroy()
    const { dispatch, patientProfileFK } = this.props
    dispatch({
      type: 'workitem/getLabResults',
      payload: {
        patientProfileFK: patientProfileFK,
        endTime: this.state.endTime,
        pageSize: 2,
      },
    }).then(data => {
      if (data) {
        if (data.labResultDetails?.length > 0) {
          this.constData(data.labResultDetails)
          this.setState({
            endTime: _.minBy(data.labResultDetails, 'visitDate').visitDate,
            allRetrieved: data.allRetrieved,
          })
        }
      }
    })
  }
  constData = data => {
    let newData = this.state.data
    data.forEach(visitData => {
      visitData.testPanelItemResults.forEach(result => {
        newData.forEach(d => {
          var target = d.testPanelItems.find(
            x => x.id === result.testPanelItemFK,
          )
          if (target) {
            target[`v_${visitData.visitId}_finalResult`] = result.finalResult
            target[
              `v_${visitData.visitId}_shouldFlag`
            ] = result.shouldFlag.toString()
            target[`v_${visitData.visitId}_referenceRange`] =
              result.referenceRange
          }
        })
        // var target = d.testPanelItems.find(
        //   t => t.id === result.testPanelItemFK,
        // )
        // if (target) {
        //   target[`v_${visitData.visitId}_finalResult`] = result.finalResult
        //   target[
        //     `v_${visitData.visitId}_shouldFlag`
        //   ] = result.shouldFlag.toString()
        //   target[`v_${visitData.visitId}_referenceRange`] =
        //     result.referenceRange
        // }
      })
    })
    this.setState(
      {
        data: newData,
      },
      () => {
        data.map((x, index) => {
          this.treegridObj.columns.push({
            width: 150,
            customAttributes: { visitTypeFK: x.visitTypeFK },
            field: `v_${x.visitId}_shouldFlag`,
            textAlign: 'Right',
            headerText: moment(x.visitDate).format('DD MMM YYYY'),
            template: props => {
              return (
                <Tooltip
                  title={props.taskData[`v_${x.visitId}_referenceRange`]}
                >
                  <span
                    style={{
                      color:
                        props.taskData[`v_${x.visitId}_shouldFlag`] === 'true'
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
      },
    )
  }
  resultTemplate(props) {
    console.log(props)
    return <span>111</span>
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
          }
        })
    })
    this.setState({ data: category })
  }
  getColumns = (header, field) => {
    return (
      <ColumnDirective
        field={field}
        headerText={header}
        width='120'
        template={props => {
          return <span>{props[field]}</span>
        }}
        textAlign='Right'
      />
    )
  }
  filterMC = () => {
    if (this.state.onlyMC) {
      this.treegridObj
        .getColumns()
        .filter(x => x.customAttributes && x.customAttributes.visitTypeFK != 4)
        .forEach(x => {
          this.treegridObj.hideColumns(x.field, 'field')
        })
    } else {
      this.treegridObj.getColumns().forEach(x => {
        this.treegridObj.showColumns(x.field, 'field')
      })
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
              style={{ display: 'inline-block', width: 160 }}
              onChange={e => {
                this.setState({ onlyMC: e.target.value }, () => {
                  this.filterMC()
                })
              }}
            ></Checkbox>
            <Checkbox
              style={{ display: 'inline-block', width: 210 }}
              label='Out of Range (Latest Visit)'
              // checked={this.state.outOfRangeLatest}
              onChange={e => {
                var latestColumnName = this.treegridObj.getColumns()[2].field
                // this.setState({ outOfRangeLatest: e.terget.value })
                if (e.target.value) {
                  // this.setState({ outOfRangeAll: false })
                  this.treegridObj.filterByColumn(
                    latestColumnName,
                    'startswith',
                    't',
                  )
                } else {
                  this.treegridObj.clearFiltering()
                  this.treegridObj.refresh()
                }
              }}
            ></Checkbox>
            <Checkbox
              style={{ display: 'inline-block', width: 160 }}
              label='Out of Range (All Visit)'
              // checked={this.state.outOfRangeAll}
              onChange={e => { 
                var allColumns = this.treegridObj
                  .getColumns()
                  .filter(x => x.index > 1)
                if (e.target.value) {
                  // this.setState({ outOfRangeLatest: false })
                  console.log(allColumns.map(x => x.field))

                  this.treegridObj.searchSettings = {
                    fields: allColumns.map(x => x.field),
                  }
                  // allColumns.forEach(column => {
                  //   this.treegridObj.filterByColumn(
                  //     column.field,
                  //     'startswith',
                  //     't',
                  //     'or',
                  //   )
                  // })
                  this.treegridObj.search('true')
                } else {
                  this.treegridObj.clearFiltering()
                  this.treegridObj.refresh()
                }
              }}
            ></Checkbox>
          </GridItem>
          <GridItem md={3}>
            <Button
              style={{ float: 'right' }}
              disabled={this.state.allRetrieved}
              onClick={() => {
                this.loadData()
              }}
            >
              Load More
            </Button>
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
                height={this.props.height - 140}
                gridLines='Both'
                enableHover='true'
                filterSettings={{ type: 'Menu', hierarchyMode: 'Both' }}
                clipMode='Ellipsis'
                // toolbar={this.toolbarOptions}
                ref={treegrid => (this.treegridObj = treegrid)}
                // toolbarClick={this.toolbarClick.bind(this)}
                pageSettings={{ pageSize: 11 }}
              >
                <ColumnsDirective>
                  <ColumnDirective
                    field='itemName'
                    headerText='Test Name'
                    width='150'
                  ></ColumnDirective>
                  <ColumnDirective
                    field='referenceRange'
                    // customAttributes={{ class: 'customcss' }}
                    headerText='Reference Range'
                    width='150'
                    textAlign='Right'
                  ></ColumnDirective>
                </ColumnsDirective>
                <Inject services={[Filter, Freeze, Toolbar, Page]} />
              </TreeGridComponent>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(LabResults)
