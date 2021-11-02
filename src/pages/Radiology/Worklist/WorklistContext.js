import React, { useContext, useEffect, useState, createContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import { getMappedVisitType } from '@/utils/utils'

const WorklistContext = createContext(null)

export const WorklistContextProvider = props => {
  const dispatch = useDispatch()
  const [detailsId, setDetailsIdInternal] = useState(null)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const codetable = useSelector(st => st.codetable)
  const { visitTypeSetting } = useSelector(st => st.clinicSettings.settings)
  const clinicianProfile = useSelector(st => st.user.data.clinicianProfile)
  const [ctvisitpurpose, setCtVisitPurpose] = useState([])
  const [lastFilter, setLastFilter] = useState({})
  const [refreshDate, setRefreshDate] = useState(moment())

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

  const getPrimaryWorkitem = workitem => {
    const { visitWorkitems } = workitem
    if (visitWorkitems && visitWorkitems.length > 0) {
      const primaryWorkitemFK = visitWorkitems.find(
        c => c.radiologyWorkitemId === workitem.radiologyWorkitemId,
      ).primaryWorkitemFK
      if (primaryWorkitemFK) {
        const primaryWorkitem = visitWorkitems.find(
          c => c.radiologyWorkitemId === primaryWorkitemFK,
        )
        return primaryWorkitem
      }
    }
  }

  const getCombinedOrders = workitem => {
    if (
      workitem.primaryWorkitemFK === null ||
      workitem.primaryWorkitemFK === undefined
    )
      return []

    const { visitWorkitems } = workitem
    if (visitWorkitems && visitWorkitems.length > 0) {
      const primaryWorkitemFK = visitWorkitems.find(
        c => c.radiologyWorkitemId === workitem.radiologyWorkitemId,
      ).primaryWorkitemFK

      return [
        visitWorkitems.find(
          v => v.radiologyWorkitemId === workitem.radiologyWorkitemId,
        ),
        ...visitWorkitems.filter(
          v =>
            v.primaryWorkitemFK === primaryWorkitemFK &&
            v.radiologyWorkitemId !== workitem.radiologyWorkitemId,
        ),
      ]
    }
  }

  const filterWorklist = param => {
    const currentFilter = param ?? lastFilter

    const {
      searchValue,
      visitType,
      modality,
      dateFrom,
      dateTo,
      isUrgent,
      isMyPatientOnly,
    } = currentFilter

    dispatch({
      type: 'radiologyWorklist/query',
      payload: {
        apiCriteria: {
          searchValue: searchValue,
          visitType: visitType
            ? visitType.filter(t => t !== -99).join(',')
            : undefined,
          modality: modality
            ? modality.filter(t => t !== -99).join(',')
            : undefined,
          filterFrom: dateFrom,
          filterTo: moment(dateTo)
            .endOf('day')
            .formatUTC(false),
          isUrgent: isUrgent,
          clinicianProfileId: isMyPatientOnly ? clinicianProfile.id : undefined,
        },
      },
    }).then(val => {
      if (val) {
        setRefreshDate(moment())
      }
    })
    setLastFilter({ ...currentFilter })
  }

  const setDetailsId = (id, readonly = false) => {
    setIsReadOnly(readonly)
    setDetailsIdInternal(id)

    //set back the default value.
    if (!id) setIsReadOnly(false)
  }

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
        isReadOnly,
        setDetailsId,
        visitPurpose,
        refreshDate,
        setRefreshDate,
        filterWorklist,
        getPrimaryWorkitem,
        getCombinedOrders,
      }}
    >
      {props.children}
    </WorklistContext.Provider>
  )
}

export default WorklistContext
