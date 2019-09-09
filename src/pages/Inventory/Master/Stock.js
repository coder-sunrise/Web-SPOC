import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { FastField } from 'formik'
import { formatMessage } from 'umi/locale'

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
    ],
    columnExtensions: [
      {
        columnName: 'stock',
        type: 'number',
      },
      {
        columnName: 'expiryDate',
        type: 'date',
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
                  {...args}
                />
              )
            }}
          />
        </GridItem>
      </GridContainer>
      <CommonTableGrid rows={[]} {...tableParas} />
      <Divider style={{ margin: '40px 0 20px 0' }} />
    </CardContainer>
  )
}
export default withStyles(styles, { withTheme: true })(Stock)
