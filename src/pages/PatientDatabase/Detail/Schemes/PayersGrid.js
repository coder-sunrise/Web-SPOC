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
        onChange: ({ row }) => {
          if(!row.schemeFK) return
          
          const { ctschemetype = [] } = this.props.codetable
          const patSchemeType = ctschemetype.find(
            (item) => item.id === row.schemeFK,
          )

          if(patSchemeType.code !== 'FLEXIMEDI') return

          const minAge = moment().subtract(65, 'years')
          const payerAge = moment(row.dob)

          if(payerAge.isAfter(minAge))
          notification.error({
            message: 'Payer DOB must be equal or more than 65 for Flexi-Medisave',
          })
        },
      },
      {
        columnName: 'relationshipFK',
        type: 'codeSelect',
        code: 'ctMedisaveRelationShip',
        onChange: ({ row }) => {  
          const { ctschemetype = [], ctmedisaverelationship } = this.props.codetable

          const relation = ctmedisaverelationship.find(
            (item) => item.id === row.relationshipFK,
          )

          if (relation.name === 'SELF') // auto populate payer
          {
            const { entity } = this.props.patient
            row.payerName = entity.name
            row.payerID = entity.patientAccountNo
            row.dob = entity.dob
          }
          
          if(!row.schemeFK) return

          const patSchemeType = ctschemetype.find(
            (item) => item.id === row.schemeFK,
          )

          if(patSchemeType.code !== 'FLEXIMEDI') return

          let st = [
            'SELF',
            'SPOUSE',
          ].indexOf(relation.name) < 0

          if (st) {
            notification.error({
              message: '“Patient is” must be “Self” or “Spouse” for Flexi-Medisave',
            })
          }
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
