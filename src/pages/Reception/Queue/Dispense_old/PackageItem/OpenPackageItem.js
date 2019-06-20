import React, { PureComponent } from 'react'
// umi
import { formatMessage } from 'umi/locale'
// formik
import { FastField } from 'formik'
// material ui
import { Paper } from '@material-ui/core'
// dev grid
import {
  Grid as DevGrid,
  VirtualTable,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui'
// custom components
import { GridContainer, GridItem, NumberInput } from '@/components'

const COLUMNS = [{ name: 'item', title: 'Item' }]
const ROWS = [
  {
    item: 'Package 1 - packge item 01',
  },
]

class OpenPackageItem extends PureComponent {
  render() {
    return (
      <GridContainer>
        <GridItem md={4}>
          <FastField
            name="packageFormValues.Credit"
            render={args => (
              <NumberInput
                {...args}
                currency
                label={formatMessage({ id: 'reception.queue.dispense.packageItem.credit' })}
              />
            )}
          />
        </GridItem>
        <GridItem md={4}>
          <FastField
            name="packageFormValues.Price"
            render={args => (
              <NumberInput
                {...args}
                currency
                label={formatMessage({ id: 'reception.queue.dispense.packageItem.price' })}
              />
            )}
          />
        </GridItem>
        <GridItem md={12}>
          <Paper className="bottomSpacing">
            <DevGrid rows={ROWS} columns={COLUMNS}>
              <VirtualTable height={300} />
              <TableHeaderRow />
            </DevGrid>
          </Paper>
        </GridItem>
      </GridContainer>
    )
  }
}

export default OpenPackageItem
