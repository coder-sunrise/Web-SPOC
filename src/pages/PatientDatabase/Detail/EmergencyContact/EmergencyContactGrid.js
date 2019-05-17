import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Loadable from 'react-loadable'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'
import _ from 'lodash'
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

@connect(({ emergencyContact, loading }) => {
  return { emergencyContact, loading }
})
@withFormik({
  mapPropsToValues: ({ patient }) => {
    return patient.entity || patient.default
  },
  validationSchema: Yup.object().shape({
    patientEmergencyContact: Yup.array().of(
      Yup.object().shape({
        salutationFk: Yup.string().required(),
        name: Yup.string().required(),
      }),
    ),
  }),

  handleSubmit,
  displayName: 'EmergencyContact',
})
class Grid extends PureComponent {
  state = {
    editingRowIds: [],
    rowChanges: {},
  }

  tableParas = {
    columns: [
      { name: 'salutationFk', title: 'Salutation' },
      { name: 'name', title: 'Name' },
      { name: 'relationship', title: 'Relationship' },
      { name: 'address', title: 'Address' },
      { name: 'primaryContactNo', title: 'Primary Contact' },
      { name: 'priority', title: 'Priority' },
      { name: 'remark', title: 'Remarks' },
    ],
    columnExtensions: [
      {
        columnName: 'salutationFk',
        type: 'codeSelect',
        code: 'Salutation',
        isDisabled: (row) => !!row.nokPatientProfileFk,
      },
      {
        columnName: 'priority',
        type: 'radio',
        checkedValue: 1,
        uncheckedValue: 0,
        onRadioChange: (row, e, checked) => {
          console.log(this)
          if (checked) {
            const { values, setFieldValue, setFieldTouched } = this.props
            const { patientEmergencyContact } = values
            patientEmergencyContact.forEach((pec) => {
              pec.priority = 0
            })
            const r = patientEmergencyContact.find((o) => o.id === row.id)
            if (r) {
              r.priority = 1
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

    this.changeEditingRowIds = (editingRowIds) =>
      this.setState({ editingRowIds })
    this.changeRowChanges = (rowChanges) => {
      console.log(rowChanges)
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
    const setArrayValue = (items) => {
      // runValidationSchema('patientEmergencyContact', items)
      // resetForm()
      console.log(this)
      // setFieldValue(
      //   'patientEmergencyContact',
      //   _.unionBy(
      //     items,
      //     this.props.patient.entity.patientEmergencyContact,
      //     'id',
      //   ),
      // )
      validateForm()
      // console.log(props.errors)
      // console.log(v)
      // // setFieldValue('patientEmergencyContact', items)
    }
    this.PagerContent = (me) => (p) => {
      return (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              padding: me.props.theme.spacing.unit * 2,
            }}
          >
            <Button onClick={this.toggleModal} color='info'>
              Add From Existing Patient
            </Button>
          </div>
          <PagingPanel.Container {...p} />
        </div>
      )
    }
  }

  componentDidUpdate = (prevProps) => {
    componentDidUpdate(this.props, prevProps, () => {
      return false
      console.log(this.props.patient.entity)
      return this.props.patient.entity.patientEmergencyContact.find(
        (o) =>
          !prevProps.values.patientEmergencyContact.find((m) => m.id === o.id),
      )
    })
  }

  // onChangePriority = (row, e, checked) => {
  //   if (checked) {
  //     const { values, setFieldValue } = this.props
  //     values.patientEmergencyContact.forEach((pec) => {
  //       pec.priority = 0
  //     })
  //     const r = values.patientEmergencyContact.find((o) => o.id === row.id)
  //     r.priority = 1
  //     setFieldValue('patientEmergencyContact', values.patientEmergencyContact)
  //   }
  // }

  renderActionFn = (row) => {
    const { props } = this
    const { dispatch, setFieldValue, setFieldTouched } = props
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
              const { values: { patientEmergencyContact = [] } } = props

              if (
                patientEmergencyContact.find((m) => m.patientProfileFk === o.id)
              ) {
                notification.warn({
                  message: 'This contact person already existed',
                })
                return
              }
              patientEmergencyContact.unshift({
                id: getUniqueGUID(),
                patientProfileFk: o.id,
                salutationFk: o.salutationFk,
                name: o.name,
                relationship: '',
                nokPatientProfileFk: o.id,
                address: o.contact.contactAddress[0].line1,
              })
              setFieldValue('patientEmergencyContact', patientEmergencyContact)
              setFieldTouched('patientEmergencyContact', true)
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

  commitChanges = ({ added, changed, deleted }) => {
    // console.log(added, changed, deleted)
    // console.log(this)
    const { values, setFieldValue, setFieldTouched } = this.props
    let { patientEmergencyContact } = values

    if (added) {
      patientEmergencyContact.unshift(
        ...added.map((o) => {
          return {
            id: getUniqueGUID(),
            ...o,
          }
        }),
      )
    }

    if (changed) {
      patientEmergencyContact = values.patientEmergencyContact.map((row) => {
        const n = changed[row.id] ? { ...row, ...changed[row.id] } : row
        return n
      })
    }

    if (deleted) {
      deleted.forEach((id) => {
        const row = patientEmergencyContact.find((o) => o.id === id)
        if (row) row.isDeleted = true
      })
    }
    setFieldValue('patientEmergencyContact', patientEmergencyContact)
    setFieldTouched('patientEmergencyContact', true)

    // setArrayValue()
    return false
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }))
  }

  render () {
    const { values, type, loading, errors, patientSearch } = this.props
    const { SearchPatient = (f) => f } = this
    console.log(this.props)
    // console.log(values)
    return (
      <div>
        <CardContainer title={this.titleComponent}>
          <EditableTableGrid2
            rows={values.patientEmergencyContact.filter((o) => !o.isDeleted)}
            onRowDoubleClick={this.onRowDoubleClick}
            FuncProps={{
              edit: true,
              pagerConfig: {
                containerComponent: this.PagerContent(this),
              },
            }}
            EditingProps={{
              showAddCommand: true,
              editingRowIds: this.state.editingRowIds,
              rowChanges: this.state.rowChanges,
              onEditingRowIdsChange: this.changeEditingRowIds,
              createRowChange: (a, b, c) => {
                console.log(a, b, c)
              },
              onRowChangesChange: this.changeRowChanges,
              onCommitChanges: this.commitChanges,
            }}
            errors={errors.patientEmergencyContact}
            {...this.tableParas}
          />
          {getFooter({
            resetable: true,
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
