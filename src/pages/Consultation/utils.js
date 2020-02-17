import { consultationDocumentTypes, orderTypes } from '@/utils/codes'

const convertToConsultation = (values, { consultationDocument, orders }) => {
  const { rows = [] } = consultationDocument
  consultationDocumentTypes.forEach((p) => {
    values[p.prop] = rows.filter((o) => o.type === p.value)
  })
  const { rows: orderRows = [], finalAdjustments = [], isGSTInclusive } = orders
  values.corOrderAdjustment = finalAdjustments
  orderTypes.forEach((p, i) => {
    if (p.prop) {
      if (p.value === '5') {
        values[p.prop] = (values[p.prop] || [])
          .concat(orderRows.filter((o) => o.type === p.value))
      } else {
        values[p.prop] = orderRows.filter((o) => o.type === p.value)
      }
    }
  })
  const { dentalChartComponent } = window.g_app._store.getState()
  // console.log('dentalChartComponent', dentalChartComponent)

  if (dentalChartComponent) {
    const { isPedoChart, isSurfaceLabel, data } = dentalChartComponent
    values.corDentalCharts = [
      {
        ...(values.corDentalCharts || [])[0],
        isPedoChart,
        isSurfaceLabel,
        dentalChart: JSON.stringify(data),
      },
    ]
    // values.corDentalCharts = data.map(o=>)
  }
  return {
    ...values,
    isGSTInclusive,
  }
}

module.exports = {
  ...module.exports,
  convertToConsultation,
}
