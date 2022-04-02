import React, {
  useContext,
  useEffect,
  useState,
  createContext,
  useRef,
} from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import { getMappedVisitType } from '@/utils/utils'
import { VISIT_TYPE } from '@/utils/constants'

const WorklistHistoryContext = createContext(null)

export const WorklistHistoryContextProvider = props => {
  const handlerRef = useRef(null)

  const setPaginationChangeHandler = handler => {
    console.log('setPaginationChangeHandler', handler)
    handlerRef.current = handler
  }

  const triggerPaginationChange = pageNo => {
    console.log('triggerPaginationChange', handlerRef.current, pageNo)
    if (handlerRef.current) handlerRef.current(pageNo)
  }

  return (
    // this is the provider providing state
    <WorklistHistoryContext.Provider
      value={{
        setPaginationChangeHandler,
        triggerPaginationChange,
      }}
    >
      {props.children}
    </WorklistHistoryContext.Provider>
  )
}

export default WorklistHistoryContext
