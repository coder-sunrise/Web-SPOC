import React from 'react'
import classnames from 'classnames'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import { Button, GridItem, AntdInput, TextField } from '@/components'
import style from './style'

const PatientInfoInput = ({ classes, onSearchPatient, onCreatePatient }) => {
  return (
    <React.Fragment>
      <GridItem xs md={6}>
        <FastField
          name='patientName'
          render={(args) => {
            return (
              <AntdInput
                {...args}
                autoFocus
                onEnterPressed={onSearchPatient}
                label='Patient Name'
              />
            )
          }}
        />
      </GridItem>
      <GridItem xs md={6}>
        <div className={classnames(classes.buttonGroup)}>
          <Button size='sm' color='primary' onClick={onSearchPatient}>
            Search
          </Button>
          <Button size='sm' color='primary' onClick={onCreatePatient}>
            Create Patient
          </Button>
        </div>
      </GridItem>
      <GridItem xs md={6}>
        <FastField
          name='contactNo'
          render={(args) => <AntdInput {...args} label='Contact No.' />}
        />
      </GridItem>
    </React.Fragment>
  )
}

export default withStyles(style, { name: 'AppointmentForm.PatientInfo' })(
  PatientInfoInput,
)
