import React from 'react'
// formik
import { FastField, Formik } from 'formik'
// material ui
import { Divider, withStyles } from '@material-ui/core'
// common components
import { Danger, GridItem, NumberInput, Select, TextField } from '@/components'

const styles = (theme) => ({
  info: {
    marginTop: theme.spacing(1),
  },
})

const ClaimDetailsSection = ({ classes, readOnly = true }) => (
  <React.Fragment>
    <GridItem md={12} container>
      <GridItem md={5}>
        <FastField
          name='hrnNo'
          render={(args) => (
            <TextField {...args} label='HRN No.' disabled={!readOnly} />
          )}
        />
      </GridItem>
      <GridItem md={1} />
      <GridItem md={5}>
        <FastField
          name='claimStatus'
          render={(args) => (
            <TextField {...args} label='Claim Status' disabled={!readOnly} />
          )}
        />
      </GridItem>
      <GridItem md={5}>
        <FastField
          name='payerName'
          render={(args) => <TextField {...args} label='Payer Name' disabled />}
        />
      </GridItem>
      <GridItem md={1} />
      <GridItem md={5}>
        <FastField
          name='payerDOB'
          render={(args) => <TextField {...args} label='Payer DOB' disabled />}
        />
      </GridItem>
      <GridItem md={5}>
        <FastField
          name='payerAccNo'
          render={(args) => (
            <TextField {...args} label='Payer Account No.' disabled />
          )}
        />
      </GridItem>
      <GridItem md={7} />

      <GridItem md={5}>
        <FastField
          name='chargeCode'
          render={(args) => (
            <TextField {...args} label='Charge Code' disabled={!readOnly} />
          )}
        />
      </GridItem>
      <GridItem md={1} />
      <GridItem md={5}>
        <FastField
          name='admissionType'
          render={(args) => (
            <TextField {...args} label='Admission Type' disabled />
          )}
        />
      </GridItem>
      <GridItem md={5}>
        <FastField
          name='diagnosis'
          render={(args) => (
            <Select
              {...args}
              label='Diagnosis'
              options={[
                { name: 'Asthma', value: 'asthma' },
                { name: 'Hypertension', value: 'hypertension' },
              ]}
              disabled
            />
          )}
        />
      </GridItem>
      <GridItem md={7} />
      <GridItem md={5}>
        <FastField
          name='claimAmount'
          render={(args) => (
            <NumberInput {...args} disabled currency label='Claim Amount' />
          )}
        />
      </GridItem>
      <GridItem md={7} />
      <GridItem md={12} className={classes.info}>
        <Danger>
          <i>
            *Draft claim record is not editable. Please end the current business
            session to edit claim record and view invocie.
          </i>
        </Danger>
      </GridItem>
    </GridItem>
  </React.Fragment>
)

export default withStyles(styles, { name: 'ClaimDetailsSection' })(
  ClaimDetailsSection,
)
