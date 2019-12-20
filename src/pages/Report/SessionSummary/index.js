import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
import router from 'umi/router'
// formik
import { withFormik } from 'formik'
// material ui
import PageView from '@material-ui/icons/Pageview'
import ReportBase from '../ReportBase'
// common components
import {
  dateFormatLongWithTime,
  Button,
  Tooltip,
} from '@/components'
// sub components
import { ReportDataGrid } from '@/components/_medisys'
// services
import { getBizSession } from '@/pages/Reception/Queue/services/index'
import FilterBar from './FilterBar'

const SessionColumns = [
  { name: 'sessionNo', title: 'Session No.' },
  { name: 'sessionStartDate', title: 'Session Start Date' },
  { name: 'sessionCloseDate', title: 'Session Close Date' },
  { name: 'isClinicSessionClosed', title: 'Status' },
  { name: 'action', title: 'Action' },
]


class SessionSummary extends ReportBase {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      isDisplayReportLayout: false,
    }
    console.log('super.defaultState', this.xx)
  }

  viewSessionSummaryReport = (row) => {
    router.push(`/report/sessionsummary/${row.id}`)
  }

  getReportDatas = async (params) => {
    try {
      let criteria = {
        pagesize: 99999,
        lgteql_sessionStartDate: params.dateFrom,
        sorting: [
          { columnName: 'sessionStartDate', direction: 'desc' },
        ],
      }
      if (params.dateTo) {
        criteria.lsteql_sessionCloseDate = params.dateTo
      }
      const result = await getBizSession(criteria)
      const { status, data } = result
      if (status === '200') {
        return data.data
      }
    } catch (error) {
      console.log({ error })
    }
    return null
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return <FilterBar handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
  }

  renderContent = (reportDatas) => {
    if (!reportDatas) return null
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
              onClick={() => this.viewSessionSummaryReport(row)}
            >
              <PageView />
            </Button>
          </Tooltip>
        ),
      },
    ]
    return <ReportDataGrid
      height='80vh'
      onRowDoubleClick={this.viewSessionSummaryReport}
      data={reportDatas}
      columns={SessionColumns}
      columnExtensions={columnExtensions}
    />
  }
}

const SessionSummaryWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).add(-3, 'month').toDate(),
    dateTo: moment(new Date()).toDate(),
    filterType: 'Credit Note',
  }),
})(SessionSummary)
export default SessionSummaryWithFormik

