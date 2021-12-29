import React, { useContext, useEffect, useState, createContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import { getMappedVisitType } from '@/utils/utils'
import { VISIT_TYPE } from '@/utils/constants'

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

  const getVisitTypes = () => {
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

    if (!visitPurpose) return []
    return visitPurpose
      .filter(p => p.id !== VISIT_TYPE.OTC)
      .map(c => ({
        name: c.name,
        id: c.id,
        customTooltipField: `Code: ${c.code}\nName: ${c.name}`,
      }))
  }

  return (
    // this is the provider providing state
    <WorklistContext.Provider
      value={{
        isAnyModelOpened,
        setIsAnyModelOpened,
        getVisitTypes,
      }}
    >
      {props.children}
    </WorklistContext.Provider>
  )
}

export default WorklistContext
