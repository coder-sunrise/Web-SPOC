import React, { useContext, useEffect, useState, createContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import { getMappedVisitType } from '@/utils/utils'
import { VISIT_TYPE } from '@/utils/constants'

const WorklistContext = createContext(null)

export const WorklistContextProvider = props => {
  const dispatch = useDispatch()
  const [isAnyWorklistModelOpened, setIsAnyWorklistModelOpened] = useState(
    false,
  )
  const [detailsId, setDetailsId] = useState(undefined)
  const [formCategory, setFormCategory] = useState(undefined)
  const [showForms, setShowForms] = useState(false)

  return (
    // this is the provider providing state
    <WorklistContext.Provider
      value={{
        isAnyWorklistModelOpened,
        setIsAnyWorklistModelOpened,
        detailsId,
        setDetailsId,
        showForms,
        setShowForms,
      }}
    >
      {props.children}
    </WorklistContext.Provider>
  )
}

export default WorklistContext
