import Error from '@material-ui/icons/Error'
import _ from 'lodash'
import DetailPanel from './Detail'
import Pricing from '../../Pricing'
import Stock from '../../Stock'
import Setting from '../../Setting'

const addContent = (type, props) => {
  switch (type) {
    case 1:
      return <DetailPanel {...props} />
    case 2:
      return <Setting {...props} />
    case 3:
      return <Pricing {...props} />
    default:
      return <Stock {...props} />
  }
}

const tabHeader = (tabName, detailsProps) => {
  const errorHeader = (
    <span style={{ color: 'red' }}>
      {tabName} <Error />
    </span>
  )
  const returnTabHeader = () => {
    if (detailsProps.errors && !_.isEmpty(detailsProps.errors)) {
      const {
        code,
        displayValue,
        revenueCategoryFK,
        effectiveDates,
        prescribingUOMFK,
        dispensingUOMFK,
        averageCostPrice,
        markupMargin,
        sellingPrice,
        maxDiscount,
        reOrderThreshold,
        criticalThreshold,
      } = detailsProps.errors

      if ((dispensingUOMFK || prescribingUOMFK) && tabName === 'Setting') {
        return errorHeader
      }
      if (
        (code || displayValue || revenueCategoryFK || effectiveDates) &&
        tabName === 'General'
      ) {
        return errorHeader
      }

      if (
        (averageCostPrice || markupMargin || maxDiscount || sellingPrice) &&
        tabName === 'Pricing'
      ) {
        return errorHeader
      }

      if ((reOrderThreshold || criticalThreshold) && tabName === 'Stock') {
        return errorHeader
      }
    }
    return <span>{tabName}</span>
  }

  return returnTabHeader()
}

export const MedicationDetailOption = (detailsProps, stockProps) => [
  {
    id: 0,
    name: tabHeader('General', detailsProps),
    content: addContent(1, detailsProps),
  },
  {
    id: 1,
    name: tabHeader('Setting', detailsProps),
    content: addContent(2, detailsProps),
  },
  {
    id: 2,
    name: tabHeader('Pricing', detailsProps),
    content: addContent(3, detailsProps),
  },
  {
    id: 3,
    name: tabHeader('Stock', stockProps),
    content: addContent(4, stockProps),
  },
]
