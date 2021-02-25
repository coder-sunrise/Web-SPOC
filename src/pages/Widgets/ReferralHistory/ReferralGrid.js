import React, {PureComponent} from 'react'
import {connect} from 'dva'
import _ from 'lodash'
import {EditableTableGrid,CodeSelect,Select,TextField,notification} from '@/components'
import Authorized from '@/utils/Authorized'
import { queryList } from '@/services/patient'

@connect(
    ({
      settingReferralSource,
      settingReferralPerson,
      clinicSettings,
      patient,
    }) => ({
      settingReferralSource,
      settingReferralPerson,
      clinicSettings,
      patient,
    }),
  )

 
class ReferralGrid extends PureComponent {
    state ={
        referralData: [],
        referralList: [],
        referralPersonData: [],
        referralPersonList: [],
    }

    tableEditable = Authorized.check('patientdatabase.patientprofiledetails.patienthistory.referralhistory')
    .rights === 'enable'
        
    tableParas = {
            columns :[
                { name: 'visitDate', title: 'Visit Date' },
                { name: 'doctorName', title: 'Doctor' },
                { name: 'referralSourceFK', title: 'Referral Source' },
                { name: 'referralPersonFK', title: 'Referral Person' },
                { name: 'referralRemarks', title:'Referral Remarks' },
            ],
            columnExtensions:[
              {
                  columnName: 'visitDate',
                  disabled: true,
                  sortingEnabled: false,
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
                  render: (row) =>{
                    return <TextField text value={row.referralSource} />
                  },
                  sortingEnabled: false,
              },
              {
                   columnName: 'referralPersonFK',
                   disabled: !this.tableEditable,
                   type: 'codeSelect',
                   labelField: 'name',
                   valueField: 'id',
                   query: async (v) => {
                      return queryList({
                        apiCriteria: {
                          searchValue: v,
                          includeinactive: false,
                        },
                      })
                    },
                   options:(row) => {
                      const templocalReferralPerson = this.state.referralPersonData.filter((t) =>
                      (t.referralSources || [])
                      .find((rs) => rs.id === row.referralSourceFK),
                      )
                    let referralPatientNameAndValue = templocalReferralPerson.map((m) => {
                      
                      return { name: m.name, value: m.id, id: m.id }
                    })
                    return referralPatientNameAndValue
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
        const { option, row} = e
        row.referralSource = option? option.name : undefined
        row.referralSourceFK = option? option.value : undefined
 
      }

      handleSelectedReferralPerson = (e) => {
        const {option, row} = e
        row.referralPersonFK = option? option.id : undefined
        row.referralPerson = option? option.name : undefined

        // console.log('optionName',option.name)
        // console.log('optionId',option.id )
        // console.log('handleSelectedReferralPerson',row)
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
              this.setState({ referralData: data, referralList: result })
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

    commitChanges = ({ rows}) => {
       const {setFieldValue} = this.props
       setFieldValue('rows',rows)
      }

    render () {
   
        const {editingRowIds,rowChanges,referralPersonData,referralList,referralData,referralPersonList} = this.state
        
        const {values} = this.props
        const {rows = [] } = values
        // console.log('values',values)
        // console.log('rows',rows)
           
        return(
          <EditableTableGrid
            rows={rows}
            FuncProps={{
                pager:true,
            }}
            EditingProps={{
                showEditCommand: false,
                showDeleteCommand: false,
                onCommitChanges: this.commitChanges,
              }}
            {...this.tableParas}
          />
        )
    }
  }
export default ReferralGrid
