import React, { Component } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import Refresh from '@material-ui/icons/Refresh'
import Print from '@material-ui/icons/Print'
// common component
import { Button, CommonTableGrid2, GridContainer, GridItem } from '@/components'
// sub component
import PatientBanner from './components/PatientBanner'
import style from './style'
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
  tableConfig,
} from './variables'

class Dispense extends Component {
  render () {
    const { classes } = this.props
    return (
      <div>
        <PatientBanner />
        <GridContainer direction='column' className={classes.content}>
          <GridItem justify='flex-end' container>
            <Button color='info'>
              <Refresh />
              Refresh
            </Button>
            <Button color='primary'>
              <Print />
              Print All Label
            </Button>
            <Button color='primary'>
              <Print />
              Print Label
            </Button>
          </GridItem>
          <GridItem className={classes.gridRow}>
            <h5>Prescription</h5>
            <CommonTableGrid2
              size='sm'
              height={200}
              columns={PrescriptionColumns}
              columnExtensions={PrescriptionColumnExtensions}
              rows={PrescriptionTableData}
              {...tableConfig}
            />
          </GridItem>
          <GridItem className={classes.gridRow}>
            <h5>Vaccination</h5>
            <CommonTableGrid2
              size='sm'
              height={150}
              columns={VaccinationColumn}
              columnExtensions={VaccinationColumnExtensions}
              rows={VaccinationData}
              {...tableConfig}
            />
          </GridItem>
          <GridItem className={classes.gridRow}>
            <h5>Other Orders</h5>
            <CommonTableGrid2
              size='sm'
              height={150}
              columns={OtherOrdersColumns}
              columnExtensions={OtherOrdersColumnExtensions}
              rows={OtherOrdersData}
              {...tableConfig}
            />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(style, { name: 'DispenseIndex' })(Dispense)
