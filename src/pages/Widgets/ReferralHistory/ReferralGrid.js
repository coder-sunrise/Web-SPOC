import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { EditableTableGrid, TextField } from '@/components'
import Authorized from '@/utils/Authorized'
import { queryList, query } from '@/services/patient'
import moment from 'moment'

@connect(({ settingReferralSource, settingReferralPerson, clinicSettings, patient }) => ({
  settingReferralSource,
  settingReferralPerson,
  clinicSettings,
  patient,
}))
class ReferralGrid extends PureComponent {
  state = {
    referralList: [],
    referralPersonData: [],
  }

  tableEditable = Authorized.check('patientdatabase.patientprofiledetails.patienthistory.referralhistory').rights ===
    'enable'

  tableParas = {
    columns: [
      { name: 'visitDate', title: 'Visit Date' },
      { name: 'doctorName', title: 'Doctor' },
      { name: 'referralSourceFK', title: 'Referral Source' },
      { name: 'referralPersonFK', title: 'Referral Person' },
      { name: 'referralRemarks', title: 'Referral Remarks' },
    ],
    columnExtensions: [
      {
        columnName: 'visitDate',
        disabled: true,
        sortingEnabled: false,
        render: (row) => {
          return <TextField text value={moment(row.visitDate).format('DD MMM YYYY')} />
        },
      },
      {
        columnName: 'doctorName',
        disabled: true,
        sortingEnabled: false,
      },
      {
        columnName: 'referralSourceFK',
        disabled: !this.tableEditable,
        type: 'codeSelect',
        labelField: 'name',
        valueField: 'value',
        options: () => {
          return this.state.referralList
        },
        onChange: (e) => {
          this.handleSelectedReferralSource(e)
        },
        render: (row) => {
          return <TextField text value={row.referralSource} />
        },
        sortingEnabled: false,
      },
      {
        columnName: 'referralPersonFK',
        disabled: !this.tableEditable,
        isDisabled: (row) => {
          return row.referralSourceFK === undefined
        },
        type: 'codeSelect',
        labelField: 'name',
        valueField: 'id',
        query: async (v) => {
          if (typeof v === 'number') {
            return query({ id: v })
          }
          return queryList({
            apiCriteria: {
              searchValue: v,
              includeinactive: false,
            },
          })
        },
        options: (row) => {
          const templocalReferralPerson = this.state.referralPersonData.filter((t) =>
            (t.referralSources || []).find((rs) => rs.id === row.referralSourceFK)
          )
          let referralPatientNameAndValue = templocalReferralPerson.map((m) => {
            return { name: m.name, value: m.id, id: m.id }
          })
          return referralPatientNameAndValue
        },
        renderDropdown: (p) => {
          return this.renderSwitch(p)
        },
        onChange: (e) => {
          this.handleSelectedReferralPerson(e)
        },
        render: (row) => {
          return <TextField text value={row.referralPerson} />
        },
        sortingEnabled: false,
      },
      {
        columnName: 'referralRemarks',
        disabled: !this.tableEditable,
        sortingEnabled: false,
      },
    ],
  }

  handleSelectedReferralSource = (e) => {
    const { option, row } = e
    row.referralSource = option ? option.name : undefined
    row.referralSourceFK = option ? option.value : undefined
    row.referralPersonFK = undefined
    row.referralPerson = undefined
  }

  handleSelectedReferralPerson = (e) => {
    const { option, row } = e
    row.referralPersonFK = option ? option.id : undefined
    row.referralPerson = option ? option.name : undefined
  }

  componentDidMount = () => {
    this.loadReferralSource()
    this.loadReferralPerson()
  }

  loadReferralSource = () => {
    this.props
      .dispatch({
        type: 'settingReferralSource/query',
      })
      .then((response) => {
        if (response) {
          let data = response.data.filter((t) => t.isActive)
          let result = data.map((m) => {
            return { name: m.name, value: m.id }
          })
          result = _.concat({ name: 'Patient As Referral', value: -1 }, result)
          this.setState({ referralList: result })
        }
      })
  }

  loadReferralPerson = () => {
    this.props
      .dispatch({
        type: 'settingReferralPerson/query',
      })
      .then((response) => {
        if (response) {
          let data = response.data.filter((t) => t.isActive)
          this.setState({ referralPersonData: data })
        }
      })
  }

  commitChanges = ({ rows }) => {
    const { setFieldValue } = this.props
    setFieldValue('rows', rows)
  }

  renderSwitch (p) {
    switch (p.patientAccountNo) {
      case undefined:
        return p.name
      default:
        return (
          <div>
            <p>
              {p.patientAccountNo} / {p.name}
            </p>
            <p>Ref No. {p.patientReferenceNo}</p>
          </div>
        )
    }
  }

  render () {
    const { values } = this.props
    const { rows = [] } = values

    return (
      <EditableTableGrid
        rows={rows}
        FuncProps={{
          pager: true,
        }}
        EditingProps={{
          showEditCommand: false,
          showCommandColumn:false,
          onCommitChanges: this.commitChanges,
        }}
        {...this.tableParas}
      />
    )
  }
}
export default ReferralGrid
