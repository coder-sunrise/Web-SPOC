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
import { compose } from 'redux'
import Yup from '@/utils/yup'
import DetailPanel from './Detail'
import Pricing from '../../Pricing'
import Stock from '../../Stock'
import Setting from '../../Setting'

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
  vaccination,
  vaccinationDetail,
  history,
  handleSubmit,
  setFieldValue,
  values,
  ...props
}) => {
  const { currentTab } = vaccination

  const detailProps = {
    vaccinationDetail,
    dispatch,
    setFieldValue,
    showTransfer: false,
    values,
    ...props,
  }
  return (
    <React.Fragment>
      <div className={classes.actionDiv}>
        <ProgressButton
          submitKey='vaccinationDetail/submit'
          onClick={handleSubmit}
        />
        <Button
          color='danger'
          onClick={navigateDirtyCheck('/inventory/master?t=2')}
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
            tabButton: 'Setting',
            tabContent: <Setting {...detailProps} />,
          },
          {
            tabButton: 'Pricing',
            tabContent: <Pricing {...detailProps} />,
          },
          {
            tabButton: 'Stock',
            tabContent: (
              <Stock
                vaccinationDetail={vaccinationDetail}
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
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ vaccination, vaccinationDetail }) => ({
    vaccination,
    vaccinationDetail,
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ vaccinationDetail }) => {
      return vaccinationDetail.entity
        ? vaccinationDetail.entity
        : vaccinationDetail.default
    },

    validationSchema: Yup.object().shape({
      code: Yup.string().required(),
      displayValue: Yup.string().required(),
      revenueCategoryFK: Yup.number().required(),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
      prescribingUOMFK: Yup.number().required(),
      dispensingUOMFK: Yup.number().required(),
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
        .min(0, errMsg('Critical Threshold'))
        .max(999999.99, errMsg('Critical Threshold')),
    }),
    handleSubmit: (values, { props }) => {
      const { dispatch, history } = props
      dispatch({
        type: 'vaccinationDetail/upsert',
        payload: {
          ...values,
          effectiveStartDate: values.effectiveDates[0],
          effectiveEndDate: values.effectiveDates[1],
        },
      }).then((r) => {
        if (r) {
          history.push('/inventory/master?t=2')
        }
      })
    },
    displayName: 'InventoryVaccinationDetail',
  }),
)(Detail)
