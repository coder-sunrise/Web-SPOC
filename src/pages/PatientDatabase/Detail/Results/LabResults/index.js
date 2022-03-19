import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  TreeGridComponent,
  ColumnsDirective,
  Inject,
  Freeze,
  ColumnDirective,
} from '@syncfusion/ej2-react-treegrid'
import './index.css'
import { Button } from 'antd'
const styles = theme => ({})
class LabResults extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          taskID: 1,
          taskName: 'Biochemistry',
          subtasks: [
            {
              taskID: 2,
              taskName: 'GOT/AST',
              referenceRange: '<50',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 100,
              approved: false,
            },
            {
              taskID: 2,
              taskName: 'GOT/AST',
              referenceRange: '<50',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 100,
              approved: false,
            },
            {
              taskID: 2,
              taskName: 'GOT/AST',
              referenceRange: '<50',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 100,
              approved: false,
            },
            {
              taskID: 2,
              taskName: 'GOT/AST',
              referenceRange: '<50',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 100,
              approved: false,
            },
            {
              taskID: 2,
              taskName: 'GOT/AST',
              referenceRange: '<50',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 100,
              approved: false,
            },
            {
              taskID: 2,
              taskName: 'GOT/AST',
              referenceRange: '<50',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 100,
              approved: false,
            },
            {
              taskID: 2,
              taskName: 'GOT/AST',
              referenceRange: '<50',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 100,
              approved: false,
            },
            {
              taskID: 2,
              taskName: 'GOT/AST',
              referenceRange: '<50',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 100,
              approved: false,
            },
            {
              taskID: 2,
              taskName: 'GOT/AST',
              referenceRange: '<50',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 100,
              approved: false,
            },
            {
              taskID: 2,
              taskName: 'GOT/AST',
              referenceRange: '<50',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 100,
              approved: false,
            },
            {
              taskID: 2,
              taskName: 'GOT/AST',
              referenceRange: '<50',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 100,
              approved: false,
            },
            {
              taskID: 2,
              taskName: 'GOT/AST',
              referenceRange: '<50',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 100,
              approved: false,
            },
            {
              taskID: 3,
              taskName: 'GPT/ALT',
              referenceRange: '<40',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 12,
              approved: true,
            },
            {
              taskID: 4,
              taskName: 'ALP',
              referenceRange: '30-117',
              endDate: new Date('02/07/2017'),
              GOT: 5,
              v2: 100,
              v3: 31,
              approved: false,
            },
            {
              taskID: 5,
              taskName: 'LDH',
              referenceRange: '200-480',
              endDate: new Date('02/07/2017'),
              GOT: 0,
              v2: 0,
              v3: 24,
              approved: true,
            },
          ],
        },
        {
          taskID: 6,
          taskName: 'Heamotology',
          subtasks: [
            {
              taskID: 7,
              taskName: 'Software Specification',
              referenceRange: new Date('02/10/2017'),
              endDate: new Date('02/12/2017'),
              GOT: 3,
              v2: 60,
              v3: 'Normal',
              approved: false,
            },
            {
              taskID: 8,
              taskName: 'Develop prototype',
              referenceRange: new Date('02/10/2017'),
              endDate: new Date('02/12/2017'),
              GOT: 3,
              v2: 100,
              v3: 'Critical',
              approved: false,
            },
            {
              taskID: 9,
              taskName: 'Get approval from customer',
              referenceRange: new Date('02/13/2017'),
              endDate: new Date('02/14/2017'),
              GOT: 2,
              v2: 100,
              v3: 'Low',
              approved: true,
            },
            {
              taskID: 10,
              taskName: 'Design Documentation',
              referenceRange: new Date('02/13/2017'),
              endDate: new Date('02/14/2017'),
              GOT: 2,
              v2: 100,
              v3: 'High',
              approved: true,
            },
            {
              taskID: 11,
              taskName: 'Design complete',
              referenceRange: new Date('02/14/2017'),
              endDate: new Date('02/14/2017'),
              GOT: 0,
              v2: 0,
              v3: 'Normal',
              approved: true,
            },
          ],
        },
        {
          taskID: 12,
          taskName: 'Urine',
          subtasks: [
            {
              taskID: 13,
              taskName: 'Phase 1',
              referenceRange: new Date('02/17/2017'),
              endDate: new Date('02/27/2017'),
              v3: 'High',
              approved: false,
              v2: 50,
              GOT: 11,
            },
          ],
        },
      ],
    }
    this.taskName = () => {
      return (
        <div>
          <b>Task Name</b>
        </div>
      )
    }
  }
  render() {
    console.log(this.state)
    return (
      <div>
        <div>
          <Button
            onClick={() => {
              this.setState({ data: [] })
            }}
          >
            Hello
          </Button>
        </div>
        <div className='control-pane'>
          <div className='control-section'>
            <TreeGridComponent
              frozenColumns={2}
              dataSource={this.state.data}
              treeColumnIndex={0}
              childMapping='subtasks'
              enableHover='true'
              height={400}
            >
              <ColumnsDirective>
                <ColumnDirective
                  field='taskName'
                  headerText='Test Name'
                  width='200'
                  headerTemplate={() => {
                    return <div>aaa</div>
                  }}
                ></ColumnDirective>
                <ColumnDirective
                  field='referenceRange'
                  headerText='Ref. Range'
                  width='120'
                  textAlign='Right'
                />
                <ColumnDirective
                  field='GOT'
                  headerText='21 Mar 2021'
                  // headerTemplate={() => {
                  //   return (
                  //     <div>
                  //       <b className='e-header'>Task Name</b>
                  //     </div>
                  //   )
                  // }}
                  width='120'
                  textAlign='Right'
                />
                <ColumnDirective
                  field='v2'
                  headerText='21 Mar 2021'
                  width='120'
                  textAlign='Right'
                />
                <ColumnDirective
                  field='v3'
                  headerText='11 Jan 2021'
                  width='120'
                  textAlign='Right'
                />
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
