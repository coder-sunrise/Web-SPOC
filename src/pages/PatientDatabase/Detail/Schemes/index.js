import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withFormik } from 'formik'
import * as Yup from 'yup'

import { withStyles } from '@material-ui/core'

import schemesModal from '../models/schemes'
import payersModal from '../models/payers'

import SchemesGrid from './SchemesGrid'
import PayersGrid from './PayersGrid'

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
      <div
        ref={(divElement) => {
          this.divElement = divElement
        }}
        className={classes.container}
      >
        <div className={classes.item}>
          <SchemesGrid
            type='Schemes'
            entity={schemes.entity}
            dispatch={dispatch}
            title='Schemes'
            height={height}
          />
        </div>

        <div className={classes.item}>
          <PayersGrid
            type='Payers'
            entity={payers.entity}
            dispatch={dispatch}
            title='Payers'
            height={height}
          />
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Schemes)

