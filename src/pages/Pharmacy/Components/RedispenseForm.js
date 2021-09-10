import React from 'react'
import * as Yup from 'yup'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Warning from '@material-ui/icons/Warning'
// common components
import {
  GridContainer,
  GridItem,
  RadioGroup,
  TextField,
  withFormikExtend,
} from '@/components'

const styles = theme => ({
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

const RedispenseForm = ({ classes, footer, handleSubmit }) => {
  return (
    <React.Fragment>
      <GridContainer justify='center'>
        <GridItem md={12}>
          <div className={classes.title}>
            <Warning fontSize='large' className={classes.warningIcon} />
            <h4 style={{ textAlign: 'left' }}>
              Please indicate reason for re-dispense
            </h4>
          </div>
        </GridItem>
        <GridItem md={10}>
          <FastField
            name='redispenseBy'
            render={args => (
              <RadioGroup
                {...args}
                label='Required By'
                options={[
                  {
                    value: 'Doctor',
                    label: 'Doctor',
                  },
                  {
                    value: 'Pharmacist',
                    label: 'Pharmacist',
                  },
                  {
                    value: 'Patient',
                    label: 'Patient',
                  },
                  {
                    value: 'Others',
                    label: 'Others',
                  },
                ]}
              />
            )}
          />
        </GridItem>
        <GridItem md={10}>
          <FastField
            name='redispenseReason'
            render={args => <TextField {...args} label='Reason' autoFocus />}
          />
        </GridItem>
      </GridContainer>
      {footer &&
        footer({
          onConfirm: handleSubmit,
        })}
    </React.Fragment>
  )
}

const RedispenseFormFormik = withFormikExtend({
  validationSchema: Yup.object().shape({
    redispenseBy: Yup.string().required(),
    redispenseReason: Yup.string().required(),
  }),
  mapPropsToValues: () => {
    return {}
  },
  handleSubmit: (values, { props }) => {
    const { onConfirmRedispense, onConfirm } = props
    onConfirmRedispense(values)
    onConfirm()
  },
  displayName: 'RedispenseForm',
})(RedispenseForm)

export default withStyles(styles, { name: 'RedispenseForm' })(
  RedispenseFormFormik,
)
