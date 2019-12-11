import React, { PureComponent } from 'react'
import AccountCircle from '@material-ui/icons/AccountCircle'
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
    patientAccountNo: 'PT-000017',
    regId: 'REG-000003',
  },
  {
    id: 2,

    ward: 'ICU',
    bed: 'I2',
    name: 'Albert',
    age: 22,
    patientAccountNo: 'PT-000018',
    regId: 'REG-000004',
  },
  {
    id: 3,

    ward: 'ICU',
    bed: 'I3',
    name: 'Atreus',
    age: 33,
    patientAccountNo: 'PT-000019',
    regId: 'REG-000005',
  },
  {
    id: 4,

    ward: 'ICU',
    bed: 'I4',
    name: 'Chandler',
    age: 55,
    patientAccountNo: 'PT-000020',
    regId: 'REG-000006',
  },
  {
    id: 5,

    ward: 'Special',
    bed: 'S1',
    name: 'Chandler',
    age: 55,
    patientAccountNo: 'PT-000030',
    regId: 'REG-000016',
  },
  {
    id: 6,

    ward: 'Special',
    bed: 'S2',
    name: 'Charlie Puth',
    age: 18,
    patientAccountNo: 'PT-000031',
    regId: 'REG-000017',
  },
  {
    id: 7,

    ward: 'RICU',
    bed: 'R1',
    name: 'Clara Mae',
    age: 42,
    patientAccountNo: 'PT-000032',
    regId: 'REG-000037',
  },
  {
    id: 8,

    ward: 'RICU',
    bed: 'R2',
    name: 'Dev Avery',
    age: 56,
    patientAccountNo: 'PT-000033',
    regId: 'REG-000038',
  },
]
class Grid extends PureComponent {
  state = {}

  constructor (props) {
    super(props)

    this.tableParas = {
      columns: [
        { name: 'ward', title: 'Ward' },
        { name: 'bed', title: 'Bed' },
        { name: 'name', title: 'Patient Name' },
        { name: 'age', title: 'Age' },
        { name: 'patientAccountNo', title: 'Acc. No.' },
        { name: 'regId', title: 'Reg. ID.' },
        { name: 'action', title: 'Action' },
      ],
      columnExtensions: [
        {
          columnName: 'action',
          align: 'center',
          sortingEnabled: false,
          render: (row) => {
            const { renderActionFn = (f) => f } = props
            return (
              <div>
                <Tooltip title='Patient Detail'>
                  <Button
                    onClick={() => {
                      // this.onAddExistPatient(row)
                    }}
                    justIcon
                    color='primary'
                  >
                    <AccountCircle />
                  </Button>
                </Tooltip>
                <Tooltip title='Transfer Patient'>
                  <Button
                    onClick={() => {
                      // this.onAddExistPatient(row)
                    }}
                    justIcon
                    color='primary'
                  >
                    <SyncAlt />
                  </Button>
                </Tooltip>
              </div>
            )
          },
        },
      ],
      FuncProps: {
        pager: false,
        grouping: true,
        groupingConfig: {
          state: {
            grouping: [
              { columnName: 'ward' },
            ],
            defaultExpandedGroups: [
              'ICU',
              'Special',
              'RICU',
            ],
          },
        },
      },
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
