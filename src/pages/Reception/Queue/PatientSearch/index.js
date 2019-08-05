import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { connect } from 'dva'
// formik
import { FastField, withFormik } from 'formik'
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
  ProgressButton,
  TextField,
  CommonTableGrid,
} from '@/components'
import ViewDetailsButton from './ViewDetailsBtn'

const styles = () => ({
  spacing: {
    marginBottom: '10px',
  },
})

@connect(({ queueLog, loading }) => ({ queueLog, loading }))
@withFormik({
  mapPropsToValues: () => ({
    search: '',
  }),
})
class PatientSearch extends PureComponent {
  state = {
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
    onViewRegisterVisit({ patientID })
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
    const { dispatch, values } = this.props

    dispatch({
      type: 'queueLog/fetchPatientListByName',
      payload: values.search,
    })
  }

  render () {
    const { columns, columnExtensions } = this.state
    const { classes, queueLog, onViewRegisterPatient, loading } = this.props
    const ActionProps = { TableCellComponent: this.TableCell }

    return (
      <React.Fragment>
        <GridContainer className={classNames(classes.spacing)}>
          <GridItem xs md={6}>
            <FastField
              name='search'
              render={(args) => (
                <TextField
                  {...args}
                  label={formatMessage({
                    id: 'reception.queue.patientName',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={4} container alignItems='center'>
            <ProgressButton
              color='primary'
              size='sm'
              icon={<Search />}
              onClick={this.searchPatient}
              submitKey='queueLog/fetchPatientListByName'
            >
              <FormattedMessage id='reception.queue.search' />
            </ProgressButton>
            <Button color='primary' size='sm' onClick={onViewRegisterPatient}>
              <PersonAdd />
              <FormattedMessage id='reception.queue.patientSearch.registerNewPatient' />
            </Button>
          </GridItem>
        </GridContainer>

        <div style={{ marginBottom: '5px' }}>
          <CommonTableGrid
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
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(PatientSearch)
