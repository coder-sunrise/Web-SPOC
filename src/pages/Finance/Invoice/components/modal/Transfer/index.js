import React from 'react'
import {
  GridContainer,
  GridItem,
  FastField,
  OutlinedTextField,
  Button,
  NumberInput,
} from '@/components'
import Grid from './Grid'

const Transfer = ({ handleSubmit, onConfirm }) => {
  return (
    <React.Fragment>
      <GridContainer>
        <GridItem direction='column' md={12}>
          <GridItem md={3}>
            <FastField
              name='totalTransferAmount'
              render={(args) => (
                <NumberInput
                  label='Total Transfer Amount'
                  min={0}
                  currency
                  precision={2}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem>
            <FastField
              name='remarks'
              render={(args) => {
                return (
                  <OutlinedTextField
                    rows='4'
                    multiline
                    label='Remarks'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridItem>
      </GridContainer>
      <Grid />

      <GridContainer>
        <GridItem md={12} style={{ textAlign: 'right', marginTop: 10 }}>
          <Button color='danger' onClick={onConfirm}>
            Cancel
          </Button>
          <Button color='primary' onClick={handleSubmit}>
            Save
          </Button>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  )
}

export default Transfer
