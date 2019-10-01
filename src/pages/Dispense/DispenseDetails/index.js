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
  VaccinationColumn,
  VaccinationColumnExtensions,
  OtherOrdersColumns,
  OtherOrdersColumnExtensions,
} from '../variables'

// const styles = (theme) => ({
//   gridRow: {
//     margin: `${theme.spacing.unit}px 0px`,
//     '& > h5': {
//       padding: theme.spacing.unit,
//     },
//   },
// })

const DispenseDetails = ({ classes, dispense }) => {
  const { entity } = dispense
  const { prescription, vaccination, otherOrder } = entity
  console.log(prescription, vaccination, otherOrder, dispense)
  return (
    <React.Fragment>
      <GridItem className={classes.gridRow}>
        <TableData
          title='Prescription'
          height={200}
          columns={PrescriptionColumns}
          colExtensions={PrescriptionColumnExtensions}
          data={prescription}
        />
      </GridItem>
      <GridItem className={classes.gridRow}>
        <TableData
          title='Vaccination'
          height={150}
          columns={VaccinationColumn}
          colExtensions={VaccinationColumnExtensions}
          data={vaccination}
        />
      </GridItem>
      <GridItem className={classes.gridRow}>
        <TableData
          title='Other Orders'
          height={150}
          columns={OtherOrdersColumns}
          colExtensions={OtherOrdersColumnExtensions}
          data={otherOrder}
        />
      </GridItem>
    </React.Fragment>
  )
}

export default DispenseDetails
