import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi'
import { connect } from 'dva'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import { status } from '@/utils/codes'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  Select,
  ProgressButton,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ settingTag }) => ({
    ...(settingTag.filter || {}),
    isActive: true,
  }),
  handleSubmit: () => {},
  displayName: 'TagFilter',
})
class Filter extends PureComponent {
  render() {
    const { classes, tagCategoryOptions } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='tagDisplayValue'
              render={args => {
                return <TextField label='Display Value' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='category'
              render={args => {
                return (
                  <Select
                    label='Category'
                    options={tagCategoryOptions}
                    {...args}
                  />
                )
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
                onClick={() => {
                  const {
                    tagDisplayValue,
                    isActive,
                    category,
                  } = this.props.values
                  this.props.dispatch({
                    type: 'settingTag/query',
                    payload: {
                      isActive,
                      eql_category: category,
                      displayValue: tagDisplayValue,
                    },
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingTag/updateState',
                    payload: {
                      entity: undefined,
                    },
                  })
                  this.props.toggleModal()
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
}

export default Filter
