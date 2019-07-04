import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withFormik } from 'formik'
import * as Yup from 'yup'

import { withStyles } from '@material-ui/core'

import schemesModal from '../models/schemes'
import payersModal from '../models/payers'

import {  CardContainer, CommonHeader, GridContainer, GridItem } from '@/components'


window.g_app.replaceModel(schemesModal)
window.g_app.replaceModel(payersModal)

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})

@connect(({ schemes, payers }) => {
  return ({
    schemes,
    payers,
  })
})

class AppointmentHistory extends PureComponent {
  state = {
    height: 100,
  }

  componentDidMount () {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  onReset () {
    console.log('Schemes-onReset', this)
  }

  resize () {
    if (this.divElement) {
      const height = this.divElement.clientHeight
      if (height > 0) {
        this.setState({ height: height > 0 ? height / 2 - 144 : 300 })
      }
    }
  }

  render () {
    const { classes, schemes, payers, dispatch } = this.props
    const { height } = this.state

    return (
      <CardContainer title={this.titleComponent} hideHeader>
                <GridContainer
          alignItems='flex-start'>
        </GridContainer>
        </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AppointmentHistory)

