import React, { PureComponent } from 'react'
import { PagingPanel } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import {
  Button,
  CommonModal,
  CommonTableGrid2,
  EditableTableGrid2,
  CardContainer,
} from '@/components'
import { getUniqueGUID, getRemovedUrl, getAppendUrl } from '@/utils/utils'

class AllergyGrid extends PureComponent {
  state = {
    editingRowIds: [],
    rowChanges: {},
  }

  tableParas = {
    columns: [
      { name: 'allergyName', title: 'Allergy Name' },
      { name: 'description', title: 'Allergic Reaction' },
      { name: 'date', title: 'Date' },
      { name: 'status', title: 'Status' }
    ],
    columnExtensions: [
      {
        columnName: 'date',
        type: 'date',
      },
      {
        columnName: 'status',
        type: 'select',
        options: status,
        label: 'Status',
      },
    ],
  }

  constructor (props) {
    super(props)

    const { state } = this
    const { title, titleChildren, dispatch, type } = props

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
      if (!state.editingRowIds.find((o) => o === row.Id)) {
        this.setState({
          editingRowIds: state.editingRowIds.concat([
            row.Id,
          ]),
        })
      }

    }

    
  this.setArrayValue = (items) => {
    const { setFieldValue, validateForm } = this.props
    setFieldValue('patientAllergy', items)
    //validateForm()
  }

    this.commitChanges = ({ added, changed, deleted }) => {
      console.log('oncommite')
      console.log(this.props.values)

      let { values: { patientAllergy = [] } } =  this.props
      if (added) {
        patientAllergy = patientAllergy.concat(
          added.map((o) => {
            return {
              id: getUniqueGUID(),
              ...o,
            }
          }),
        )
      }
      if (changed) {
        patientAllergy = patientAllergy.map((row) => {
          const n = changed[row.id] ? { ...row, ...changed[row.id] } : row
          return n
        })
      }

      if (deleted) {
        patientAllergy = patientAllergy.filter(
          (row) => !deleted.find((o) => o === row.id) && row.id,
        )
      }

      this.setArrayValue(patientAllergy)

      this.props.onSaveClick(this.props.values)
    }

    

    this.PagerContent = (me) => (p) => {
      return (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute'
            
            }}
          >
          </div>
          <PagingPanel.Container {...p} />
        </div>
      )
    }
  }

  render () {
    const { editingRowIds, rowChanges } = this.state
    const {  type,values } = this.props

    const EditingProps = {
      showAddCommand: true,
      editingRowIds,
      rowChanges,
      onEditingRowIdsChange: this.changeEditingRowIds,
      onRowChangesChange: this.changeRowChanges,
      onCommitChanges: this.commitChanges,
    }
    console.log('render2')
    console.log(this.props)
    return (
      // <CardContainer title={this.titleComponent} hideHeader>
        <EditableTableGrid2
          rows={values.patientAllergy.filter((o) => !o.isDeleted)}
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
          
          {...this.tableParas}
        />
      // </CardContainer>
    )
  }
}

export default AllergyGrid
