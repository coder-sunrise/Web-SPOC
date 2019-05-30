import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { connect } from 'dva'
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
} from '@/components'
import ViewDetailsButton from './ViewDetailsBtn'

const styles = () => ({
  spacing: {
    marginBottom: '10px',
  },
})

@connect(({ queueLog, loading }) => ({ queueLog, loading }))
class PatientSearch extends PureComponent {
  state = {
    searchQuery: this.props.searchPatientName,
    columns: [
      { name: 'name', title: 'Name' },
      { name: 'patientAccountNo', title: 'ID' },
      { name: 'gender', title: 'Gender' },
      { name: 'age', title: 'Age' },
      { name: 'mobileNo', title: 'Contact' },
      { name: 'Action', title: 'Action' },
    ],
    columnExtensions: [
      { columnName: 'name', width: 200 },
      { columnName: 'Action', align: 'center' },
    ],
  }

  viewPatientInfo = (patientID) => {
    const { onViewRegisterVisit } = this.props
    onViewRegisterVisit(patientID)
  }

  Cell = (props) => {
    const { column, row } = props
    if (column.name === 'Action') {
      return (
        <Table.Cell {...props}>
          <ViewDetailsButton row={row} onClick={this.viewPatientInfo} />
        </Table.Cell>
      )
    }
    return <Table.Cell {...props} />
  }

  TableCell = (props) => {
    return this.Cell({ ...props })
  }

  gridGetRowID = (row) => row.id

  searchPatient = () => {
    const { dispatch, searchPatientName } = this.props

    dispatch({
      type: 'queueLog/fetchPatientListByName',
      payload: searchPatientName,
    })
  }

  onSearchQueryChange = (event) => {
    this.setState({ searchQuery: event.target.value })
  }

  render () {
    const { columns, columnExtensions, searchQuery } = this.state
    const { classes, queueLog, onViewRegisterPatient, loading } = this.props
    const ActionProps = { TableCellComponent: this.TableCell }

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
          <GridItem xs md={4} container justify='flex-end' alignItems='center'>
            <Button color='primary' onClick={onViewRegisterPatient}>
              <PersonAdd />
              <FormattedMessage id='reception.queue.patientSearch.registerNewPatient' />
            </Button>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs md={12} style={{ marginBottom: '5px' }}>
            <CommonTableGrid2
              height={400}
              rows={queueLog.patientList}
              columnExtensions={columnExtensions}
              ActionProps={ActionProps}
              columns={columns}
              LoadingProps={{
                isLoading: !!loading.effects['queueLog/fetchPatientListByName'],
                loadingMessage: (
                  <FormattedMessage id='reception.queue.patientSearch.retrieving' />
                ),
              }}
              getRowId={this.gridGetRowID}
              FuncProps={{ pager: false }}
            />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(PatientSearch)
