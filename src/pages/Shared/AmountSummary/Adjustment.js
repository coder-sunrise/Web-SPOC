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
  calcPurchaseOrderSummary,
  ...amountProps
}) => {
  const { adjRemark } = adjustments[index]
  return (
    <GridContainer style={{ paddingLeft: 30 }}>
      <GridItem xs={2} md={9} />
      <GridItem xs={5} md={2}>
        <GridItem>
          <Popconfirm
            title='Do you want to remove this adjustment?'
            onConfirm={() => {
              adjustments[index].isDeleted = true
              dispatch({
                type: 'purchaseOrderDetails/deleteAdjustment',
                payload: { adjustments },
              })
              setTimeout(() => calcPurchaseOrderSummary(), 500)
            }}
          >
            <Button color='danger' size='sm' aria-label='Delete' justIcon>
              <DeleteOutline />
            </Button>
          </Popconfirm>
          {adjRemark}
        </GridItem>
      </GridItem>
      <GridItem xs={5} md={1}>
        <Field
          // name={`adjustments[${index}].adjDisplayAmount`}
          name={`adjustments[${index}].adjValue`}
          render={(args) => {
            return <NumberInput {...amountProps} {...args} />
          }}
        />
      </GridItem>
    </GridContainer>
  )
}

export default Adjustment
