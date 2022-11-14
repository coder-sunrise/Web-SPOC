import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'
import { scribbleTypes } from '@/utils/codes'
import { cleanFields } from '@/pages/Consultation/utils'
import { VISIT_TYPE } from '@/utils/constants'
import _ from 'lodash'

export const WIDGETS_ID = {
  CONSULTATION_DOCUMENT: '1',
  DIAGNOSIS: '2',
  INVOICE: '3',
  NURSENOTES: '4',
  ORDERS: '5',
  VISITREMARKS: '6',
}

export const GPCategory = [
  WIDGETS_ID.CONSULTATION_DOCUMENT,
  WIDGETS_ID.DIAGNOSIS,
  WIDGETS_ID.INVOICE,
  WIDGETS_ID.NURSENOTES,
  WIDGETS_ID.ORDERS,
  WIDGETS_ID.VISITREMARKS,
]

export const categoryTypes = [
  {
    value: WIDGETS_ID.CONSULTATION_DOCUMENT,
    name: 'Consultation Document',
    shortname: 'Cons. Document',
    authority: 'queue.consultation.widgets.consultationdocument',
  },
  {
    value: WIDGETS_ID.DIAGNOSIS,
    name: 'Diagnosis',
    authority: 'queue.consultation.widgets.diagnosis',
  },
  {
    value: WIDGETS_ID.INVOICE,
    name: 'Invoice',
    authority: 'finance/invoicepayment',
  },
  {
    value: WIDGETS_ID.NURSENOTES,
    name: 'Notes',
    authority:
      'patientdatabase.patientprofiledetails.patienthistory.nursenotes',
  },
  {
    value: WIDGETS_ID.VISITREMARKS,
    name: 'Visit Remarks',
    authority: 'queue.visitregistrationdetails',
  },
]

export const widgets = (props, scribbleNoteUpdateState = () => {}) => [
  {
    id: WIDGETS_ID.CONSULTATION_DOCUMENT,
    name: 'Consultation Document',
    authority: 'queue.consultation.widgets.consultationdocument',
    component: Loadable({
      loader: () => import('./ConsultationDocument'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.DIAGNOSIS,
    name: 'Diagnosis',
    authority: 'queue.consultation.widgets.diagnosis',
    component: Loadable({
      loader: () => import('./Diagnosis'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.ORDERS,
    name: 'Orders',
    authority: 'queue.consultation.widgets.order',
    component: Loadable({
      loader: () => import('./Orders'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.INVOICE,
    name: 'Invoice',
    authority: 'queue.consultation.widgets.order',
    component: Loadable({
      loader: () => import('./Invoice'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.ORDERS,
    name: 'Orders',
    authority: 'queue.consultation.widgets.order',
    component: Loadable({
      loader: () => import('./Orders'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.VISITREMARKS,
    name: 'Visit Remarks',
    authority: '',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='visitRemarks' />
      },
      loading: Loading,
    }),
  },
]

export const hasValue = value => {
  return value !== undefined && value !== null
}

export const showWidget = (current, widgetId) => {
  // check show diagnosis
  if (
    widgetId === WIDGETS_ID.DIAGNOSIS &&
    (!current.diagnosis || current.diagnosis.length === 0)
  )
    return false
  // check show orders
  if (
    widgetId === WIDGETS_ID.ORDERS &&
    (!current.orders || current.orders.length === 0) &&
    !current.isFromEditOrder
  )
    return false
  // check show document
  if (
    widgetId === WIDGETS_ID.CONSULTATION_DOCUMENT &&
    (!current.documents || current.documents.length === 0)
  )
    return false
  // check show invoice
  if (widgetId === WIDGETS_ID.INVOICE && !current.invoice) return false
  // check visit remarks
  if (
    widgetId === WIDGETS_ID.VISITREMARKS &&
    (!hasValue(current.visitRemarks) ||
      current.visitRemarks.trim().length === 0)
  )
    return false
  return true
}
