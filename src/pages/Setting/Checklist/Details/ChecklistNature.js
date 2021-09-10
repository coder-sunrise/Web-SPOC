import React, { PureComponent } from 'react'
import _ from 'lodash'
import {
  GridContainer,
  GridItem,
  EditableTableGrid,
} from '@/components'
import Yup from '@/utils/yup'

const schema = {
  natureScheme: Yup.array()
    .compact(v => v.isDeleted)
    .of(
      Yup.object().shape({
        displayValue: Yup.string().required(),
      }),
    ),
}

class ChecklistNature extends PureComponent {
  constructor(props) {
    super(props)

    const { subjectIndex, observationIndex, values } = this.props

    const checklistSubject = values.checklistSubject || []
    const checklistNature =
      checklistSubject[subjectIndex].checklistObservation[observationIndex]
        .checklistNature || []
    this.state = { checklistNature: [...checklistNature] }

    this.tableParas = {
      columns: [{ name: 'displayValue', title: 'Nature' }],
      columnExtensions: [
        {
          columnName: 'displayValue',
          sortingEnabled: false,
        },
      ],
    }

    this.commitChanges = ({ rows, added, changed, deleted }) => {
      let newRows = []

      const {
        subjectIndex,
        observationIndex,
        values,
        setFieldValue,
      } = this.props
      const checklistSubject = values.checklistSubject || []
      const checklistObservation =
        checklistSubject[subjectIndex].checklistObservation[observationIndex]

      if (changed) {
        const key = Object.keys(changed)[0]

        newRows = rows.map(nature => {
          if (nature.id === key) {
            return { ...nature, ...changed[key] }
          } else return { ...nature }
        })
      } else if (deleted) {
        const key = _.first(deleted)

        if (key >= 0) {
          newRows = rows.map(nature => {
            if (nature.id === key) {
              return { ...nature, isDeleted: true }
            } else return { ...nature }
          })
        } else {
          for (let natureItem of rows) {
            if (natureItem.id !== key) {
              newRows.push({ ...natureItem })
            }
          }
        }
      } else if (added) {
        const key = _.first(added).id

        let maxSortOrder =
          _.maxBy(rows, function(natureItem) {
            return natureItem.sortOrder || 0
          }).sortOrder || 0

        newRows = rows.map(nature => {
          if (nature.id === key) {
            return {
              ...nature,
              isDeleted: false,
              sortOrder: ++maxSortOrder,
              displayValue: '',
            }
          } else return { ...nature }
        })
      }

      if (added || deleted || changed) {
        checklistObservation.checklistNature = newRows
        setFieldValue('checklistSubject', checklistSubject)
        this.setState({ checklistNature: newRows })
      }
      return newRows
    }
  }

  getSortedRows = rows => {
    return _.orderBy(rows, ['sortOrder'])
  }

  onRowMove = (row, dirt) => {
    const { subjectIndex, observationIndex, values, setFieldValue } = this.props
    const checklistSubject = values.checklistSubject || []
    const checklistObservation =
      checklistSubject[subjectIndex].checklistObservation[observationIndex]

    const { checklistNature } = this.state
    const sortedChecklistNature = this.getSortedRows(
      _.filter(checklistNature, ['isDeleted', false]),
    )

    const aimRow = _.find(sortedChecklistNature, ['id', row.id])
    const index = sortedChecklistNature.indexOf(aimRow)

    if (dirt === 'UP') {
      if (index - 1 >= 0) {
        const prevSortOrder = sortedChecklistNature[index - 1].sortOrder
        sortedChecklistNature[index - 1].sortOrder =
          sortedChecklistNature[index].sortOrder
        sortedChecklistNature[index].sortOrder = prevSortOrder
      }
    } else if (dirt === 'DOWN') {
      if (index + 1 <= sortedChecklistNature.length) {
        const nextSortOrder = sortedChecklistNature[index + 1].sortOrder
        sortedChecklistNature[index + 1].sortOrder =
          sortedChecklistNature[index].sortOrder
        sortedChecklistNature[index].sortOrder = nextSortOrder
      }
    }

    const newChecklistNature = checklistObservation.checklistNature.map(
      natureItem => {
        const sortedNature = _.find(sortedChecklistNature, [
          'id',
          natureItem.id,
        ])
        if (sortedNature) {
          return { ...sortedNature }
        } else {
          return { ...natureItem }//soft delete nature
        }
      },
    )
    checklistObservation.checklistNature = newChecklistNature
    setFieldValue('checklistSubject', checklistSubject)
    this.setState({ checklistNature: newChecklistNature })
  }

  render() {
    const { checklistNature } = this.state

    const EditingProps = {
      showAddCommand: true,
      onCommitChanges: this.commitChanges,
    }

    return (
      <GridContainer>
        <GridItem md={12}>
          <EditableTableGrid
            rows={this.getSortedRows(checklistNature)}
            rowMoveable={() => true}
            onRowMove={this.onRowMove}
            FuncProps={{ pager: false }}
            EditingProps={EditingProps}
            schema={schema.natureScheme._subType}
            {...this.tableParas}
          />
        </GridItem>
      </GridContainer>
    )
  }
}

export default ChecklistNature
