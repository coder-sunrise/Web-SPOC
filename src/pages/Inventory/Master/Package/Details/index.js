import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { navigateDirtyCheck } from '@/utils/utils'
import Authorized from '@/utils/Authorized'

import { ProgressButton, Button, withFormikExtend } from '@/components'
import Yup from '@/utils/yup'

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
  packageDetail,
  history,
  setFieldValue,
  handleSubmit,
  codetable,
  values,
  ...props
}) => {
  const [
    selectedItem,
    setSelectedItem,
  ] = useState(() => {})

  const [
    serviceCenterServicess,
    setServiceCenterServicess,
  ] = useState(() => [])
  const [
    serviceCenterFK,
    setServiceCenterFK,
  ] = useState(() => {})
  const [
    price,
    setPrice,
  ] = useState(() => undefined)

  const detailProps = {
    values,
    packageDetail,
    dispatch,
    setFieldValue,
    showTransfer: false,
    errors: props.errors,
  }

  const [
    totalPrice,
    setTotalPrice,
  ] = useState(0)

  const typeListingProps = {
    dispatch,
    packageDetail,
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

  console.log('detailProps', detailProps, typeListingProps)

  return (
    <React.Fragment>
      <div style={{ marginTop: 20 }}>
        <DetailPanel {...detailProps} />
      </div>
      <div className={classes.actionDiv}>
        <Button
          color='danger'
          authority='none'
          onClick={navigateDirtyCheck({
            redirectUrl: '/inventory/master?t=4',
          })}
        >
          Close
        </Button>
        <ProgressButton
          submitKey='packageDetail/submit'
          onClick={handleSubmit}
        />
      </div>
    </React.Fragment>
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ packageDetail, codetable }) => ({
    packageDetail,
    codetable,
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ packageDetail }) => {
      const returnValue = packageDetail.entity || packageDetail.default
      // const { serviceOrderSetItem } = returnValue
      // let newserviceOrderSetItem = []
      // if (serviceOrderSetItem.length > 0) {
      //   newserviceOrderSetItem = serviceOrderSetItem.map((o) => {
      //     const { service } = o
      //     return {
      //       ...o,
      //       tempServiceCenterServiceFK: o.serviceCenterServiceFK,
      //       serviceCenterServiceFK:
      //         service.ctServiceCenter_ServiceNavigation[0].serviceFK,
      //       serviceName:
      //         service.ctServiceCenter_ServiceNavigation[0].serviceCenterFK,
      //     }
      //   })
      // }
      return {
        ...returnValue,
        // serviceOrderSetItem: newserviceOrderSetItem,
      }
    },

    validationSchema: Yup.object().shape({
      code: Yup.string().trim().required(),
      displayValue: Yup.string().required(),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    }),

    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, history, codetable } = props
      // const { serviceOrderSetItem } = values

      // const newServiceOrderSetArray = serviceOrderSetItem.map((o) => {
      //   return {
      //     ...o,
      //     serviceCenterServiceFK:
      //       o.tempServiceCenterServiceFK || o.serviceCenterServiceFK,
      //     // serviceName: o.tempServiceName,
      //   }
      // })
      dispatch({
        type: 'packageDetail/upsert',
        payload: {
          ...values,
          effectiveStartDate: values.effectiveDates[0],
          effectiveEndDate: values.effectiveDates[1],
          // serviceOrderSetItem: newServiceOrderSetArray,
        },
      }).then((r) => {
        if (r) {
          resetForm()
          history.push('/inventory/master?t=4')
        }
      })
    },

    displayName: 'InventoryPackageDetail',
  }),
)(Secured('inventorymaster.package')(Detail))
