import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl } from '@/utils/utils'
// import { withFormik } from 'formik'
import DetailPanel from './Detail'
// import Pricing from '../../DetaPricing'
// import Stock from '../../Details/Stock'
import InventoryTypeListing from './InventoryTypeListing'
import {
  NavPills,
  ProgressButton,
  Button,
  withFormikExtend,
} from '@/components'
import Yup from '@/utils/yup'
import { getServices } from '@/utils/codes'

const styles = () => ({
  actionDiv: {
    float: 'right',
    textAlign: 'center',
    marginTop: '22px',
    marginRight: '10px',
  },
})

let commitCount = 1000 // uniqueNumber
const Detail = ({
  classes,
  dispatch,
  pack,
  packDetail,
  history,
  setFieldValue,
  handleSubmit,
  codetable,
  setValues,
  values,
  ...props
}) => {
  const [
    selectedItem,
    setSelectedItem,
  ] = useState(() => {})

  const [
    servicess,
    setServicess,
  ] = useState(() => [])
  const [
    serviceCenterss,
    setServiceCenterss,
  ] = useState(() => [])
  const [
    serviceCenterServicess,
    setServiceCenterServicess,
  ] = useState(() => [])
  const [
    serviceFK,
    setServiceFK,
  ] = useState(() => {})
  const [
    serviceCenterFK,
    setServiceCenterFK,
  ] = useState(() => {})
  const [
    price,
    setPrice,
  ] = useState(() => undefined)

  useEffect(async () => {
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
      },
    }).then((list) => {
      const { services, serviceCenters, serviceCenterServices } = getServices(
        list,
      )

      setServicess(services)
      setServiceCenterss(serviceCenters)
      setServiceCenterServicess(serviceCenterServices)
    })

    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }, [])

  const handleItemOnChange = (e) => {
    const { option, row } = e
    const { sellingPrice } = option
    setSelectedItem(option)

    return { ...row, unitPrice: sellingPrice }
  }

  const {
    medicationPackageItem,
    consumablePackageItem,
    vaccinationPackageItem,
    servicePackageItem,
  } = values
  const { currentTab } = pack
  const detailProps = {
    packDetail,
    dispatch,
    setFieldValue,
    showTransfer: false,
  }

  const medicationProps = {
    medicationTableParas: {
      columns: [
        { name: 'inventoryMedicationFK', title: 'Medication Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'subTotal', title: 'Amount' },
      ],
      leftColumns: [],
    },
    medicationColExtensions: [
      {
        columnName: 'inventoryMedicationFK',
        type: 'codeSelect',
        code: 'inventoryMedication',
        labelField: 'displayValue',
        valueField: 'id',
        onChange: handleItemOnChange,
      },
      {
        columnName: 'quantity',
        type: 'number',
      },
      {
        columnName: 'unitPrice',
        type: 'number',
        currency: true,
        disabled: true,
      },
      {
        columnName: 'subTotal',
        type: 'number',
        currency: true,
        disabled: true,
      },
    ],
    medicationList: medicationPackageItem,
  }

  const vaccinationProps = {
    vaccinationTableParas: {
      columns: [
        { name: 'inventoryVaccinationFK', title: 'Vaccination' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'subTotal', title: 'Amount' },
      ],
      leftColumns: [],
    },
    vaccinationColExtensions: [
      {
        columnName: 'inventoryVaccinationFK',
        type: 'codeSelect',
        code: 'inventoryVaccination',
        labelField: 'displayValue',
        valueField: 'id',
        onChange: handleItemOnChange,
      },
      { columnName: 'quantity', type: 'number' },
      {
        columnName: 'unitPrice',
        type: 'number',
        currency: true,
        disabled: true,
      },
      {
        columnName: 'subTotal',
        type: 'number',
        currency: true,
        disabled: true,
      },
    ],
    vaccinationList: vaccinationPackageItem,
  }

  const consumableProps = {
    consumableTableParas: {
      columns: [
        { name: 'inventoryConsumableFK', title: 'Consumable Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'subTotal', title: 'Amount' },
      ],
      leftColumns: [],
    },
    consumableColExtensions: [
      {
        columnName: 'inventoryConsumableFK',
        type: 'codeSelect',
        code: 'inventoryConsumable',
        labelField: 'displayValue',
        valueField: 'id',
        onChange: handleItemOnChange,
      },
      { columnName: 'quantity', type: 'number' },
      {
        columnName: 'unitPrice',
        type: 'number',
        currency: true,
        disabled: true,
      },
      {
        columnName: 'subTotal',
        type: 'number',
        currency: true,
        disabled: true,
      },
    ],
    consumableList: consumablePackageItem,
  }

  const [
    serviceCenter,
    setServiceCenter,
  ] = useState([])

  const serviceProps = {
    serviceTableParas: {
      columns: [
        { name: 'serviceCenterServiceFK', title: 'Service' },
        { name: 'serviceName', title: 'Service Center' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'subTotal', title: 'Amount' },
      ],
      leftColumns: [],
    },
    serviceColExtensions: [
      { columnName: 'quantity', type: 'number' },
      {
        columnName: 'serviceCenterServiceFK',
        type: 'select',
        options: servicess.filter(
          (o) =>
            !serviceCenterFK ||
            o.serviceCenters.find((m) => m.value === serviceCenterFK),
        ),

        onChange: (e) => {
          setServiceFK(e.val)
          console.log('service', serviceFK)
          // setTimeout(() => {
          //   getServiceCenterService()
          // }, 1)
          dispatch({
            // force current edit row components to update
            type: 'global/updateState',
            payload: {
              commitCount: (commitCount += 1),
            },
          })
          handleItemOnChange
        },
      },
      {
        columnName: 'serviceName',
        type: 'select',
        options: serviceCenterss.filter(
          (o) => !serviceFK || o.services.find((m) => m.value === serviceFK),
        ),
        onChange: (e) => {
          setServiceCenterFK(e.val)
          // console.log('serviceCenterFK', serviceCenterFK)
          // setTimeout(() => {
          //   getServiceCenterService()
          // }, 1)
          dispatch({
            // force current edit row components to update
            type: 'global/updateState',
            payload: {
              commitCount: (commitCount += 1),
            },
          })
          handleItemOnChange
        },
      },
      {
        columnName: 'unitPrice',
        type: 'number',
        currency: true,
        disabled: true,
      },
      {
        columnName: 'subTotal',
        type: 'number',
        currency: true,
        disabled: true,
      },
    ],
    ServiceList: servicePackageItem,
  }
  const [
    total,
    setTotal,
  ] = useState(0)
  const calTotal = () => {
    setTotal(0)
    medicationPackageItem.map((row) => {
      return setTotal(total + row.subTotal)
    })

    servicePackageItem.map((row) => {
      return setTotal(total + row.subTotal)
    })

    consumablePackageItem.map((row) => {
      return setTotal(total + row.subTotal)
    })

    vaccinationPackageItem.map((row) => {
      return setTotal(total + row.subTotal)
    })
  }

  // if (ctServiceCenter) {
  //   setServiceCenter(
  //     ctServiceCenter.for((o) => {
  //       return {
  //         value: o.serviceCenterCategoryFK,
  //         name: o.displayValue,
  //       }
  //     }),
  //   )
  // }
  // console.log('let', list)
  // console.log('let', serviceCenterList)
  return (
    <React.Fragment>
      <div className={classes.actionDiv}>
        <ProgressButton submitKey='packDetail/submit' onClick={handleSubmit} />
        <Button
          color='danger'
          onClick={() => {
            history.push('/inventory/master?t=3')
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
            tabButton: 'Order Item',
            tabContent: (
              <InventoryTypeListing
                calTotal={calTotal}
                medication={medicationProps}
                consumable={consumableProps}
                vaccination={vaccinationProps}
                service={serviceProps}
                packDetail={packDetail}
                setFieldValue={setFieldValue}
                values={values}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                setServiceCenter={setServiceCenter}
                serviceCenter={serviceCenter}
                price={price}
                serviceCenterFK={serviceCenterFK}
                serviceFK={serviceFK}
                serviceCenterServicess={serviceCenterServicess}
              />
            ),
          },
        ]}
      />
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
    handleSubmit: (values, { props }) => {
      const { dispatch, history } = props
      dispatch({
        type: 'packDetail/upsert',
        payload: {
          ...values,
          effectiveStartDate: values.effectiveDates[0],
          effectiveEndDate: values.effectiveDates[1],
        },
      }).then((r) => {
        if (r) {
          history.push('/inventory/master?t=3')
        }
      })
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().required(),
      displayValue: Yup.string().required(),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    }),
    displayName: 'InventoryPackageDetail',
  }),
)(Detail)
