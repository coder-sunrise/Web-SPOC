import React, { useEffect, useReducer } from 'react'
import moment from 'moment'
import router from 'umi/router'
// material ui
import PageView from '@material-ui/icons/Pageview'
// common components
import {
  dateFormatLongWithTime,
  Button,
  Tooltip,
  CardContainer,
} from '@/components'
// sub components
import { ReportDataGrid } from '@/components/_medisys'
// services
import { getBizSession } from '@/pages/Reception/Queue/services/index'

const SessionColumns = [
  { name: 'sessionNo', title: 'Session No.' },
  { name: 'sessionStartDate', title: 'Session Start Date' },
  { name: 'sessionCloseDate', title: 'Session Close Date' },
  { name: 'isClinicSessionClosed', title: 'Status' },
  { name: 'action', title: 'Action' },
]

const initialState = {
  loaded: false,
  isLoading: false,
  activePanel: -1,
  sessionData: [],
}
const reducer = (state, action) => {
  switch (action.type) {
    case 'toggleLoading':
      return { ...state, isLoading: !state.isLoading }
    case 'setActivePanel':
      return { ...state, activePanel: action.payload }
    case 'setLoaded':
      return { ...state, loaded: action.payload }
    case 'updateState': {
      return { ...state, ...action.payload }
    }
    case 'reset':
      return { ...initialState }
    default:
      throw new Error()
  }
}

const SessionSummary = () => {
  const [
    state,
    dispatch,
  ] = useReducer(reducer, initialState)

  const getAllSession = async () => {
    try {
      const result = await getBizSession({
        pagesize: 99999,
        sorting: [
          { columnName: 'sessionStartDate', direction: 'desc' },
        ],
      })
      const { status, data } = result
      if (status === '200') {
        dispatch({
          type: 'updateState',
          payload: {
            sessionData: data.data,
          },
        })
      }
    } catch (error) {
      console.log({ error })
    }
  }

  const viewSessionSummaryReport = (row) => {
    router.push(`/report/sessionsummary/${row.id}`)
  }

  useEffect(() => {
    /* 
    clean up function
    set data to empty array when leaving the page 
    */
    getAllSession()
    return () =>
      dispatch({
        type: 'reset',
      })
  }, [])

  const columnExtensions = [
    {
      columnName: 'isClinicSessionClosed',
      sortingEnabled: false,
      render: (row) => (row.isClinicSessionClosed ? 'Closed' : 'Ongoing'),
    },
    {
      columnName: 'sessionStartDate',
      sortingEnabled: false,
      render: (row) =>
        moment(row.sessionStartDate).format(dateFormatLongWithTime),
    },
    {
      columnName: 'sessionCloseDate',
      sortingEnabled: false,
      render: (row) =>
        row.sessionCloseDate
          ? moment(row.sessionCloseDate).format(dateFormatLongWithTime)
          : '',
    },
    {
      align: 'center',
      columnName: 'action',
      // width: 240,
      render: (row) => (
        <Tooltip title='View Session Summary Report'>
          <Button
            className='noPadding'
            color='primary'
            size='sm'
            id={row.id}
            justIcon
            rounded
            onClick={() => viewSessionSummaryReport(row)}
          >
            <PageView />
          </Button>
        </Tooltip>
      ),
    },
  ]
  console.log({ data: state.sessionData })
  return (
    <CardContainer hideHeader>
      <h4 style={{ marginBottom: 16 }}>All Sessions</h4>
      <ReportDataGrid
        height='80vh'
        onRowDoubleClick={viewSessionSummaryReport}
        data={state.sessionData}
        columns={SessionColumns}
        columnExtensions={columnExtensions}
      />
    </CardContainer>
  )
}

export default SessionSummary
