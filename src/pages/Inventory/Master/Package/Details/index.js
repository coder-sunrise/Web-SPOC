import React from 'react'
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
import { getUniqueNumericId } from '@/utils/utils'

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
        { name: 'amount', title: 'Amount' },
      ],
      leftColumns: [],
    },
    medicationColExtensions: [
      { columnName: 'Action', width: 110, align: 'center' },
      { columnName: 'unitPrice', type: 'number', currency: true },
      { columnName: 'amount', type: 'number', currency: true },
    ],
    medicationList: [
      { medicationName: 'Panadol', quantity: 1, unitPrice: 5, amount: 5 },
      { medicationName: 'Paracetemol', quantity: 1, unitPrice: 5, amount: 5 },
      { medicationName: 'Cough Juice', quantity: 1, unitPrice: 10, amount: 10 },
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
        type: 'select',
        code: 'ctservice',
        labelField: 'displayValue',
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

  const commitChanges = ({ rows, added, changed, deleted }) => {
    console.log('rows', rows)
    const newRow = rows[0]
    console.log('newRow', newRow)

    const calSubtotal = newRow.quantity * newRow.unitPrice
    newRow.subTotal = calSubtotal
    newRow.id = getUniqueNumericId()
    const { servicePackageItem } = props.values
    const newServicePackageItem = servicePackageItem.concat(newRow)

    const field = packDetail.entity ? 'entity' : 'default'
    dispatch({
      type: 'packDetail/updateState',
      payload: {
        default: {
          ...props.values,
          servicePackageItem: newServicePackageItem,
        },
      },
    })
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
  }

  const onRowChangesChange = (changes) => {
    console.log('changes', changes)

    // this.setState((preSate) => {
    //   return {
    //     rows: preSate.rows.map(
    //       (row) => (changes[row.id] ? { ...row, ...changes[row.id] } : row),
    //     ),
    //   }
    // })
    // return changes
  }

  const onDeletedRowIdsChange = (ids) => {
    console.log('ids', ids)

    const rows = props.values.servicePackageItem.filter(
      (service) => ids.indexOf(service.id) < 0,
    )
    console.log('rows', rows)
    // this.setState((preSate) => {
    //   return {
    //     rows: preSate.rows.filter((o) => ids.indexOf(o.id) < 0),
    //   }
    // })
    // return ids
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
                commitChanges={commitChanges}
                onAddedRowsChange={onAddedRowsChange}
                onRowChangesChange={onRowChangesChange}
                onDeletedRowIdsChange={onDeletedRowIdsChange}
                {...props}
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
