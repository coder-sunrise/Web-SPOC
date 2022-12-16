import {
  GridContainer,
  GridItem,
  EditableTableGrid,
  FieldArray,
  MultipleTextField,
  RadioGroup,
  FastField,
  Button,
  Tooltip,
  Popconfirm,
} from '@/components'
import { PureComponent } from 'react'
import { getUniqueId } from '@/utils/utils'
import { withStyles } from '@material-ui/core/styles'
import { Delete, Add } from '@material-ui/icons'
import _ from 'lodash'
const styles = theme => ({})

class Management extends PureComponent {
  constructor(props) {
    super(props)
    this.listProp = `${props.prefixProp}.corManagement_Item`
  }

  handleAddedRowsChange = addedRows => {
    const rows = _.get(this.arrayHelpers.form.values, this.listProp) || []
    addedRows.forEach(row => {
      row.id = 0
      row.uid = getUniqueId()
      row.isNew = true
      row.sequence = rows.filter(r => !r.isDeleted).length + 1
      row.assessment = ''
      row.managementPlan = ''
    })
    const { setFieldValue } = this.arrayHelpers.form
    setFieldValue(this.listProp, [...rows, ...addedRows])
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
            Management
          </span>
        </GridItem>
        <GridItem md={12}>
          <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
            Assessment & Plan
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
                    { name: 'action', title: 'Action' },
                    { name: 'sequence', title: 'S/N' },
                    { name: 'assessment', title: 'Assessment' },
                    { name: 'managementPlan', title: 'Plan' },
                  ]}
                  columnExtensions={[
                    {
                      columnName: 'action',
                      precision: 0,
                      width: 60,
                      disabled: true,
                      sortingEnabled: false,
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
                      align: 'center',
                      sortingEnabled: false,
                      width: 60,
                      disabled: true,
                    },
                    {
                      columnName: 'assessment',
                      sortingEnabled: false,
                      type: 'text',
                      maxLength: 2000,
                      disabled: false,
                    },
                    {
                      columnName: 'managementPlan',
                      sortingEnabled: false,
                      type: 'text',
                      maxLength: 2000,
                      disabled: false,
                    },
                  ]}
                  EditingProps={{
                    showAddCommand: true,
                    showCommandColumn: false,
                    onAddedRowsChange: this.handleAddedRowsChange,
                    onCommitChanges: this.handleCommitChanges,
                  }}
                  FuncProps={{ pager: false }}
                />
              )
            }}
          />
        </GridItem>
        <GridItem md={12} style={{ marginTop: 10 }}>
          <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
            Referral Timeline (If applicable)
          </span>
        </GridItem>
        <GridItem md={12} style={{ marginTop: 5 }}>
          <FastField
            name={`${this.props.prefixProp}.referralTimeline`}
            render={args => {
              return (
                <RadioGroup
                  valueField='code'
                  isAllowReset
                  textField='description'
                  options={[
                    {
                      code: 'NonUrgent',
                      description: 'Non-Urgent (Within 2-4 weeks)',
                    },
                    {
                      code: 'Early',
                      description: 'Early (Within 2 weeks)',
                    },
                    {
                      code: 'UrgentReferral',
                      description: 'Urgent referral (same day)',
                    },
                    {
                      code: 'Immediate',
                      description: 'Immediate (A&E)',
                    },
                  ]}
                  onChange={v => {
                    let { values, setFieldValue } = this.arrayHelpers.form
                    let oldFormValue = _.get(values, `${this.props.prefixProp}`)
                    const newFormValue = {
                      ...oldFormValue,
                      referralTimeline: v.target.value,
                    }
                    setFieldValue(`${this.props.prefixProp}`, newFormValue)
                  }}
                  noUnderline
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem md={12} style={{ marginTop: 10 }}>
          <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
            Follow Up Action & Next Review
          </span>
        </GridItem>
        <GridItem md={12}>
          <FastField
            name={`${this.props.prefixProp}.followUpActionAndNextPreview`}
            render={args => (
              <MultipleTextField
                label=''
                maxLength={2000}
                autoSize={{ minRows: 3 }}
                {...args}
              />
            )}
          />
        </GridItem>
      </GridContainer>
    )
  }
}
export default withStyles(styles, { name: 'Management' })(Management)
