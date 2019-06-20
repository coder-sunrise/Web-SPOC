import React, { PureComponent } from 'react'
import { connect } from 'dva'
// yup
import * as Yup from 'yup'
// formik
import { withFormik } from 'formik'
// umi
import { formatMessage } from 'umi/locale'
// custom components
import { GridContainer, GridItem, CommonModal, Button } from '@/components'
// sub components
import PriceControl from '../PriceControl'
import DrugControl from './DrugControl'

const drugFormInitialValue = {
  itemCode: '',
  category: '',
  stock: '',
  instruction: '',
  consumptionMethod: '',
  dosage: '',
  dosageUnit: '',
  frequency: '',
  periodAmount: 0,
  period: '',
  PRN: false,
  precautionOne: '',
  precautionTwo: '',
  precautionThree: '',
  batchNo: '',
  expireDate: '',
  remarks: '',
  unitPrice: 0,
  scheme: 0,
  quantity: 0,
  amount: 0,
  subTotal: 0,
  discount: 0,
  discountType: '',
  // amount: 0,
}

const DrugItemSchema = Yup.object().shape({
  itemCode: Yup.string().required(),
})

@connect(({ dispense }) => ({ dispense }))
@withFormik({
  mapPropsToValues: () => ({
    ...drugFormInitialValue,
  }),
  handleSubmit: (values, { props }) => {
    const { dispatch } = props
    dispatch({
      type: 'dispense/addItems',
      payload: { ...values, category: 'Drug' },
    })
  },
  validationSchema: DrugItemSchema,
})
class DrugItem extends PureComponent {
  state = {
    showRemarks: false,
  }

  toggleRemarksModal = () => {
    const { showRemarks } = this.state
    this.setState({ showRemarks: !showRemarks })
  }

  render () {
    const { showRemarks } = this.state
    const { handleSubmit } = this.props
    return (
      <GridContainer>
        <DrugControl
          handleRemarksClick={this.toggleRemarksModal}
          handleAdd={handleSubmit}
          {...this.props}
        />
        <PriceControl {...this.props} />
        <CommonModal
          open={showRemarks}
          title={formatMessage({
            id: 'reception.queue.dispense.drugItem.remarks',
          })}
          onClose={this.toggleRemarksModal}
          onConfirm={this.toggleRemarksModal}
          maxWidth='md'
          fluidHeight
          showFooter={false}
        >
          <div>123</div>
        </CommonModal>
      </GridContainer>
    )
  }
}

export default DrugItem
