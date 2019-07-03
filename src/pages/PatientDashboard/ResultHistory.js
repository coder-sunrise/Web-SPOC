import React, { useState } from 'react'
import { CommonTableGrid2, Button, CommonModal } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Assignment from '@material-ui/icons/Assignment'
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts'
import { compose } from 'redux'

const data = [
  {
    date: '01/09/2018',
    value: 90,
  },
  {
    date: '03/09/2018',
    value: 130,
  },
  {
    date: '05/09/2018',
    value: 80,
  },
  {
    date: '07/09/2018',
    value: 85,
  },
  {
    date: '09/09/2018',
    value: 90,
  },
]
const cols = {
  value: {
    min: 0,
    max: 140,
  },
  date: {},
}

const ResultHistory = (props) => {
  const [ showGraphModal, setShowGraphModal ] = useState(false)
  return (
    <React.Fragment>
      <CommonModal
        open={showGraphModal}
        title='Result History'
        maxWidth='sm'
        onClose={() => setShowGraphModal(false)}
        onConfirm={() => setShowGraphModal(true)}
        showFooter={false}
      >
        <div>
          <Chart height={500} width={700} data={data} scale={cols} forceFit padding={{ top: 30, right: 30, bottom: 20, left: 30 }}>
            <Axis name='date' />
            <Axis name='value' />
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom type='line' position='date*value' size={2} />
            <Geom
              type='point'
              position='date*value'
              size={4}
              shape='circle'
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
            />
          </Chart>
          <h3>BLOOD GLUCOSE LEVEL (MG/DL)</h3>
        </div>
      </CommonModal>

      <CommonTableGrid2
        size='sm'
        rows={[
          {
            id: 1,
            name: 'Blood Glucose Level (mg/dL)',
          },
          {
            id: 2,
            name: 'Blood Pressure (Systolic) (mmHg)',
          },
          {
            id: 3,
            name: 'Memo',
            subject: 'Blood Pressure (Diastolic) (mmHg)',
          },
          {
            id: 4,
            name: 'Weight',
          },
          {
            id: 5,
            name: 'Heart Rate (bpm)',
          },
          {
            id: 6,
            name: 'HbA1c (%)',
          },
          {
            id: 7,
            name: 'Height',
          },
          {
            id: 8,
            name: 'Hypocount (mg/dL)',
          },
          {
            id: 9,
            name: 'Urine Alb/Creat Ratio (mg/mmol)',
          },
        ]}
        columns={[
          { name: 'name', title: 'Name' },
          { name: 'action', title: 'Action' },
        ]}
        FuncProps={{ pager: false }}
        columnExtensions={[]}
        ActionProps={{
          TableCellComponent: ({
            column,
            row,
            dispatch,
            classes,
            renderActionFn,
            ...p
          }) => {
            // console.log(this)
            if (column.name === 'action') {
              return (
                <Table.Cell {...p}>
                  <Button
                    size='sm'
                    onClick={() => setShowGraphModal(true)}
                    justIcon
                    round
                    color='primary'
                    style={{ marginRight: 5 }}
                  >
                    <Assignment />
                  </Button>
                </Table.Cell>
              )
            }
            return <Table.Cell {...p} />
          },
        }}
      />
    </React.Fragment>
  )
}

export default ResultHistory
