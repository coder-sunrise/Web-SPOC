import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'dva'
import moment from 'moment'
import {
  TreeGridComponent,
  ColumnsDirective,
  Inject,
  Freeze,
  ColumnDirective,
} from '@syncfusion/ej2-react-treegrid'
import './index.css'
import { Button } from 'antd'
import { useEffect } from 'react'
const styles = theme => ({})

@connect(({ workitem }) => ({
  workitem,
}))
class LabResults extends React.PureComponent {
  componentDidMount() {}
  constructor(props) {
    super(props)
    const { dispatch, patientProfileFK } = props
    this.resultTemplate = this.resultTemplate
    this.state = {
      columns: [
        // { header: 'Test Name', field: 'testName' },
        // { header: 'Ref. Range', field: 'referenceRange' },
      ],
      endTime: undefined, // last visit date of currently retrieved
      testPanelItems: [],
      data: [],
    }
    dispatch({
      type: 'workitem/getTestPanelItemWithRefRange',
      payload: { patientProfileFK },
    }).then(data => {
      if (data) {
        console.log(data)
        this.setState({ testPanelItems: data })
        this.constructTestPanelItem()
        this.loadData()
      }
    })
  }
  loadData = () => {
    const { dispatch, patientProfileFK } = this.props
    dispatch({
      type: 'workitem/getLabResults',
      payload: {
        patientProfileFK: patientProfileFK,
        endTime: this.state.endTime,
        pageSize: 5,
      },
    }).then(data => {
      if (data) {
        if (data.labResultDetails.length > 0) {
          this.constData(data.labResultDetails)
          this.setState({
            endTime: _.maxBy(data.labResultDetails, 'visitDate').visitDate,
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
            t => t.id === result.testPanelItemFK,
          )
          if (target) {
            target[`v_${visitData.visitId}`] = result
          }
        })
      })
    })
    var currentVisitLength = this.state.columns.length
    this.setState({
      columns: _.concat(
        this.state.columns,
        data.map((x, index) => {
          return {
            field: `v_${currentVisitLength + (index + 1)}`,
            header: moment(x.visitDate).format('DD MMM YYYY'),
          }
        }),
      ),
    })
  }
  resultTemplate(props) {
    console.log(props)
    return <div style={{ display: 'inline' }}>{props.finalResult || 0}</div>
  }
  constructTestPanelItem = () => {
    let category = _.uniqWith(
      this.state.testPanelItems.map(item => {
        return {
          testCategoryFK: item.testCategoryFK,
          itemName: item.testCategory,
        }
      }),
      _.isEqual,
    )
    category.forEach(item => {
      item.testPanelItems = this.state.testPanelItems
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
    this.setState({ testPanelItems: category, data: category })
  }
  getColumns = (header, field) => {
    return (
      <ColumnDirective
        field={field}
        headerText={header}
        width='120'
        rowHeight={25}
        template={this.resultTemplate}
        textAlign='Right'
      />
    )
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <div>
          <Button
            onClick={() => {
              this.loadData()
            }}
          >
            Load More
          </Button>
        </div>
        <div className='control-pane'>
          <div className='control-section'>
            <TreeGridComponent
              frozenColumns={2}
              dataSource={this.state.data}
              treeColumnIndex={0}
              height={this.props.height - 120}
              clipMode='EllipsisWithTooltip'
              childMapping='testPanelItems'
              enableHover='true'
            >
              <ColumnsDirective>
                <ColumnDirective
                  field='itemName'
                  headerText='Test Name'
                  width='150'
                  // headerTemplate={() => {
                  //   return <div>aaa</div>
                  // }}
                ></ColumnDirective>
                <ColumnDirective
                  field='referenceRange'
                  // customAttributes={{ class: 'customcss' }}
                  headerText='Reference Range'
                  width='150'
                  textAlign='Right'
                ></ColumnDirective>
                {this.state.columns.map(x => {
                  return this.getColumns(x.header, x.field)
                })}
              </ColumnsDirective>
              <Inject services={[Freeze]} />
            </TreeGridComponent>
          </div>
        </div>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(LabResults)
