import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { FastField } from 'formik'
import { formatMessage } from 'umi/locale'
import { Radio } from 'antd'
import {
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
  CommonTableGrid,
  Field,
} from '@/components'

const styles = (theme) => ({
  infoPanl: {
    marginBottom: theme.spacing.unit * 2,
  },
})

let commitCount = 1000 // uniqueNumber
const Stock = ({
  classes,
  vaccinationDetail,
  medicationDetail,
  consumableDetail,
  values,
  setFieldValue,
  theme,
  dispatch,
}) => {
  const objectType = () => {
    if (vaccinationDetail) return 'vaccinationStock'
    if (medicationDetail) return 'medicationStock'
    if (consumableDetail) return 'consumableStock'
    return ''
  }

  const [
    stock,
    setStock,
  ] = useState(values[objectType()])

  const changeIsDefault = (row) => {
    stock.forEach((o) => {
      if (o.id === row.id) {
        o.isDefault = true
      } else {
        o.isDefault = false
      }
    })
    setStock(stock)

    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }

  const [
    stockQty,
    setStockQty,
  ] = useState(0)

  useEffect(() => {
    let totalQty = 0
    values[objectType()].forEach((o) => {
      totalQty += o.stock
    })
    setStockQty(totalQty)
  }, [])

  const [
    tableParas,
    setTableParas,
  ] = useState({
    columns: [
      { name: 'batchNo', title: 'Batch No.' },
      { name: 'expiryDate', title: 'Expiry Date' },
      { name: 'stock', title: 'Quantity' },
      { name: 'isDefault', title: 'Default' },
    ],
    columnExtensions: [
      {
        columnName: 'stock',
        align: 'center',
        type: 'number',
      },
      {
        columnName: 'expiryDate',
        align: 'center',
        type: 'date',
      },
      {
        columnName: 'isDefault',
        align: 'center',
        render: (row) => {
          return (
            <Radio
              checked={row.isDefault}
              onChange={() => changeIsDefault(row)}
            />
          )
        },
      },
    ],
  })
  return (
    <CardContainer
      hideHeader
      style={{
        margin: theme.spacing(1),
        minHeight: 700,
        maxHeight: 700,
      }}
    >
      <h4 style={{ fontWeight: 400 }}>
        <b>Stock</b>
      </h4>
      <GridContainer className={classes.infoPanl}>
        <GridItem xs={12} md={4}>
          <Field
            name={`${objectType()}`}
            // name={`${objectType()}.length`}
            render={(args) => {
              return (
                <NumberInput
                  label={formatMessage({
                    id: 'inventory.master.stock.currentStock',
                  })}
                  value={stockQty}
                  disabled
                  format='0.0'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={12} md={4}>
          <FastField
            name='reOrderThreshold'
            render={(args) => {
              return (
                <NumberInput
                  label={formatMessage({
                    id: 'inventory.master.stock.reorderThreshold',
                  })}
                  format='0.00'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={12} md={4}>
          <FastField
            name='criticalThreshold'
            render={(args) => {
              return (
                <NumberInput
                  label={formatMessage({
                    id: 'inventory.master.stock.criticalThreshold',
                  })}
                  format='0.00'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
      </GridContainer>
      <CommonTableGrid rows={stock} {...tableParas} />
      {/* <Divider style={{ margin: '40px 0 20px 0' }} /> */}
    </CardContainer>
  )
}
export default withStyles(styles, { withTheme: true })(Stock)
