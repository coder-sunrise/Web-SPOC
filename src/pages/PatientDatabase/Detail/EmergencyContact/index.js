import React, { PureComponent } from 'react'
import _ from 'lodash'
import Loadable from 'react-loadable'
import {
  EditableTableGrid,
  Button,
  CommonModal,
  notification,
} from '@/components'
import Loading from '@/components/PageLoading/index'
import { Tooltip } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import { query } from '@/services/patient'
import { getUniqueNumericId } from '@/utils/utils'

class EmergencyContact extends PureComponent {
  state = {
    editingRowIds: [],
    showModal: false,
  }

  tableParas = {
    columns: [
      { name: 'accountNoTypeFK', title: 'Account Type' },
      { name: 'accountNo', title: 'Account No' },
      { name: 'salutationFK', title: 'Salutation' },
      { name: 'name', title: 'Name' },
      { name: 'relationshipFK', title: 'Relationship' },
      { name: 'address', title: 'Address' },
      { name: 'primaryContactNo', title: 'Primary Contact' },
      { name: 'isPrimaryContact', title: 'Priority' },
      { name: 'remark', title: 'Remarks' },
    ],
    columnExtensions: [
      { columnName: 'name', isDisabled: (row) => !!row.nokPatientProfileFK },
      {
        columnName: 'accountNo',
        isDisabled: (row) => !!row.nokPatientProfileFK,
      },
      {
        columnName: 'relationshipFK',
        type: 'codeSelect',
        code: 'ctrelationship',
      },
      {
        columnName: 'accountNoTypeFK',
        type: 'codeSelect',
        code: 'ctPatientAccountNoType',
        isDisabled: (row) => !!row.nokPatientProfileFK,
      },
      {
        columnName: 'address',
        isDisabled: (row) => !!row.nokPatientProfileFK,
      },
      {
        columnName: 'salutationFK',
        type: 'codeSelect',
        code: 'ctSalutation',
        isDisabled: (row) => !!row.nokPatientProfileFK,
      },
      {
        columnName: 'isPrimaryContact',
        type: 'radio',
        checkedValue: true,
        uncheckedValue: false,
        onRadioChange: (row, e, checked) => {
          if (checked) {
            const { values, setFieldValue, setFieldTouched } = this.props
            const patientEmergencyContact = _.cloneDeep(
              values.patientEmergencyContact,
            )
            patientEmergencyContact.forEach((pec) => {
              pec.isPrimaryContact = false
            })
            const r = patientEmergencyContact.find((o) => o.id === row.id)
            if (r) {
              r.isPrimaryContact = true
            }
            setFieldValue('patientEmergencyContact', patientEmergencyContact)
            setFieldTouched('patientEmergencyContact', true)
          }
        },
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
          simple
          disableAdd
          disableQueryOnLoad
        />
      )
    },
  })

  onRowDoubleClick = (row) => {
    if (!this.state.editingRowIds.find((o) => o === row.id)) {
      this.setState((prevState) => ({
        editingRowIds: !prevState.editingRowIds.concat([
          row.id,
        ]),
      }))
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }))
  }

  onEditingRowIdsChange = (ids) => {
    this.setState({
      editingRowIds: ids,
    })
  }

  commitChanges = ({ rows }) => {
    const { setFieldValue } = this.props
    setFieldValue('patientEmergencyContact', rows)
  }

  renderActionFn = (row) => {
    const { props } = this
    const { values, setFieldValue } = props
    return (
      <Tooltip title='Add' placement='bottom'>
        <Button
          size='sm'
          onClick={async () => {
            const r = await query(row.id)
            const o = r.data
            const patientEmergencyContact = _.cloneDeep(
              values.patientEmergencyContact,
            )
            if (
              patientEmergencyContact.find(
                (m) => m.patientProfileFK === o.id && !m.isDeleted,
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
            const primaryAddress =
              o.contact.contactAddress.find((m) => m.isPrimary) || {}
            const newId = getUniqueNumericId()
            patientEmergencyContact.push({
              id: newId,
              isNew: true,
              accountNo: o.patientAccountNo,
              patientProfileFK: o.id,
              salutationFK: o.salutationFK,
              accountNoTypeFK: o.patientAccountNoTypeFK,
              name: o.name,
              relationshipFK: undefined,
              isPrimaryContact: false,
              nokPatientProfileFK: o.id,
              address: `${primaryAddress.blockNo ||
                ''} ${primaryAddress.buildingName ||
                ''} ${primaryAddress.unitNo || ''} ${primaryAddress.street ||
                ''}`,
            })
            setFieldValue('patientEmergencyContact', patientEmergencyContact)
            this.setState((prevState) => {
              return {
                editingRowIds: prevState.editingRowIds.concat([
                  newId,
                ]),
              }
            })
            this.toggleModal()
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

  render () {
    const { values, schema } = this.props
    const { SearchPatient = (f) => f } = this
    return (
      <div>
        <EditableTableGrid
          rows={values.patientEmergencyContact}
          schema={schema}
          onRowDoubleClick={this.onRowDoubleClick}
          FuncProps={{
            pagerConfig: {
              containerExtraComponent: (
                <Button
                  onClick={this.toggleModal}
                  hideIfNoEditRights
                  color='info'
                  link
                >
                  <Add />Add From Existing Patient
                </Button>
              ),
            },
            pager: false,
          }}
          EditingProps={{
            showAddCommand: true,
            editingRowIds: this.state.editingRowIds,
            onEditingRowIdsChange: this.onEditingRowIdsChange,
            onCommitChanges: this.commitChanges,
          }}
          {...this.tableParas}
        />
        <CommonModal
          open={this.state.showModal}
          title='Search Patient'
          onClose={this.toggleModal}
          showFooter={false}
          maxWidth='lg'
          onConfirm={this.toggleModal}
        >
          <SearchPatient />
        </CommonModal>
      </div>
    )
  }
}

export default EmergencyContact
