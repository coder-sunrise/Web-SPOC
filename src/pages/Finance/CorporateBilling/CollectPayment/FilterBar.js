import React, { PureComponent } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { FastField, withFormik } from 'formik'
import { withStyles, Paper } from '@material-ui/core'

import { GridContainer, GridItem, DatePicker, Button } from '@/components'
import FilterList from '@material-ui/icons/FilterList'

const styles = () => ({
  filterBar: {
    padding: '0 10px 10px 10px',
    marginBottom: '10px',
  },
  filterBtn: {
    paddingTop: '13px',
    textAlign: 'left',
  },
})

@withFormik({ mapPropsToValues: () => {} })
class FilterBar extends PureComponent {
  render () {
    const { classes } = this.props

    return (
      <Paper className={classes.filterBar}>
        <GridContainer>
          <GridItem xs sm={12} md={3}>
            <FastField
              name='StartDate'
              render={(args) => (
                <DatePicker
                  label={formatMessage({
                    id: 'form.date.placeholder.start',
                  })}
                  timeFormat={false}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={12} md={3}>
            <FastField
              name='EndDate'
              render={(args) => (
                <DatePicker
                  label={formatMessage({
                    id: 'form.date.placeholder.end',
                  })}
                  timeFormat={false}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={12} md={3}>
            <div className={classes.filterBtn}>
              <Button color='rose'>
                <FilterList />
                <FormattedMessage id='form.filter' />
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </Paper>
    )
  }
}

export default withStyles(styles)(FilterBar)
