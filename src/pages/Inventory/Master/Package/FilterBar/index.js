import React from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Search, Add, GridOn } from '@material-ui/icons'
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
  const { classes, dispatch, history } = props
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
                    id: 'inventory.master.package.code',
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
                    id: 'inventory.master.package.name',
                  })}
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
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                dispatch({
                  type: 'pack/query',
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
                history.push('/inventory/master/package')
              }}
            >
              <Add />
              Add New
            </Button>

            {/* <Button
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
)(FilterBar)
