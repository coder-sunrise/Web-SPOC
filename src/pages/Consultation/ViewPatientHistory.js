import { useState } from 'react'
import Authorized from '@/utils/Authorized'
import { Drawer } from 'antd'
import Accessibility from '@material-ui/icons/Accessibility'
import { Button } from '@/components'
import PatientHistoryDrawer from './PatientHistoryDrawer'

const ViewPatientHistory = ({ top = '220px' }) => {
  const [openPatientHistoryDrawer, setOpenPatientHistoryDrawer] = useState(
    false,
  )

  const togglePatientHistoryDrawer = () => {
    setOpenPatientHistoryDrawer(!openPatientHistoryDrawer)
  }

  return (
    <div>
      <Authorized authority='queue.consultation.widgets.patienthistory'>
        {({ rights: patientHistoryAccessRight }) => {
          if (
            !patientHistoryAccessRight ||
            patientHistoryAccessRight === 'hidden'
          )
            return null
          return (
            <div
              style={{
                float: 'right',
                top,
                right: '-7px',
                position: 'fixed',
                zIndex: 999,
              }}
            >
              <Button
                size='sm'
                color='info'
                onClick={togglePatientHistoryDrawer}
                justIcon
                style={{ height: 90 }}
              >
                <div>
                  <div
                    style={{
                      transform: 'rotate(-90deg)',
                    }}
                  >
                    History
                  </div>
                  <Accessibility style={{ marginBottom: -20 }} />
                </div>
              </Button>
            </div>
          )
        }}
      </Authorized>
      <Drawer
        width='auto'
        closable={false}
        placement='right'
        bodyStyle={{ padding: 0 }}
        open={openPatientHistoryDrawer}
        onClose={togglePatientHistoryDrawer}
      >
        <PatientHistoryDrawer onClose={togglePatientHistoryDrawer} />
      </Drawer>
    </div>
  )
}
export default ViewPatientHistory
