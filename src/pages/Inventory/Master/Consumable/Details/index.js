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
import {
  getAppendUrl,
  errMsgForOutOfRange as errMsg,
  navigateDirtyCheck,
  roundTo,
} from '@/utils/utils'
import { getBizSession } from '@/services/queue'
import Authorized from '@/utils/Authorized'
import { ConsumableDetailOption } from './variables'

const { Secured } = Authorized

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
  clinicSettings,
}) => {
  const [hasActiveSession, setHasActiveSession] = useState(undefined)

  const detailProps = {
    consumableDetail,
    dispatch,
    setFieldValue,
    setValues,
    values,
    errors,
    hasActiveSession,
    clinicSettings,
  }
  const stockProps = {
    consumableDetail,
    values,
    setFieldValue,
    dispatch,
    errors,
    hasActiveSession,
    clinicSettings,
    authority: 'inventorymaster.consumable',
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
    dispatch({
      type: 'clinicSettings/query',
    })
    if (consumableDetail.currentId) {
      checkHasActiveSession()
      dispatch({
        type: 'consumableDetail/updateState',
        payload: {
          entity: undefined,
        },
      })
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
      {hasActiveSession !== undefined && (
        <React.Fragment>
          <Tabs
            style={{ marginTop: 20 }}
            defaultActiveKey='0'
            options={ConsumableDetailOption({ ...detailProps }, stockProps)}
          />
          <div className={classes.actionDiv}>
            <Button
              color='danger'
              authority='none'
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
      )}
    </React.Fragment>
  )
}
// const errMsg = (field) => `${field} must between 0 to 999,999.99`
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ consumable, consumableDetail, clinicSettings }) => ({
    consumable,
    consumableDetail,
    clinicSettings,
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ consumableDetail }) => {
      const returnValue = consumableDetail.entity
        ? consumableDetail.entity
        : consumableDetail.default

      let optionGrp = []
      const {
        isChasAcuteClaimable,
        isChasChronicClaimable,
        orderable,
        isDispensedByPharmacy,
        isNurseActualizable,
      } = returnValue
      if (isChasAcuteClaimable) {
        optionGrp.push('isChasAcuteClaimable')
      }
      if (isChasChronicClaimable) {
        optionGrp.push('isChasChronicClaimable')
      }
      if (orderable) {
        optionGrp.push('orderable')
      }
      if (isDispensedByPharmacy) {
        optionGrp.push('isDispensedByPharmacy')
      }
      if (isNurseActualizable) {
        optionGrp.push('isNurseActualizable')
      }

      return {
        ...returnValue,
        chas: optionGrp,
      }
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().when('id', {
        is: id => !!id,
        then: Yup.string()
          .trim()
          .required(),
      }),
      displayValue: Yup.string().required(),
      revenueCategoryFK: Yup.string().required(),
      effectiveDates: Yup.array()
        .of(Yup.date())
        .min(2)
        .required(),
      uomfk: Yup.number().required(),
      averageCostPrice: Yup.number()
        .min(0, 'Average Cost Price must between 0 and 999,999.9999')
        .max(999999.9999, 'Average Cost Price must between 0 and 999,999.9999'),

      markupMargin: Yup.number()
        .min(0, 'Markup Margin must between 0 and 999,999.9')
        .max(999999.9, 'Markup Margin must between 0 and 999,999.9'),

      suggestSellingPrice: Yup.number()
        .min(0, 'Suggested Selling Price must between 0 and 999,999.99')
        .max(
          999999.99,
          'Suggested Selling Price must between 0 and 999,999.99',
        ),

      sellingPrice: Yup.number()
        .required()
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

      excessThreshold: Yup.number()
        .min(0, 'Excess Threshold must between 0 and 999,999.9')
        .max(999999.9, 'Excess Threshold must between 0 and 999,999.9'),
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
      let optionGrp = {
        isChasAcuteClaimable: false,
        isChasChronicClaimable: false,
        isDispensedByPharmacy: false,
        isNurseActualizable: false,
        orderable: false,
      }
      values.chas.forEach(o => {
        if (o === 'isChasAcuteClaimable') {
          optionGrp[o] = true
        } else if (o === 'isChasChronicClaimable') {
          optionGrp[o] = true
        } else if (o === 'isDispensedByPharmacy') {
          optionGrp[o] = true
        } else if (o === 'isNurseActualizable') {
          optionGrp[o] = true
        } else if (o === 'orderable') {
          optionGrp[o] = true
        }
      })
      dispatch({
        type: 'consumableDetail/upsert',
        payload: {
          ...restValues,
          ...optionGrp,
          id,
          orderable: optionGrp.orderable,
          effectiveStartDate: values.effectiveDates[0],
          effectiveEndDate: values.effectiveDates[1],
          consumableStock: defaultConsumableStock,
          suggestSellingPrice: roundTo(restValues.suggestSellingPrice),
        },
      }).then(r => {
        if (r) {
          //resetForm()
          history.push('/inventory/master?t=1')
        }
      })
    },
    displayName: 'InventoryConsumableDetail',
  }),
)(Secured('inventorymaster.consumable')(Detail))
