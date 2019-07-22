import React, { PureComponent } from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// custom components
import {
  Button,
  CommonCard,
  CommonModal,
  GridContainer,
  EditableTableGrid2,
  GridItem,
} from '@/components'
import FormField from './formField'
import AddParticipantModal from './AddParticipantModal'

const styles = (theme) => ({
  addSpacing: {
    margin: `${theme.spacing(2)}px 0px`,
  },
})

const columns = [
  { name: 'participantName', title: 'Participant Name' },
  { name: 'participantRole', title: 'Participant Role' },
]

const colExtensions = [
  {
    columnName: 'participantRole',
    type: 'select',
    options: [
      { name: 'Admin', value: '001' },
      { name: 'Nurse', value: '002' },
      { name: 'Doctor', value: '003' },
    ],
  },
]

class ParticipantCard extends PureComponent {
  state = {
    showAddParticipants: false,
    editingRowIds: [],
    rowChanges: [],
  }

  changeEditingRowIds = (editingRowIds) => {
    this.setState({ editingRowIds })
  }

  changeRowChanges = (rowChanges) => {
    this.setState({ rowChanges })
  }

  handleCommitChanges = ({ rows, deleted }) => {}

  toggleShowAddParticipants = () => {
    const { showAddParticipants } = this.state
    this.setState({ showAddParticipants: !showAddParticipants })
  }

  render () {
    const { classes } = this.props
    const { showAddParticipants } = this.state
    return (
      <CommonCard size='sm' title='Participant'>
        <GridContainer>
          <GridItem className={classes.addSpacing}>
            <Button
              color='primary'
              size='sm'
              onClick={this.toggleShowAddParticipants}
            >
              Add Participant
            </Button>
          </GridItem>

          <GridItem xs md={12}>
            <EditableTableGrid2
              rows={[]}
              columns={columns}
              columnExtensions={colExtensions}
              EditingProps={{
                showAddCommand: false,
                editingRowIds: this.state.editingRowIds,
                rowChanges: this.state.rowChanges,
                onEditingRowIdsChange: this.changeEditingRowIds,
                onRowChangesChange: this.changeRowChanges,
                onCommitChanges: this.handleCommitChanges,
              }}
            />
          </GridItem>
        </GridContainer>
        <CommonModal
          open={showAddParticipants}
          onClose={this.toggleShowAddParticipants}
          onConfirm={this.toggleShowAddParticipants}
        >
          <AddParticipantModal />
        </CommonModal>
      </CommonCard>
    )
  }
}

export default withStyles(styles, { name: 'ParticipantCard' })(ParticipantCard)
