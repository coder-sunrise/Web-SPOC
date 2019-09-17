import React from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import {
  getAppendUrl,
  errMsgForOutOfRange as errMsg,
  navigateDirtyCheck,
} from '@/utils/utils'
import {
  NavPills,
  ProgressButton,
  Button,
  withFormikExtend,
} from '@/components'
import { withFormik } from 'formik'
import Yup from '@/utils/yup'
import { compose } from 'redux'
import DetailPanel from './Detail'
import Pricing from '../../Pricing'
import Stock from '../../Stock'

const styles = () => ({
  actionDiv: {
    float: 'right',
    textAlign: 'center',
    marginTop: '22px',
    marginRight: '10px',
  },
})

const Detail = ({
  classes,
  dispatch,
  consumable,
  consumableDetail,
  history,
  handleSubmit,
  setFieldValue,
  setValues,
  values,
}) => {
  const { currentTab } = consumable

  const detailProps = {
    consumableDetail,
    dispatch,
    setFieldValue,
    setValues,
    values,
  }
  return (
    <React.Fragment>
      <div className={classes.actionDiv}>
        <ProgressButton
          submitKey='consumableDetail/submit'
          onClick={handleSubmit}
        />
        <Button
          color='danger'
          onClick={navigateDirtyCheck('/inventory/master?t=1')}
        >
          Cancel
        </Button>
      </div>
      <NavPills
        color='primary'
        onChange={(event, active) => {
          history.push(
            getAppendUrl({
              t: active,
            }),
          )
        }}
        index={currentTab}
        contentStyle={{ margin: '0 -5px' }}
        tabs={[
          {
            tabButton: 'General',
            tabContent: <DetailPanel {...detailProps} />,
          },
          {
            tabButton: 'Pricing',
            tabContent: <Pricing {...detailProps} />,
          },
          {
            tabButton: 'Stock',
            tabContent: (
              <Stock
                consumableDetail={consumableDetail}
                values={values}
                setFieldValue={setFieldValue}
              />
            ),
          },
        ]}
      />
    </React.Fragment>
  )
}
// const errMsg = (field) => `${field} must between 0 to 999,999.99`
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ consumable, consumableDetail }) => ({
    consumable,
    consumableDetail,
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ consumableDetail }) => {
      // console.log('consumableDetail', consumableDetail)
      return consumableDetail.entity
        ? consumableDetail.entity
        : consumableDetail.default
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().required(),
      displayValue: Yup.string().required(),
      revenueCategoryFK: Yup.string().required(),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
      uomfk: Yup.number().required(),
      averageCostPrice: Yup.number()
        .min(0, 'Average Cost Price must between 0 and 999,999.9999')
        .max(999999.9999, 'Average Cost Price must between 0 and 999,999.9999'),

      markupMargin: Yup.number()
        .min(0, 'Markup Margin must between 0 and 999,999.9')
        .max(999999.9, 'Markup Margin must between 0 and 999,999.9'),

      sellingPrice: Yup.number()
        .min(0, errMsg('Selling Price'))
        .max(999999.99, errMsg('Selling Price')),

      maxDiscount: Yup.number()
        .min(0, 'Max Discount must between 0 and 999,999.9')
        .max(999999.9, 'Max Discount must between 0 and 999,999.9'),

      reOrderThreshold: Yup.number()
        .min(0, errMsg('Re-Order Threshold'))
        .max(999999.99, errMsg('Re-Order Threshold')),

      criticalThreshold: Yup.number()
        .min(0, 'Critical Threshold must between 0 and 999,999.9')
        .max(999999.9, 'Critical Threshold must between 0 and 999,999.9'),
    }),

    handleSubmit: (values, { props }) => {
      const { dispatch, history } = props
      // console.log('props', props)
      dispatch({
        type: 'consumableDetail/upsert',
        payload: {
          ...values,
          effectiveStartDate: values.effectiveDates[0],
          effectiveEndDate: values.effectiveDates[1],
        },
      }).then((r) => {
        if (r) {
          history.push('/inventory/master?t=1')
        }
      })
    },
    displayName: 'InventoryConsumableDetail',
  }),
)(Detail)
