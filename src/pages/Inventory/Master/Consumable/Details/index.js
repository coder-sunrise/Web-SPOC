import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import Yup from '@/utils/yup'
// import DetailPanel from './Detail'
// import Pricing from '../../Pricing'
// import Stock from '../../Stock'
import {
  NavPills,
  ProgressButton,
  Button,
  withFormikExtend,
  Tabs,
} from '@/components'
import { ConsumableDetailOption } from './variables'
import {
  getAppendUrl,
  errMsgForOutOfRange as errMsg,
  navigateDirtyCheck,
  roundTo,
} from '@/utils/utils'
import { getBizSession } from '@/services/queue'

const styles = () => ({
  actionDiv: {
    float: 'center',
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
  errors,
}) => {
  const [
    hasActiveSession,
    setHasActiveSession,
  ] = useState(true)

  const detailProps = {
    consumableDetail,
    dispatch,
    setFieldValue,
    setValues,
    values,
    errors,
    hasActiveSession,
  }
  const stockProps = {
    consumableDetail,
    values,
    setFieldValue,
    dispatch,
    errors,
    hasActiveSession,
  }

  const checkHasActiveSession = async () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    const result = await getBizSession(bizSessionPayload)
    const { data } = result.data
    setHasActiveSession(data.length > 0)
  }

  useEffect(() => {
    if (consumableDetail.currentId) {
      checkHasActiveSession()
      dispatch({
        type: 'consumableDetail/query',
        payload: {
          id: consumableDetail.currentId,
        },
      })
    }
  }, [])

  return (
    <React.Fragment>
      {/* <NavPills
        color='primary'
        onChange={(event, active) => {
          history.push(
            getAppendUrl({
              t: active,
            }),
          )
        }}
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
      /> */}
      <Tabs
        style={{ marginTop: 20 }}
        defaultActiveKey='0'
        options={ConsumableDetailOption(detailProps, stockProps)}
      />
      <div className={classes.actionDiv}>
        <Button
          color='danger'
          onClick={navigateDirtyCheck({
            redirectUrl: '/inventory/master?t=1',
          })}
        >
          Close
        </Button>
        <ProgressButton
          submitKey='consumableDetail/submit'
          onClick={handleSubmit}
        />
      </div>
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
      const returnValue = consumableDetail.entity
        ? consumableDetail.entity
        : consumableDetail.default

      let chas = []
      const { isChasAcuteClaimable, isChasChronicClaimable } = returnValue
      if (isChasAcuteClaimable) {
        chas.push('isChasAcuteClaimable')
      }
      if (isChasChronicClaimable) {
        chas.push('isChasChronicClaimable')
      }

      return {
        ...returnValue,
        chas,
      }
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().when('id', {
        is: (id) => !!id,
        then: Yup.string().trim().required(),
      }),
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
        .min(0, 'Re-Order Threshold must between 0 and 999,999.9')
        .max(999999.9, 'Re-Order Threshold must between 0 and 999,999.9'),

      criticalThreshold: Yup.number()
        .min(0, 'Critical Threshold must between 0 and 999,999.9')
        .max(999999.9, 'Critical Threshold must between 0 and 999,999.9'),
    }),

    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, history } = props
      const { id, consumableStock, effectiveDates, ...restValues } = values
      let defaultConsumableStock = consumableStock
      if (consumableStock.length === 0) {
        defaultConsumableStock = [
          {
            inventoryVaccinationFK: id,
            batchNo: 'Not Applicable',
            stock: 0,
            isDefault: true,
          },
        ]
      }
      let chas = {
        isChasAcuteClaimable: false,
        isChasChronicClaimable: false,
      }
      values.chas.forEach((o) => {
        if (o === 'isChasAcuteClaimable') {
          chas[o] = true
        } else if (o === 'isChasChronicClaimable') {
          chas[o] = true
        }
      })
      dispatch({
        type: 'consumableDetail/upsert',
        payload: {
          ...restValues,
          ...chas,
          id,
          effectiveStartDate: values.effectiveDates[0],
          effectiveEndDate: values.effectiveDates[1],
          consumableStock: defaultConsumableStock,
          suggestSellingPrice: roundTo(restValues.suggestSellingPrice),
        },
      }).then((r) => {
        if (r) {
          resetForm()
          history.push('/inventory/master?t=1')
        }
      })
    },
    displayName: 'InventoryConsumableDetail',
  }),
)(Detail)
