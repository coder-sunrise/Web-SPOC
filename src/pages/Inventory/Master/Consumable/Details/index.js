import React from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl } from '@/utils/utils'
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
}) => {
  const { currentTab } = consumable

  const detailProps = {
    consumableDetail,
    dispatch,
    setFieldValue,
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
          onClick={() => {
            history.push('/inventory/master?t=1')
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
            tabButton: 'Pricing',
            tabContent: <Pricing {...detailProps} />,
          },
          {
            tabButton: 'Stock',
            tabContent: <Stock />,
          },
        ]}
      />
    </React.Fragment>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ consumable, consumableDetail }) => ({
    consumable,
    consumableDetail,
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ consumableDetail }) => {
      return consumableDetail.entity
        ? consumableDetail.entity
        : consumableDetail.default
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().required(),
      displayValue: Yup.string().required(),
      revenueCategoryFK: Yup.string().required(),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
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

    handleSubmit: (values, { props }) => {
      const { dispatch, history } = props
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
