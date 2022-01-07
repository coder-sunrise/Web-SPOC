import React, { useContext, useEffect, useState, createContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import { getMappedVisitType } from '@/utils/utils'
import { VISIT_TYPE } from '@/utils/constants'

const WorklistContext = createContext(null)

export const WorklistContextProvider = props => {
  const dispatch = useDispatch()
  const { visitTypeSetting } = useSelector(st => st.clinicSettings.settings)
  const [isAnyWorklistModelOpened, setIsAnyWorklistModelOpened] = useState(
    false,
  )
  const [ctvisitpurpose, setCtVisitPurpose] = useState([])

  useEffect(() => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctvisitpurpose',
      },
    }).then(v => {
      setCtVisitPurpose(v)
    })
  }, [])

  return (
    // this is the provider providing state
    <WorklistContext.Provider
      value={{
        isAnyWorklistModelOpened,
        setIsAnyWorklistModelOpened,
      }}
    >
      {props.children}
    </WorklistContext.Provider>
  )
}

export default WorklistContext
