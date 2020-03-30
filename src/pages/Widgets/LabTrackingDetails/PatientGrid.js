import React, {PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import CommonTableGrid from '@/components/CommonTableGrid'
import { Button, Tooltip } from '@/components'

const tableColumns = [
    { name:'visitDate', title:'Visit Date'},
    { name:'doctorName', title:'Doctor'},
    { name:'serviceName', title:'Service Name'},
    { name:'labTrackingStatusDisplayValue', title:'Status'},
    { name:'remarks', title:'Remarks'},
    { name: 'action', title: 'Action'},
]

const tableColumnExtensions = [
  {columnName:'visitDate',type:'date'},
  {
    columnName: 'action',
    sortingEnabled: false,
    align: 'center',
    width: 100,
    render: (row) => {
      return (
        <Tooltip title='Edit Patient Lab Result' placement='bottom'>
          <Button
            size='sm'
            onClick={() => {
              this.editRow(row)
            }}
            justIcon
            color='primary'
            style={{ marginRight: 0 }}
          >
            <Edit />
          </Button>
        </Tooltip>
      )
    },
  },
]

class PatientGrid extends PureComponent {

  editRow = (row,e) =>{
    const {dispatch, LabTrackingDetails}= this.props
    const {list} = LabTrackingDetails

    dispatch({
      type:'labTrackingDetails/updatestate',
      payload:{
        showModal:true,
        entity:list.find((o)=> o.id === row.id),
      },
    })

  }


  render () {
    return (
      <CommonTableGrid
        type='labTrackingDetails'
        onRowDoubleClick={this.editRow}
        columns={tableColumns}
        columnExtensions={tableColumnExtensions}
      />
    )

  }
}

export default PatientGrid
