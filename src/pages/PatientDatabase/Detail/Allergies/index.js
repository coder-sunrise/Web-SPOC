import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withFormik, FastField } from 'formik'
import * as Yup from 'yup'
import { withStyles } from '@material-ui/core'
import { notification, Checkbox, CardContainer, CommonHeader, Select, GridContainer, GridItem } from '@/components'

import allergyModal from '../models/allergy'
import AllergyGrid from './AllergyGrid'
import { handleSubmit, getFooter, componentDidUpdate } from '../utils'

window.g_app.replaceModel(allergyModal)

const styles = () => ({
  collectPaymentBtn: { float: 'right', marginTop: '22px', marginRight: '10px' },
  item: {},
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})

@withFormik({
  mapPropsToValues: ({ patient }) => {
    console.log('allergy map')
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

  handleSubmit: (values, { props }) => {
    props
      .dispatch({
        type: 'addPayment/submit',
        payload: values,
      })
      .then((r) => {
        if (r.message === 'Ok') {
          notification.success({
            message: 'Done',
          })
          if (props.onConfirm) props.onConfirm()
        }
      })
  },
  displayName: 'Allergy',
})

class Allergies extends PureComponent {
  state = {
    height: 0,
  }

  onSaveClick(values){
    console.log('here update')
    console.log(values)
  }

  componentDidMount() {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  onReset() {
    console.log(this, 'Allergy-onReset')
  }

  resize() {
    if (this.divElement) {
      const height = this.divElement.clientHeight
      if (height > 0) {
        this.setState({ height: height > 0 ? height / 2 - 144 : 300 })
      }
    }
  }

  render() {
    const { height } = this.state
    const { classes, allergy, dispatch,patient,values, ...restProps } = this.props
   
    console.log('allergy render')
    console.log(values)
    return (
      <CardContainer title={this.titleComponent} hideHeader>
        <GridContainer
          alignItems='flex-start'>
          <GridItem xs md={12}>
            <FastField
              name='HasAllergy'
              render={(args) => {
                return (
                  <Checkbox
                    simple
                    label={"This patient doesn't has any allergy"}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs md={3} style={{ marginTop: -10 }}>
            <FastField
              name='G6PD'
              render={(args) => (
                <Select
                  {...args}
                  options={[
                    { name: 'Yes', value: 1 },
                    { name: 'No', value: 0 },
                  ]}
                  label={"G6PD Deficiency"}
                />
              )}
            />
          </GridItem>

          <GridItem xs md={12}>  <h4 className={classes.cardIconTitle} style={{ marginTop: 20 }}>
            Allergy
            </h4></GridItem>
          <GridItem xs md={12} style={{ marginTop: 8 }}>
            <AllergyGrid
              type='Allergy'
              title='Allergy'
              height={height}
              onSaveClick = {this.onSaveClick}
              values = {values}
              {...restProps}
            />
          </GridItem>

          <GridItem xs md={12}>  <h4 className={classes.cardIconTitle} style={{ marginTop: 20 }}>
            Medical Alert
            </h4></GridItem>

          <GridItem xs md={12} style={{ marginTop: 8 }}>
            <AllergyGrid
              type='Alert'
              title='Medical Alert'
              height={height}
              values = {values}
              {...restProps}
            />
          </GridItem>
        </GridContainer>
        {getFooter({
            resetable: true,
            ...this.props,
          })}
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Allergies)
