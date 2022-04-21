import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { CommonTableGrid, Tooltip, Button } from '@/components'
import Authorized from '@/utils/Authorized'
import { Edit } from '@material-ui/icons'

@connect(
  ({
    settingReferralSource,
    settingReferralPerson,
    clinicSettings,
    patient,
    global,
  }) => ({
    settingReferralSource,
    settingReferralPerson,
    clinicSettings,
    patient,
    mainDivHeight: global.mainDivHeight,
  }),
)
class ReferralGrid extends PureComponent {
  tableEditable =
    Authorized.check(
      'patientdatabase.patientprofiledetails.patienthistory.referralhistory',
    )?.rights === 'enable'

  editRow = row => {
    this.props.onEditReferralHistoryClicked(row)
  }

  render() {
    const { patientHistory, mainDivHeight = 700, patient } = this.props
    let height = mainDivHeight - 300
    if (height < 300) height = 300
    console.log(patient)
    return (
      <CommonTableGrid
        getRowId={r => r.id}
        forceRender
        rows={patientHistory.patientReferralHistory.entity.data}
        TableProps={{
          height,
        }}
        columns={[
          { name: 'visitDate', title: 'Visit Date' },
          { name: 'doctorName', title: 'Doctor' },
          { name: 'referralSource', title: 'Referral Source' },
          { name: 'referralPerson', title: 'Referral Person' },
          { name: 'referralRemarks', title: 'Referral Remarks' },
          { name: 'action', title: 'Action' },
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
            render: row => {
              return (
                <Tooltip title='Edit'>
                  <Button
                    disabled={!this.tableEditable || !patient?.entity?.isActive}
                    size='sm'
                    onClick={() => {
                      this.editRow(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginRight: 5 }}
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
