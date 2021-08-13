import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import { connect } from 'dva'
import { compose } from 'redux'
import { Divider } from '@material-ui/core'
import {
  withFormikExtend,
  FastField,
  Field,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  NumberInput,
  CodeSelect,
  RadioGroup,
} from '@/components'
import PrescriptionItem from './PrescriptionItem'
import Grid from './Grid'

const Detail = (props) => {
  const { theme, footer, handleSubmit, values, setFieldValue, codetable, generalAccessRight, prescriptionSet } = props
  const typeEnable = generalAccessRight.rights === 'enable'
  const containsMedication = (prescriptionSet.prescriptionSetItems || []).filter(ps => !ps.isDeleted).length > 0
  const containsInactiveMedication = (prescriptionSet.prescriptionSetItems || []).filter(ps => !ps.isDeleted && !ps.isActive).length > 0
  const containsUOMChangedMedication = (prescriptionSet.prescriptionSetItems || []).filter(ps => {
    const firstInstruction = (ps.prescriptionSetItemInstruction || []).find(item => !item.isDeleted)
    return !ps.isDeleted && !ps.isDrugMixture
      && (ps.inventoryDispenseUOMFK !== ps.dispenseUOMFK
        || firstInstruction?.prescribeUOMFK !== ps.inventoryPrescribingUOMFK)
  }).length > 0
  return (
    <React.Fragment>
      <GridContainer>
        <GridItem xs={6}>
          <FastField
            name='prescriptionSetName'
            render={args => {
              return (
                <TextField
                  label='Prescription Set Name'
                  {...args}
                  autocomplete='off'
                  maxLength={100}
                  autoFocus
                />
              )
            }}
          />
        </GridItem>
        <GridItem md={2}>
          <FastField
            name='sortOrder'
            render={(args) => {
              return (
                <NumberInput
                  label='Sort Order'
                  precision={0}
                  {...args}
                />
              )
            }}
          />
        </GridItem>

        <GridItem xs={4} style={{ marginTop: theme.spacing(2) }}>
          <FastField
            name='type'
            render={args => {
              return (
                <RadioGroup
                  disabled={!typeEnable}
                  label=''
                  options={[
                    {
                      value: 'General',
                      label: 'General',
                    },
                    {
                      value: 'Personal',
                      label: 'Personal',
                    },
                  ]}
                  {...args}
                />
              )
            }}
          />
        </GridItem>

        <PrescriptionItem {...props} />

        <div
          style={{
            marginBottom: theme.spacing(1),
            marginLeft: theme.spacing(1),
            paddingRight: theme.spacing(8),
          }}
        >
          <Divider />
        </div>

        <Grid {...props} />

        {!containsMedication &&
          <GridItem xs={12} style={{ marginTop: theme.spacing(1), color: 'red' }}>
            At least one medication is required
          </GridItem>
        }
        {containsUOMChangedMedication &&
          <GridItem xs={12} style={{ marginTop: theme.spacing(1), color: 'red' }}>
            Update dispense/prescribe UOM to save the prescription set
          </GridItem>
        }
        <GridItem xs={12} style={{ marginTop: theme.spacing(1) }}>
          <span>
            Note:&nbsp;
            <span style={{ color: 'red', fontStyle: 'italic' }}>
              <sup>#1&nbsp;</sup>
            </span>
            inactive medication &nbsp;&nbsp;
            <span style={{ color: 'red', fontStyle: 'italic' }}>
              <sup>#2&nbsp;</sup>
            </span>
            dispense/prescribe UOM is changed&nbsp;&nbsp;
          </span>
          {containsInactiveMedication && <span style={{ color: 'red', marginLeft: 20 }}>Remove inactive medication to save the prescription set</span>}
        </GridItem>
      </GridContainer>
      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmBtnText: 'Save',
          confirmProps: {
            disabled: !containsMedication || containsInactiveMedication || containsUOMChangedMedication,
          },
        })}
    </React.Fragment>
  )
}
export default compose(
  connect(({ prescriptionSet, user }) => ({
    prescriptionSet,
    user
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ prescriptionSet, user, generalAccessRight }) => {
      let defaultType = 'General'
      if (generalAccessRight.rights !== 'enable') {
        defaultType = 'Personal'
      }
      return {
        ...(prescriptionSet.entity || {
          ...prescriptionSet.default, type: defaultType,
          ownedByUserFK: user.data.id
        }),
      }
    },
    validationSchema: Yup.object().shape({
      prescriptionSetName: Yup.string().required(),
    }),
    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, onConfirm, prescriptionSet } = props
      dispatch({
        type: 'prescriptionSet/upsert',
        payload: {
          ...values,
          prescriptionSetItem: prescriptionSet.prescriptionSetItems || []
        },
      }).then((r) => {
        if (r) {
          resetForm()
          if (onConfirm) onConfirm()
        }
      })
    },
    displayName: 'PrescriptionSetDetail',
  }),
)(Detail)
