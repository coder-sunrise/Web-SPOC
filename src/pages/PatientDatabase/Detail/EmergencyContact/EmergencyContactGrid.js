import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import Loadable from 'react-loadable'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'
import { query } from '@/services/patient'

import {
  EditableTableGrid2,
  CardContainer,
  Button,
  CommonModal,
  notification,
  ProgressButton,
} from '@/components'
import { Tooltip, withStyles } from '@material-ui/core'
import Add from '@material-ui/icons/Add'

import { titles } from '@/utils/codes'
import { PagingPanel } from '@devexpress/dx-react-grid-material-ui'
import Loading from '@/components/PageLoading/index'
import { getUniqueNumericId, getRemovedUrl, getAppendUrl } from '@/utils/utils'
import { handleSubmit, getFooter, componentDidUpdate } from '../utils'

// const pecValidationSchema = Yup.array().compact((v) => v.isDeleted).of(
//   Yup.object().shape({
//     salutationFK: Yup.string().required(),
//     name: Yup.string().required(),
//   }),
// )
const pecValidationSchema = Yup.object().shape({
  accountNoTypeFK: Yup.string().required(),
  accountNo: Yup.string().required(),
  name: Yup.string().required(),
  relationshipFK: Yup.number().required(),
})
@connect(({ patient, emergencyContact, loading }) => {
  return { patient, emergencyContact, loading }
})
@withFormik({
  mapPropsToValues: ({ patient }) => {
    // console.log(patient)
    return patient.entity || patient.default
  },
  validationSchema: Yup.object().shape({
    patientEmergencyContact: Yup.array()
      .compact((v) => v.isDeleted)
      .of(pecValidationSchema),
  }),
  handleSubmit,
  displayName: 'EmergencyContact',
})
class Grid extends React.Component {
  state = {
    editingRowIds: [],
    rowChanges: {},
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

      // {
      //   columnName: 'primaryContactNo',
      //   type: 'date',
      //   // isDisabled: (row) => true,
      // },
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
          // console.log(this)
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

  constructor (props) {
    super(props)

    const {
      title,
      titleChildren,
      dispatch,
      type,
      theme,
      setFieldValue,
      validateForm,
      resetForm,
    } = props
    const { state } = this

    this.titleComponent = (
      <div style={{ position: 'relative' }}>
        {title}
        {titleChildren}
      </div>
    )

    this.changeEditingRowIds = (editingRowIds) => {
      this.setState({ editingRowIds })
    }
    this.changeRowChanges = (rowChanges) => {
      // console.log(rowChanges)
      // console.log(
      //   rowChanges,
      //   this.props.errors,
      //   this.props.values.patientEmergencyContact,
      // )
      this.setState({ rowChanges })
    }

    this.onRowDoubleClick = (row) => {
      if (!state.editingRowIds.find((o) => o === row.id)) {
        this.setState({
          editingRowIds: state.editingRowIds.concat([
            row.id,
          ]),
        })
      }
    }
    this.PagerContent = (
      <Button onClick={this.toggleModal} color='info' link>
        <Add />Add From Existing Patient
      </Button>
    )
  }

  // static getDerivedStateFromProps (nextProps, preState) {
  //   const { values, errors } = nextProps
  //   console.log(values, errors)
  //   console.log(errors)
  //   if (errors && Array.isArray(errors.patientEmergencyContact)) {
  //     const ids = preState.editingRowIds.splice()
  //     for (
  //       let index = 0;
  //       index < errors.patientEmergencyContact.length;
  //       index++
  //     ) {
  //       const er = errors.patientEmergencyContact[index]
  //       const row = values.patientEmergencyContact[index]
  //       if (er && row && preState.editingRowIds.indexOf(row.id) < 0) {
  //         ids.push(row.id)
  //       }
  //     }
  //     if (ids.length > 0 && ids.length !== preState.editingRowIds.length) {
  //       console.log(preState.editingRowIds, ids)
  //       return {
  //         editingRowIds: ids,
  //       }
  //     }
  //   }
  //   return null
  // }

  componentDidUpdate = (prevProps) => {
    componentDidUpdate(this.props, prevProps)
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }))
  }

  commitChanges = ({ rows, added, changed, deleted }) => {
    console.log(rows, added, changed, deleted)
    const { setFieldValue } = this.props
    setFieldValue('patientEmergencyContact', rows)
  }

  renderActionFn = (row) => {
    const { props } = this
    const { dispatch, values, setFieldValue } = props
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
              // id: getUniqueGUID(),
              id: newId,
              isNew: true,
              accountNo: o.patientAccountNo,
              patientProfileFK: o.id,
              salutationFK: o.salutationFK,
              accountNoTypeFK: o.patientAccountNoTypeFK,
              name: o.name,
              relationship: '',
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
    const { values, type, loading, errors, patientSearch } = this.props
    const { SearchPatient = (f) => f } = this
    console.log(this.props)
    // console.log(this.state)
    // console.log(pecValidationSchema)
    return (
      <div>
        <CardContainer title={this.titleComponent} hideHeader>
          <EditableTableGrid2
            rows={values.patientEmergencyContact.filter((o) => !o.isDeleted)}
            onRowDoubleClick={this.onRowDoubleClick}
            FuncProps={{
              pagerConfig: {
                containerExtraComponent: this.PagerContent,
              },
            }}
            EditingProps={{
              showAddCommand: true,
              editingRowIds: this.state.editingRowIds,
              rowChanges: this.state.rowChanges,
              onEditingRowIdsChange: this.changeEditingRowIds,
              onRowChangesChange: this.changeRowChanges,
              onCommitChanges: this.commitChanges,
            }}
            // errors={errors.patientEmergencyContact}
            schema={pecValidationSchema}
            {...this.tableParas}
          />
          {getFooter({
            resetable: true,
            allowSubmit: this.state.editingRowIds.length === 0,
            ...this.props,
          })}
        </CardContainer>
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

export default Grid
