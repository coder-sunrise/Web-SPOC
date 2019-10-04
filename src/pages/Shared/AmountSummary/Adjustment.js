import React from 'react'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import {
  GridContainer,
  GridItem,
  Button,
  NumberInput,
  Popconfirm,
  Field,
} from '@/components'

const Adjustment = ({
  index,
  adjustments,
  dispatch,
  adjAmount,
  adjRemark,
  onDelete,
  amountProps,
}) => {
  // console.log('Adjustment', amountProps)
  return (
    <GridContainer style={{ margin: '4px 0' }}>
      <GridItem xs={6}>
        <GridItem>
          <Popconfirm
            title='Do you want to remove this adjustment?'
            onConfirm={() => {
              onDelete(index)
            }}
          >
            <Button color='danger' size='sm' aria-label='Delete' justIcon>
              <DeleteOutline />
            </Button>
          </Popconfirm>
          {adjRemark}
        </GridItem>
      </GridItem>
      <GridItem xs={6}>
        <NumberInput value={adjAmount} {...amountProps} />
      </GridItem>
    </GridContainer>
  )
}

export default Adjustment
