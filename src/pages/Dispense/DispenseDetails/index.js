import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// sub components
import TableData from './TableData'
// common component
import { GridItem } from '@/components'
// variables
import {
  PrescriptionColumns,
  PrescriptionColumnExtensions,
  PrescriptionTableData,
  VaccinationColumn,
  VaccinationColumnExtensions,
  VaccinationData,
  OtherOrdersColumns,
  OtherOrdersColumnExtensions,
  OtherOrdersData,
} from '../variables'

const styles = (theme) => ({
  gridRow: {
    margin: `${theme.spacing.unit}px 0px`,
    '& > h5': {
      padding: theme.spacing.unit,
    },
  },
})

const DispenseDetails = ({ classes }) => {
  return (
    <React.Fragment>
      <GridItem className={classes.gridRow}>
        <TableData
          title='Medication'
          height={200}
          columns={PrescriptionColumns}
          colExtensions={PrescriptionColumnExtensions}
          data={PrescriptionTableData}
        />
      </GridItem>
      <GridItem className={classes.gridRow}>
        <TableData
          title='Vaccination'
          height={150}
          columns={VaccinationColumn}
          colExtensions={VaccinationColumnExtensions}
          data={VaccinationData}
        />
      </GridItem>
      <GridItem className={classes.gridRow}>
        <TableData
          title='Other Orders'
          height={150}
          columns={OtherOrdersColumns}
          colExtensions={OtherOrdersColumnExtensions}
          data={OtherOrdersData}
        />
      </GridItem>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'DispenseDetails' })(DispenseDetails)
