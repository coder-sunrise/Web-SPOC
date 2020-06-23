import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'dva'
import classnames from 'classnames'
import { withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  CardContainer,
  Accordion,
  withFormikExtend,
} from '@/components'
import Authorized from '@/utils/Authorized'

import PatientNurseNotesContent from '@/pages/PatientDatabase/Detail/PatientNurseNotes/content'
import model from '@/pages/PatientDatabase/Detail/PatientNurseNotes/models'

window.g_app.replaceModel(model)

@connect(({ patient, patientNurseNotes }) => ({
  patient,
  patientNurseNotes,
}))
class PatientNurseNotes extends Component {
  componentDidMount () {
    this.refreshNurseNotes()
  }

  refreshNurseNotes = () => {
    const { dispatch, patient } = this.props
    const payload = {
      PatientProfileFK: patient.entity.id,
      pagesize: 999,
      version: Date.now(),
      sorting: [
        { columnName: 'createDate', direction: 'desc' },
      ],
    }

    dispatch({
      type: 'patientNurseNotes/query',
      payload,
    })
  }

  render () {
    const { dispatch, patientNurseNotes = {} } = this.props
    const { list = [] } = patientNurseNotes
    return (
      <GridContainer>
        <GridItem md={12}>
          {list.map((i) => (
            <PatientNurseNotesContent
              entity={i}
              dispatch={dispatch}
              canEdit={false}
            />
          ))}
        </GridItem>
      </GridContainer>
    )
  }
}

export default PatientNurseNotes
