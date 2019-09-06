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
  pack,
  packDetail,
  history,
  setFieldValue,
  handleSubmit,
  ...props
}) => {
  const [
    selectedItem,
    setSelectedItem,
  ] = useState({})

  const field = packDetail.entity ? 'entity' : 'default'

  const { ctServiceCenter } = packDetail
  console.log('ctServiceCenter', packDetail)

  const handleItemOnChange = (e) => {
    const { option, row } = e
    const { sellingPrice } = option
    setSelectedItem(option)

    return { ...row, unitPrice: sellingPrice }
  }
  const [
    serviceCenterList,
    setServiceCenterList,
  ] = useState([])

  const [
    list,
    setList,
  ] = useState([])

  const filterServiceCenter = (serviceCenter) => {
    if (serviceCenter) {
      return ctServiceCenter.filter((o) =>
        o.name.toLowerCase().includes(serviceCenter.toLowerCase()),
      )
    }
    return ctServiceCenter
  }

  useEffect(
    () => {
      if (serviceCenterList) {
        setList(serviceCenterList)
      }
    },
    [
      serviceCenterList,
    ],
  )

  const handleServiceOnChange = (e) => {
    if (e) {
      const { option, row } = e
      const { unitPrice, serviceCenter } = option
      setServiceCenterList(filterServiceCenter(serviceCenter))
      setSelectedItem(option)
      console.log('heckfiler', filterServiceCenter(serviceCenter))
    }
  }

  console.log('propsss', props)
  const {
    medicationPackageItem,
    consumablePackageItem,
    vaccinationPackageItem,
    servicePackageItem,
  } = props.values
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
        { name: 'medicationName', title: 'Medication Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'subTotal', title: 'Amount' },
      ],
      leftColumns: [],
    },
    medicationColExtensions: [
      {
        columnName: 'medicationName',
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
        { name: 'vaccinationName', title: 'Vaccination' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'subTotal', title: 'Amount' },
      ],
      leftColumns: [],
    },
    vaccinationColExtensions: [
      {
        columnName: 'vaccinationName',
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
        { name: 'consumableName', title: 'Consumable Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'subTotal', title: 'Amount' },
      ],
      leftColumns: [],
    },
    consumableColExtensions: [
      {
        columnName: 'consumableName',
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
        { name: 'serviceName', title: 'Service' },
        { name: 'serviceCenterServiceFK', title: 'Service Center' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'subTotal', title: 'Amount' },
      ],
      leftColumns: [],
    },
    serviceColExtensions: [
      { columnName: 'quantity', type: 'number' },
      {
        columnName: 'serviceName',
        type: 'codeSelect',
        code: 'ctService',
        labelField: 'displayValue',
        valueField: 'serviceId',
        onChange: handleServiceOnChange,
      },
      {
        columnName: 'serviceCenterServiceFK',
        type: 'select',
        options: list,
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
  console.log('let', list)
  console.log('let', serviceCenterList)
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
                {...props}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                setServiceCenter={setServiceCenter}
                serviceCenter={serviceCenter}
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
  connect(({ pack, packDetail }) => ({
    pack,
    packDetail,
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
