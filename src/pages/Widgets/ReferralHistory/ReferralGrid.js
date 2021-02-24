import React, {PureComponent} from 'react'
import {connect} from 'dva'
import _ from 'lodash'
import {EditableTableGrid,CodeSelect,Select,TextField,notification} from '@/components'
import Authorized from '@/utils/Authorized'
import { queryList } from '@/services/patient'

// let localReferralList = []
// let localReferralPersonData = []

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
                { name: 'referralSource', title: 'Referral Source' },
                { name: 'referralPerson', title: 'Referral Person' },
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
                  columnName: 'referralSource',
                  disabled: !this.tableEditable,
                  type: 'codeSelect',
                  labelField: 'name',
                  valueField: 'name',
                  options: () => {
                    return this.state.referralList
                    // localReferralList 
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
                   columnName: 'referralPerson',
                   disabled: !this.tableEditable,
                   type: 'select',
                   valueField: 'name',
                   labelField: 'name',
                   query: async (v) => {
                    return (queryList({
                      apiCriteria: {
                        searchValue: v,
                        includeinactive: false,
                      },
                    }))
                  },
                   options:(row) => {
                      const templocalReferralPerson = this.state.referralPersonData.filter((t) =>
                      (t.referralSources || [])
                      .find((rs) => rs.id === row.referralSourceFK),
                      )
                    let referralPatientNameAndValue = templocalReferralPerson.map((m) => {
                      return { name: m.name, value: m.id }
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
        console.log('option',option)
        console.log('optionName',option.name)
        console.log('optionValue',option.value )
        console.log('handleSelectedReferralSource',row)
      }

      handleSelectedReferralPerson = (e) => {
        const {option, row} = e

        if (row.referralSourceFK === -1 || row.referralSourceFK === undefined) {
          row.referralPersonFK = option? option.id : undefined
        }else{
          row.referralPersonFK = option? option.value : undefined
        }
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
              // localReferralList = result
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
              // localReferralPersonData = data
              // const { referralSourceFK } = this.props.values
              // if (referralSourceFK) {
              //   data = data.filter((t) =>
              //     (t.referralSources || [])
              //       .find((rs) => rs.id === referralSourceFK),
              //   )
              // }
              // let result = data.map((m) => {
              //   return { name: m.name, value: m.id }
              // })
              // this.setState({ referralPersonList: result })
            }
          })
      }

    commitChanges = ({ rows}) => {
       const {setFieldValue,values,dispatch} = this.props
       const {patientHistory} = values

       setFieldValue('dispatch',dispatch)
       setFieldValue('referralPersonHistory',rows)
       setFieldValue('patientHistory',patientHistory)
       // setFieldValue('rows',rows)
       // console.log('referralPersonHistory',rows)
       // console.log('Props',this.props)
       // console.log ('referralPersonHistory',rows)
      
      }

    render () {
   
        const {editingRowIds,rowChanges,referralPersonData,referralList,referralData,referralPersonList} = this.state
        
        // console.log('referralList',referralList)
        // console.log('ReferralPersonList',referralPersonList)
        // console.log ('referralPersonData',referralPersonData)

        const {rows} = this.props

        console.log('data',rows)
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
