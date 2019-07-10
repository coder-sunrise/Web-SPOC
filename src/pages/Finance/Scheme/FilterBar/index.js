import React from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Search, Add } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { compose } from 'redux'
import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  CodeSelect,
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
const FilterBar = ({ classes, dispatch, history }) => {
  return (
    <div className={classes.filterBar}>
      <GridContainer>
        <GridItem xs={6} md={4}>
          <FastField
            name='schemeName'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'finance.scheme.search.name',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={4}>
          <FastField
            name='schemeNameType'
            render={(args) => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'finance.scheme.search.type',
                  })}
                  code='Gender'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={4}>
          <FastField
            name='schemeCategory'
            render={(args) => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'finance.scheme.search.category',
                  })}
                  code='Gender'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={4}>
          <FastField
            name='Co-Pyaer Name'
            render={(args) => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'finance.scheme.search.cpname',
                  })}
                  code='Gender'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={4}>
          <FastField
            name='Co-Pyaer Type'
            render={(args) => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'finance.scheme.search.cptype',
                  })}
                  code='Gender'
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
                <CodeSelect
                  label={formatMessage({
                    id: 'finance.scheme.search.status',
                  })}
                  code='Gender'
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
                  type: 'scheme/query',
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
                history.push('/finance/scheme/details')
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
    mapPropsToValues: () => {},
  }),
  React.memo,
)(FilterBar)
