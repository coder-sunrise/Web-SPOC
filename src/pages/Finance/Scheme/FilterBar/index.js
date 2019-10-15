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
  Select,
} from '@/components'
import { status } from '@/utils/codes'

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
const FilterBar = ({ classes, dispatch, history, schemeDetail, values }) => {
  return (
    <div className={classes.filterBar}>
      <GridContainer>
        <GridItem xs={6} md={4}>
          <FastField
            name='name'
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
            name='schemeTypeName'
            render={(args) => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'finance.scheme.search.type',
                  })}
                  code='ctSchemeType'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={4}>
          <FastField
            name='schemeCategoryName'
            render={(args) => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'finance.scheme.search.category',
                  })}
                  code='ctSchemeCategory'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={4}>
          <FastField
            name='coPayerFK'
            render={(args) => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'finance.scheme.search.cpname',
                  })}
                  code='ctCopayer'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={4}>
          <FastField
            name='copayerTypeFK'
            render={(args) => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'finance.scheme.search.cptype',
                  })}
                  code='ctCopayerType'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={4}>
          <FastField
            name='isActive'
            render={(args) => {
              return <Select label='Status' {...args} options={status} />
            }}
          />
        </GridItem>
        <GridItem xs={12}>
          <div className={classes.filterBtn}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                const {
                  name,
                  schemeNameType,
                  schemeCategory,
                  coPayerFK,
                  copayerTypeFK,
                  isActive,
                } = values
                dispatch({
                  type: 'copaymentScheme/query',
                  payload: {
                    name,
                    schemeNameType,
                    schemeCategory,
                    coPayerFK,
                    'CopayerFKNavigation.copayerTypeFK': copayerTypeFK,
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
                dispatch({
                  type: 'schemeDetail/updateState',
                  payload: {
                    entity: undefined,
                  },
                })
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
