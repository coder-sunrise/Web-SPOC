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

export const VaccinationDetailOption = (detailsProps, stockProps) => [
  {
    id: 0,
    name: 'General',
    content: addContent(1, detailsProps),
  },
  {
    id: 1,
    name: 'Setting',
    content: addContent(2, detailsProps),
  },
  {
    id: 2,
    name: 'Pricing',
    content: addContent(3, detailsProps),
  },
  {
    id: 3,
    name: 'Stock',
    content: addContent(4, stockProps),
  },
]
