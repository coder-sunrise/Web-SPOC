import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import {
  getAppendUrl,
  navigateDirtyCheck,
  ableToViewByAuthority,
} from '@/utils/utils'
import Authorized from '@/utils/Authorized'

import {
  NavPills,
  ProgressButton,
  Button,
  withFormikExtend,
  Tabs,
} from '@/components'
import Yup from '@/utils/yup'
import { OrderSetDetailOption } from './variables'
import InventoryTypeListing from './InventoryTypeListing'
import DetailPanel from './Detail'

const { Secured } = Authorized

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
  orderSetDetail,
  history,
  setFieldValue,
  handleSubmit,
  codetable,
  values,
  ...props
}) => {
  const [selectedItem, setSelectedItem] = useState(() => {})

  const [serviceCenterServicess, setServiceCenterServicess] = useState(() => [])
  const [serviceCenterFK, setServiceCenterFK] = useState(() => {})
  const [price, setPrice] = useState(() => undefined)

  const detailProps = {
    values,
    orderSetDetail,
    dispatch,
    setFieldValue,
    showTransfer: false,
    errors: props.errors,
  }

  const [totalPrice, setTotalPrice] = useState(0)

  const typeListingProps = {
    dispatch,
    orderSetDetail,
    setFieldValue,
    values,
    selectedItem,
    setSelectedItem,
    price,
    serviceCenterFK,
    serviceCenterServicess,
    totalPrice,
    setTotalPrice,
    ...props,
  }

  return (
    <React.Fragment>
      {}
      <Tabs
        style={{ marginTop: 20 }}
        defaultActiveKey='0'
        options={OrderSetDetailOption(detailProps, typeListingProps)}
      />
      <div className={classes.actionDiv}>
        <Button
          color='danger'
          authority='none'
          onClick={navigateDirtyCheck({
            redirectUrl: '/inventory/master?t=3',
          })}
        >
          Close
        </Button>
        {ableToViewByAuthority('inventorymaster.orderset') && (
          <ProgressButton
            submitKey='orderSetDetail/submit'
            onClick={handleSubmit}
          />
        )}
      </div>
    </React.Fragment>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ orderSetDetail, codetable }) => ({
    orderSetDetail,
    codetable,
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ orderSetDetail }) => {
      const returnValue = orderSetDetail.entity || orderSetDetail.default
      const { serviceOrderSetItem } = returnValue
      let newserviceOrderSetItem = []
      if (serviceOrderSetItem.length > 0) {
        newserviceOrderSetItem = serviceOrderSetItem.map(o => {
          const { service } = o
          const serviceCenterService =
            service.ctServiceCenter_ServiceNavigation.find(
              x => x.id === o.serviceCenterServiceFK,
            ) || {}
          return {
            ...o,
            tempServiceCenterServiceFK: o.serviceCenterServiceFK,
            serviceCenterServiceFK: o.serviceCenterServiceFK,
            serviceName: serviceCenterService.serviceCenterFK,
            serviceFK: serviceCenterService.serviceFK,
          }
        })
      }
      return {
        ...returnValue,
        serviceOrderSetItem: newserviceOrderSetItem,
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
      effectiveDates: Yup.array()
        .of(Yup.date())
        .min(2)
        .required(),
    }),

    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, history } = props
      const { serviceOrderSetItem } = values
      dispatch({
        type: 'orderSetDetail/upsert',
        payload: {
          ...values,
          effectiveStartDate: values.effectiveDates[0],
          effectiveEndDate: values.effectiveDates[1],
          serviceOrderSetItem,
        },
      }).then(r => {
        if (r) {
          resetForm()
          history.push('/inventory/master?t=3')
        }
      })
    },

    displayName: 'InventoryOrderSetDetail',
  }),
)(Secured('inventorymaster.orderset')(Detail))
