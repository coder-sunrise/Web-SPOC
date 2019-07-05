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

@connect(({patient }) => {
  return ({
    patient
  })
})

@withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ patient }) => {
    console.log('schema map')
    console.log(patient)
    return patient.entity || patient.default
  },
  validationSchema: Yup.object().shape({
    EditingItems: Yup.array().of(
      Yup.object().shape({
        Description: Yup.string().required('Description is required'),
        UnitPrice: Yup.number().required('Unit Price is required'),
      }),
    ),
  }),

  handleSubmit,
  displayName: 'Allergy',
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

  onSaveClick(values) {
    this.setState(this.state)
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
    const { classes, schemes, payers, dispatch,values, ...restProps  } = this.props
    const { height } = this.state

    let patientPayer = []

    console.log('schema render')
    console.log(values)
    return (
      <CardContainer title={this.titleComponent} hideHeader>
                <GridContainer
          alignItems='flex-start'>
             <GridItem xs md={12}>  <h4 className={classes.cardIconTitle} >
            Schemes
            </h4></GridItem>
         <GridItem xs md={12} style={{ marginTop: 8 }}>
          <SchemesGrid
           rows={values.patientScheme.filter((o) => !o.isDeleted)}
            type='Schemes'
            title='Schemes'
            height={height}
            values={values}
            {...restProps}
          />
        </GridItem>
        <GridItem xs md={12}>  <h4 className={classes.cardIconTitle} style={{ marginTop: 20 }}>
            Medisave Payer
            </h4></GridItem>
        <GridItem xs md={12} style={{ marginTop: 8 }}>
          <PayersGrid
          rows={patientPayer}
            type='Payers'
            title='Payers'
            height={height}
          />
        </GridItem>
        </GridContainer>
        {getFooter({
          resetable: true,
          allowSubmit: true,
          ...this.props,
        })}
        </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Schemes)

