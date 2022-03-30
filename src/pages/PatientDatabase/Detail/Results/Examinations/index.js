import React, { Component, useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {} from '@/components'
import FilterBar from './FilterBar'
import LabExaminations from './LabExaminations'
import RadiologyExaminations from './RadiologyExaminations'
import { SelectionState } from '@devexpress/dx-react-grid'
import moment from 'moment'
import { useDispatch } from 'react-redux'

const styles = theme => ({})
const Examinations = props => {
  const [category, setCategory] = useState('Lab')
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useDispatch()
  const { patientProfileFK } = props
  const search = values => {
    const {
      visitDate,
      allDate,
      category,
      examinationName,
      doctorIDs,
      status,
    } = values

    const visitFromDate =
      visitDate && visitDate.length > 0
        ? moment(visitDate[0])
            .set({ hour: 0, minute: 0, second: 0 })
            .formatUTC(false)
        : undefined
    const visitToDate =
      visitDate && visitDate.length > 1
        ? moment(visitDate[1])
            .set({ hour: 23, minute: 59, second: 59 })
            .formatUTC(false)
        : undefined
    const payload = {
      patientProfileFK: patientProfileFK,
      visitFromDate: allDate ? undefined : visitFromDate || undefined,
      visitToDate: allDate ? undefined : visitToDate || undefined,
      examinationName: examinationName || undefined,
      category: category,
      doctorIds: doctorIDs,
      status: status,
    }
    dispatch({
      type: 'patientResults/queryExaminationsList',
      payload: { ...payload, currentPage: currentPage },
    }).then(response => {
      if (response && response.status === '200') {
      }
    })
  }
  return (
    <div>
      <FilterBar search={search} {...props}></FilterBar>
      {category === 'Lab' && <LabExaminations></LabExaminations>}
      {category === 'Radiology' && (
        <RadiologyExaminations></RadiologyExaminations>
      )}
    </div>
  )
}
export default withStyles(styles, { withTheme: true })(Examinations)
