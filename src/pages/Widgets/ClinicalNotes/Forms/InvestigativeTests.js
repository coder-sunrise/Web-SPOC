import {
  GridContainer,
  GridItem,
  EditableTableGrid,
  FieldArray,
  Popconfirm,
  Tooltip,
  Button,
} from '@/components'
import { PureComponent } from 'react'
import { getUniqueId } from '@/utils/utils'
import { withStyles } from '@material-ui/core/styles'
import { Delete, Add } from '@material-ui/icons'

const styles = theme => ({})

class InvestigativeTests extends PureComponent {
  constructor(props) {
    super(props)
    this.listProp = `${props.prefixProp}.corInvestigativeTests_Item`
  }

  addRow = () => {
    const { setFieldValue } = this.arrayHelpers.form
    const rows = _.get(this.arrayHelpers.form.values, this.listProp) || []
    setFieldValue(this.listProp, [
      ...rows,
      {
        id: 0,
        uid: getUniqueId(),
        isNew: true,
        sequence: rows.filter(r => !r.isDeleted).length + 1,
        typeOfTestFK: 1,
        findings: '',
      },
    ])
    return []
  }

  deleteRow = row => {
    const { setFieldValue, values } = this.arrayHelpers.form
    let rows = _.get(values, this.listProp) || []
    if (!row.id) rows = rows.filter(r => r.uid != row.uid)
    else rows.find(r => r.id == row.id).isDeleted = true
    let s = 0
    rows = rows.map((r, i) => {
      if (!r.isDeleted) return { ...r, sequence: ++s }
      return { ...r }
    })
    setFieldValue(this.listProp, rows)
    console.log(rows)
  }
  handleCommitChanges = ({ rows, added, changed, deleted }) => {
    const { setFieldValue } = this.arrayHelpers.form
    setFieldValue(this.listProp, rows)
  }

  render() {
    return (
      <div>
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
                const rows =
                  _.get(arrayHelpers.form.values, this.listProp) || []
                return (
                  <EditableTableGrid
                    rows={rows}
                    getRowId={r => r.id || r.uid}
                    columns={[
                      { name: 'action', title: 'Action' },
                      { name: 'sequence', title: 'S/N' },
                      { name: 'typeOfTestFK', title: 'Type Of Test' },
                      { name: 'findings', title: 'Findings' },
                    ]}
                    columnExtensions={[
                      {
                        columnName: 'action',
                        precision: 0,
                        width: 60,
                        disabled: true,
                        align: 'center',
                        render: row => {
                          return (
                            <Popconfirm onConfirm={() => this.deleteRow(row)}>
                              <Tooltip title='Delete'>
                                <Button size='sm' color='danger' justIcon>
                                  <Delete />
                                </Button>
                              </Tooltip>
                            </Popconfirm>
                          )
                        },
                      },
                      {
                        columnName: 'sequence',
                        type: 'number',
                        precision: 0,
                        width: 80,
                        disabled: true,
                        align: 'center',
                      },
                      {
                        columnName: 'typeOfTestFK',
                        type: 'codeSelect',
                        code: 'ctTypeOfTest',
                        disabled: false,
                        width: '30%',
                      },
                      {
                        columnName: 'findings',
                        type: 'text',
                        disabled: false,
                      },
                    ]}
                    EditingProps={{
                      showAddCommand: false,
                      showCommandColumn: false,
                      onCommitChanges: this.handleCommitChanges,
                    }}
                    FuncProps={{ pager: false }}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        <Button
          size='sm'
          color='primary'
          onClick={this.addRow}
          style={{ marginLeft: 8 }}
        >
          <Add />
          Add New
        </Button>
      </div>
    )
  }
}
export default withStyles(styles, { name: 'InvestigativeTests' })(
  InvestigativeTests,
)
