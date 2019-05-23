import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Search, Add, Print, Edit } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { status } from '@/utils/codes'
import { compose } from 'redux'

import {
  GridContainer,
  GridItem,
  Select,
  Button,
  TextField,
  DateRangePicker,
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
  const { classes, theme, values } = props
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
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                // this.props.dispatch({
                //   type: 'consumable/query',
                // })
              }}
            >
              <Search />
              <FormattedMessage id='form.search' />
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                // this.props.history.push('/inventory/master/consumable')
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
