import React, { Component } from 'react'
import { connect } from 'dva'
// common components
import { CommonTableGrid, withFormik } from '@/components'
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
    return invoiceCreditNote.entity || invoiceCreditNote.default
  },
})
class AddCrNote extends Component {
  render () {
    console.log('AddCrNoteIndex', this.props)
    const { footer, onConfirm, values } = this.props
    const { creditNoteItem } = values
    return (
      <div>
        <CrNoteForm />
        <CommonTableGrid
          {...TableConfig}
          height={300}
          rows={creditNoteItem}
          columns={CrNoteColumns}
          columnExtensions={CrNoteColExtensions}
        />
        <Summary />
        <MiscCrNote />
        {footer &&
          footer({
            onConfirm,
            confirmBtnText: 'Confirm',
            confirmProps: {
              disabled: false,
            },
          })}
      </div>
    )
  }
}

export default AddCrNote
