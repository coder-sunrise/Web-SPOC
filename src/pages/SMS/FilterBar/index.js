import React from 'react'
import { compose } from 'redux'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { Search } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
// common components
import moment from 'moment'
import { GridContainer, GridItem, Button, RadioGroup } from '@/components'
// sub components
import FilterByAppointment from './FilterByAppointment'
import FilterByPatient from './FilterByPatient'

const styles = (theme) => ({
  filterBar: {
    marginBottom: '20px',
  },
  filterBtn: {
    // paddingTop: '13px',
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
})

const FilterBar = (args) => {
  const { classes, type, handleSubmit } = args
  return (
    <div className={classes.filterBar}>
      <GridContainer>
        {type === 'Appointment' ? (
          <FilterByAppointment {...args} />
        ) : (
          <FilterByPatient />
        )}
        <GridItem xs={12}>
          <div className={classes.filterBtn}>
            <Button variant='contained' color='primary' onClick={handleSubmit}>
              <Search />
              <FormattedMessage id='sms.search' />
            </Button>
          </div>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withFormik({
    mapPropsToValues: () => ({
      SearchBy: 'appointment',
    }),

    handleSubmit: (values, { props, resetForm }) => {
      const {
        patientName,
        consent,
        lastSMSSendStatus,
        lastVisitDate,
        ...restValues
      } = values
      const { dispatch, type } = props

      const payload = {
        group: [
          {
            name: patientName,
            patientAccountNo: patientName,
            'ContactFkNavigation.contactNumber.number': patientName,
            combineCondition: 'or',
          },
        ],
        StatusFK: lastSMSSendStatus,
        'PatientPdpaConsent.IsConsent': consent,
        'lgteql_Visit.VisitDate':
          lastVisitDate && moment(lastVisitDate[0]).formatUTC(),
        'lsteql_Visit.VisitDate':
          lastVisitDate && moment(lastVisitDate[0]).formatUTC(false),
      }
      dispatch({
        type: 'sms/querySMSData',
        payload,
        smsType: type,
      })
    },
  }),
  React.memo,
)(FilterBar)
