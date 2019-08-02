import React, { PureComponent } from 'react'

import { EditableTableGrid, CardContainer } from '@/components'

class PayersGrid extends PureComponent {
  tableParas = {
    columns: [
      { name: 'payerName', title: 'Payer Name' },
      { name: 'payerID', title: 'Payer ID' },
      { name: 'dob', title: 'Date of Birth' },
      { name: 'relationshipFK', title: 'Patient Is' },
      { name: 'scheme', title: 'Scheme' },
    ],
    columnExtensions: [
      {
        columnName: 'dob',
        type: 'date',
        dobRestrict: true,
      },
      {
        columnName: 'relationshipFK',
        type: 'codeSelect',
        code: 'ctMedisaveRelationShip',
      },
    ],
  }

  constructor (props) {
    super(props)

    const { title, titleChildren, dispatch, type } = props
    const { state } = this

    this.titleComponent = (
      <div style={{ position: 'relative' }}>
        {title}
        {titleChildren}
      </div>
    )

    this.commitChanges = ({ rows, added, changed, deleted }) => {
      const { setFieldValue } = this.props
      setFieldValue('schemePayer', rows)
    }
  }

  render () {
    const { enableAdd, rows, schema } = this.props

    const EditingProps = {
      showAddCommand: true,
      addCommandProps: {
        disabled: !enableAdd,
      },
      onCommitChanges: this.commitChanges,
    }

    return (
      <EditableTableGrid
        rows={rows}
        FuncProps={{ pager: false }}
        EditingProps={EditingProps}
        schema={schema}
        {...this.tableParas}
      />
    )
  }
}

export default PayersGrid
