import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'dva'
import _ from 'lodash'
import { getMappedVisitType } from '@/utils/utils'

export function useVisitTypes() {
  const dispatch = useDispatch()
  const [ctvisitpurpose, setCtVisitPurpose] = useState([])
  const { visitTypeSetting } = useSelector(st => st.clinicSettings.settings)

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
  let visitTypes = []
  if (visitTypeSetting) {
    try {
      visitTypeSettingsObj = JSON.parse(visitTypeSetting)
    } catch {}
  }

  if ((ctvisitpurpose || []).length > 0) {
    visitTypes = getMappedVisitType(
      ctvisitpurpose,
      visitTypeSettingsObj,
    ).filter(vstType => vstType['isEnabled'] === 'true')
  }

  return visitTypes
}
