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

const InvoiceAdjustment = ({
  index,
  adjustmentList,
  dispatch,
  handleCalcInvoiceSummary,
  adjustmentListName,
  setFieldValue,
  ...amountProps
}) => {
  const { adjRemark, adjValue } = adjustmentList[index]
  return (
    <GridContainer style={{ paddingLeft: 30 }}>
      <GridItem xs={2} md={9} />
      <GridItem xs={5} md={2}>
        <GridItem>
          <Popconfirm
            title='Do you want to remove this adjustment?'
            onConfirm={() => {
              adjustmentList[index].isDeleted = true
              // dispatch({
              //   // type: `${modelName}/deleteAdjustment`,
              //   type: `purchaseOrderDetails/deleteAdjustment`,
              //   payload: { adjustmentList },
              // })

              setFieldValue(adjustmentListName, adjustmentList)
              setTimeout(() => handleCalcInvoiceSummary(), 500)
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
        {/* <Field
          name={`adjustmentList[${index}].adjValue`}
          render={(args) => {
            return <NumberInput {...amountProps} {...args} />
          }}
        /> */}
        <NumberInput defaultValue={adjValue} {...amountProps} />
      </GridItem>
    </GridContainer>
  )
}

export default InvoiceAdjustment
