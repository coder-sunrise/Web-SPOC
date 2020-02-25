import React, { PureComponent } from 'react'
import Assignment from '@material-ui/icons/Assignment'
import SyncAlt from '@material-ui/icons/SyncAlt'
import { statusString } from '@/utils/codes'
import { CommonTableGrid, Tooltip, Button, CardContainer } from '@/components'
import { calculateAgeFromDOB } from '@/utils/dateUtils'
import Authorized from '@/utils/Authorized'

const data = [
  {
    id: 1,
    ward: 'ICU',
    bed: 'I1',
    name: 'Abu Bin',
    age: 43,
    patientId: 'PT-000017',
    orderId: 'OD-000003',
    orderDate: '2019-10-11',
    serviceCentre: 'Service Centre A',
    serviceCategory: 'Procedure',
    serviceName: 'Service 1',
    doctor: 'Doctor A',
    status: 'Ordered',
    lastUpdatedBy: 'Demo',
    panel: 'Diabetes Profile',
  },
  {
    id: 2,

    ward: 'ICU',
    bed: 'I2',
    name: 'Albert',
    age: 22,
    patientId: 'PT-000018',
    orderId: 'OD-000004',
    orderDate: '2019-10-11',
    serviceCentre: 'Service Centre A',
    serviceCategory: 'Procedure',
    serviceName: 'Service 2',
    doctor: 'Doctor A',
    status: 'Ordered',
    lastUpdatedBy: 'Demo',
    panel: 'Diabetes Profile',
  },
  {
    id: 3,

    ward: 'ICU',
    bed: 'I3',
    name: 'Atreus',
    age: 33,
    patientId: 'PT-000019',
    orderId: 'OD-000005',
    orderDate: '2019-10-13',
    serviceCentre: 'Service Centre A',
    serviceCategory: 'Investigation',
    serviceName: 'Service 1',
    doctor: 'Doctor A',
    status: 'Ordered',
    lastUpdatedBy: 'Demo',
    panel: 'Diabetes Profile',
  },
  {
    id: 4,

    ward: 'ICU',
    bed: 'I4',
    name: 'Chandler',
    age: 55,
    patientId: 'PT-000020',
    orderId: 'OD-000006',
    orderDate: '2019-10-13',
    serviceCentre: 'Service Centre B',
    serviceCategory: 'Investigation',
    serviceName: 'Service 1',
    doctor: 'Doctor A',
    status: 'Ordered',
    lastUpdatedBy: 'Demo',
    panel: 'Diabetes Profile',
  },
  {
    id: 5,

    ward: 'Special',
    bed: 'S1',
    name: 'Chandler',
    age: 55,
    patientId: 'PT-000030',
    orderId: 'OD-000016',
    orderDate: '2019-10-11',
    serviceCentre: 'Service Centre B',
    serviceCategory: 'Investigation',
    serviceName: 'Service 3',
    doctor: 'Doctor C',
    status: 'Ordered',
    lastUpdatedBy: 'Demo',
    panel: 'Diabetes Profile',
  },
  {
    id: 6,

    ward: 'Special',
    bed: 'S2',
    name: 'Charlie Puth',
    age: 18,
    patientId: 'PT-000031',
    orderId: 'OD-000017',
    orderDate: '2019-11-03',
    receivedDate: '2019-11-05',

    serviceCentre: 'Service Centre B',
    serviceCategory: 'Investigation',
    serviceName: 'Service A',
    doctor: 'Doctor E',
    status: 'Ordered',
    lastUpdatedBy: 'Demo',
    panel: 'Liver Profile',
  },
  {
    id: 7,

    ward: 'RICU',
    bed: 'R1',
    name: 'Clara Mae',
    age: 42,
    patientId: 'PT-000032',
    orderId: 'OD-000037',
    orderDate: '2019-11-11',
    receivedDate: '2019-11-15',
    serviceCentre: 'Service Centre B',
    serviceCategory: 'Investigation',
    serviceName: 'Service 3',
    doctor: 'Doctor C',
    status: 'Ordered',
    lastUpdatedBy: 'Demo',
    panel: 'Liver Profile',
  },
  {
    id: 8,

    ward: 'RICU',
    bed: 'R2',
    name: 'Dev Avery',
    age: 56,
    patientId: 'PT-000033',
    orderId: 'OD-000038',
    orderDate: '2019-12-11',
    receivedDate: '2019-12-15',
    serviceCentre: 'Service Centre B',
    serviceCategory: 'Investigation',
    serviceName: 'Service 3',
    doctor: 'Doctor C',
    status: 'Ordered',
    lastUpdatedBy: 'Demo',
    panel: 'Liver Profile',
  },
]
class Grid extends PureComponent {
  state = {}

  constructor (props) {
    super(props)

    this.tableParas = {
      columns: [
        { name: 'orderId', title: 'Order ID' },
        { name: 'orderDate', title: 'Date of Request' },
        { name: 'receivedDate', title: 'Date of Report' },

        { name: 'patientId', title: 'Patient ID' },
        { name: 'name', title: 'Patient Name' },
        { name: 'panel', title: 'Panel/Item' },
        { name: 'lastUpdatedBy', title: 'Ordered By' },
      ],
      columnExtensions: [
        {
          columnName: 'orderDate',
          type: 'date',
        },
        {
          columnName: 'receivedDate',
          type: 'date',
        },
      ],
      // FuncProps: {
      //   pager: false,

      // },
    }
  }

  render () {
    const { overrideTableParas = {} } = this.props

    return (
      <React.Fragment>
        <CommonTableGrid
          rows={data}
          {...this.tableParas}
          {...overrideTableParas}
        />
      </React.Fragment>
    )
  }
}

export default Grid
