import React, { useEffect, useReducer } from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// common components
import { CardContainer, GridContainer, GridItem } from '@/components'
// sub components
import FilterBar from './FilterBar'

import ReportLayoutWrapper from '../ReportLayout'
// services
import { getRawData } from '@/services/report'
import MovementList from './MovementList'

const reportId = 21
const fileName = 'Consumable Movement Report'

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

const ConsumableMovementReport = ({ values, validateForm }) => {
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
    const errors = await validateForm()
    if (Object.keys(errors).length > 0) return
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
            reportParameters={values}
            loaded={state.loaded}
            fileName={fileName}
          >
            <MovementList {...state} />
          </ReportLayoutWrapper>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

const ConsumableMovementReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
  }),
})(ConsumableMovementReport)

export default ConsumableMovementReportWithFormik
