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

export const PackageDetailOption = (detailsProps, typeListingProps) => [
  {
    id: 0,
    name: 'Details',
    content: addContent(1, detailsProps),
  },
  {
    id: 3,
    name: 'Order Item',
    content: addContent(2, typeListingProps),
  },
]
