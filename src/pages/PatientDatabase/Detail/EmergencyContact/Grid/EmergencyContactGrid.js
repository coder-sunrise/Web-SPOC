import React, { PureComponent } from 'react'
import _ from 'lodash'
import Loadable from 'react-loadable'
import Add from '@material-ui/icons/Add'
import {
  FastEditableTableGrid,
  Button,
  CommonModal,
  notification,
  Tooltip,
} from '@/components'
import Loading from '@/components/PageLoading/index'
import service from '@/services/patient'
import { getUniqueId } from '@/utils/utils'
import styles from './Grid.less'

const { query } = service
class EmergencyContactGrid extends PureComponent {
  state = {
    editingRowIds: [],
    showModal: false,
  }

  tableParas = {
    columns: [
      { name: 'salutationFK', title: 'Salutation' },
      { name: 'name', title: 'Name' },
      { name: 'accountNoTypeFK', title: 'Account Type' },
      { name: 'accountNo', title: 'Account No' },
      { name: 'relationshipFK', title: 'Relationship' },
      { name: 'address', title: 'Address' },
      { name: 'primaryContactNo', title: 'Primary Contact' },
      {
        name: 'isPrimaryContact',
        title: 'Priority',
      },
      { name: 'remark', title: 'Remarks' },
    ],
    columnExtensions: [
      {
        columnName: 'name',
        isDisabled: row => !!row.emergencyContactFK,
      },
      {
        columnName: 'accountNo',
        maxLength: 20,
        isDisabled: row => !!row.emergencyContactFK,
      },
      {
        columnName: 'relationshipFK',
        type: 'codeSelect',
        code: 'ctrelationship',
        sortBy: 'relationshipFK',
        // sortingEnabled: false,
        dropdownMatchSelectWidth: false,
      },
      {
        columnName: 'accountNoTypeFK',
        type: 'codeSelect',
        code: 'ctPatientAccountNoType',
        isDisabled: row => {
          return !!row.emergencyContactFK
        },
        dropdownMatchSelectWidth: false,
      },
      {
        columnName: 'address',
        isDisabled: row => !!row.emergencyContactFK,
      },
      {
        columnName: 'salutationFK',
        width: 80,
        type: 'codeSelect',
        code: 'ctSalutation',
        // sortingEnabled: false,
        isDisabled: row => !!row.emergencyContactFK,
      },
      {
        columnName: 'isPrimaryContact',
        type: 'radio',
        width: 60,
        checkedValue: true,
        uncheckedValue: false,
        // sortingEnabled: false,
        onChange: ({ row, checked }) => {
          if (checked) {
            const { values, setFieldValue, setFieldTouched } = this.props
            const patientEmergencyContact = _.cloneDeep(
              values.patientEmergencyContact,
            )
            patientEmergencyContact.forEach(pec => {
              pec.isPrimaryContact = false
            })
            const r = patientEmergencyContact.find(o => o.id === row.id)
            if (r) {
              r.isPrimaryContact = true
            }
            setFieldValue('patientEmergencyContact', patientEmergencyContact)
            setFieldTouched('patientEmergencyContact', true)
          }
        },
      },
      {
        columnName: 'remark',
        maxLength: 100,
      },
    ],
  }

  SearchPatient = Loadable({
    loader: () => import('@/pages/PatientDatabase/Search'),
    loading: Loading,
    render: (loaded, p) => {
      let Component = loaded.default
      return (
        <Component
          renderActionFn={this.renderActionFn}
          onRowDblClick={this.onAddExistPatient}
          simple
          disableAdd
          disableQueryOnLoad
        />
      )
    },
  })

  onRowDoubleClick = row => {
    if (!this.state.editingRowIds.find(o => o === row.id)) {
      this.setState(prevState => ({
        editingRowIds: prevState.editingRowIds.concat([row.id]),
      }))
    }
  }

  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }))
  }

  onEditingRowIdsChange = ids => {
    this.setState({
      editingRowIds: ids,
    })
    return ids
  }

  commitChanges = ({ rows }) => {
    const { setFieldValue } = this.props
    setFieldValue('patientEmergencyContact', rows)
  }

  onAddExistPatient = async row => {
    const { props } = this
    const { values, setFieldValue, dispatch } = props
    if (!row || !row.id) return
    const r = await query(row.id)
    const o = r.data
    const patientEmergencyContact = _.cloneDeep(values.patientEmergencyContact)
    if (
      patientEmergencyContact.find(
        m => m.emergencyContactFK === o.id && !m.isDeleted,
      )
    ) {
      notification.warn({
        message: 'This contact person already existed',
      })
      return
    }
    if (o.id === values.id) {
      notification.warn({
        message: 'Can not add this patient himself as contact person',
      })
      return
    }
    const primaryAddress = o.contact.contactAddress.find(m => m.isPrimary) || {}
    const newId = getUniqueId()
    patientEmergencyContact.push({
      id: newId,
      isNew: true,
      accountNo: o.patientAccountNo,
      patientProfileFK: values.id,
      emergencyContactFK: o.id,
      salutationFK: o.salutationFK,
      accountNoTypeFK: o.patientAccountNoTypeFK,
      name: o.name,
      relationshipFK: undefined,
      isPrimaryContact: false,
      address: `${primaryAddress.blockNo || ''} ${primaryAddress.buildingName ||
        ''} ${primaryAddress.unitNo || ''} ${primaryAddress.street || ''}`,
      primaryContactNo: o.contact.mobileContactNumber.number,
      remark: '-',
    })
    setFieldValue('patientEmergencyContact', patientEmergencyContact)
    // // this.setState((prevState) => {
    // //   return {
    // //     editingRowIds: prevState.editingRowIds.concat([
    // //       newId,
    // //     ]),
    // //   }
    // // })
    // dispatch({
    //   type: 'global/updateState',
    //   payload: {
    //     disableSave: true,
    //   },
    // })
    this.toggleModal()
  }

  renderActionFn = row => {
    return (
      <Tooltip title='Add' placement='bottom'>
        <Button
          size='sm'
          onClick={() => {
            this.onAddExistPatient(row)
          }}
          justIcon
          round
          color='primary'
          style={{ marginRight: 5 }}
        >
          <Add />
        </Button>
      </Tooltip>
    )
  }

  render() {
    const { values, schema } = this.props
    const { SearchPatient = f => f } = this

    return (
      <div>
        <FastEditableTableGrid
          rows={values.patientEmergencyContact}
          schema={schema.patientEmergencyContact._subType}
          // showRowNumber
          // onRowDoubleClick={this.onRowDoubleClick}
          FuncProps={{
            pagerConfig: {
              containerExtraComponent: !this.props.disabled && (
                <Button
                  onClick={this.toggleModal}
                  // hideIfNoEditRights
                  color='info'
                  link
                >
                  <Add />
                  Add From Existing Patient
                </Button>
              ),
            },
            pager: false,
          }}
          EditingProps={{
            // defaultNewRow: [
            //   {
            //     name: '123',
            //   },
            // ],
            showAddCommand: !this.props.disabled,
            isDeletable: row => !this.props.disabled,
            // editingRowIds: this.state.editingRowIds,
            // onEditingRowIdsChange: this.onEditingRowIdsChange,
            onCommitChanges: this.commitChanges,
            // onAddedRowsChange: (rows) => {
            //   return rows.map((o) => ({
            //     name: 'dff',
            //     accountNoTypeFK: 1,
            //     ...o,
            //   }))
            // },
            onAddedRowsChange: rows => {
              return rows.map(o => {
                return { primaryContactNo: '', ...o }
              })
            },
          }}
          {...this.tableParas}
        />
        <CommonModal
          className={styles.deepCommonModal}
          open={this.state.showModal}
          title='Search Patient'
          onClose={this.toggleModal}
          showFooter={false}
          maxWidth='md'
          onConfirm={this.toggleModal}
        >
          <SearchPatient />
        </CommonModal>
      </div>
    )
  }
}

export default EmergencyContactGrid
