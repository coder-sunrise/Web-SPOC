import React, { PureComponent } from 'react'
import { formatMessage } from 'umi'
import { GridContainer, CardContainer, GridItem, Button } from '@/components'
import { downloadPrintingTool } from '../download'

class PrintingTool extends PureComponent {
  render() {
    return (
      <CardContainer hideHeader>
        <GridContainer>
          <GridItem xs={12} md={12} style={{ marginTop: 20, fontSize: 20 }}>
            <span>{formatMessage({ id: 'menu.support.printingtool' })}</span>
          </GridItem>
          <GridItem xs={12} md={12} style={{ marginTop: 20 }}>
            <span>Direct print drug label from label printer</span>
          </GridItem>
          <GridItem xs={12} md={12} style={{ marginTop: 20 }}>
            <Button
              onClick={() => {
                downloadPrintingTool(
                  'SEMRPrintingTool',
                  'AutoUpdatePrintingToolDownloadLinkSection',
                )
              }}
              color='primary'
            >
              <span>Download</span>
            </Button>
          </GridItem>
          <GridItem xs={12} md={12} style={{ marginTop: 20 }}>
            <span>
              Click{' '}
              <a
                style={{ textDecoration: 'underline' }}
                onClick={() => {
                  downloadPrintingTool(
                    'LabelPrinterSetup',
                    'LabelPrinterDownloadLinkSection',
                  )
                }}
              >
                here
              </a>{' '}
              to download printing tool installation guide
            </span>
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default PrintingTool
