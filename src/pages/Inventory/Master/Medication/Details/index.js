import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import {
  errMsgForOutOfRange as errMsg,
  navigateDirtyCheck,
  roundTo,
} from '@/utils/utils'
import { ProgressButton, Button, withFormikExtend, Tabs } from '@/components'
import { MedicationDetailOption } from './variables'
import Yup from '@/utils/yup'
import { getBizSession } from '@/services/queue'

const styles = () => ({
  actionDiv: {
    textAlign: 'center',
    marginTop: '22px',
    position: 'sticky',
    bottom: 0,
    width: '100%',
    paddingBottom: 10,
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
  theme,
  ...props
}) => {
  const { currentTab } = medication

  const [
    hasActiveSession,
    setHasActiveSession,
  ] = useState(true)

  const detailProps = {
    medicationDetail,
    dispatch,
    setFieldValue,
    showTransfer: true,
    values,
    hasActiveSession,
    ...props,
  }

  const stockProps = {
    medicationDetail,
    values,
    setFieldValue,
    dispatch,
    errors: props.errors,
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
    if (medicationDetail.currentId) {
      checkHasActiveSession()
      let tempCode
      let tempName
      dispatch({
        type: 'medicationDetail/query',
        payload: {
          id: medicationDetail.currentId,
        },
      }).then(async (med) => {
        const { sddfk } = med
        if (sddfk) {
          await dispatch({
            type: 'sddDetail/queryOne',
            payload: {
              id: sddfk,
            },
          }).then((sdd) => {
            const { data } = sdd
            const { code, name } = data[0]
            tempCode = code
            tempName = name
          })
        }
        dispatch({
          type: 'medicationDetail/updateState',
          payload: {
            sddCode: tempCode,
            sddDescription: tempName,
          },
        })
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
                medicationDetail={medicationDetail}
                values={values}
                setFieldValue={setFieldValue}
              />
            ),
          },
        ]}
      /> */}
      {/* <CardContainer
        hideHeader
        style={{
          margin: theme.spacing(2),
        }}

        
      > */}
      <Tabs
        style={{ marginTop: 20 }}
        defaultActiveKey='0'
        options={MedicationDetailOption(detailProps, stockProps)}
      />
      {/* </CardContainer> */}
      <div className={classes.actionDiv}>
        <Button
          color='danger'
          onClick={navigateDirtyCheck({
            redirectUrl: '/inventory/master?t=0',
          })}
        >
          Close
        </Button>
        <ProgressButton
          submitKey='medicationDetail/submit'
          onClick={handleSubmit}
        />
      </div>
    </React.Fragment>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ medication, medicationDetail }) => ({
    medication,
    medicationDetail,
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ medicationDetail }) => {
      const returnValue = medicationDetail.entity
        ? medicationDetail.entity
        : medicationDetail.default

      let chas = []
      const { isChasAcuteClaimable, isChasChronicClaimable } = returnValue
      if (isChasAcuteClaimable) {
        chas.push('isChasAcuteClaimable')
      }
      if (isChasChronicClaimable) {
        chas.push('isChasChronicClaimable')
      }
      // const { sddfk } = returnValue
      // if (sddfk) {
      //   console.log('sddfk', sddfk)
      //   // console.log('sddfk', this.props)
      //   this.props
      //     .dispatch({
      //       type: 'sddDetail/queryOne',
      //       payload: {
      //         id: sddfk,
      //       },
      //     })
      //     .then((sdd) => {
      //       const { data } = sdd
      //       const { code, name } = data[0]
      //       console.log('data', data)
      //     })
      // }

      return {
        ...returnValue,
        chas,
        sddCode: medicationDetail.sddCode,
        sddDescription: medicationDetail.sddDescription,
      }
    },
    validationSchema: Yup.object().shape({
      // code: Yup.string().required(),
      displayValue: Yup.string().required(),
      revenueCategoryFK: Yup.number().required(),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
      prescribingUOMFK: Yup.number().required(),
      prescriptionToDispenseConversion: Yup.number().required(),
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
        .min(0, 'Re-Order Threshold must between 0 and 999,999.9')
        .max(999999.9, 'Re-Order Threshold must between 0 and 999,999.9'),

      criticalThreshold: Yup.number()
        .min(0, 'Critical Threshold must between 0 and 999,999.9')
        .max(999999.9, 'Critical Threshold must between 0 and 999,999.9'),
    }),

    handleSubmit: (values, { props, resetForm }) => {
      const { id, medicationStock, effectiveDates, ...restValues } = values
      const { dispatch, history, onConfirm, medicationDetail } = props

      let defaultMedicationStock = medicationStock
      if (medicationStock.length === 0) {
        defaultMedicationStock = [
          {
            inventoryMedicationFK: id,
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
      const payload = {
        ...restValues,
        ...chas,
        id,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
        medicationStock: defaultMedicationStock,
        suggestSellingPrice: roundTo(restValues.suggestSellingPrice),
      }

      dispatch({
        type: 'medicationDetail/upsert',
        payload,
      }).then((r) => {
        if (r) {
          // if (onConfirm) onConfirm()
          // dispatch({
          //   type: 'medicationDetail/query',
          // })
          resetForm()
          history.push('/inventory/master')
        }
      })
    },

    displayName: 'InventoryMedicationDetail',
  }),
)(Detail)
