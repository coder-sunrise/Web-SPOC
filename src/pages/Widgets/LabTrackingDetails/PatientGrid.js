import React, {PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import CommonTableGrid from '@/components/CommonTableGrid'
import { Button, Tooltip } from '@/components'

class PatientGrid extends PureComponent {


  configs={
    columns : [
      { name:'visitDate', title:'Visit Date'},
      { name:'doctorName', title:'Doctor'},
      { name:'serviceName', title:'Service Name'},
      { name:'labTrackingStatusDisplayValue', title:'Status'},
      { name:'remarks', title:'Remarks'},
      { name: 'action', title: 'Action'},
    ],
    columnExtensions: [
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
  ],
}

  editRow = (row, e ) =>{
    const {dispatch, labTrackingDetails}= this.props
    const {list} = labTrackingDetails

    dispatch({
      type:'labTrackingDetails/updateState',
      payload:{
        showModal: true,
        entity: list.find((o)=> o.id === row.id),
      },
    })

  }

  render () {
    return (
      <CommonTableGrid
        type='labTrackingDetails'
        onRowDoubleClick={this.editRow}
        {...this.configs}
      />
    )

  }
}

export default PatientGrid
