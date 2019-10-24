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
  handleDeleteInvoiceAdjustment,
  handleCalcInvoiceSummary,
  adjustmentListName,
  setFieldValue,
  ...amountProps
}) => {
  const { adjType, adjRemark, adjValue } = adjustmentList[index]

  if (adjType === 'Percentage') {
    amountProps.currency = false
    amountProps.percentage = true
  } else if (adjType === 'Currency') {
    amountProps.currency = true
    amountProps.percentage = false
  }
  return (
    <GridContainer style={{ paddingLeft: 30 }}>
      <GridItem xs={2} md={9} />
      <GridItem xs={5} md={2}>
        <GridItem>
          <Popconfirm
            title='Do you want to remove this adjustment?'
            onConfirm={() => {
              adjustmentList[index].isDeleted = true
              setTimeout(
                () => handleDeleteInvoiceAdjustment(adjustmentList),
                handleCalcInvoiceSummary(),
                500,
              )
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
        <NumberInput value={adjValue} {...amountProps} />
      </GridItem>
    </GridContainer>
  )
}

export default InvoiceAdjustment
