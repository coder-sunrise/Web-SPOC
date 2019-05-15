import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withFormik, FastField } from 'formik'
import * as Yup from 'yup'
import { withStyles } from '@material-ui/core'
import { notification, Checkbox } from '@/components'

import allergyModal from '../models/allergy'
import AllergyGrid from './AllergyGrid'

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

@connect(({ allergy }) => ({
  allergy,
}))

@withFormik({
  mapPropsToValues: ({ allergy }) => {
    return allergy.entity
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

  componentDidMount () {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  onReset () {
    console.log(this, 'Allergy-onReset')
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
    const { height } = this.state
    const { classes, allergy, dispatch } = this.props

    return (
      <div
        ref={(divElement) => {
          this.divElement = divElement
        }}
        className={classes.container}
      >
        <div className={classes.item}>
          <AllergyGrid
            type='Allergy'
            entity={allergy.entity}
            dispatch={dispatch}
            title='Allergy'
            titleChildren={
              <div
                style={{
                  right: 0,
                  top: 0,
                  position: 'absolute',
                }}
              >
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
              </div>
            }
            height={height}
          />
        </div>
        <div className={classes.item}>
          <AllergyGrid
            type='Alert'
            entity={allergy.entity}
            dispatch={dispatch}
            title='Medical Alert'
            height={height}
          />
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Allergies)
