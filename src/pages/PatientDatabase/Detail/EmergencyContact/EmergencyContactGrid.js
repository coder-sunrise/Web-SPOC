import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Loadable from 'react-loadable'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'

import {
  EditableTableGrid2,
  CardContainer,
  Button,
  CommonModal,
  notification,
} from '@/components'
import { Tooltip, withStyles } from '@material-ui/core'
import Add from '@material-ui/icons/Add'

import { titles } from '@/utils/codes'
import { PagingPanel } from '@devexpress/dx-react-grid-material-ui'
import Loading from '@/components/PageLoading/index'

@connect(({ emergencyContact, loading }) => {
  return { emergencyContact, loading }
})
@withFormik({
  mapPropsToValues: ({ emergencyContact }) => {
    return emergencyContact.entity || emergencyContact.default
  },
  validationSchema: Yup.object().shape({
    patientEmergencyContact: Yup.array().of(
      Yup.object().shape({
        salutationFk: Yup.string().required(),
        name: Yup.string().required(),
      }),
    ),
  }),

  handleSubmit: (values, component) => {
    console.log(component)
    const { props, setValues } = component
    // console.log(values)
    // return
    // props
    //   .dispatch({
    //     type: 'demographic/submit',
    //     payload: values,
    //   })
    //   .then((r) => {
    //     console.log(r)
    //     if (r) {
    //       notification.success({
    //         // duration:0,
    //         message: r.id ? 'Created' : 'Saved',
    //       })
    //       if (r.id) {
    //         props.history.push(
    //           getAppendUrl(
    //             {
    //               pid: r.id,
    //             },
    //             getRemovedUrl([
    //               'new',
    //             ]),
    //           ),
    //         )
    //       } else {
    //         setCurrentPatient(props, setValues)
    //       }

    //       if (props.onConfirm) props.onConfirm()
    //     }
    //   })
  },
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
      },
    ],
  }

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
      setFieldValue('patientEmergencyContact', items)
      validateForm()
      // console.log(props.errors)
      // console.log(v)
      // // setFieldValue('patientEmergencyContact', items)
    }
    this.commitChanges = ({ added, changed, deleted }) => {
      // console.log(added, changed, deleted)
      // console.log(this)
      const { values } = props
      const { patientEmergencyContact } = values

      if (added) {
        props
          .dispatch({
            type: `emergencyContact/localAdd`,
            payload: added.map((o) => {
              return {
                type,
                ...o,
              }
            }),
          })
          .then(setArrayValue)
      }

      if (changed) {
        props
          .dispatch({
            type: `emergencyContact/localChange`,
            payload: changed,
          })
          .then(setArrayValue)
      }

      if (deleted) {
        dispatch({
          type: `emergencyContact/localDelete`,
          payload: deleted,
        }).then(setArrayValue)
      }

      return false
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

    const renderActionFn = (row) => {
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
                  patientEmergencyContact.find(
                    (m) => m.patientProfileFk === o.id,
                  )
                ) {
                  notification.warn({
                    message: 'This contact person already existed',
                  })
                  return
                }
                dispatch({
                  type: 'emergencyContact/add',
                  payload: [
                    {
                      patientProfileFk: o.id,
                      salutationFk: o.salutationFk,
                      name: o.name,
                      relationship: '',
                      nokPatientProfileFk: o.id,
                      address: o.contact.contactAddress[0].line1,
                    },
                  ],
                }).then(this.toggleModal)
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

    this.SearchPatient = Loadable({
      loader: () => import('@/pages/PatientDatabase/Search'),
      loading: Loading,
      render (loaded, p) {
        let Component = loaded.default
        return (
          <Component
            renderActionFn={renderActionFn}
            simple
            disableQueryOnLoad
          />
        )
      },
    })
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }))
  }

  render () {
    const { values, type, loading, errors, patientSearch } = this.props
    const { SearchPatient = (f) => f } = this
    // console.log(errors)
    return (
      <div>
        <CardContainer title={this.titleComponent}>
          <EditableTableGrid2
            rows={values.patientEmergencyContact}
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
              onRowChangesChange: this.changeRowChanges,
              onCommitChanges: this.commitChanges,
            }}
            errors={errors.patientEmergencyContact}
            {...this.tableParas}
          />
        </CardContainer>
        <CommonModal
          open={this.state.showModal}
          title='Search Patient'
          onClose={this.toggleModal}
          showFooter={false}
          onConfirm={this.toggleModal}
        >
          <SearchPatient />
        </CommonModal>
      </div>
    )
  }
}

export default Grid
