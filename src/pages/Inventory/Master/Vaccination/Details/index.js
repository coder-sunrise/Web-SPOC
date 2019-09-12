import React from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl } from '@/utils/utils'
import { NavPills, ProgressButton, Button } from '@/components'
import { compose } from 'redux'
import { withFormik } from 'formik'
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
          onClick={() => {
            history.push('/inventory/master?t=2')
          }}
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
            tabButton: 'Detail',
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
              <Stock vaccinationDetail={vaccinationDetail} values={values} />
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
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ vaccinationDetail }) => {
      return vaccinationDetail.entity
        ? vaccinationDetail.entity
        : vaccinationDetail.default
    },
    handleSubmit: (values, { props }) => {
      console.log('clicked')
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
    validationSchema: Yup.object().shape({
      code: Yup.string().required(),
      displayValue: Yup.string().required(),
      revenueCategoryFK: Yup.number().required(),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
      prescribingUOMFK: Yup.number().required(),
      dispensingUOMFK: Yup.number().required(),
      averageCostPrice: Yup.number().positive(
        'Average Cost Price must between 0 to 999,999.99',
      ),
      markupMargin: Yup.number().positive(
        'Markup Margin must between 0 to 999,999.99',
      ),
      sellingPriceBefDiscount: Yup.number().positive(
        'Selling Price must between 0 to 999,999.99',
      ),
      maxDiscount: Yup.number().positive(
        'Max Discount must between 0 to 999,999.99',
      ),
      reOrderThreshold: Yup.number().positive(
        'Re-Order Threshold must between 0 to 999,999.99',
      ),
      criticalThreshold: Yup.number().positive(
        'Critical Threshold must between 0 to 999,999.99',
      ),
    }),
    displayName: 'InventoryVaccinationDetail',
  }),
)(Detail)
