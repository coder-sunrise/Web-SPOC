import Error from '@material-ui/icons/Error'
import _ from 'lodash'
import DetailPanel from './Detail'
import InventoryTypeListing from './InventoryTypeListing'

const addContent = (type, props) => {
  switch (type) {
    case 1:
      return <DetailPanel {...props} />
    default:
      return <InventoryTypeListing {...props} />
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
      const { code, displayValue } = detailsProps.errors

      if ((code || displayValue) && tabName === 'Details') {
        return errorHeader
      }
    }
    return <span>{tabName}</span>
  }

  return returnTabHeader()
}

export const PackageDetailOption = (detailsProps, typeListingProps) => [
  {
    id: 0,
    name: tabHeader('Details', detailsProps),
    content: addContent(1, detailsProps),
  },
  {
    id: 3,
    name: 'Order Item',
    content: addContent(2, typeListingProps),
  },
]
