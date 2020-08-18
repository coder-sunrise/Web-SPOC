import _ from 'lodash'
import { Table } from 'antd'
import Tooth from '@/pages/Widgets/DentalChart/Tooth'
import tablestyles from '../TableStyle.less'

export default ({ current, codetable, dentalChartComponent }) => {
  const { data } = dentalChartComponent
  const { cttreatment } = codetable
  const treatments = data.filter((o) => o.action.dentalTreatmentFK)
  return (
    <Table
      size='small'
      bordered
      pagination={false}
      rowClassName={(record, index) => {
        return index % 2 === 0 ? tablestyles.once : tablestyles.two
      }}
      dataSource={current.orders.filter((o) => o.type === 'Treatment') || []}
      columns={[
        {
          dataIndex: 'legend',
          title: 'Image',
          width: 100,
          render: (text, row) => {
            const treatmentList = treatments.filter((o) =>
              cttreatment.find(
                (m) =>
                  m.id === o.action.dentalTreatmentFK &&
                  m.displayValue === row.name,
              ),
            )
            if (treatmentList.length === 0) return null
            const { action } = treatmentList[0]
            return (
              <Tooth
                width={20}
                height={20}
                paddingLeft={1}
                paddingTop={1}
                zoom={1 / 6}
                image={action.image}
                action={action}
                fill={{
                  left: action.chartMethodColorBlock || 'white',
                  right: action.chartMethodColorBlock || 'white',
                  top: action.chartMethodColorBlock || 'white',
                  bottom: action.chartMethodColorBlock || 'white',
                  centerfull: action.chartMethodColorBlock || 'white',
                }}
                symbol={{
                  left: action.chartMethodText,
                  right: action.chartMethodText,
                  top: action.chartMethodText,
                  bottom: action.chartMethodText,
                  centerfull: action.chartMethodText,
                }}
              />
            )
          },
        },
        { dataIndex: 'name', title: 'Treatment' },
        {
          dataIndex: 'toothNumber',
          title: 'Tooth',
          render: (text, row) => {
            const treatmentList = treatments.filter((o) =>
              cttreatment.find(
                (m) =>
                  m.id === o.action.dentalTreatmentFK &&
                  m.displayValue === row.name,
              ),
            )
            if (treatmentList.length === 0) return null
            if (treatmentList[0].action.chartMethodTypeFK === 3) {
              return (
                <span>
                  {_.sortedUniq(
                    Object.values(
                      _.groupBy(treatmentList, 'nodes'),
                    ).map((o) => {
                      const { nodes } = o[0]

                      return `#${nodes[0]} - ${nodes[1]}`
                    }),
                  ).join(',')}
                </span>
              )
            }
            return (
              <span>
                {_.sortedUniq(treatmentList.map((o) => `#${o.toothNo}`)).join(
                  ',',
                )}
              </span>
            )
          },
        },
        {
          dataIndex: 'description',
          title: 'Treatment Description',
          render: (text) => {
            return (
              <div
                style={{
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {text}
              </div>
            )
          },
        },
      ]}
    />
  )
}
