import React, { useEffect, useReducer } from 'react'
// common components
import { CardContainer, GridContainer, GridItem } from '@/components'

import ReportLayoutWrapper from '../ReportLayout'
// services
import { getRawData } from '@/services/report'
import LowStockList from './LowStockList'
// sub components
import FilterBar from './FilterBar'

const reportId = 19
const fileName = 'Low Stock Consumables Report'

const initialState = {
  loaded: false,
  isLoading: false,
  activePanel: -1,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'toggleLoading':
      return { ...state, isLoading: !state.isLoading }
    case 'setActivePanel':
      return { ...state, activePanel: action.payload }
    case 'setLoaded':
      return { ...state, loaded: action.payload }
    case 'updateState': {
      return { ...state, ...action.payload }
    }
    case 'reset':
      return { ...initialState }
    default:
      throw new Error()
  }
}

const LowStockConsumablesReport = ({ values }) => {
  const [
    state,
    dispatch,
  ] = useReducer(reducer, initialState)

  useEffect(() => {
    /*
    clean up function
    set data to empty array when leaving the page
    */
    return () =>
      dispatch({
        type: 'reset',
      })
  }, [])

  const asyncGetData = async () => {
    dispatch({
      type: 'toggleLoading',
    })
    const reportDatas = await getRawData(reportId, values)

    if (reportDatas) {
      dispatch({
        type: 'updateState',
        payload: {
          activePanel: 0,
          loaded: true,
          isLoading: false,
          reportDatas,
        },
      })
    } else {
      dispatch({
        type: 'updateState',
        payload: {
          loaded: false,
          isLoading: false,
        },
      })
    }
  }
  const onSubmitClick = async () => {
    dispatch({
      type: 'setLoaded',
      payload: false,
    })
    asyncGetData()
  }
  return (
    <CardContainer hideHeader>
      <GridContainer>
        <GridItem md={12}>
          <FilterBar handleSubmit={onSubmitClick} />
        </GridItem>
        <GridItem md={12}>
          <ReportLayoutWrapper
            loading={state.isLoading}
            reportID={reportId}
            loaded={state.loaded}
            fileName={fileName}
          >
            <LowStockList {...state} />
          </ReportLayoutWrapper>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

export default LowStockConsumablesReport
