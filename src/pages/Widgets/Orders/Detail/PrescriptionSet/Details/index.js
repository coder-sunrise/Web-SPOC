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
const UOMChanged = item => {
  const firstInstruction = (item.prescriptionSetItemInstruction || []).find(
    item => !item.isDeleted,
  )
  if (item.isDrugMixture) {
    const drugMixtures = item.prescriptionSetItemDrugMixture || []
    if (
      drugMixtures.find(
        drugMixture =>
          drugMixture.inventoryDispenseUOMFK !== drugMixture.uomfk ||
          drugMixture.inventoryPrescribingUOMFK !== drugMixture.prescribeUOMFK,
      )
    ) {
      return true
    }
    return false
  }
  return (
    item.inventoryDispenseUOMFK !== item.dispenseUOMFK ||
    firstInstruction?.prescribeUOMFK !== item.inventoryPrescribingUOMFK
  )
}
const Detail = props => {
  const {
    theme,
    footer,
    handleSubmit,
    values,
    setFieldValue,
    codetable,
    generalAccessRight,
    prescriptionSet,
  } = props
  const typeEnable = generalAccessRight.rights === 'enable'
  const items = (prescriptionSet.prescriptionSetItems || []).filter(
    ps => !ps.isDeleted,
  )
  const containsMedication = items.length > 0
  let containsInactiveMedication
  let containsNonOrderableMedication

  items.forEach(item => {
    if (item.isDrugMixture) {
      const drugMixtures = item.prescriptionSetItemDrugMixture || []
      if (drugMixtures.find(drugMixture => !drugMixture.isActive)) {
        containsInactiveMedication = true
      } else if (
        drugMixtures.find(drugMixture => !drugMixture.orderable)
      ) {
        containsNonOrderableMedication = true
      }
    } else {
      if (!item.isActive) {
        containsInactiveMedication = true
      } else if (!item.orderable) {
        containsNonOrderableMedication = true
      }
    }
  })
  const containsUOMChangedMedication =
    items.filter(ps => {
      const firstInstruction = (ps.prescriptionSetItemInstruction || []).find(
        item => !item.isDeleted,
      )
      return UOMChanged(ps)
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
            render={args => {
              return <NumberInput label='Sort Order' precision={0} {...args} />
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

        {!containsMedication && (
          <GridItem
            xs={12}
            style={{ marginTop: theme.spacing(1), color: 'red' }}
          >
            At least one medication is required
          </GridItem>
        )}
        {containsUOMChangedMedication && (
          <GridItem
            xs={12}
            style={{ marginTop: theme.spacing(1), color: 'red' }}
          >
            Update dispense/prescribe UOM to save the prescription set
          </GridItem>
        )}
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
            non-orderable medication&nbsp;&nbsp;
            <span style={{ color: 'red', fontStyle: 'italic' }}>
              <sup>#3&nbsp;</sup>
            </span>
            dispense/prescribe UOM changed&nbsp;&nbsp;
          </span>
          {containsInactiveMedication && (
            <div style={{ color: 'red' }}>
              Remove inactive medication to save the prescription set
            </div>
          )}
          {containsNonOrderableMedication && (
            <div style={{ color: 'red' }}>
              Remove non-orderable medication to save the prescription set
            </div>
          )}
        </GridItem>
      </GridContainer>
      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmBtnText: 'Save',
          confirmProps: {
            disabled:
              !containsMedication ||
              containsInactiveMedication ||
              containsUOMChangedMedication ||
              containsNonOrderableMedication,
          },
        })}
    </React.Fragment>
  )
}
export default compose(
  connect(({ prescriptionSet, user }) => ({
    prescriptionSet,
    user,
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
          ...prescriptionSet.default,
          type: defaultType,
          ownedByUserFK: user.data.id,
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
          prescriptionSetItem: prescriptionSet.prescriptionSetItems || [],
        },
      }).then(r => {
        if (r) {
          resetForm()
          if (onConfirm) onConfirm()
        }
      })
    },
    displayName: 'PrescriptionSetDetail',
  }),
)(Detail)
