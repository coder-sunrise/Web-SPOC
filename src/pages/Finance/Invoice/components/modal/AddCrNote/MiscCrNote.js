import React, { PureComponent } from 'react'
import * as Yup from 'yup'
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core'
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
  SizeContainer,
  TextField,
  withFormik,
} from '@/components'
// styles
import styles from './styles'

@withFormik({
  validationSchema: Yup.object().shape({
    // description: Yup.string().required(),
    total: Yup.number().min(0.01),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { handleAddMiscItem } = props
    // const newCreditNoteItem = props.values.creditNoteItem || []
    // const tempID = newCreditNoteItem.reduce((smallestNegativeID, item) => {
    //   if (item.id < 0 && item.id < smallestNegativeID) return item.id
    //   return smallestNegativeID
    // }, 0)
    const miscItem = {
      // id: tempID - 1,
      itemType: 'Misc',
      itemCode: 'MISC',
      itemTypeFK: 6,
      itemName: values.description,
      quantity: 1,
      unitPrice: values.total,
      totalAfterItemAdjustment: values.total,
      isDeleted: false,
    }
    handleAddMiscItem(miscItem)
    resetForm({})
    // newCreditNoteItem.push(miscItem)
    // props.setFieldValue('creditNoteItem', newCreditNoteItem)
    // props.setFieldValue('creditNoteItem', [
    //   ...newCreditNoteItem,
    //   miscItem,
    // ])
    // setTimeout(() => props.handleCalcFinalTotal(), 100)
  },
  displayName: 'MiscCrNote',
})
class MiscCrNote extends PureComponent {
  onClickResetMisc = () => {
    const { setFieldValue } = this.props
    setFieldValue('description', '')
    setFieldValue('total', '')
  }

  render () {
    const { classes, handleSubmit, values } = this.props
    return (
      <div className={classes.misc}>
        <h4 className={classes.miscTitle}>Add Misc. Credit Note</h4>
        <CardContainer size='sm' hideHeader>
          <SizeContainer size='sm'>
            <React.Fragment>
              <GridContainer>
                <GridItem md={8}>
                  <GridContainer>
                    <GridItem md={10}>
                      <TextField label='Type' value='MISC' disabled />
                    </GridItem>
                    <GridItem md={10}>
                      <FastField
                        name='description'
                        render={(args) => (
                          <TextField {...args} label='Description: ' />
                        )}
                      />
                    </GridItem>
                    <GridItem className={classes.miscActions}>
                      <Button
                        size='sm'
                        color='danger'
                        onClick={this.onClickResetMisc}
                      >
                        Reset
                      </Button>
                      <Button
                        size='sm'
                        color='primary'
                        disabled={!values.description || !values.total}
                        onClick={handleSubmit}
                      >
                        Add
                      </Button>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem md={4}>
                  <GridContainer>
                    <GridItem md='12' />
                    <GridItem md='12'>
                      <FastField
                        name='total'
                        render={(args) => (
                          <NumberInput {...args} label='Total: ' currency />
                        )}
                      />
                    </GridItem>
                    <GridItem md='12' />
                  </GridContainer>
                </GridItem>
              </GridContainer>
            </React.Fragment>
          </SizeContainer>
        </CardContainer>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'MiscCrNote' })(MiscCrNote)
