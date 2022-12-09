import React, { useState } from 'react'
// material ui
import Print from '@material-ui/icons/Print'
import { List } from 'antd'
// common components
import { Button, Popover } from '@/components'

const printTypes = [
  {
    id: 1,
    name: 'Spectacle Order Form',
    type: 'Spectacle',
    dateType: 'orderFormId',
    reportId: 99,
    reportParameterName: 'SpectacleOrderFormId',
  },
  {
    id: 2,
    name: 'Spectacle Prescription',
    type: 'Spectacle',
    dateType: 'prescriptionId',
    reportId: 96,
    reportParameterName: 'SpectaclePrescriptionId',
  },
  {
    id: 3,
    name: 'Contact Lens Order Form',
    type: 'Contact Lens',
    dateType: 'orderFormId',
    reportId: 100,
    reportParameterName: 'ContactLensOrderFormId',
  },
  {
    id: 4,
    name: 'Contact Lens Prescription',
    type: 'Contact Lens',
    dateType: 'prescriptionId',
    reportId: 98,
    reportParameterName: 'ContactLensPrescriptionId',
  },
]

const PatientResultButton = ({ row }) => {
  const viewReport = (reportParameterName, reportDataId, reportId) => {
    window.g_app._store.dispatch({
      type: 'report/updateState',
      payload: {
        reportTypeID: reportId,
        reportParameters: {
          [reportParameterName]: reportDataId,
          isSaved: true,
        },
      },
    })
    toggleVisibleChange()
  }
  const [popperOpen, setPopperOpen] = useState(false)
  const toggleVisibleChange = () => {
    setPopperOpen(!popperOpen)
  }
  return (
    <React.Fragment>
      <Popover
        icon={null}
        trigger='click'
        placement='left'
        visible={popperOpen}
        onVisibleChange={toggleVisibleChange}
        content={
          <List
            size='small'
            bordered
            dataSource={printTypes.filter(
              item => row[item.dateType] && row.orderType === item.type,
            )}
            renderItem={item => (
              <List.Item
                onClick={() => {
                  viewReport(
                    item.reportParameterName,
                    row[item.dateType],
                    item.reportId,
                  )
                }}
                style={{ cursor: 'pointer' }}
              >
                {item.name}
              </List.Item>
            )}
          />
        }
      >
        <Button color='primary' justIcon onClick={toggleVisibleChange}>
          <Print />
        </Button>
      </Popover>
    </React.Fragment>
  )
}

export default PatientResultButton
