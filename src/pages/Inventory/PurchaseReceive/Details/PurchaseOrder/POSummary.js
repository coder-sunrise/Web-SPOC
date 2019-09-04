import React, { PureComponent } from 'react'
// material ui
import { Divider } from '@material-ui/core'
// common component
import {
  GridContainer,
  GridItem,
  NumberInput,
  Field,
  Switch,
  Tooltip,
  Checkbox,
} from '@/components'
// styling

const amountProps = {
  style: { margin: 0 },
  noUnderline: true,
  currency: true,
  disabled: true,
  rightAlign: true,
  normalText: true,
}

class Summary extends PureComponent {
  render () {
    return (
      <div>
        <GridContainer
          direction='column'
          justify='center'
          alignItems='flex-end'
        >
          <GridItem xs={6} md={6}>
            <NumberInput
              prefix='Sub Total:'
              defaultValue={10}
              {...amountProps}
            />
          </GridItem>

          <GridItem xs={6} md={6}>
            <NumberInput
              prefix='Adjustments:'
              defaultValue={2}
              {...amountProps}
            />
          </GridItem>

          <GridItem xs={6} md={6}>
            <NumberInput
              prefix='GST (7%):'
              defaultValue={0.63}
              {...amountProps}
            />
          </GridItem>
          <GridItem xs={6} md={6}>
            <Field
              name='gstEnabled'
              render={(args) => (
                <Switch
                  checkedChildren='Yes'
                  unCheckedChildren='No'
                  label=''
                  {...args}
                />
              )}
              {...amountProps}
            />
          </GridItem>
          <GridItem xs={6} md={6}>
            <Field
              name='gstIncluded'
              render={(args) => {
                return (
                  <Tooltip title={'Inclusive GST'} placement='bottom'>
                    <Checkbox label={'Inclusive GST'} simple {...args} />
                  </Tooltip>
                )
              }}
            />
          </GridItem>

          <GridItem md={3}>
            <Divider />
          </GridItem>

          <GridItem xs={6} md={6}>
            <NumberInput
              prefix='Total:'
              defaultValue={10.63}
              {...amountProps}
            />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}
export default Summary
