import Error from '@material-ui/icons/Error'
import _ from 'lodash'
import DetailPanel from './Detail'
import Setting from './Setting'

const addContent = (type, props) => {
  switch (type) {
    case 1:
      return <DetailPanel {...props} />
    default:
      return <DetailPanel {...props} />
    // return <Setting {...props} />
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
        name,
        schemeCategoryFK,
        copayerFK,
        coverageMaxCap,
        effectiveDates,
      } = detailsProps.errors
      if (
        (code || name || schemeCategoryFK || copayerFK || effectiveDates) &&
        tabName === 'Details'
      ) {
        return errorHeader
      }

      if (coverageMaxCap && tabName === 'Stock') {
        return errorHeader
      }
    }
    return <span>{tabName}</span>
  }

  return returnTabHeader()
}

export const SchemeDetailOption = (detailsProps) => [
  {
    id: 0,
    name: tabHeader('Details', detailsProps),
    content: addContent(1, detailsProps),
  },
  // {
  //   id: 1,
  //   name: tabHeader('Setting', detailsProps),
  //   content: addContent(2, detailsProps),
  // },
]
