import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import Replay from '@material-ui/icons/Replay'

import { GridContainer, GridItem, Select, Button } from '@/components'
import { withStyles, Tooltip } from '@material-ui/core'

const styles = {
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    paddingTop: '13px',
    textAlign: 'left',
  },
}

@connect(({ corporateBilling }) => ({ corporateBilling }))
@withFormik({
  mapPropsToValues: () => {},
})
class FilterBar extends PureComponent {
  handleRefresh = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'corporateBilling/fetchList',
    })
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer spacing={8}>
          <GridItem xs sm={12} md={3}>
            <FastField
              name='ExpenseType'
              render={(args) => {
                return (
                  <Select
                    label={formatMessage({
                      id: 'finance.corporate-billing.status',
                    })}
                    options={[
                      { name: 'Chris', value: 'Chris' },
                      { name: 'Patrik', value: 'Patrik' },
                      { name: 'Teo Jiayan', value: 'Teo Jiayan' },
                      { name: 'Jack', value: 'Jack' },
                      { name: 'Jason', value: 'Jason' },
                      { name: 'Dave', value: 'Dave' },
                    ]}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs sm={12} md={3}>
            <FastField
              name='ExpenseType'
              render={(args) => {
                return (
                  <Select
                    label={formatMessage({
                      id: 'finance.corporate-billing.outstandingBalance',
                    })}
                    options={[
                      { name: 'Chris', value: 'Chris' },
                      { name: 'Patrik', value: 'Patrik' },
                      { name: 'Teo Jiayan', value: 'Teo Jiayan' },
                      { name: 'Jack', value: 'Jack' },
                      { name: 'Jason', value: 'Jason' },
                      { name: 'Dave', value: 'Dave' },
                    ]}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem>
            <div className={classes.filterBtn}>
              <Button
                variant='contained'
                color='primary'
                onClick={this.handleRefresh}
              >
                <Replay />
                <FormattedMessage id='form.refresh' />
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles)(FilterBar)
