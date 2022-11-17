import {
  GridContainer,
  GridItem,
  EditableTableGrid,
  FieldArray,
} from '@/components'
import { PureComponent } from 'react'
import { getUniqueId } from '@/utils/utils'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({})

class InvestigativeTests extends PureComponent {
  constructor(props) {
    super(props)
    this.listProp = `${props.prefixProp}.corInvestigativeTests_Item`
  }

  handleAddedRowsChange = addedRows => {
    const rows = _.get(this.arrayHelpers.form.values, this.listProp) || []
    addedRows.forEach(row => {
      row.id = 0
      row.uid = getUniqueId()
      row.isNew = true
      row.sequence = rows.filter(r => !r.isDeleted).length + 1
      row.typeOfTestFK = 1
      row.findings = ''
    })
    const { setFieldValue } = this.arrayHelpers.form
    setFieldValue(this.listProp, [...rows, ...addedRows])
    return []
  }

  handleCommitChanges = ({ rows, added, changed, deleted }) => {
    const { setFieldValue } = this.arrayHelpers.form
    let newRows = rows
    if (deleted) {
      newRows = rows
        .filter(row => !row.isDeleted)
        .map((row, index) => ({
          ...row,
          sequence: (row.sequence = index + 1),
        }))
    }
    setFieldValue(this.listProp, newRows)
  }

  render() {
    return (
      <GridContainer style={{ marginTop: 8 }}>
        <GridItem md={12}>
          <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
            Investigative Tests
          </span>
        </GridItem>
        <GridItem md={12} style={{ marginTop: 4 }}>
          <FieldArray
            name={this.listProp}
            render={arrayHelpers => {
              this.arrayHelpers = arrayHelpers
              const rows = _.get(arrayHelpers.form.values, this.listProp) || []
              return (
                <EditableTableGrid
                  rows={rows}
                  getRowId={r => r.id || r.uid}
                  columns={[
                    { name: 'sequence', title: 'S/N' },
                    { name: 'typeOfTestFK', title: 'Type Of Test' },
                    { name: 'findings', title: 'Findings' },
                  ]}
                  columnExtensions={[
                    {
                      columnName: 'sequence',
                      type: 'number',
                      precision: 0,
                      width: 60,
                      disabled: true,
                    },
                    {
                      columnName: 'typeOfTestFK',
                      type: 'codeSelect',
                      code: 'ctTypeOfTest',
                      disabled: false,
                    },
                    {
                      columnName: 'findings',
                      type: 'text',
                      disabled: false,
                    },
                  ]}
                  EditingProps={{
                    showAddCommand: true,
                    onAddedRowsChange: this.handleAddedRowsChange,
                    onCommitChanges: this.handleCommitChanges,
                  }}
                  FuncProps={{ pager: false }}
                />
              )
            }}
          />
        </GridItem>
      </GridContainer>
    )
  }
}
export default withStyles(styles, { name: 'InvestigativeTests' })(
  InvestigativeTests,
)
