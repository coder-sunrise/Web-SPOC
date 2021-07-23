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
  Checkbox
} from '@/components'
import PrescriptionItem from './PrescriptionItem'
import Grid from './Grid'

const Detail = (props) => {
  const { theme, footer, handleSubmit, values, setFieldValue, codetable } = props

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
                  maxLength={200}
                  autoFocus
                />
              )
            }}
          />
        </GridItem>

        <GridItem xs={6} style={{ marginTop: theme.spacing(2) }}>
          <FastField
            name='isShared'
            render={args => {
              return (
                <Checkbox
                  label='Shared'
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
      </GridContainer>
      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmBtnText: 'Save',
          confirmProps: {
            disabled: (values.prescriptionSetItem || []).filter(ps => !ps.isDeleted).length <= 0,
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
    mapPropsToValues: ({ prescriptionSet, user }) => {
      return {
        ...(prescriptionSet.entity || prescriptionSet.default),
        prescriptionSetItem: prescriptionSet.prescriptionSetItems,
        ownedByUserFK: user.data.id
      }
    },
    validationSchema: Yup.object().shape({
      prescriptionSetName: Yup.string().required(),
    }),
    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, onConfirm } = props

      dispatch({
        type: 'prescriptionSet/upsert',
        payload: {
          ...values,
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
