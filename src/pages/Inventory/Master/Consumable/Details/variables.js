import Error from '@material-ui/icons/Error'
import _ from 'lodash'
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

const tabHeader = (tabName, detailsProps) => {
  const returnTabHeader = () => {
    if (detailsProps.errors && !_.isEmpty(detailsProps.errors)) {
      return (
        <span style={{ color: 'red' }}>
          {tabName} <Error />
        </span>
      )
    }
    return <span>{tabName}</span>
  }

  return returnTabHeader()
}

export const ConsumableDetailOption = (detailsProps, stockProps) => [
  {
    id: 0,
    name: tabHeader('General', detailsProps),
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
