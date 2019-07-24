import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withFormik } from 'formik'
import * as Yup from 'yup'

import { withStyles } from '@material-ui/core'

import schemesModal from '../models/schemes'
import payersModal from '../models/payers'

import SchemesGrid from './SchemesGrid'
import PayersGrid from './PayersGrid'
import {
  CardContainer,
  CommonHeader,
  GridContainer,
  GridItem,
} from '@/components'
import { handleSubmit, getFooter, componentDidUpdate } from '../utils'

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

class Schemes extends PureComponent {
  state = {
    height: 100,
  }

  onReset () {
    console.log('Schemes-onReset', this)
  }

  onSaveClick (values) {
    this.setState(this.state)
  }

  render () {
    const {
      classes,
      schemes,
      payers,
      dispatch,
      values,
      schema,
      ...restProps
    } = this.props
    return (
      <GridContainer>
        <GridItem xs md={12}>
          <h4 className={classes.cardIconTitle}>Schemes</h4>
        </GridItem>
        <GridItem xs md={12} style={{ marginTop: 8 }}>
          <SchemesGrid
            rows={values.patientScheme}
            schema={schema.patientScheme._subType}
            values={values}
            {...restProps}
          />
        </GridItem>
        <GridItem xs md={12}>
          <h4 className={classes.cardIconTitle} style={{ marginTop: 20 }}>
            Medisave Payer
          </h4>
        </GridItem>
        <GridItem xs md={12} style={{ marginTop: 8 }}>
          <PayersGrid
            rows={values.schemePayer}
            schema={schema.schemePayer._subType}
            values={values}
            {...restProps}
          />
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Schemes)
