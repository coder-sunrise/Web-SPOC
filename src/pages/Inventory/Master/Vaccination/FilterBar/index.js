import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Search, Add, GridOn } from '@material-ui/icons'
import { withStyles, Tooltip } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { getAppendUrl } from '@/utils/utils'
import { status } from '@/utils/codes'

import {
  GridContainer,
  GridItem,
  Select,
  Button,
  TextField,
  NumberField,
  Checkbox,
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
          <GridItem xs={6} md={4}>
            <FastField
              name='Code'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'inventory.master.vaccination.code',
                    })}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='Name'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'inventory.master.vaccination.name',
                    })}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='Vaccination Group'
              render={(args) => {
                return (
                  <Select
                    label={formatMessage({
                      id: 'inventory.master.vaccination.group',
                    })}
                    options={[]}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='Supplier'
              render={(args) => {
                return (
                  <Select
                    label={formatMessage({
                      id: 'inventory.master.vaccination.supplier',
                    })}
                    options={[]}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='Status'
              render={(args) => {
                return (
                  <Select
                    label={formatMessage({
                      id: 'inventory.master.vaccination.status',
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
                    type: 'vaccination/query',
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
                  this.props.history.push('/inventory/master/vaccination')
                }}
              >
                <Add />
                Add New
              </Button>

              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  // this.props.history.push(
                  //   getAppendUrl({
                  //     md: 'pt',
                  //     cmt: 'dmgp',
                  //     new: 1,
                  //   }),
                  // )
                }}
              >
                <GridOn />
                Batch Edit
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FilterBar)
