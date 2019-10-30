import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl, navigateDirtyCheck } from '@/utils/utils'
import DetailPanel from './Detail'
import InventoryTypeListing from './InventoryTypeListing'
import { PackageDetailOption } from './variables'

import {
  NavPills,
  ProgressButton,
  Button,
  withFormikExtend,
  Tabs,
} from '@/components'
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
  pack,
  packDetail,
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

  // useEffect(() => {
  //   const fetchCodes = async () => {
  //     await podoOrderType.forEach((x) => {
  //       dispatch({
  //         type: 'codetable/fetchCodes',
  //         payload: {
  //           code: x.ctName,
  //         },
  //       }).then((list) => {
  //         const { inventoryItemList } = getInventoryItemList(list)
  //         console.log(x.stateName)
  //         switch (x.stateName) {
  //           case 'ConsumableItemList': {
  //             return setConsumableItemList(inventoryItemList)
  //           }
  //           case 'MedicationItemList': {
  //             return setMedicationItemList(inventoryItemList)
  //           }
  //           case 'VaccinationItemList': {
  //             return setVaccinationItemList(inventoryItemList)
  //           }
  //           default: {
  //             return null
  //           }
  //         }
  //       })

  //       dispatch({
  //         type: 'codetable/fetchCodes',
  //         payload: {
  //           code: 'ctservice',
  //         },
  //       }).then((list) => {
  //         const {
  //           services,
  //           serviceCenters,
  //           serviceCenterServices,
  //         } = getServices(list)

  //         setServicess(services)
  //         setServiceCenterss(serviceCenters)
  //         setServiceCenterServicess(serviceCenterServices)
  //       })
  //     })

  //     dispatch({
  //       // force current edit row components to update
  //       type: 'global/updateState',
  //       payload: {
  //         commitCount: (commitCount += 1),
  //       },
  //     })
  //   }
  //   fetchCodes()
  // }, [])

  // const handleItemOnChange = (e) => {
  //   const { option, row } = e
  //   const { sellingPrice } = option
  //   setSelectedItem(option)

  //   return { ...row, unitPrice: sellingPrice }
  // }

  const { currentTab } = pack
  const detailProps = {
    values,
    packDetail,
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
    packDetail,
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

  // const [
  //   total,
  //   setTotal,
  // ] = useState(0)
  // const calTotal = () => {
  //   setTotal(0)
  //   medicationPackageItem.map((row) => {
  //     return setTotal(total + row.subTotal)
  //   })

  //   servicePackageItem.map((row) => {
  //     return setTotal(total + row.subTotal)
  //   })

  //   consumablePackageItem.map((row) => {
  //     return setTotal(total + row.subTotal)
  //   })

  //   vaccinationPackageItem.map((row) => {
  //     return setTotal(total + row.subTotal)
  //   })
  // }
  // console.log('packDetail', packDetail)
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
        index={currentTab}
        contentStyle={{ margin: '0 -5px' }}
        tabs={[
          {
            tabButton: 'Details',
            tabContent: <DetailPanel {...detailProps} />,
          },
          {
            tabButton: 'Order Item',
            tabContent: (
              <InventoryTypeListing
                dispatch={dispatch}
                packDetail={packDetail}
                setFieldValue={setFieldValue}
                values={values}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                price={price}
                serviceCenterFK={serviceCenterFK}
                serviceCenterServicess={serviceCenterServicess}
                totalPrice={totalPrice}
                setTotalPrice={setTotalPrice}
                {...props}
              />
            ),
          },
        ]}
      /> */}
      <Tabs
        style={{ marginTop: 20 }}
        defaultActiveKey='0'
        options={PackageDetailOption(detailProps, typeListingProps)}
      />
      <div className={classes.actionDiv}>
        <Button
          color='danger'
          onClick={navigateDirtyCheck({
            redirectUrl: '/inventory/master?t=3',
          })}
        >
          Close
        </Button>
        <ProgressButton submitKey='packDetail/submit' onClick={handleSubmit} />
      </div>
    </React.Fragment>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ pack, packDetail, codetable }) => ({
    pack,
    packDetail,
    codetable,
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ packDetail }) => {
      return packDetail.entity ? packDetail.entity : packDetail.default
    },

    validationSchema: Yup.object().shape({
      // code: Yup.string().required(),
      displayValue: Yup.string().required(),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    }),

    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, history, codetable } = props
      const { servicePackageItem } = values

      const newServicePackageArray = servicePackageItem.map((o) => {
        return {
          ...o,
          serviceCenterServiceFK:
            o.tempServiceCenterServiceFK || o.serviceCenterServiceFK,
          // serviceName: o.tempServiceName,
        }
      })
      dispatch({
        type: 'packDetail/upsert',
        payload: {
          ...values,
          effectiveStartDate: values.effectiveDates[0],
          effectiveEndDate: values.effectiveDates[1],
          servicePackageItem: newServicePackageArray,
        },
      }).then((r) => {
        if (r) {
          resetForm()
          history.push('/inventory/master?t=3')
        }
      })
    },

    displayName: 'InventoryPackageDetail',
  }),
)(Detail)
