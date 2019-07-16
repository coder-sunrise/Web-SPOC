import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { FormattedMessage } from 'umi/locale'
import { standardRowHeight } from 'mui-pro-jss'
import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  Select,
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
  tansactionCheck: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    right: 0,
  },
})

@withFormik({
  handleSubmit: () => {},
  displayName: 'PublicHolidayFilter',
})
class Filter extends PureComponent {
  render () {
    const { classes } = this.props

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={4}>
            <FastField
              name='code'
              render={(args) => {
                return <TextField label='Code/Display Value' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='status'
              render={(args) => {
                return <Select label='Status' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  const prefix = this.props.values.isExactSearch
                    ? 'eql_'
                    : 'like_'
                  this.props.dispatch({
                    type: 'settingPublicHoliday/query',
                    payload: {
                      [`${prefix}name`]: this.props.values.search,
                    },
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.toggleModal()
                  this.props.dispatch({
                    type: 'settingPublicHoliday/reset',
                  })
                }}
              >
                Add New
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Filter
