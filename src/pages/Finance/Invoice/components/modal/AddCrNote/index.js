import React, { Component } from 'react'
import { connect } from 'dva'
// common components
import {
  CommonTableGrid,
  withFormik,
  GridContainer,
  GridItem,
  Button,
} from '@/components'
// sub components
import CrNoteForm from './CrNoteForm'
import Summary from './Summary'
import MiscCrNote from './MiscCrNote'
import {
  CrNoteColumns,
  CrNoteData,
  CrNoteColExtensions,
  TableConfig,
} from './variables'

@connect(({ invoiceCreditNote }) => ({
  invoiceCreditNote,
}))
@withFormik({
  name: 'invoiceCreditNote',
  mapPropsToValues: ({ invoiceCreditNote }) => {
    return invoiceCreditNote
  },
})
class AddCrNote extends Component {
  render () {
    console.log('AddCrNoteIndex', this.props)
    const { onConfirm, values } = this.props
    const { creditNoteItem } = values
    return (
      <div>
        <CrNoteForm />
        <CommonTableGrid
          {...TableConfig}
          // height={300}
          rows={creditNoteItem}
          columns={CrNoteColumns}
          columnExtensions={CrNoteColExtensions}
        />
        <Summary />
        <MiscCrNote />

        <GridContainer>
          <GridItem md={9}>
            <p>Note: Total Price($) are after GST.</p>
          </GridItem>
          <GridItem md={3}>
            <Button color='primary'>Save</Button>
            <Button color='danger' onClick={onConfirm}>
              Cancel
            </Button>
          </GridItem>
        </GridContainer>

        {/* {footer &&
          footer({
            onConfirm,
            confirmBtnText: 'Confirm',
            confirmProps: {
              disabled: false,
            },
          })} */}
      </div>
    )
  }
}

export default AddCrNote
