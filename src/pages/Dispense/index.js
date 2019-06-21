import React, { Component } from 'react'
import router from 'umi/router'
// material ui
import { withStyles } from '@material-ui/core'
import Refresh from '@material-ui/icons/Refresh'
import Print from '@material-ui/icons/Print'
// common component
import { Button, GridContainer, GridItem } from '@/components'
// sub component
import PatientBanner from './components/PatientBanner'
import TableData from './components/TableData'
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
} from './variables'

class Dispense extends Component {
  makePayment = () => {
    const { location } = this.props
    this.props.history.push(`${location.pathname}/billing`)
  }

  render () {
    const { classes } = this.props
    return (
      <div>
        <PatientBanner />
        <GridContainer direction='column' className={classes.content}>
          <GridItem justify='flex-end' container>
            <Button color='info' size='sm' disabled>
              <Refresh />
              Refresh
            </Button>
            <Button color='primary' size='sm' disabled>
              <Print />
              Print All Label
            </Button>
            <Button color='primary' size='sm' disabled>
              <Print />
              Print Label
            </Button>
          </GridItem>
          <GridItem className={classes.gridRow}>
            <TableData
              title='Prescription'
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
              title='Vaccination'
              height={150}
              columns={OtherOrdersColumns}
              colExtensions={OtherOrdersColumnExtensions}
              data={OtherOrdersData}
            />
          </GridItem>
          <GridItem justify='flex-end' container className={classes.footerRow}>
            <Button color='success' size='sm' disabled>
              Save Dispense
            </Button>
            <Button color='primary' size='sm' disabled>
              Edit Order
            </Button>
            <Button color='primary' size='sm' onClick={this.makePayment}>
              Make Payment
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(style, { name: 'DispenseIndex' })(Dispense)
