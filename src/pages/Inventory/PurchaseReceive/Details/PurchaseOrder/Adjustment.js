import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import {
  GridContainer,
  GridItem,
  Button,
  NumberInput,
  FastField,
  withFormikExtend,
  Popconfirm,
} from '@/components'
import DeleteOutline from '@material-ui/icons/DeleteOutline'

class Adjustment extends PureComponent {
  render() {
    const {
      index,
      arrayHelpers,
      values,
      ...amountProps
    } = this.props
    const { adjustmentList } = values
    const adjTitle = adjustmentList[index].adjTitle
    const adjAmount = adjustmentList[index].adjAmount

    return (
      <GridContainer>
        <GridItem xs={2} md={9} />
        <GridItem xs={5} md={2}>
          <GridItem>
            <Popconfirm
              title='Do you want to remove this adjustment?'
              onConfirm={() => { arrayHelpers.remove(index) }}
            >
              <Button
                color='danger'
                size='sm'
                aria-label='Delete'
                justIcon
              >
                <DeleteOutline />
              </Button>
            </Popconfirm>
            {adjTitle}
          </GridItem>
        </GridItem>
        <GridItem xs={5} md={1}>
          <NumberInput defaultValue={adjAmount} {...amountProps} />
        </GridItem>
      </GridContainer>
    )
  }
}

export default Adjustment
