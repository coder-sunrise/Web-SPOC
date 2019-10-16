import React, { PureComponent, Component } from 'react'
import { connect } from 'dva'

import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import model from './models'

window.g_app.replaceModel(model)

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ patientAttachment, patient }) => ({
  patientAttachment,
  patient,
}))
class PatientDocument extends Component {
  state = {}

  componentDidMount () {
    const { dispatch } = this.props

    dispatch({
      type: 'patientAttachment/query',
    })
  }

  render () {

    return (
      <div>
        <Filter {...this.props} />
        <Grid {...this.props} />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientDocument)
