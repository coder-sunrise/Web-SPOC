import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { AccountCircle, Search, Replay, Person, Apps } from '@material-ui/icons'

import { withStyles, Tooltip } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { getAppendUrl } from '@/utils/utils'

import {
  GridContainer,
  GridItem,
  Select,
  Button,
  TextField,
  NumberField,
  Checkbox,
  DatePicker,
} from '@/components'

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
  tansactionCheck: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    right: 14,
  },
})

@withFormik({
  mapPropsToValues: () => {},
})
class FilterBar extends PureComponent {
  render () {
    const { classes, dispatch, theme } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs sm={12} md={4} style={{ position: 'relative' }}>
            <FastField
              name='Invoice'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'finance.invoice.search.invoice',
                    })}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>

          <GridItem xs sm={12} md={4}>
            <FastField
              name='Start'
              render={(args) => (
                <DatePicker
                  label={formatMessage({
                    id: 'finance.invoice.search.start',
                  })}
                  timeFormat={false}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={12} md={3}>
            <FastField
              name='End'
              render={(args) => (
                <DatePicker
                  label={formatMessage({
                    id: 'finance.invoice.search.end',
                  })}
                  timeFormat={false}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={12} md={1}>
            <FastField
              name='isExactSearch'
              render={(args) => {
                return (
                  <Tooltip
                    title={formatMessage({
                      id: 'finance.invoice.search.all',
                    })}
                    placement='bottom'
                  >
                    <Checkbox
                      label={formatMessage({
                        id: 'finance.invoice.search.all',
                      })}
                      {...args}
                    />
                  </Tooltip>
                )
              }}
            />
          </GridItem>
          <GridItem xs sm={12} md={4}>
            <FastField
              name='PatientRef'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'finance.invoice.search.patient.ref',
                    })}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>

          <GridItem xs sm={12} md={4}>
            <FastField
              name='Balance'
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'finance.invoice.search.balance',
                  })}
                  options={[
                    { name: 'Yes', value: '1' },
                    { name: 'No', value: '0' },
                  ]}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={12} md={4}>
            <FastField
              name='PatientName'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'finance.invoice.search.patient',
                    })}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>

          <GridItem xs sm={12} md={4}>
            <FastField
              name='Status'
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'finance.invoice.search.status',
                  })}
                  options={[
                    { name: 'New', value: '0' },
                    { name: 'Finalised', value: '1' },
                  ]}
                  {...args}
                />
              )}
            />
          </GridItem>

          <GridItem xs sm={12} md={4}>
            <FastField
              name='AdHoc'
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'finance.invoice.search.adhoc',
                  })}
                  options={[
                    { name: 'Yes', value: '1' },
                    { name: 'No', value: '0' },
                  ]}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={12} md={4}>
            <div className={classes.filterBtn}>
              <Button variant='contained' color='primary' type='submit'>
                <Search />
                <FormattedMessage id='form.submit' />
              </Button>
              <Button variant='contained' type='reset'>
                <Replay />
                <FormattedMessage id='form.reset' />
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FilterBar)
