import React from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
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
  Tabs,
  CardContainer,
} from '@/components'
import { MedicationDetailOption } from './variables'
import Yup from '@/utils/yup'
import DetailPanel from './Detail'
import Pricing from '../../Pricing'
import Stock from '../../Stock'
import Setting from '../../Setting'

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
        <ProgressButton
          submitKey='medicationDetail/submit'
          onClick={handleSubmit}
        />
        <Button
          color='danger'
          onClick={navigateDirtyCheck('/inventory/master?t=0')}
        >
          Cancel
        </Button>
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

      // console.log('codetable', returnValue)

      return returnValue
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

    handleSubmit: (values, { props, resetForm }) => {
      // console.log('restValues')
      // console.log('restValues', values)
      const { id, medicationStock, effectiveDates, ...restValues } = values
      const { dispatch, history, onConfirm, medicationDetail } = props
      // console.log('medicationDetail', medicationDetail)
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

      const payload = {
        ...restValues,
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
          history.push('/inventory/master')
        }
      })
    },

    displayName: 'InventoryMedicationDetail',
  }),
)(Detail)
