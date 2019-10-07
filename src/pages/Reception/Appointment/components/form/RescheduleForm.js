import React from 'react'
import * as Yup from 'yup'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Warning from '@material-ui/icons/Warning'
// common components
import { GridContainer, GridItem, RadioGroup, TextField } from '@/components'

const styles = (theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  spacing: {
    marginBottom: theme.spacing(2),
  },
  warningIcon: {
    margin: theme.spacing.unit * 2,
  },
})

const RescheduleForm = ({ classes, footer, handleSubmit }) => {
  return (
    <React.Fragment>
      <GridContainer justify='center'>
        <GridItem md={12}>
          <div className={classes.title}>
            <Warning fontSize='large' className={classes.warningIcon} />
            <h4 style={{ textAlign: 'left' }}>
              Please indicate reason for reschedule
            </h4>
          </div>
        </GridItem>
        <GridItem md={8}>
          <FastField
            name='rescheduledByFK'
            render={(args) => (
              <RadioGroup
                {...args}
                label='Reschedule By'
                options={[
                  {
                    value: 1,
                    label: 'Clinic',
                  },
                  {
                    value: 2,
                    label: 'Patient',
                  },
                ]}
              />
            )}
          />
        </GridItem>
        <GridItem md={8}>
          <FastField
            name='rescheduleReason'
            render={(args) => (
              <TextField {...args} prefix='Remarks (optional)' />
            )}
          />
        </GridItem>
      </GridContainer>
      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmText: 'Confirm',
        })}
    </React.Fragment>
  )
}

const RescheduleFormFormik = withFormik({
  validationSchema: Yup.object().shape({
    rescheduledByFK: Yup.number().required(),
  }),
  mapPropsToValues: () => {},
  handleSubmit: (values, { props, resetForm }) => {
    const { onConfirmReschedule } = props
    resetForm()
    onConfirmReschedule(values)
  },
})(RescheduleForm)

export default withStyles(styles, { name: 'SeriesConfirmation' })(
  RescheduleFormFormik,
)
