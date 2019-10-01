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

export const SchemeDetailOption = (detailsProps) => [
  {
    id: 0,
    name: 'Detail',
    content: addContent(1, detailsProps),
  },
  {
    id: 1,
    name: 'Setting',
    content: addContent(2, detailsProps),
  },
]
