import { CommonModal, CommonTableGrid } from '@/components'
import React, { Component } from 'react'
import { useDispatch } from 'dva'

const addressColumns = [
  { name: 'name', title: 'Name' },
  { name: 'relationship', title: 'Relationship' },
  { name: 'addressInfo', title: 'Current Address' },
]
const schemeColumns = [
  { name: 'name', title: 'Name' },
  { name: 'relationship', title: 'Relationship' },
  { name: 'schemeInfo', title: 'Current Corporate Scheme' },
]
const columnExtensions = [
  { columnName: 'name', type: 'Text', width:'25%'},
  { columnName: 'relationship', type: 'Text', width:'30%' },
  { columnName: 'addressInfo', type: 'Text' },
  { columnName: 'schemeInfo', type: 'Text' },
]

export default class FamilyMembersInfoUpdate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      familyMembersInfo: [],
    }
  }
  componentWillMount = () => {
    const { patientProfileFK, address, scheme, dispatch } = this.props
    dispatch({
      type: 'patient/getFamilyMembersInfo',
      payload: { patientProfileFK, getAddress: address, getScheme: scheme },
    }).then(r => {
      if (r) {
        this.setState({ familyMembersInfo: r })
      }
    })
  }
  render() {
    const {
      familyMembersInfo = [],
      selectedAddressRows = [],
      selectedSchemeRows = [],
    } = this.state
    const addressList = familyMembersInfo.filter(x => x.addressInfo)
    const schemeList = familyMembersInfo.filter(x => x.schemeInfo)
    // console.log('detail render', addressList, schemeList, familyMembersInfo)
    return (
      <div>
        {addressList.length > 0 && (
          <div>
            <h5>Do you want to update your Family Members' Address too?</h5>
            <CommonTableGrid
              rows={addressList}
              getRowId={r => r.id}
              columns={addressColumns}
              columnExtensions={columnExtensions}
              selection={selectedAddressRows}
              onSelectionChange={rows =>
                this.setState({ selectedAddressRows: rows })
              }
              FuncProps={{
                pager: false,
                selectable: true,
                selectConfig: {
                  showSelectAll: true,
                  // selectByRowClick: false,
                  rowSelectionEnabled: () => true,
                },
              }}
            />
          </div>
        )}
        {schemeList.length > 0 && (
          <div>
            <h5>
              Do you want to update your Family Members' Corporate Scheme too?
            </h5>
            <CommonTableGrid
              rows={schemeList}
              getRowId={r => r.id}
              columns={schemeColumns}
              columnExtensions={columnExtensions}
              selection={selectedSchemeRows}
              onSelectionChange={rows =>
                this.setState({ selectedSchemeRows: rows })
              }
              FuncProps={{
                pager: false,
                selectable: true,
                selectConfig: {
                  showSelectAll: true,
                  // selectByRowClick: false,
                  rowSelectionEnabled: () => true,
                },
              }}
            />
          </div>
        )}
      </div>
    )
  }
}
