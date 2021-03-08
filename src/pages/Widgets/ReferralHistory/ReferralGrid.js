import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { CommonTableGrid,Tooltip,Button } from '@/components'
import Authorized from '@/utils/Authorized'
import { Edit } from '@material-ui/icons'

@connect(({ settingReferralSource, settingReferralPerson, clinicSettings, patient }) => ({
  settingReferralSource,
  settingReferralPerson,
  clinicSettings,
  patient,
}))
class ReferralGrid extends PureComponent {

  tableEditable = Authorized.check('patientdatabase.patientprofiledetails.patienthistory.referralhistory').rights ===
    'enable'

  editRow = (row) => {
    this.props.onEditReferralHistoryClicked(row)
  }

  render () {
    const { patientHistory } = this.props

    return (
      <CommonTableGrid
        getRowId={(r) => r.id}
        forceRender
        rows={patientHistory.patientReferralHistory.entity.data}
        columns={[
            { name: 'visitDate', title: 'Visit Date' },
            { name: 'doctorName', title: 'Doctor' },
            { name: 'referralSource', title: 'Referral Source' },
            { name: 'referralPerson', title: 'Referral Person' },
            { name: 'referralRemarks', title: 'Referral Remarks' },
            { name: 'action', title: 'Action'},
          ]}
        FuncProps={{
          pager: true,
          filter: true,
        }}
        columnExtensions={[
          {
            columnName: 'visitDate',
            type: 'date',
          },
          {
            columnName: 'action',
            sortingEnabled: false,
            render: (row) => {
              return(
                <Tooltip title='Edit'>
                  <Button 
                    disabled={!this.tableEditable}
                    size='sm'
                    onClick={()=>{
                      this.editRow(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginRight : 5}}
                  >
                    <Edit />
                  </Button>
                </Tooltip>
              )
            },
          },
        ]}
      />
    )
  }
}
export default ReferralGrid
