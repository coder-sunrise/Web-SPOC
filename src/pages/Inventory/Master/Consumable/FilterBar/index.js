import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Search, Add, GridOn } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { status } from '@/utils/codes'
import ExcelGrid from '../ExcelGrid'

import {
  CommonModal,
  GridContainer,
  GridItem,
  Select,
  Button,
  TextField,
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
    const { classes, theme, dispatch, consumable } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='Code'
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
              name='Name'
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
              name='Supplier'
              render={(args) => {
                return (
                  <Select
                    label={formatMessage({
                      id: 'inventory.master.consumable.supplier',
                    })}
                    options={[]}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='Status'
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
                  this.props.dispatch({
                    type: 'consumable/query',
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
                  this.props.history.push('/inventory/master/consumable')
                }}
              >
                <Add />
                Add New
              </Button>
              <Button
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
              </Button>
            </div>
          </GridItem>
        </GridContainer>
        <CommonModal
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
          <ExcelGrid />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FilterBar)
