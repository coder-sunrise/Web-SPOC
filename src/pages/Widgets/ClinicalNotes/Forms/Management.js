import {
  GridContainer,
  GridItem,
  EditableTableGrid,
  FieldArray,
  MultipleTextField,
  RadioGroup,
  FastField,
} from '@/components'
import { PureComponent } from 'react'
import { getUniqueId } from '@/utils/utils'
import { withStyles } from '@material-ui/core/styles'
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
                    { name: 'sequence', title: 'S/N' },
                    { name: 'assessment', title: 'Assessment' },
                    { name: 'managementPlan', title: 'Plan' },
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
                      columnName: 'assessment',
                      type: 'text',
                      disabled: false,
                    },
                    {
                      columnName: 'managementPlan',
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
