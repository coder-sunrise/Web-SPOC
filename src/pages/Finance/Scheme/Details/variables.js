import Error from '@material-ui/icons/Error'
import _ from 'lodash'
import DetailPanel from './Detail'
import Setting from './Setting'

const addContent = (type, props) => {
  switch (type) {
    case 1:
      return <DetailPanel {...props} />
    default:
      return <Setting {...props} />
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
      return errorHeader
    }
    return <span>{tabName}</span>
  }

  return returnTabHeader()
}

export const SchemeDetailOption = (detailsProps) => [
  {
    id: 0,
    name: tabHeader('Detail', detailsProps),
    content: addContent(1, detailsProps),
  },
  {
    id: 1,
    name: 'Setting',
    content: addContent(2, detailsProps),
  },
]
