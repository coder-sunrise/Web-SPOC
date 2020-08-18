import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { navigateDirtyCheck } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import { LoadingWrapper } from '@/components/_medisys'

import {
  ProgressButton,
  Button,
  withFormikExtend,
  CardContainer,
} from '@/components'
import Yup from '@/utils/yup'

import DetailPanel from './Detail'
import PackageItemListing from './PackageItemListing'

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
  theme,
  ...props
}) => {
  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const detailProps = {
    values,
    packageDetail,
    dispatch,
    setFieldValue,
    showTransfer: false,
    errors: props.errors,
    setIsLoading,
  }

  const [
    totalPrice,
    setTotalPrice,
  ] = useState(0)

  const packageItemListingProps = {
    dispatch,
    packageDetail,
    setFieldValue,
    values,
    totalPrice,
    setTotalPrice,
    ...props,
  }

  return (
    <LoadingWrapper loading={isLoading} text='Getting package details...'>
      <CardContainer
        hideHeader
        style={{
          margin: theme.spacing(1),
        }}
      >
        <DetailPanel {...detailProps} />
        <PackageItemListing {...packageItemListingProps} />
      </CardContainer>
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
    </LoadingWrapper>
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
      const { servicePackageItem } = returnValue
      let newservicePackageItem = []
      if (servicePackageItem.length > 0) {
        newservicePackageItem = servicePackageItem.map((o) => {
          const { serviceCenterService } = o
          return {
            ...o,
            tempServiceCenterServiceFK: o.id,
            serviceCenterServiceFK: serviceCenterService.serviceFK,
            serviceName: serviceCenterService.serviceCenterFKNavigation.id,
          }
        })
      }
      return {
        ...returnValue,
        servicePackageItem: newservicePackageItem,
      }
    },

    validationSchema: Yup.object().shape({
      code: Yup.string().trim().required(),
      displayValue: Yup.string().required(),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    }),

    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, history } = props
      const { servicePackageItem } = values

      const newServicePackageArray = servicePackageItem.map((o) => {
        return {
          ...o,
          serviceCenterServiceFK:
            o.tempServiceCenterServiceFK || o.serviceCenterServiceFK,
        }
      })
      dispatch({
        type: 'packageDetail/upsert',
        payload: {
          ...values,
          effectiveStartDate: values.effectiveDates[0],
          effectiveEndDate: values.effectiveDates[1],
          servicePackageItem: newServicePackageArray,
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
