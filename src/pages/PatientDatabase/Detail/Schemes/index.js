import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withFormik } from 'formik'
import * as Yup from 'yup'

import { withStyles } from '@material-ui/core'

import schemesModal from '../models/schemes'
import payersModal from '../models/payers'

import SchemesGrid from './SchemesGrid'
import PayersGrid from './PayersGrid'
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

class Schemes extends PureComponent {
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
             <GridItem xs md={12}>  <h4 className={classes.cardIconTitle} >
            Schemes
            </h4></GridItem>
         <GridItem xs md={12} style={{ marginTop: 8 }}>
          <SchemesGrid
            type='Schemes'
            entity={schemes.entity}
            dispatch={dispatch}
            title='Schemes'
            height={height}
          />
        </GridItem>
        <GridItem xs md={12}>  <h4 className={classes.cardIconTitle} style={{ marginTop: 20 }}>
            Payers
            </h4></GridItem>
        <GridItem xs md={12} style={{ marginTop: 8 }}>
          <PayersGrid
            type='Payers'
            entity={payers.entity}
            dispatch={dispatch}
            title='Payers'
            height={height}
          />
        </GridItem>
        </GridContainer>
        </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Schemes)

