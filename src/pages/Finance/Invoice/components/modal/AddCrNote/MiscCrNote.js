import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
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
    total: Yup.number().min(1),
  }),
  handleSubmit: (values, { props }) => {
    console.log({ values, props })
    let newCreditNoteItem = props.values.creditNoteItem || []
    const miscItem = {
      itemType: 'Misc',
      itemName: values.description,
      quantity: 1,
      totalAfterItemAdjustment: values.total,
      isDeleted: false,
    }
    newCreditNoteItem.push(miscItem)
    props.setFieldValue('creditNoteItem', newCreditNoteItem)
    setTimeout(() => props.handleCalcFinalTotal(), 100)
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
                  <GridContainer direction='column'>
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
                        color='primary'
                        disabled={!values.description || !values.total}
                        onClick={handleSubmit}
                      >
                        Add
                      </Button>
                      <Button
                        size='sm'
                        color='danger'
                        onClick={this.onClickResetMisc}
                      >
                        Reset
                      </Button>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem md={4}>
                  <GridContainer direction='column'>
                    {/* <GridItem>
                  <FastField
                    name='unitPrice'
                    render={(args) => (
                      <NumberInput {...args} label='Unit Price: ' currency />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <FastField
                    name='quantiy'
                    render={(args) => (
                      <NumberInput {...args} label='Quantity:' />
                    )}
                  />
                </GridItem> */}
                    <GridItem>
                      <FastField
                        name='total'
                        render={(args) => (
                          <NumberInput {...args} label='Total: ' currency />
                        )}
                      />
                    </GridItem>
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
