import Authorized from '@/utils/Authorized'
import PatientHistory from '@/pages/Widgets/PatientHistory'
import AppointmentHistory from '@/pages/Widgets/AppointmentHistory'
import DispenseHistory from '@/pages/Widgets/DispenseHistory'
import { PATIENT_HISTORY_TABS } from '@/utils/constants'
import InvoiceHistory from '@/pages/Widgets/InvoiceHistory'
import PatientNurseNotes from '@/pages/Widgets/PatientNurseNotes'
import PatientDeposit from '@/pages/patientdatabase/Detail/patientdeposit'

const addContent = (type, props) => {
  switch (type) {
    case PATIENT_HISTORY_TABS.VISIT:
      return <PatientHistory mode='integrated' {...props} />
    case PATIENT_HISTORY_TABS.DISPENSE:
      return <DispenseHistory mode='integrated' {...props} />
    case PATIENT_HISTORY_TABS.APPOINTMENT:
      return <AppointmentHistory {...props} />
    case PATIENT_HISTORY_TABS.INVOICE:
      return <InvoiceHistory mode='integrated' {...props} />
    case PATIENT_HISTORY_TABS.NURSENOTES:
      return <PatientNurseNotes {...props} />
    case PATIENT_HISTORY_TABS.DEPOSIT:
      return <PatientDeposit {...props} />
    default:
      return <PatientHistory {...props} />
  }
}

const checkAccessRight = (accessRightNames) => {
  if (!accessRightNames || accessRightNames.length === 0) return true

  for (let i = 0; i < accessRightNames.length; i++) {
    const accessRight = Authorized.check(accessRightNames[i])
    if (accessRight.rights === 'enable') return true
  }
  return false
}

export const PatientHistoryTabOption = (props) => {
  const Tabs = [
    {
      id: PATIENT_HISTORY_TABS.VISIT,
      name: 'Visit',
      content: addContent(PATIENT_HISTORY_TABS.VISIT, props),
    },
    {
      id: PATIENT_HISTORY_TABS.NURSENOTES,
      name: 'Nurse Notes',
      content: addContent(PATIENT_HISTORY_TABS.NURSENOTES, props),
      authority: [
        'patientdatabase.patientprofiledetails.patienthistory.nursenotes',
      ],
    },
    {
      id: PATIENT_HISTORY_TABS.DISPENSE,
      name: 'Dispense',
      content: addContent(PATIENT_HISTORY_TABS.DISPENSE, props),
    },
    {
      id: PATIENT_HISTORY_TABS.APPOINTMENT,
      name: 'Appointment',
      content: addContent(PATIENT_HISTORY_TABS.APPOINTMENT, props),
    },
    {
      id: PATIENT_HISTORY_TABS.INVOICE,
      name: 'Invoice',
      content: addContent(PATIENT_HISTORY_TABS.INVOICE, props),
    },
    {
      id: PATIENT_HISTORY_TABS.DEPOSIT,
      name: 'Deposit',
      authority: [
        // 'patientdatabase.patientprofiledetails.patienthistory.deposit',
      ],
      content: addContent(PATIENT_HISTORY_TABS.DEPOSIT, props),
    },
  ]
  return Tabs.filter((f) => checkAccessRight(f.authority))
}
