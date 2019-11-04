import { CommonTableGrid, Select } from '@/components'

export default ({ current, codetable }) => (
  <CommonTableGrid
    size='sm'
    rows={current.orders || []}
    columns={[
      { name: 'type', title: 'Type' },
      { name: 'name', title: 'Name' },
      { name: 'description', title: 'Description' },
      { name: 'totalAmount', title: 'Total' },
    ]}
    FuncProps={{ pager: false }}
    columnExtensions={[
      {
        columnName: 'type',

        render: (row) => {
          return (
            <div>
              {row.type}
              {row.isExternalPrescription === true ? <span> (Ext.) </span> : ''}
            </div>
          )
        },
      },
      {
        columnName: 'description',

        render: (row) => {
          let text = ''
          const {
            ctmedicationusage,
            ctmedicationdosage,
            ctmedicationunitofmeasurement,
            ctmedicationfrequency,
          } = codetable

          if (
            !ctmedicationusage ||
            !ctmedicationdosage ||
            !ctmedicationunitofmeasurement ||
            !ctmedicationfrequency
          )
            return null
          return (
            <div>
              {row.corPrescriptionItemInstruction ? (
                row.corPrescriptionItemInstruction.map((item) => {
                  text = ''
                  const usageMethod = ctmedicationusage.filter(
                    (codeTableItem) => codeTableItem.id === item.usageMethodFK,
                  )
                  text += `${usageMethod.length > 0
                    ? usageMethod[0].name
                    : ''} `
                  text += ' '
                  const dosage = ctmedicationdosage.filter(
                    (codeTableItem) => codeTableItem.id === item.dosageFK,
                  )
                  text += `${dosage.length > 0 ? dosage[0].displayValue : ''} `
                  const prescribe = ctmedicationunitofmeasurement.filter(
                    (codeTableItem) => codeTableItem.id === item.prescribeUOMFK,
                  )
                  text += `${prescribe.length > 0 ? prescribe[0].name : ''} `
                  const drugFrequency = ctmedicationfrequency.filter(
                    (codeTableItem) =>
                      codeTableItem.id === item.drugFrequencyFK,
                  )
                  text += `${drugFrequency.length > 0
                    ? drugFrequency[0].displayValue
                    : ''} For `
                  text += `${item.duration ? item.duration : ''} day(s)`

                  return <p>{text}</p>
                })
              ) : (
                ''
              )}
            </div>
          )
        },
      },
      { columnName: 'totalAmount', type: 'number', currency: true },
    ]}
  />
)
