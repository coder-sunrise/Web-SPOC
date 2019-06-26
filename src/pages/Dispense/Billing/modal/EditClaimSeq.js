import React, { Component } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button, EditableTableGrid2 } from '@/components'
import {
  ClaimSequenceColumns,
  ClaimSequenceColExtensions,
  ClaimSequenceData,
} from '../variables'

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit,
  },
  saveChangesButton: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
})

class EditClaimSeq extends Component {
  state = {
    editingRowIds: [],
    rowChanges: [],
  }

  changeEditingRowIds = (editingRowIds) => {
    this.setState({ editingRowIds })
  }

  changeRowChanges = (rowChanges) => {
    this.setState({ rowChanges })
  }

  commitChanges = ({ rows, added, changed, deleted }) => {
    console.log(rows, added, changed, deleted)
  }

  render () {
    const { classes, onConfirm } = this.props
    return (
      <div className={classes.container}>
        <EditableTableGrid2
          rows={ClaimSequenceData}
          columns={ClaimSequenceColumns}
          columnExtensions={ClaimSequenceColExtensions}
          column
          onRowDoubleClick={this.onRowDoubleClick}
          EditingProps={{
            showAddCommand: true,
            editingRowIds: this.state.editingRowIds,
            rowChanges: this.state.rowChanges,
            onEditingRowIdsChange: this.changeEditingRowIds,
            onRowChangesChange: this.changeRowChanges,
            onCommitChanges: this.commitChanges,
          }}
          // errors={errors.patientEmergencyContact}
          // schema={pecValidationSchema}
        />
        <div className={classes.saveChangesButton}>
          <Button color='primary' onClick={onConfirm}>
            Save Changes
          </Button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'EditClaimSeq' })(EditClaimSeq)
