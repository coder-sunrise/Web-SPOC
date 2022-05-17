import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Typography } from 'antd'
import _ from 'lodash'
import ProCard from '@ant-design/pro-card'
import { columns } from '@/pages/Widgets/ClinicalNotes/CannedText/utils'
import { RADIOLOGY_WORKITEM_STATUS } from '@/utils/constants'
import { Empty } from 'antd'

const defaultColumnStyle = {
  height: '100%',
  backgroundColor: 'green',
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  padding: 1,
  margin: '0px 4px',
}

const columnBodyStyle = {
  position: 'relative',
  backgroundColor: 'white',
  margin: 3,
  flex: '1 1 auto',
  overflow: 'auto',
  height: '0',
  padding: '3px',
}

const WorlklistColumnTitle = ({ title, workItemCount }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 4fr 1fr',
        justifyItems: 'center',
        margin: 5,
      }}
    >
      <Typography.Title
        level={4}
        style={{ color: 'white', gridColumnStart: 2, marginBottom: 5 }}
      >
        {title}
      </Typography.Title>
      <div
        style={{
          padding: '0px 20px',
          alignSelf: 'center',
          backgroundColor: 'white',
          gridColumnStart: 3,
          borderRadius: 10,
        }}
      >
        {workItemCount}
      </div>
    </div>
  )
}

const sortItems = data => {
  if (!data || !data.workitems || data.workitems.length === 0) return []

  //If the order is combined, the sorting is based on primary workitem first.
  const getSortValueItem = (collection, item) => {
    return !item.primaryWorkitemFK ||
      item.primaryWorkitemFK === item.radiologyWorkitemId ||
      collection.findIndex(
        current => current.radiologyWorkitemId === item.primaryWorkitemFK,
      ) === -1
      ? item
      : collection.find(
          current => current.radiologyWorkitemId === item.primaryWorkitemFK,
        )
  }

  const sortNewWorkitems = items => {
    const getPreSortValue = item => {
      let sortValue = item.priority === 'Urgent' ? 100 : 0

      sortValue +=
        !item.isNurseActualizeRequired ||
        (item.isNurseActualizeRequired && item.isNurseActualized === true)
          ? 10
          : 0

      return sortValue
    }

    return items.sort((firstItem, secondItem) => {
      //Get the primary workitem as item to compare if it is combined orders.
      //For combined orders, it compare against primary order values to compare with other orders.
      const firstSortItem = getSortValueItem(data.workitems, firstItem)
      const secondSortItem = getSortValueItem(data.workitems, secondItem)

      // 1.Compare the priority  and nurse actualization status.
      if (getPreSortValue(firstSortItem) !== getPreSortValue(secondSortItem)) {
        return getPreSortValue(firstSortItem) > getPreSortValue(secondSortItem)
          ? -1
          : 1
      }

      // 2.Compare the order generate date.
      // Two workitems from same combine order will have same generate date as it is compared using primary workitem.
      if (firstSortItem.generateDate !== secondSortItem.generateDate)
        return firstSortItem.generateDate < secondSortItem.generateDate ? -1 : 1

      // 3.To sort the items inside combined orders
      if (
        firstItem.primaryWorkitemFK &&
        secondSortItem.primaryWorkitemFK &&
        firstItem.primaryWorkitemFK === secondSortItem.primaryWorkitemFK
      ) {
        // 3.1.Check if any of the item is primary item, the primary item will be top in combined order list.
        if (firstItem.radiologyWorkitemId === firstItem.primaryWorkitemFK)
          return -1

        if (
          secondSortItem.radiologyWorkitemId ===
          secondSortItem.primaryWorkitemFK
        )
          return 1

        // 3.1 Compare the generate date inside the combined orders.
        if (firstItem.generateDate !== secondItem.generateDate)
          return firstItem.generateDate > secondItem.generateDate ? -1 : 1
      }
      // 4.If at least one item is not from combined ordered and having same generate date, sort by primary item.
      // Combined order will take primary item's id to ensure all items inside the combined orders are grouped together.
      else {
        return firstSortItem.accessionNo > secondSortItem.accessionNo ? 1 : -1
      }

      return 0
    })
  }

  const currentColumnStatus = data.workitems[0].statusFK

  switch (currentColumnStatus) {
    case RADIOLOGY_WORKITEM_STATUS.NEW:
      return sortNewWorkitems(data.workitems)

    case RADIOLOGY_WORKITEM_STATUS.INPROGRESS:
      return _.sortBy(data.workitems, 'statusUpdateDate')

    default:
      return _.sortBy(data.workitems, 'statusUpdateDate').reverse()
  }
}

const WorklistColumnBody = ({ data, renderWorkitem }) => {
  const viewPortRef = useRef()
  const marginTop = 10
  const offsetHeight = 230
  const [currentIndex, setCurrentIndex] = useState(0)
  const [columnData, setColumnData] = useState([])
  const [containerHeight, setContainerHeight] = useState(0)

  useEffect(() => {
    window.addEventListener('resize', loadCurrentData)

    return () => window.removeEventListener('resize', loadCurrentData)
  }, [])

  useEffect(() => {
    if (data && data.workitems.length > 0) {
      const height = data.workitems.length * offsetHeight
      setContainerHeight(height)
    }
    return () => {
      setContainerHeight(0)
      setColumnData([])
      setCurrentIndex(0)
    }
  }, [data])

  useEffect(() => {
    loadCurrentData()
  }, [data, currentIndex])

  const loadCurrentData = () => {
    // re-calculate the newIndex in case if the change is only data which will result
    calculateCurrentIndex()

    const height = viewPortRef.current.offsetHeight
    const numVisibleItems = Math.trunc(height / offsetHeight) + 1
    const datalength = data.workitems.length > 0 ? data.workitems.length : 1

    const start =
      currentIndex - numVisibleItems >= datalength
        ? currentIndex - numVisibleItems
        : currentIndex

    const end =
      currentIndex + numVisibleItems >= datalength
        ? datalength
        : currentIndex + numVisibleItems

    //Load the data based on the current viewport. Virtual rendering.
    const currentData = sortItems(data).slice(start, end)
    setColumnData(currentData)
  }

  const calculateCurrentIndex = () => {
    const scrollTop = viewPortRef.current.scrollTop
    const newIndex = Math.trunc(scrollTop / offsetHeight)
    if (newIndex != currentIndex) setCurrentIndex(newIndex)
  }

  return (
    <div
      ref={viewPortRef}
      style={columnBodyStyle}
      onScroll={calculateCurrentIndex}
    >
      <div style={{ height: containerHeight }}>
        {columnData.length > 0 &&
          columnData.map((item, i) =>
            renderWorkitem(item, {
              position: 'absolute',
              top: marginTop + (currentIndex + i) * offsetHeight,
              left: 5,
              right: 5,
              height: offsetHeight - marginTop,
            }),
          )}
        {columnData.length === 0 && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  )
}

export const WorklistColumn = ({ data, renderWorkitem, columnPercentage }) => (
  <div
    style={{
      ...defaultColumnStyle,
      backgroundColor: data.backgroundColor,
      width: `${columnPercentage}%`,
      minWidth: 300,
    }}
  >
    <WorlklistColumnTitle
      title={data.title}
      workItemCount={data.workitems.length}
    />
    <WorklistColumnBody data={data} renderWorkitem={renderWorkitem} />
  </div>
)
