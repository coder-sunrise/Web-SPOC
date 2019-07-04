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
    patientAllergy:[]
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
    const { setArrayValue, validateForm } = this.props
    setArrayValue(items)
    //validateForm()
  }

    this.commitChanges = ({ added, changed, deleted }) => {
      if (added) {
        state.patientAllergy = state.patientAllergy.concat(
          added.map((o) => {
            return {
              id: getUniqueGUID(),
              ...o,
            }
          }),
        )
      }
      if (changed) {
        state.patientAllergy = state.patientAllergy.map((row) => {
          const n = changed[row.id] ? { ...row, ...changed[row.id] } : row
          return n
        })
      }

      if (deleted) {
        state.patientAllergy = state.patientAllergy.filter(
          (row) => !deleted.find((o) => o === row.id) && row.id,
        )
      }

      this.setArrayValue(state.patientAllergy)

      //this.props.onSaveClick(this.props.values)
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
    const {  type,values,isEditable,rows } = this.props

    const EditingProps = {
      showAddCommand: true,
      editingRowIds,
      rowChanges,
      onEditingRowIdsChange: this.changeEditingRowIds,
      onRowChangesChange: this.changeRowChanges,
      onCommitChanges: this.commitChanges,
    }

    return (
      // <CardContainer title={this.titleComponent} hideHeader>
        <EditableTableGrid2
          rows={rows}
          onRowDoubleClick={this.onRowDoubleClick}
          FuncProps={{
            edit: isEditable,
            pagerConfig: {
              containerComponent: this.PagerContent(this),
            },
          }}
          EditingProps={{
            showAddCommand: isEditable,
            showEditCommand: isEditable,
            showDeleteCommand: isEditable,
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
