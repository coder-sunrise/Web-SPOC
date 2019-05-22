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
import { IconButton, withStyles, LinearProgress } from '@material-ui/core'
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
@withFormik({
  mapPropsToValues: () => ({
    patientName: '',
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
    const { dispatch, values } = this.props
    const { patientName } = values

    dispatch({
      type: 'queueLog/fetchPatientListByName',
      payload: patientName,
    })
  }

  render () {
    const { columns, columnExtensions } = this.state
    const { classes, queueLog, loading, onViewRegisterPatient } = this.props
    const ActionProps = { TableCellComponent: this.TableCell }

    return (
      <React.Fragment>
        <GridContainer className={classNames(classes.spacing)}>
          <GridItem xs md={6}>
            <FastField
              name='patientName'
              render={(args) => (
                <TextField
                  {...args}
                  help='Leave blank to list all patient'
                  label={formatMessage({
                    id: 'reception.queue.patientName',
                  })}
                />
              )}
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
