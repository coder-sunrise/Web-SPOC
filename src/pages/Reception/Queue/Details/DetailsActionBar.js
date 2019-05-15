import React, { PureComponent } from 'react'
import classNames from 'classnames'
// umi locale
import { FormattedMessage, formatMessage } from 'umi/locale'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import { Stop, Create } from '@material-ui/icons'
// custom components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardText,
  GridContainer,
  GridItem,
  TextField,
} from '@/components'
// sub component
import StatisticIndicator from './StatisticIndicator'

const styles = () => ({
  cardTitle: {
    marginTop: '0',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
  rightButtons: { float: 'right' },
  actionBar: { marginBottom: '10px' },
  spacing: {
    marginBottom: '10px',
  },
  sessionNo: {
    float: 'left',
  },
  toolBtns: {
    float: 'right',
    marginTop: '15px',
  },
})

@withFormik({
  mapPropsToValues: () => ({
    SessionNo: '190410-01-1.0',
  }),
})
class DetailsActionBar extends PureComponent {
  render () {
    const options = [
      { name: 'All doctor', value: 'all' },
      { name: 'Cheah', value: 'cheah' },
      { name: 'Joseph', value: 'Joseph' },
    ]
    const { classes, togglePatientSearch } = this.props
    const sessionNo = '190321-02'
    return (
      <GridContainer classes={{ grid: classes.actionBar }} spacing={8}>
        <GridItem xs md={3}>
          <FastField
            name='PatientName'
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
        <GridItem xs md={1} container alignItems='center'>
          <Button color='primary' onClick={togglePatientSearch}>
            <Create />
            <FormattedMessage id='reception.queue.registerVisit' />
          </Button>
        </GridItem>
        <GridItem xs md={8} container justify='flex-end' alignItems='center'>
          <StatisticIndicator />
        </GridItem>
      </GridContainer>
    )
    // return (
    //   <GridContainer className={classNames(classes.spacing)}>
    //     <GridItem xs md={4}>
    //       <FastField
    //         name='SessionNo'
    //         render={(args) => (
    //           <TextField
    //             {...args}
    //             readOnly
    //             prefixProps={{
    //               disableTypography: true,
    //               style: { width: '25%' },
    //             }}
    //             prefix={formatMessage({
    //               id: 'reception.queue.sessionNo',
    //             })}
    //           />
    //         )}
    //       />
    //     </GridItem>
    //     <GridItem xs md={8} container justify='flex-end' alignItems='center'>
    //       <Button color='danger' onClick={this.toggleDrawer}>
    //         <Stop />
    //         <FormattedMessage id='reception.queue.endSession' />
    //       </Button>
    //     </GridItem>
    //   </GridContainer>
    // )
  }
}

export default withStyles(styles)(DetailsActionBar)
