import React, { Component } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  Button,
  CommonTableGrid,
  GridContainer,
  GridItem,
  CodeSelect,
} from '@/components'
// data table variable
import { CoPayerColumns, CoPayerColExtensions, CoPayerData } from '../variables'

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit,
  },
  dropdown: {
    marginBottom: theme.spacing.unit,
  },
  saveChangesButton: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
})

class CoPayer extends Component {
  state = {
    editingRowIds: [],
    rowChanges: [],
    selectedRows: [],
    coPayer: 'AIA',
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

  handleSelectionChange = (selection) => {
    this.setState({ selectedRows: selection })
  }

  handleCopayerChange = (value) => {
    this.setState({ coPayer: value })
  }

  render () {
    const { classes, onConfirm } = this.props
    const { selectedRows, coPayer } = this.state
    return (
      <div className={classes.container}>
        <GridContainer>
          <GridItem md={4} className={classes.dropdown}>
            <CodeSelect
              label='Corporate Copayer'
              code='ctcopayer'
              onChange={this.handleCopayerChange}
            />
          </GridItem>
          <GridItem md={12}>
            <CommonTableGrid
              size='sm'
              rows={CoPayerData}
              columns={CoPayerColumns}
              columnExtensions={CoPayerColExtensions}
              // onRowDoubleClick={this.onRowDoubleClick}
              // EditingProps={{
              //   editingRowIds: this.state.editingRowIds,
              //   rowChanges: this.state.rowChanges,
              //   onEditingRowIdsChange: this.changeEditingRowIds,
              //   onRowChangesChange: this.changeRowChanges,
              //   onCommitChanges: this.commitChanges,
              // }}
              selection={selectedRows}
              onSelectionChange={this.handleSelectionChange}
              FuncProps={{
                selectable: true,
                selectConfig: { showSelectAll: true },
              }}
              // errors={errors.patientEmergencyContact}
              // schema={pecValidationSchema}
            />
          </GridItem>
        </GridContainer>
        <div className={classes.saveChangesButton}>
          <Button color='primary' onClick={onConfirm}>
            Add Copayer
          </Button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'CoPayer' })(CoPayer)
