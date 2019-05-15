import React, { PureComponent } from 'react'
// umi
import { formatMessage } from 'umi/locale'
// custom components
import { GridContainer, GridItem, CommonModal, Button } from '@/components'
// sub components
import ConsumablesControl from './ConsumablesControl'
import PriceControl from '../PriceControl'

class ConsumablesItem extends PureComponent {
  render () {
    return (
      <GridContainer spacing={0}>
        <ConsumablesControl />
        <PriceControl />
        {/*
        <CommonModal
          open={showRemarks}
          title={formatMessage({ id: 'reception.queue.dispense.drugItem.remarks' })}
          onClose={this.toggleRemarksModal}
          onConfirm={this.toggleRemarksModal}
          maxWidth="md"
          fluidHeight
          showFooter={false}
        >
          <div>123</div>
        </CommonModal>
        */}
      </GridContainer>
    )
  }
}

export default ConsumablesItem
