import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { EditableTableGrid, notification } from '@/components'

@connect(({ codetable }) => ({ codetable }))
class PayersGrid extends PureComponent {
  tableParas = {
    columns: [
      { name: 'payerName', title: 'Payer Name' },
      { name: 'payerID', title: 'Payer ID' },
      { name: 'dob', title: 'Date of Birth' },
      { name: 'relationshipFK', title: 'Patient Is' },
      { name: 'schemeFK', title: 'Scheme' },
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
        onChange: ({ row }) => {  
          if (row.relationshipFK === 1) // auto populate self payer
          {
            const patientInfo = this.props.values || this.props.patient.entity
            if(patientInfo)
            {
              row.payerName = patientInfo.name
              row.payerID = patientInfo.patientAccountNo
              row.dob = patientInfo.dob
            }
          }
        },
        render: (row) => {
          const { ctmedisaverelationship = [] } = this.props.codetable
          const relation = ctmedisaverelationship.find(
            (item) => item.id === row.relationshipFK,
          )
          return (
            <span>{relation ? relation.name : ''}</span>
          )
        },
      },
      {
        columnName: 'schemeFK',
        type: 'codeSelect',
        code: 'ctSchemeType',
        localFilter: (opt) => [
          'FLEXIMEDI',
          'OPSCAN',
          'MEDIVISIT',
        ].indexOf(opt.code) >= 0,
        onChange: ({ row }) => {  
          const { patientScheme } = this.props.values
          if(!patientScheme.find(ps => ps.schemeTypeFK === row.schemeFK))
          {
            row.schemeFK = undefined
            notification.error({
              message: 'Scheme for Medisave Payer not in list of added Schemes.',
            })
          }
        },
        render: (row) => {
          const { ctschemetype = [] } = this.props.codetable
          const patSchemeType = ctschemetype.find(
            (item) => item.id === row.schemeFK,
          )
          return (
            <span>{patSchemeType ? patSchemeType.name : ''}</span>
          )
        },
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
