import React from 'react'
import { Button, GridItem, GridContainer } from '@/components'

const SubmitClaimStatus = ({ count, onConfirm }) => {
  return (
    <GridContainer justify='center' alignItems='center'>
      <GridItem>
        <h3>Claim Submission Failed Total: {count}</h3>
      </GridItem>
      <GridItem>
        <Button color='primary' onClick={onConfirm}>
          OK
        </Button>
      </GridItem>
    </GridContainer>
  )
}

export default SubmitClaimStatus
