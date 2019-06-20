import React, { PureComponent } from 'react'

// custom components
import { GridContainer } from '@/components'
// sub componnets
import OtherControl from './OtherControl'
import PriceControl from '../PriceControl'

class OtherItem extends PureComponent {
  render () {
    return (
      <GridContainer>
        <OtherControl />
        <PriceControl />
      </GridContainer>
    )
  }
}

export default OtherItem
