import React from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import {
  errMsgForOutOfRange as errMsg,
  navigateDirtyCheck,
  roundTo,
} from '@/utils/utils'
import { ProgressButton, Button, withFormikExtend, Tabs } from '@/components'
import { VaccinationDetailOption } from './variables'
import Yup from '@/utils/yup'

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
  vaccination,
  vaccinationDetail,
  history,
  handleSubmit,
  setFieldValue,
  ...props
}) => {
  const detailProps = {
    vaccinationDetail,
    dispatch,
    setFieldValue,
    showTransfer: false,
    ...props,
  }

  const stockProps = {
    vaccinationDetail,
    values: props.values,
    setFieldValue,
    dispatch,
    errors: props.errors,
  }
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
                vaccinationDetail={vaccinationDetail}
                values={props.values}
                setFieldValue={setFieldValue}
              />
            ),
          },
        ]}
      /> */}
      <Tabs
        style={{ marginTop: 20 }}
        defaultActiveKey='0'
        options={VaccinationDetailOption(detailProps, stockProps)}
      />
      <div className={classes.actionDiv}>
        <Button
          color='danger'
          onClick={navigateDirtyCheck({
            redirectUrl: '/inventory/master?t=2',
          })}
        >
          Close
        </Button>
        <ProgressButton
          submitKey='vaccinationDetail/submit'
          onClick={handleSubmit}
        />
      </div>
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
      const returnValue = vaccinationDetail.entity
        ? vaccinationDetail.entity
        : vaccinationDetail.default

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
      const { dispatch, history } = props
      const { id, vaccinationStock, effectiveDates, ...restValues } = values
      let defaultVaccinationStock = vaccinationStock
      if (vaccinationStock.length === 0) {
        defaultVaccinationStock = [
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
        type: 'vaccinationDetail/upsert',
        payload: {
          ...restValues,
          ...chas,
          id,
          effectiveStartDate: values.effectiveDates[0],
          effectiveEndDate: values.effectiveDates[1],
          markupMargin: parseFloat(values.markupMargin),
          vaccinationStock: defaultVaccinationStock,
          suggestSellingPrice: roundTo(restValues.suggestSellingPrice),
        },
      }).then((r) => {
        if (r) {
          resetForm()
          history.push('/inventory/master?t=2')
        }
      })
    },
    displayName: 'InventoryVaccinationDetail',
  }),
)(Detail)
