import React from 'react'
import {
  withFormikExtend,
  GridContainer,
  GridItem,
  Button,
  TextField,
  Select,
  ProgressButton,
} from '@/components'
import { status } from '@/utils/codes'
import { FastField } from 'formik'
import { compose } from 'redux'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import { FormattedMessage } from 'umi'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { withStyles } from '@material-ui/core/styles'

let _styles = withStyles(
  theme => ({
    ...basicStyle(theme),
  }),
  { withTheme: true },
)

let _withFormikExtend = withFormikExtend({
  handleSubmit: (values, { props: { dispatch } }) => {
    let { codeDisplayValue, isActive } = values
    dispatch({
      type: 'settingGradingChart/query',
      payload: {
        isActive,
        group: [
          {
            code: codeDisplayValue,
            displayValue: codeDisplayValue,
            combineCondition: 'or',
          },
        ],
      },
    })
  },
})

let Filter = props => {
  let { dispatch, handleSubmit, classes } = props
  return (
    <div className={classes.filterBar}>
      <GridContainer>
        <GridItem xs={6} md={3}>
          <FastField
            name='codeDisplayValue'
            render={args => {
              return <TextField label='Code / Display Value' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={6} md={2}>
          <FastField
            name='isActive'
            render={args => {
              return <Select label='Status' options={status} {...args} />
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem>
          <div className={classes.filterBtn}>
            <ProgressButton
              color='primary'
              icon={<Search />}
              type='submit'
              onClick={handleSubmit}
            >
              <FormattedMessage id='form.search' />
            </ProgressButton>

            <Button
              color='primary'
              onClick={() => {
                dispatch({
                  type: 'settingGradingChart/updateState',
                  payload: {
                    entity: undefined,
                    showModal: true,
                  },
                })
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
export default compose(_withFormikExtend, _styles)(Filter)
