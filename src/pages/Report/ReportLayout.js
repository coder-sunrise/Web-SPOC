import React from 'react'
// printjs
import printJS from 'print-js'
// ant design
import { Dropdown, Menu } from 'antd'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
import Print from '@material-ui/icons/Print'
// common components
import { Button, CardContainer } from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'
// services
import { getPDF, getExcel } from '@/services/report'
import { downloadFile } from '@/services/file'

const ReportLayoutWrapper = ({
  children,
  loading = false,
  reportID = -1,
  loaded = false,
  fileName = 'Report',
  reportParameters = {},
}) => {
  const onExportPDFClick = async () => {
    const result = await getPDF(reportID, reportParameters)
    if (result) {
      const fileExtensions = '.pdf'
      downloadFile(result, `${fileName}${fileExtensions}`)
    }
  }

  const onExportExcelClick = async () => {
    const result = await getExcel(reportID, reportParameters)
    if (result) {
      const fileExtensions = '.xls'
      downloadFile(result, `${fileName}${fileExtensions}`)
    }
  }

  const onPrintClick = async () => {
    const result = await getPDF(reportID, reportParameters)
    if (result) {
      const base64Result = arrayBufferToBase64(result)
      printJS({ printable: base64Result, type: 'pdf', base64: true })
    }
  }

  return (
    <LoadingWrapper loading={loading} text={`Generating ${fileName}...`}>
      <CardContainer hideHeader>
        <div style={{ textAlign: 'right' }}>
          <Dropdown
            disabled={!loaded}
            overlay={
              <Menu>
                <Menu.Item
                  key='export-pdf'
                  disabled={!loaded}
                  id='pdf'
                  onClick={onExportPDFClick}
                >
                  <span>PDF</span>
                </Menu.Item>
                <Menu.Item
                  key='export-excel'
                  disabled={!loaded}
                  id='excel'
                  onClick={onExportExcelClick}
                >
                  <span>Excel</span>
                </Menu.Item>
              </Menu>
            }
            trigger={[
              'click',
            ]}
          >
            <Button color='info' size='sm' disabled={!loaded}>
              <SolidExpandMore />
              Export As
            </Button>
          </Dropdown>
          <Button
            color='info'
            size='sm'
            justIcon
            disabled={!loaded}
            onClick={onPrintClick}
          >
            <Print />
          </Button>
        </div>
        {children}
      </CardContainer>
    </LoadingWrapper>
  )
}

export default ReportLayoutWrapper
