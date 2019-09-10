import React from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
// import { withFormik } from 'formik'
import { compose } from 'redux'
import { getAppendUrl } from '@/utils/utils'
import {
  NavPills,
  ProgressButton,
  Button,
  withFormikExtend,
} from '@/components'
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
  medication,
  medicationDetail,
  history,
  handleSubmit,
  setFieldValue,
  values,
  ...props
}) => {
  const { currentTab } = medication

  const detailProps = {
    medicationDetail,
    dispatch,
    setFieldValue,
    showTransfer: true,
    values,
    ...props,
  }

  console.log({ values })

  return (
    <React.Fragment>
      <div className={classes.actionDiv}>
        <ProgressButton
          submitKey='medicationDetail/submit'
          onClick={handleSubmit}
        />
        <Button
          color='danger'
          onClick={() => {
            history.push('/inventory/master?t=0')
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
            tabContent: <Stock medicationDetail={medicationDetail} />,
          },
        ]}
      />
    </React.Fragment>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ medication, medicationDetail }) => ({
    medication,
    medicationDetail,
  })),
  // withFormik({
  //   enableReinitialize: true,
  //   mapPropsToValues: ({ medicationDetail }) => {
  //     return medicationDetail.entity ? medicationDetail.entity : {}
  //   },
  //   handleSubmit: (values, { props }) => {
  //     console.log(values)
  //     const { dispatch } = props
  //     // dispatch({
  //     //   type: `${modelType}/submit`,
  //     //   payload: test,
  //     // }).then((r) => {
  //     //   if (r.message === 'Ok') {
  //     //     notification.success({
  //     //       message: 'Done',
  //     //     })
  //     //   }
  //     // })
  //   },
  //   validationSchema: Yup.object().shape(
  //     {
  //       // code: Yup.string().required(),
  //       // displayValue: Yup.string().required(),
  //       // // revenueCategory: Yup.string().required(),
  //       // effectiveStartDate: Yup.string().required(),
  //       // effectiveEndDate: Yup.string().required(),
  //       // SellingPrice: Yup.number().required(),
  //     },
  //   ),
  //   displayName: 'InventoryMedicationDetail',
  // }),

  withFormikExtend({
    enableReinitialize: true,

    mapPropsToValues: ({ medicationDetail }) => {
      // console.log('medicationDetail', medicationDetail)
      return medicationDetail.entity
        ? medicationDetail.entity
        : medicationDetail.default
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
    }),

    handleSubmit: (values, { props, resetForm }) => {
      // console.log('restValues')
      // console.log('restValues', values)
      const { effectiveDates, ...restValues } = values
      const { dispatch, history, onConfirm, medicationDetail } = props
      // console.log('medicationDetail', medicationDetail)

      const payload = {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      }
      dispatch({
        type: 'medicationDetail/upsert',
        payload,
      }).then((r) => {
        if (r) {
          if (onConfirm) onConfirm()
          dispatch({
            type: 'medicationDetail/query',
          })
          history.push('/inventory/master')
        }
      })
    },

    displayName: 'medicationDetail',
  }),
)(Detail)
