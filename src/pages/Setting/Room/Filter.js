import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { status } from '@/utils/codes'
import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  Select,
  ProgressButton,
} from '@/components'

@withFormik({
  mapPropsToValues: ({ settingRoom }) => settingRoom.filter || {},
  handleSubmit: () => {},
  displayName: 'RoomFilter',
})
class Filter extends PureComponent {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='code'
              render={(args) => {
                return <TextField label='Code' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='displayValue'
              render={(args) => {
                return <TextField label='Display Value' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='status'
              render={(args) => {
                return <Select label='Status' options={status} {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingRoom/query',
                    payload: this.props.values,
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingRoom/updateState',
                    payload: {
                      entity: undefined,
                    },
                  })
                  this.props.toggleModal()
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
