import React, { PureComponent } from 'react'
import { GridContainer, GridItem, Button } from '@/components'

const CHASCardReplacement = ({ handleOnClose }) => {
  return (
    <GridContainer>
      <GridContainer>
        <GridItem md={6}>Patient: {'Mr John Smith'}</GridItem>
        <GridItem md={6}>Account No: {'S132456D'}</GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem md={2} />
        <GridItem md={4}>Old CHAS Card:</GridItem>
        <GridItem md={4}>{'CHAS Blue'}</GridItem>
        <GridItem md={2} />

        <GridItem md={2} />
        <GridItem md={4}>New CHAS Card:</GridItem>
        <GridItem md={4}>{'CHAS Orange'}</GridItem>
        <GridItem md={2} />
      </GridContainer>
      <GridContainer>
        <GridItem md={3}>CHAS Balance:</GridItem>
        <GridItem md={3}>{'$50.00'}</GridItem>
        <GridItem md={6} />

        <GridItem md={3}>CHAS Validity: </GridItem>
        <GridItem md={3}>{'15 Sep 2021'}</GridItem>
        <GridItem md={6} />

        <GridItem md={3}>Patient Acute Visit Balance:</GridItem>
        <GridItem md={3}>{'2 Remaining for Year 2020'}</GridItem>
        <GridItem md={6} />

        <GridItem md={3}>Patient Acute Clinic Balance:</GridItem>
        <GridItem md={3}>{'2 Remaining for January 2020'}</GridItem>
        <GridItem md={6} />
      </GridContainer>
      <GridContainer>
        <GridItem>
          <Button color='primary' onClick={handleOnClose}>
            OK
          </Button>
        </GridItem>
      </GridContainer>
    </GridContainer>
  )
}

export default CHASCardReplacement
