import React from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl } from '@/utils/utils'
import { withFormik } from 'formik'
import DetailPanel from './Detail'
// import Pricing from '../../DetaPricing'
// import Stock from '../../Details/Stock'
import InventoryTypeListing from './InventoryTypeListing'
import { NavPills, ProgressButton, Button } from '@/components'
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
  handleSubmit,
  setFieldValue,
}) => {
  const { currentTab } = pack
  const detailProps = {
    packDetail,
    dispatch,
    setFieldValue,
    showTransfer: false,
  }

  const medicationProps = {
    tableParas: {
      columns: [
        { name: 'medicationName', title: 'Medication Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'amount', title: 'Amount' },
        { name: 'Action', title: 'Action' },
      ],
      leftColumns: [],
    },
    colExtensions: [
      { columnName: 'Action', width: 110, align: 'center' },
      { columnName: 'unitPrice', type: 'number', currency: true },
      { columnName: 'amount', type: 'number', currency: true },
    ],
    list: [],
  }

  const vaccinationProps = {
    tableParas: {
      columns: [
        { name: 'vaccination', title: 'Vaccination' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'amount', title: 'Amount' },
        { name: 'Action', title: 'Action' },
      ],
      leftColumns: [],
    },
    colExtensions: [
      { columnName: 'Action', width: 110, align: 'center' },
      { columnName: 'unitPrice', type: 'number', currency: true },
      { columnName: 'amount', type: 'number', currency: true },
    ],
    list: [],
  }

  const consumableProps = {
    tableParas: {
      columns: [
        { name: 'consumableName', title: 'Consumable Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'amount', title: 'Amount' },
        { name: 'Action', title: 'Action' },
      ],
      leftColumns: [],
    },
    colExtensions: [
      { columnName: 'Action', width: 110, align: 'center' },
      { columnName: 'unitPrice', type: 'number', currency: true },
      { columnName: 'amount', type: 'number', currency: true },
    ],
    list: [],
  }

  const serviceProps = {
    tableParas: {
      columns: [
        { name: 'service', title: 'Service' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'amount', title: 'Amount' },
        { name: 'Action', title: 'Action' },
      ],
      leftColumns: [],
    },
    colExtensions: [
      { columnName: 'Action', width: 110, align: 'center' },
      { columnName: 'unitPrice', type: 'number', currency: true },
      { columnName: 'amount', type: 'number', currency: true },
    ],
    list: [],
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
        color='info'
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
            tabContent: <InventoryTypeListing {...medicationProps} />,
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
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ packDetail }) => {
      return packDetail.entity ? packDetail.entity : {}
    },
    handleSubmit: (values, { props }) => {
      console.log(props)
      console.log(values)
      const { dispatch } = props
      // dispatch({
      //   type: `${modelType}/submit`,
      //   payload: test,
      // }).then((r) => {
      //   if (r.message === 'Ok') {
      //     notification.success({
      //       message: 'Done',
      //     })
      //   }
      // })
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().required(),
      displayValue: Yup.string().required(),
      effectiveStartDate: Yup.string().required(),
      effectiveEndDate: Yup.string().required(),
    }),
    displayName: 'InventoryPackageDetail',
  }),
)(Detail)
