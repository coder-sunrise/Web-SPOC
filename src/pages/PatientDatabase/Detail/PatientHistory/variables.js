import PatientHistory from '@/pages/Widgets/PatientHistory'
import AppointmentHistory from '@/pages/Widgets/AppointmentHistory'
import DispenseHistory from '@/pages/Widgets/DispenseHistory'
import { PATIENT_HISTORY_TABS } from '@/utils/constants'



const addContent = (type, props) => {

  switch (type){
    case PATIENT_HISTORY_TABS.VISIT:
      return <PatientHistory mode='integrated' {...props} />
    case PATIENT_HISTORY_TABS.DISPENSE:
      return <DispenseHistory mode='integrated' {...props} />
    case PATIENT_HISTORY_TABS.APPOINTMENT:
      return <AppointmentHistory {...props} />
    default :
      return <PatientHistory mode='integrated' {...props} />
  }

}

export const PatientHistoryTabOption = (props) =>
{
  const Tabs =[
    {
      id: PATIENT_HISTORY_TABS.VISIT,
      name :'Visit',
      content: addContent(PATIENT_HISTORY_TABS.VISIT, props),
    },
    {
      id: PATIENT_HISTORY_TABS.DISPENSE,
      name :'Dispense',
      content: addContent(PATIENT_HISTORY_TABS.DISPENSE, props),
    },
    {
      id: PATIENT_HISTORY_TABS.APPOINTMENT,
      name :'Appointment',
      content: addContent(PATIENT_HISTORY_TABS.APPOINTMENT, props),
    },
  ]

  return Tabs
}

