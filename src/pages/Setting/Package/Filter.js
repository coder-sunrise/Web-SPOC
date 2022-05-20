import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi'
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
  mapPropsToValues: ({ settingPackage }) => ({
    ...(settingPackage.filter || {}),
    isActive: true,
  }),
  handleSubmit: (values, { props }) => {
    const { code, displayValue, isActive } = values
    const { dispatch } = props

    dispatch({
      type: 'settingPackage/query',
      payload: {
        code,
        displayValue,
        isActive,
        isUserMaintainable: true,
      },
    })
  },
})
class Filter extends PureComponent {
  render() {
    const { classes, handleSubmit } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='code'
              render={args => {
                return <TextField label='Package Code' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='displayValue'
              render={args => {
                return <TextField label='Package Name' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
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
                onClick={handleSubmit}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingPackage/updateState',
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
