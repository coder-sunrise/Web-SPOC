import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import Loadable from 'react-loadable'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'

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
import { getUniqueGUID, getRemovedUrl, getAppendUrl } from '@/utils/utils'
import { handleSubmit, getFooter, componentDidUpdate } from '../utils'

// const pecValidationSchema = Yup.array().compact((v) => v.isDeleted).of(
//   Yup.object().shape({
//     salutationFk: Yup.string().required(),
//     name: Yup.string().required(),
//   }),
// )
const pecValidationSchema = Yup.object().shape({
  salutationFk: Yup.string().required(),
  name: Yup.string().required(),
  // primaryContactNo: Yup.date().required(),
})
@connect(({ emergencyContact, loading }) => {
  return { emergencyContact, loading }
})
@withFormik({
  mapPropsToValues: ({ patient }) => {
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
      { name: 'accountNoTypeFk', title: 'Account Type' },
      { name: 'accountNo', title: 'Account No' },
      { name: 'salutationFk', title: 'Salutation' },
      { name: 'name', title: 'Name' },
      { name: 'relationshipFk', title: 'Relationship' },
      { name: 'address', title: 'Address' },
      { name: 'primaryContactNo', title: 'Primary Contact' },
      { name: 'isPrimaryContact', title: 'Priority' },
      { name: 'remark', title: 'Remarks' },
    ],
    columnExtensions: [
      { columnName: 'name', isDisabled: (row) => !!row.nokPatientProfileFk },
      {
        columnName: 'accountNo',
        isDisabled: (row) => !!row.nokPatientProfileFk,
      },

      // {
      //   columnName: 'primaryContactNo',
      //   type: 'date',
      //   // isDisabled: (row) => true,
      // },
      {
        columnName: 'relationshipFk',
        type: 'codeSelect',
        code: 'relationship',
        isDisabled: (row) => !!row.nokPatientProfileFk,
      },
      {
        columnName: 'accountNoTypeFk',
        type: 'codeSelect',
        code: 'PatientAccountNoType',
        isDisabled: (row) => !!row.nokPatientProfileFk,
      },
      {
        columnName: 'salutationFk',
        type: 'codeSelect',
        code: 'Salutation',
        isDisabled: (row) => !!row.nokPatientProfileFk,
      },
      {
        columnName: 'isPrimaryContact',
        type: 'radio',
        checkedValue: true,
        uncheckedValue: false,
        onRadioChange: (row, e, checked) => {
          console.log(this)
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
          onClick={() => {
            dispatch({
              type: 'emergencyContact/query',
              payload: {
                id: row.id,
              },
            }).then((o) => {
              // console.log(props)
              const patientEmergencyContact = _.cloneDeep(
                values.patientEmergencyContact,
              )
              if (
                patientEmergencyContact.find((m) => m.patientProfileFk === o.id)
              ) {
                notification.warn({
                  message: 'This contact person already existed',
                })
                return
              }
              const primaryAddress = o.contact.contactAddress.find(
                (m) => m.isPrimary,
              )
              patientEmergencyContact.push({
                // id: getUniqueGUID(),
                patientProfileFk: o.id,
                salutationFk: o.salutationFk,
                accountNoTypeFk: o.accountNoTypeFk,
                name: o.name,
                relationship: '',
                isPrimaryContact: false,
                nokPatientProfileFk: o.id,
                address: `${primaryAddress.blockNo} ${primaryAddress.buildingName} ${primaryAddress.unitNo}  ${primaryAddress.street}`,
              })
              setFieldValue('patientEmergencyContact', patientEmergencyContact)

              this.toggleModal()
            })
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
          onConfirm={this.toggleModal}
        >
          {this.state.showModal && <SearchPatient />}
        </CommonModal>
      </div>
    )
  }
}

export default Grid
