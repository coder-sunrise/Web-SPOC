import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import {
  GridContainer,
  GridItem,
  Button,
  NumberInput,
  Popconfirm,
  Field,
} from '@/components'
import DeleteOutline from '@material-ui/icons/DeleteOutline'

class Adjustment extends PureComponent {
  render() {
    const {
      index,
      arrayHelpers,
      purchaseOrderAdjustment,
      setFieldValue,
      calculateInvoice,
      dispatch,
      ...amountProps
    } = this.props
    const adjRemark = purchaseOrderAdjustment[index].adjRemark
    //const adjTitle = adjustmentList[index].adjTitle
    //const adjAmount = adjustmentList[index].adjAmount
    console.log('Adjustment', this.props)
    return (
      <GridContainer>
        <GridItem xs={2} md={9} />
        <GridItem xs={5} md={2}>
          <GridItem>
            <Popconfirm
              title='Do you want to remove this adjustment?'
              onConfirm={() => {
                //arrayHelpers.remove(index)

                purchaseOrderAdjustment[index].isDeleted = true

                dispatch({
                  type: 'purchaseOrderDetails/deleteAdjustment',
                  payload: {
                    purchaseOrderAdjustment
                  },
                })

                calculateInvoice()
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
          {/* <NumberInput defaultValue={adjAmount} {...amountProps} /> */}
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
}

export default Adjustment
