import React, { useContext, useEffect, useState, createContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import { getMappedVisitType } from '@/utils/utils'

const WorklistContext = createContext(null)

export const WorklistContextProvider = props => {
  const dispatch = useDispatch()
  const { visitTypeSetting } = useSelector(st => st.clinicSettings.settings)
  const [isAnyModelOpened, setIsAnyModelOpened] = useState(false)
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

  let visitTypeSettingsObj = undefined
  let visitPurpose = undefined
  if (visitTypeSetting) {
    try {
      visitTypeSettingsObj = JSON.parse(visitTypeSetting)
    } catch {}
  }

  if ((ctvisitpurpose || []).length > 0) {
    visitPurpose = getMappedVisitType(
      ctvisitpurpose,
      visitTypeSettingsObj,
    ).filter(vstType => vstType['isEnabled'] === 'true')
  }

  return (
    // this is the provider providing state
    <WorklistContext.Provider
      value={{ isAnyModelOpened, setIsAnyModelOpened, visitPurpose }}
    >
      {props.children}
    </WorklistContext.Provider>
  )
}

export default WorklistContext
