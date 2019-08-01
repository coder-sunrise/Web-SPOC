import React, { Component } from 'react'
// common components
import { CommonTableGrid } from '@/components'
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

class AddCrNote extends Component {
  render () {
    const { footer, onConfirm } = this.props
    return (
      <div>
        <CrNoteForm />
        <CommonTableGrid
          {...TableConfig}
          height={300}
          rows={CrNoteData}
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
