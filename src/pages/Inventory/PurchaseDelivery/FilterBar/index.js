import React from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { compose } from 'redux'
import { status } from '@/utils/codes'

import {
  GridContainer,
  GridItem,
  Select,
  Button,
  TextField,
  DateRangePicker,
  ProgressButton,
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
})

const FilterBar = (props) => {
  const onDateRangeChange = (name, value) => {
    const { setFieldValue } = props
    setFieldValue(name, value)
  }
  const { classes, values, history } = props
  return (
    <div className={classes.filterBar}>
      <GridContainer>
        <GridItem xs={6} md={6}>
          <FastField
            name='PONo'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.pd.code',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={6}>
          <DateRangePicker
            nameDateFrom='PO Date'
            nameDateTo='To'
            handleChange={onDateRangeChange}
            values={values}
          />
        </GridItem>
        <GridItem xs={6} md={6}>
          <FastField
            name='Supplier'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.pd.supplier',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={6}>
          <FastField
            name='Status'
            render={(args) => {
              return (
                <Select
                  label={formatMessage({
                    id: 'inventory.pd.status',
                  })}
                  options={status}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={12}>
          <div className={classes.filterBtn}>
            <ProgressButton
              icon={<Search />}
              variant='contained'
              color='primary'
              onClick={() => {
                // this.props.dispatch({
                //   type: 'consumable/query',
                // })
              }}
            >
              <FormattedMessage id='form.search' />
            </ProgressButton>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                history.push('/inventory/pd/detail')
              }}
            >
              <Add />
              Add New
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
    mapPropsToValues: () => ({}),
  }),
  React.memo,
)(FilterBar)
