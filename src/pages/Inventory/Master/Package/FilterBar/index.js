import React from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
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
              return <TextField label='Package Code' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={6} md={3}>
          <FastField
            name='displayValue'
            render={(args) => {
              return <TextField label='Package Name' {...args} />
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
                    id: 'inventory.master.package.status',
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
                const { code, displayValue, isActive } = values
                dispatch({
                  type: 'inventoryPackage/query',
                  payload: {
                    code,
                    displayValue,
                    isActive,
                    isUserMaintainable: true,
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
                    type: 'packageDetail/updateState',
                    payload: {
                      entity: undefined,
                      currentId: undefined,
                    },
                  })
                  history.push('/inventory/master/package')
                }}
              >
                <Add />
                Add New
              </Button>
            </Authorized>
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
