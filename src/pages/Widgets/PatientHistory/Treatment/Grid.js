import _ from 'lodash'
import { CommonTableGrid, Select, Skeleton } from '@/components'
import Tooth from '@/pages/Widgets/DentalChart/Tooth'

export default ({ current, codetable, dentalChartComponent }) => {
  const { data } = dentalChartComponent
  const { cttreatment } = codetable
  const treatments = data.filter((o) => o.action.dentalTreatmentFK)
  return (
    <CommonTableGrid
      size='sm'
      rows={current.orders.filter((o) => o.type === 'Treatment') || []}
      columns={[
        { name: 'legend', title: 'Image' },
        { name: 'name', title: 'Treatment' },
        { name: 'toothNumber', title: 'Tooth' },
        { name: 'description', title: 'Treatment Description' },
      ]}
      FuncProps={{ pager: false }}
      columnExtensions={[
        {
          columnName: 'legend',
          width: 100,
          render: (row) => {
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
                  left: action.chartMethodColorBlock,
                  right: action.chartMethodColorBlock,
                  top: action.chartMethodColorBlock,
                  bottom: action.chartMethodColorBlock,
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
        {
          columnName: 'description',
          render: (row) => {
            return (
              <div
                style={{
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {row.description}
              </div>
            )
          },
        },
        {
          columnName: 'toothNumber',
          render: (row) => {
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
      ]}
    />
  )
}
