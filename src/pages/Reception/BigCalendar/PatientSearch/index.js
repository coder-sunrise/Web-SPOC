import React, { PureComponent } from 'react'
import classNames from 'classnames'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// table grid component
import { Table } from '@devexpress/dx-react-grid-material-ui'
// material ui
import { withStyles } from '@material-ui/core'
import { Search, PersonAdd } from '@material-ui/icons'
// custom component
import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  CommonTableGrid2,
  Danger,
} from '@/components'
import ActionButton from './GridActionButton'

const styles = () => ({
  spacing: {
    marginBottom: '10px',
  },
})

class PatientSearch extends PureComponent {
  state = {
    searchQuery: this.props.searchPatientName,
    selectedPatient: [],
    showError: false,
    columns: [
      { name: 'name', title: 'Name' },
      { name: 'patientAccountNo', title: 'ID' },
      { name: 'gender', title: 'Gender' },
      { name: 'age', title: 'Age' },
      { name: 'mobileNo', title: 'Contact' },
    ],
    columnExtensions: [
      { columnName: 'name', width: 200 },
    ],
  }

  gridGetRowID = (row) => row.id

  searchPatient = () => {
    const { searchQuery } = this.state
    const { handleSearchPatient } = this.props
    handleSearchPatient(searchQuery)
    // dispatch({
    //   type: 'appointment/fetchPatientListByName',
    //   payload: searchQuery,
    // })
  }

  onSearchQueryChange = (event) => {
    this.setState({ searchQuery: event.target.value })
  }

  handleSelectionChange = (selection) => {
    const { selectedPatient } = this.state
    const filtered = selection.filter(
      (patientID) => !selectedPatient.includes(patientID),
    )
    this.setState({ selectedPatient: filtered })
  }

  onSelectClick = () => {
    const { onSelectClick } = this.props
    const { selectedPatient } = this.state
    selectedPatient.length === 1 && onSelectClick(selectedPatient[0])
    this.setState({ showError: selectedPatient.length === 0 })
  }

  render () {
    const {
      columns,
      columnExtensions,
      searchQuery,
      selectedPatient,
      showError,
    } = this.state

    const { classes, onBackClick, patientList } = this.props

    return (
      <React.Fragment>
        <GridContainer className={classNames(classes.spacing)}>
          <GridItem xs md={6}>
            <TextField
              value={searchQuery}
              onChange={this.onSearchQueryChange}
              help='Leave blank to list all patient'
              label={formatMessage({
                id: 'reception.queue.patientName',
              })}
            />
          </GridItem>
          <GridItem xs md={2} container alignItems='center'>
            <Button color='primary' onClick={this.searchPatient}>
              <Search />
              <FormattedMessage id='reception.queue.search' />
            </Button>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs md={12}>
            {showError && (
              <Danger>
                <h3>Please select a patient</h3>
              </Danger>
            )}
          </GridItem>
          <GridItem xs md={12} style={{ marginBottom: '5px' }}>
            <CommonTableGrid2
              rows={patientList}
              columnExtensions={columnExtensions}
              columns={columns}
              getRowId={this.gridGetRowID}
              selection={selectedPatient}
              onSelectionChange={this.handleSelectionChange}
              FuncProps={{ selectable: true }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer justify='flex-end' alignItems='center'>
          <GridItem>
            <Button color='danger' onClick={onBackClick}>
              Back
            </Button>
          </GridItem>
          <GridItem>
            <Button color='primary' onClick={this.onSelectClick}>
              Select
            </Button>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(PatientSearch)
