import React, { useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import {
  errMsgForOutOfRange as errMsg,
  navigateDirtyCheck,
} from '@/utils/utils'
import { ProgressButton, Button, withFormikExtend, Tabs } from '@/components'
import { MedicationDetailOption } from './variables'
import Yup from '@/utils/yup'

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

  const detailProps = {
    medicationDetail,
    dispatch,
    setFieldValue,
    showTransfer: true,
    values,
    ...props,
  }

  const stockProps = {
    medicationDetail,
    values,
    setFieldValue,
    dispatch,
    errors: props.errors,
  }

  useEffect(() => {
    if (medicationDetail.currentId) {
      dispatch({
        type: 'medicationDetail/query',
        payload: {
          id: medicationDetail.currentId,
        },
      }).then((med) => {
        const { sddfk } = med
        if (sddfk) {
          dispatch({
            type: 'sddDetail/queryOne',
            payload: {
              id: sddfk,
            },
          }).then((sdd) => {
            const { data } = sdd
            const { code, name } = data[0]
            dispatch({
              type: 'medicationDetail/updateState',
              payload: {
                sddCode: code,
                sddDescription: name,
              },
            })
          })
        }
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
          onClick={navigateDirtyCheck('/inventory/master?t=0')}
        >
          Cancel
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
