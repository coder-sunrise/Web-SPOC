import DetailPanel from './Detail'
import Pricing from '../../Pricing'
import Stock from '../../Stock'

const addContent = (type, props) => {
  switch (type) {
    case 1:
      return <DetailPanel {...props} />
    case 2:
      return <Pricing {...props} />
    default:
      return <Stock {...props} />
  }
}

export const ConsumableDetailOption = (detailsProps, stockProps) => [
  {
    id: 0,
    name: 'General',
    content: addContent(1, detailsProps),
  },
  {
    id: 2,
    name: 'Pricing',
    content: addContent(2, detailsProps),
  },
  {
    id: 3,
    name: 'Stock',
    content: addContent(3, stockProps),
  },
]
