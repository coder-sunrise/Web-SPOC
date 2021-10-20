import React, { useContext, useEffect, useState, createContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import { getMappedVisitType } from '@/utils/utils'

const WorklistContext = createContext(null)

export const WorklistContextProvider = props => {
  const dispatch = useDispatch()
  const [detailsId, setDetailsId] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const codetable = useSelector(st => st.codetable)
  const { visitTypeSetting } = useSelector(st => st.clinicSettings.settings)
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
      value={{
        detailsId,
        setDetailsId,
        showDetails,
        setShowDetails,
        visitPurpose,
      }}
    >
      {props.children}
    </WorklistContext.Provider>
  )
}

export default WorklistContext
