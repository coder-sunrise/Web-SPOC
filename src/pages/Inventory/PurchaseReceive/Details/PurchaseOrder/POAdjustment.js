import React from 'react'
import {
  GridContainer,
  GridItem,
  Button,
  NumberInput,
  Popconfirm,
  Field,
} from '@/components'
import DeleteOutline from '@material-ui/icons/DeleteOutline'


const POAdjustment = ({
  index,
  purchaseOrderAdjustment,
  dispatch,
  calcPurchaseOrderSummary,
  ...amountProps
}) => {
  const { adjRemark } = purchaseOrderAdjustment[index]
  return (
    <GridContainer>
      <GridItem xs={2} md={9} />
      <GridItem xs={5} md={2}>
        <GridItem>
          <Popconfirm
            title='Do you want to remove this adjustment?'
            onConfirm={() => {
              purchaseOrderAdjustment[index].isDeleted = true
              dispatch({
                type: 'purchaseOrderDetails/deleteAdjustment',
                payload: { purchaseOrderAdjustment },
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
          name={`purchaseOrderAdjustment[${index}].adjDisplayAmount`}
          render={(args) => {
            return <NumberInput {...amountProps} {...args} />
          }}
        />
      </GridItem>
    </GridContainer>
  )
}

export default (POAdjustment)
