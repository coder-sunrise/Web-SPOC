import React, { PureComponent } from 'react'
import { GridContainer, GridItem } from '@/components'

class NonSurgical extends PureComponent {
  render () {
    return (
      <GridContainer hideHeader>
        <GridItem md={12}>
          <span>
            * Fill in any non-surgical charges for each doctor for the
            inpatient/ day surgery episode.
          </span>
        </GridItem>
        <GridItem md={12}>
          <span>
            * Only charges which are payable to the doctor should be included
            here.
          </span>
        </GridItem>
        <GridItem md={12}>
          <span>
            * Charges related to surgical procedures (surgeon fees, implants,
            surgical consumables, etc.) should be listed in Section C.
          </span>
        </GridItem>
      </GridContainer>
    )
  }
}
export default NonSurgical
