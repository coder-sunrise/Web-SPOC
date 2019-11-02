import React, { PureComponent } from 'react'
import { downloadPrintingTool } from '../download'

import {
    GridContainer,
    CardContainer,
    GridItem,
    Button,
} from '@/components'

class DrugLabel extends PureComponent {
    render () {
        return (
          <CardContainer hideHeader>
            <GridContainer>
              <GridItem xs={12}
                md={12}
                style={{ marginTop: 20, fontSize:20 }}
              >
                <span>Drug Label</span>
              </GridItem>
              <GridItem xs={12}
                md={12}
                style={{ marginTop: 20 }}
              >
                <span>Direct print drug label from label printer</span>
              </GridItem>
              <GridItem xs={12}
                md={12}
                style={{ marginTop: 20 }}
              >
                <Button
                  onClick={()=>{downloadPrintingTool('SEMRPrintingTool')}}
                  color='primary'
                  variant='outlined'
                >
                  <span>Download</span>
                </Button>
              </GridItem>
            </GridContainer>
          </CardContainer>
        )
    }
}

export default DrugLabel