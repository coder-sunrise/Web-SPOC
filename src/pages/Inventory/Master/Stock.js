import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { FastField } from 'formik'
import {
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
  CommonTableGrid2,
} from '@/components'

const styles = (theme) => ({
  infoPanl: {
    marginBottom: theme.spacing.unit * 2,
  },
})

const Stock = ({ classes }) => {
  const [ tableParas, setTableParas ] = useState({
    columns: [
      { name: 'refNo', title: 'Batch No.' },
      { name: 'expenseDate', title: 'Receiving Date' },
      { name: 'invoiceDate', title: 'Expiry Date' },
      { name: 'quantity', title: 'Quantity' },
    ],
    columnExtensions: [
      {
        columnName: 'quantity',
        type: 'number',
      },
      {
        columnName: 'invoiceDate',
        type: 'date',
      },
      {
        columnName: 'expenseDate',
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
            name='currentStock'
            render={(args) => {
              return <NumberInput label='Current Stock' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={12} md={4}>
          <FastField
            name='reOrderThreshold'
            render={(args) => {
              return <NumberInput label='Re-Order Threshold' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={12} md={4}>
          <FastField
            name='criticalThreshold'
            render={(args) => {
              return <NumberInput label='Critical Threshold' {...args} />
            }}
          />
        </GridItem>
      </GridContainer>
      <CommonTableGrid2 rows={[]} {...tableParas} />
      <Divider style={{ margin: '40px 0 20px 0' }} />
    </CardContainer>
  )
}
export default withStyles(styles, { withTheme: true })(Stock)
