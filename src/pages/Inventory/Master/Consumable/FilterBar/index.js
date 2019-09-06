import React from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Search, Add } from '@material-ui/icons'
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
  CodeSelect,
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
                    id: 'inventory.master.consumable.code',
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
                    id: 'inventory.master.consumable.name',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={3}>
          <FastField
            name='supplier'
            render={(args) => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'inventory.master.consumable.supplier',
                  })}
                  code='ctCompany'
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
                    id: 'inventory.master.consumable.status',
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
                const { code, displayValue, supplier, isActive } = values
                dispatch({
                  type: 'consumable/query',
                  payload: {
                    code,
                    displayValue,
                    supplier,
                    isActive,
                  },
                })
              }}
            >
              <Search />
              <FormattedMessage id='form.search' />
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                history.push('/inventory/master/consumable')
              }}
            >
              <Add />
              Add New
            </Button>
            {/* <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'consumable/updateState',
                    payload: {
                      showBatchEditModal: true,
                    },
                  })
                }}
              >
                <GridOn />
                Batch Edit
              </Button> */}
          </div>
        </GridItem>
      </GridContainer>
      {/* <CommonModal
          open={consumable.showBatchEditModal}
          title='Batch Edit'
          bodyNoPadding
          onClose={() => {
            dispatch({
              type: 'consumable/updateState',
              payload: {
                showBatchEditModal: false,
              },
            })
          }}
          // onConfirm={this.toggleModal}
          fullScreen
          showFooter={false}
        >
        </CommonModal> */}
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
