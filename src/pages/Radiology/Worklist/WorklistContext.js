import React, { useContext, useEffect, useState, createContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import { VALUE_KEYS } from '@/utils/constants'
import { useVisitTypes } from '@/utils/hooks'
import { refresh } from '@/services/login'
const WorklistContext = createContext(null)

export const WorklistContextProvider = props => {
  const dispatch = useDispatch()
  const [detailsId, setDetailsIdInternal] = useState(null)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const codetable = useSelector(st => st.codetable)
  const clinicianProfile = useSelector(st => st.user.data.clinicianProfile)
  const oriQCallList = useSelector(st => st.queueCalling.oriQCallList)
  const [refreshDate, setRefreshDate] = useState(moment())
  const [radiologyQueueCallList, setRadiologyQueueCallList] = useState([])
  const [pharmacyQueueCallList, setPharmacyQueueCallList] = useState([])
  const [currentFilter, setCurrentFilter] = useState(null)
  const { settings } = useSelector(s => s.clinicSettings)
  const { autoRefreshRadiologyWorklistInterval = 30 } = settings
  const visitTypes = useVisitTypes()

  const timer = React.useRef(null)

  const stopTimer = () => {
    clearInterval(timer.current)
    console.log('WorklistContext - Timer Stopped.', timer.current, new Date())
  }

  const startTimer = () => {
    stopTimer()
    timer.current = setInterval(() => {
      refreshWorklist()
    }, autoRefreshRadiologyWorklistInterval * 1000)

    console.log('WorklistContext - Timer Started.', timer.current, new Date())
  }

  useEffect(() => {
    if (oriQCallList) {
      setRadiologyQueueCallList(
        oriQCallList.filter(
          x => x.from === 'Radiology' && x.roomCode === roomCode,
        ),
      )
      setPharmacyQueueCallList(
        oriQCallList.filter(
          x => x.from === 'Pharmacy' && x.roomCode === roomCode,
        ),
      )
    }
  }, [oriQCallList])

  useEffect(() => {
    if (currentFilter) refreshWorklist()

    return () => {
      console.log('WorklistContext -  cleanup')
      stopTimer()
    }
  }, [currentFilter])

  const roomCode = localStorage.getItem('roomCode')

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

  const filterWorklist = filterParam => {
    setCurrentFilter({ ...filterParam })
  }

  const refreshWorklist = () => {
    if (!currentFilter) return

    const {
      searchValue,
      visitType,
      modality,
      dateFrom,
      dateTo,
      isUrgent,
      isMyPatientOnly,
    } = currentFilter

    stopTimer()
    dispatch({
      type: 'radiologyWorklist/query',
      payload: {
        pagesize: 9999,
        apiCriteria: {
          searchValue: searchValue,
          visitType: visitType
            ? visitType.filter(t => t !== -99).join(',')
            : undefined,
          modality: modality
            ? modality.filter(t => t !== -99).join(',')
            : undefined,
          filterFrom: dateFrom,
          filterTo: dateTo
            ? moment(dateTo)
                .endOf('day')
                .formatUTC(false)
            : undefined,
          isUrgent: isUrgent,
          clinicianProfileId: isMyPatientOnly ? clinicianProfile.id : undefined,
        },
      },
    }).then(val => {
      if (val) {
        setRefreshDate(moment())
        startTimer()
      }
    })
  }

  const setDetailsId = (id, readonly = false) => {
    stopTimer()
    setIsReadOnly(readonly)
    setDetailsIdInternal(id)

    //set back the default value.
    if (!id) {
      setIsReadOnly(false)
      startTimer()
    }
  }

  return (
    // this is the provider providing state
    <WorklistContext.Provider
      value={{
        detailsId,
        isReadOnly,
        setDetailsId,
        refreshDate,
        setRefreshDate,
        refreshWorklist,
        filterWorklist,
        getPrimaryWorkitem,
        getCombinedOrders,
        radiologyQueueCallList,
        pharmacyQueueCallList,
        visitTypes,
      }}
    >
      {props.children}
    </WorklistContext.Provider>
  )
}

export default WorklistContext
