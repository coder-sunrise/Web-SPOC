import { filterMap } from './variables'

export const filterData = (filter, data) => {
  let newData = data.filter((eachRow) => {
    return filterMap[filter].includes(eachRow.visitStatus)
  })

  return newData
}

export const getStatisticCount = (type, data) => {
  const filteredData = filterData(type, data)

  return filteredData.length
}
