import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { FastField } from 'formik'
import { formatMessage } from 'umi/locale'
import { Radio } from 'antd'
import {
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
  CommonTableGrid,
} from '@/components'

const styles = (theme) => ({
  infoPanl: {
    marginBottom: theme.spacing.unit * 2,
  },
})

const Stock = ({
  classes,
  vaccinationDetail,
  medicationDetail,
  consumableDetail,
  values,
  setFieldValue,
}) => {
  const objectType = () => {
    if (vaccinationDetail) return 'vaccinationStock'
    if (medicationDetail) return 'medicationStock'
    if (consumableDetail) return 'consumableStock'
    return ''
  }
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
          return <Radio checked={row.isDefault} />
        },
      },
    ],
  })
  return (
    <CardContainer
      hideHeader
      style={{
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      <h3 style={{ marginLeft: 5 }}>Stock</h3>
      <hr />
      <GridContainer className={classes.infoPanl}>
        <GridItem xs={12} md={4}>
          <FastField
            name={`${objectType()}.length`}
            render={(args) => {
              return (
                <NumberInput
                  label={formatMessage({
                    id: 'inventory.master.stock.currentStock',
                  })}
                  disabled
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
                  onChange={(e) =>
                    setFieldValue(
                      'reOrderThreshold',
                      e.target.value.toFixed(2),
                    )}
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
                  onChange={(e) =>
                    setFieldValue(
                      'criticalThreshold',
                      e.target.value.toFixed(2),
                    )}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
      </GridContainer>
      <CommonTableGrid rows={values[objectType()]} {...tableParas} />
      <Divider style={{ margin: '40px 0 20px 0' }} />
    </CardContainer>
  )
}
export default withStyles(styles, { withTheme: true })(Stock)
