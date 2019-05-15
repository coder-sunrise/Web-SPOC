import React, { PureComponent } from 'react'
// umi
import { formatMessage } from 'umi/locale'
// custom components
import { GridContainer, CommonModal } from '@/components'
// sub components
import PriceControl from '../PriceControl'
import ServiceControl from './ServiceControl'

class ServiceItem extends PureComponent {
  render () {
    return (
      <GridContainer spacing={0}>
        <ServiceControl />
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

export default ServiceItem
