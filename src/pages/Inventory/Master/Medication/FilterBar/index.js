import React from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Search, Add } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { compose } from 'redux'
import { status } from '@/utils/codes'
import Authorized from '@/utils/Authorized'

import {
  GridContainer,
  GridItem,
  Select,
  Button,
  TextField,
  CodeSelect,
  ProgressButton,
} from '@/components'

const styles = (theme) => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
})

const FilterBar = ({ classes, dispatch, history, values }) => {
  return (
    <div className={classes.filterBar}>
      <GridContainer>
        <GridItem xs={6} md={3}>
          <FastField
            name='code'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.master.medication.code',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={3}>
          <FastField
            name='displayValue'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.master.medication.name',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={3}>
          <FastField
            name='favouriteSupplierFK'
            render={(args) => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'inventory.master.medication.supplier',
                  })}
                  labelField='displayValue'
                  code='ctSupplier'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={3}>
          <FastField
            name='isActive'
            render={(args) => {
              return (
                <Select
                  label={formatMessage({
                    id: 'inventory.master.medication.status',
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
                const {
                  code,
                  displayValue,
                  favouriteSupplierFK,
                  isActive,
                } = values
                dispatch({
                  type: 'medication/query',
                  payload: {
                    keepFilter: false,
                    code,
                    displayValue,
                    favouriteSupplierFK,
                    isActive,
                  },
                })
              }}
            >
              <FormattedMessage id='form.search' />
            </ProgressButton>
            <Authorized authority='inventorymaster.newinventoryitem'>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  dispatch({
                    type: 'medicationDetail/updateState',
                    payload: {
                      entity: undefined,
                      currentId: undefined,
                      sddCode: undefined,
                      sddDescription: undefined,
                    },
                  })
                  history.push('/inventory/master/medication')
                }}
              >
                <Add />
                Add New
              </Button>
            </Authorized>
            {/* <Button
              variant='contained'
              color='primary'
              onClick={() => {
                // this.props.history.push(
                //   getAppendUrl({
                //     md: 'pt',
                //     cmt: '1',
                //     new: 1,
                //   }),
                // )
              }}
            >
              <GridOn />
              Batch Edit
            </Button> */}
          </div>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withFormik({
    mapPropsToValues: () => {},
  }),
  React.memo,
)(FilterBar)
