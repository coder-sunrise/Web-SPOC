import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { FormattedMessage, formatMessage } from 'umi/locale'
import { Assignment, Save } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Divider } from '@material-ui/core'
import { compare } from '@/layouts'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'
import { status, suppliers, dispUOMs } from '@/utils/codes'
import {
  CardContainer,
  TextField,
  Button,
  CommonHeader,
  CommonModal,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  notification,
  Select,
  DatePicker,
  RadioGroup,
  ProgressButton,
  Checkbox,
  NumberInput,
} from '@/components'
import BatchList from './BatchList'

const styles = (theme) => ({
  infoPanl: {
    marginBottom: theme.spacing.unit * 2,
  },
})
// @connect(({ consumable }) => ({
//   consumable,
// }))
@withFormik({
  // mapPropsToValues: ({ consumable }) => {
  //   // console.log(com)
  //   return consumable.entity
  // },
  validationSchema: Yup.object().shape({
    // EditingItems: Yup.array().of(
    //   Yup.object().shape({
    //     Description: Yup.string().required('Description is required'),
    //     UnitPrice: Yup.number().required('Unit Price is required'),
    //   }),
    // ),
    SellingPrice: Yup.number().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { modelType } = props
    const submitKey = `${modelType}/submitStock`
    props
      .dispatch({
        type: submitKey,
        payload: values,
      })
      .then((r) => {
        if (r.message === 'Ok') {
          // toast.success('test')
          notification.success({
            // duration:0,
            message: 'Done',
          })
        }
      })
  },
  displayName: 'InventoryMasterDetail',
})
class Stock extends PureComponent {
  render () {
    const { props } = this
    const { classes, theme, modelType, ...restProps } = props
    const submitKey = `${modelType}/submitStock`
    return (
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <GridContainer className={classes.infoPanl}>
          <GridItem xs={12} md={4}>
            <FastField
              name='CurrentStock'
              render={(args) => {
                return <NumberInput label='Current Stock' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12} md={4}>
            <FastField
              name='ReOrderThreshold'
              render={(args) => {
                return <NumberInput label='Re-Order Threshold' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12} md={4}>
            <FastField
              name='CriticalThreshold'
              render={(args) => {
                return <NumberInput label='Critical Threshold' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <BatchList
          batches={[
            {
              id: 1,
              refNo: 'BN0000001',
              expenseDate: new Date(),
              invoiceDate: new Date(),
              quantity: 1000,
            },
          ]}
        />
        <Divider style={{ margin: '40px 0 20px 0' }} />
        <div style={{ textAlign: 'center' }}>
          <Button
            color='danger'
            onClick={() => {
              props.history.push('/inventory/master?t=c')
            }}
          >
            Cancel
          </Button>
          <ProgressButton submitKey={submitKey} onClick={props.handleSubmit} />
        </div>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Stock)
