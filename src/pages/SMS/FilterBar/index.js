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
import { GridContainer, GridItem, Button, RadioGroup } from '@/components'
// sub components
import FilterByAppointment from './FilterByAppointment'
import FilterByPatient from './FilterByPatient'

const styles = (theme) => ({
  filterBar: {
    marginBottom: '10px',
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

const FilterBar = ({ classes, values }) => {
  return (
    <div className={classes.filterBar}>
      <GridContainer alignItems='center'>
        <GridItem xs={6}>
          <FastField
            name='searchBy'
            render={(args) => (
              <RadioGroup
                label='Search By'
                simple
                defaultValue='patient'
                options={[
                  {
                    value: 'appointment',
                    label: formatMessage({ id: 'sms.appointment' }),
                  },
                  {
                    value: 'patient',
                    label: formatMessage({ id: 'sms.patient' }),
                  },
                ]}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={6} />
        {values.SearchBy === 'appointment' ? (
          <FilterByAppointment />
        ) : (
          <FilterByPatient />
        )}
        <GridItem xs={12}>
          <div className={classes.filterBtn}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                // props.dispatch({
                //   type: 'consumable/query',
                // })
              }}
            >
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
  }),
  React.memo,
)(FilterBar)
