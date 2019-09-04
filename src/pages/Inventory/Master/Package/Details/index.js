import React, { useState } from 'react'
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
  const field = packDetail.entity ? 'entity' : 'default'

  const handleServiceOnChange = (e) => {
    console.log('er', e)
    const { row, option } = e
    const serviceUnitPrice = option.unitPrice
    return {
      ...row,
      unitPrice: serviceUnitPrice,
    }
  }

  console.log('propsss', props)
  const { ServiceList } = props
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
      },
      { columnName: 'unitPrice', type: 'number', currency: true },
      { columnName: 'subTotal', type: 'number', currency: true },
    ],
    medicationList: [
      props.values.medicationPackageItem,
    ],
  }

  const vaccinationProps = {
    vaccinationTableParas: {
      columns: [
        { name: 'vaccination', title: 'Vaccination' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'amount', title: 'Amount' },
      ],
      leftColumns: [],
    },
    vaccinationColExtensions: [
      { columnName: 'Action', width: 110, align: 'center' },
      { columnName: 'unitPrice', type: 'number', currency: true },
      { columnName: 'amount', type: 'number', currency: true },
    ],
    vaccinationList: [],
  }

  const consumableProps = {
    consumableTableParas: {
      columns: [
        { name: 'consumableName', title: 'Consumable Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'amount', title: 'Amount' },
      ],
      leftColumns: [],
    },
    consumableColExtensions: [
      { columnName: 'Action', width: 110, align: 'center' },
      { columnName: 'unitPrice', type: 'number', currency: true },
      { columnName: 'amount', type: 'number', currency: true },
    ],
    consumableList: [
      {
        consumableName: 'Colgate Active Fast',
        quantity: 1,
        unitPrice: 15,
        amount: 15,
      },
      {
        consumableName: 'Sensidive Whitening',
        quantity: 1,
        unitPrice: 15,
        amount: 15,
      },
      {
        consumableName: 'Fruit Juice (Orange) Sugar Free',
        quantity: 1,
        unitPrice: 2,
        amount: 2,
      },
    ],
  }
  const serviceProps = {
    serviceTableParas: {
      columns: [
        { name: 'serviceName', title: 'Service' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'subTotal', title: 'Amount' },
      ],
      leftColumns: [],
    },
    serviceColExtensions: [
      {
        columnName: 'serviceName',
        type: 'codeSelect',
        code: 'ctservice',
        labelField: 'displayValue',
        valueField: 'serviceId',
        filter: {},
        onChange: handleServiceOnChange,
      },
      {
        columnName: 'unitPrice',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'subTotal',
        type: 'number',
        currency: true,
        disabled: true,
      },
    ],
    ServiceList: props.values.servicePackageItem,
  }

  const commitChanges = (type) => ({ rows, added, changed, deleted }) => {
    console.log('packDetail', packDetail)

    const newRow = rows[0]
    console.log('newRow', newRow)

    const calSubtotal = newRow.quantity * newRow.unitPrice
    newRow.subTotal = calSubtotal
    // console.log('asdas', getUniqueNumericId())
    // newRow.id = getUniqueNumericId()

    const {
      medicationPackageItem,
      consumablePackageItem,
      vaccinationPackageItem,
      servicePackageItem,
    } = props.values

    switch (type) {
      case 'medicationPackageItem': {
        const newPackageItem = medicationPackageItem.concat(newRow)
        return dispatch({
          type: 'packDetail/updateState',
          payload: {
            [field]: {
              ...props.values,
              medicationPackageItem: newPackageItem,
            },
          },
        })
      }
      case 'servicePackageItem': {
        const newPackageItem = servicePackageItem.concat(newRow)
        return dispatch({
          type: 'packDetail/updateState',
          payload: {
            [field]: {
              ...props.values,
              servicePackageItem: newPackageItem,
            },
          },
        })
      }

      default:
        return newRow
    }
  }

  const onAddedRowsChange = (addedRows) => {
    console.log('addedRows', addedRows)
    // return addedRows.map(
    //   (row) => console.log('row', row),
    //   //  ({
    //   //   onsetDate: moment(),
    //   //   ...row,
    //   //   confirmedByUserFK: props.user.data.id,
    //   //   isConfirmed: true,
    //   //   type,
    //   // })
    // )
    return [
      { ...addedRows, unitPrice: 123 },
    ]
  }

  const onDeletedRowIdsChange = (ids) => {
    const rows = props.values.servicePackageItem.filter(
      (service) => ids.indexOf(service.id) < 0,
    )
    console.log('deleterow', rows)
    dispatch({
      type: 'packDetail/updateState',
      payload: {
        default: {
          ...props.values,
          medicationPackageItem: rows,
        },
      },
    })

    return ids
  }

  const [
    rowChange,
    setRowChange,
  ] = useState([])

  const onRowChangesChange = (rowChanges) => {
    console.log('rowChanges', rowChanges)

    setRowChange(rowChanges)
    console.log('rowChange', rowChange)

    return rowChanges
  }

  const editableGridProps = {
    commitChanges,
    onAddedRowsChange,
    onRowChangesChange,
    onDeletedRowIdsChange,
  }

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
                medication={medicationProps}
                consumable={consumableProps}
                vaccination={vaccinationProps}
                service={serviceProps}
                packDetail={packDetail}
                setFieldValue={setFieldValue}
                {...editableGridProps}
                {...props}
                rowChange={rowChange}
                setRowChange={setRowChange}
              />
            ),
          },
          // {
          //   tabButton: 'Vaccination',
          //   tabContent: <InventoryTypeListing {...vaccinationProps} />,
          // },
          // {
          //   tabButton: 'Consumable',
          //   tabContent: <InventoryTypeListing {...consumableProps} />,
          // },
          // {
          //   tabButton: 'Service',
          //   tabContent: <InventoryTypeListing {...serviceProps} />,
          // },
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
