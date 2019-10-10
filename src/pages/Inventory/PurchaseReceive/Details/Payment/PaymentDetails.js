import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import { connect } from 'dva'
import moment from 'moment'
import Yup from '@/utils/yup'
import {
  CardContainer,
  GridContainer,
  GridItem,
  FastField,
  TextField,
  withFormikExtend,
  DatePicker,
  Select,
  NumberInput,
  CodeSelect,
  Field,
} from '@/components'

@connect(({ podoPayment, purchaseOrderDetails }) => ({
  podoPayment,
  purchaseOrderDetails,
}))
@withFormikExtend({
  displayName: 'PaymentDetails',
  validationSchema: Yup.object().shape({
    paymentNo: Yup.string().required(),
    // paymentDate: Yup.string().required(),
    paymentModeFK: Yup.string().required(),
    paymentAmount: Yup.number().min(0).required(),
    // referenceNo: Yup.string().required(),
  }),
  handleSubmit: (values, { props }) => {
    // console.log({ values, props })
    const {
      paymentNo,
      paymentDate,
      paymentModeFK,
      paymentAmount,
      referenceNo,
    } = values
    const { dispatch, onConfirm, refreshPodoPayment } = props

    dispatch({
      type: 'podoPayment/upsert',
      payload: {
        purchaseOrderFK: props.values.id,
        sequence: 1,
        clinicPaymentDto: {
          createdOnBizSessionFK: props.values.currentBizSessionInfo.id,
          clinicPaymentTypeFK: 1,
          paymentNo,
          paymentDate,
          paymentModeFK,
          paymentAmount,
          referenceNo,
        },
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'purchaseOrderDetails/refresh',
          payload: {
            id: props.values.id,
          },
        }).then(setTimeout(() => refreshPodoPayment(), 500))
      }
    })
  },
})
class PaymentDetails extends PureComponent {
  render () {
    const { props } = this
    const { footer, theme } = props

    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem xs={6}>
              <FastField
                name='paymentNo'
                render={(args) => <TextField label='Payment No.' {...args} />}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='paymentDate'
                render={(args) => (
                  <DatePicker
                    label='PaymentDate'
                    value={moment()}
                    disabled
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='paymentModeFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      label='Payment Mode'
                      labelField='displayValue'
                      code='CTPaymentMode'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <Field
                name='paymentAmount'
                render={(args) => {
                  return (
                    <NumberInput currency label='Payment Amount' {...args} />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='referenceNo'
                render={(args) => <TextField label='Reference' {...args} />}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='remarks'
                render={(args) => <TextField label='Remarks' {...args} />}
              />
            </GridItem>
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default PaymentDetails
