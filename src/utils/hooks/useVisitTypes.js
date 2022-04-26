import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'dva'
import _ from 'lodash'
import { getMappedVisitType } from '@/utils/utils'

export function useVisitTypes(allTypes) {
  const dispatch = useDispatch()
  const [ctvisitpurpose, setCtVisitPurpose] = useState([])
  const { visitTypeSetting } = useSelector(st => st.clinicSettings.settings)
  const codetable = useSelector(st => st.codetable)

  console.log('codetable.ctvisitpurpose', codetable.ctvisitpurpose)
  useEffect(() => {
    !codetable.ctvisitpurpose || codetable.ctvisitpurpose.length === 0
      ? dispatch({
          type: 'codetable/fetchCodes',
          payload: {
            code: 'ctvisitpurpose',
          },
        }).then(v => {
          setCtVisitPurpose(v)
        })
      : setCtVisitPurpose(codetable.ctvisitpurpose)
  }, [codetable])

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
    ).filter(vstType => (allTypes ? true : vstType['isEnabled'] === 'true'))
  }

  return visitTypes
}
