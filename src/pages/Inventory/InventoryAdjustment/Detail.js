import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import _ from 'lodash'
import { formatMessage, FormattedMessage } from 'umi/locale'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  DatePicker,
  Select,
  EditableTableGrid,
  Button,
  OutlinedTextField,
} from '@/components'

const styles = (theme) => ({})

@withFormikExtend({
  mapPropsToValues: ({ inventoryAdjustment }) =>
    inventoryAdjustment.entity || inventoryAdjustment.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    transDate: Yup.date().required(),
  }),
  handleSubmit: (values, { props }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'inventoryAdjustment/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
        roomStatusFK: 1,
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'inventoryAdjustment/query',
        })
      }
    })
  },
  displayName: 'InventoryAdjustmentDetail',
})
class Detail extends PureComponent {
  state = {
    type: undefined,
  }

  constructor (props) {
    super(props)
    let commitCount = 1000 // uniqueNumber
    this.tableParas = {
      rows: [
        {
          type: 'medication',
          code: 'abc',
          name: 'panadol',
          uom: 'Tablet',
          currentStock: 100,
          adjustmentQty: 200,
        },
        {
          type: 'medication',
          code: 'cg',
          name: 'coughSyrup',
          uom: 'Bottle',
          currentStock: 100,
          adjustmentQty: 200,
        },
        {
          type: 'consumable',
          code: 'ct',
          name: 'cotton',
          uom: 'Piece',
          currentStock: 100,
          adjustmentQty: 200,
        },
      ],
      columns: [
        {
          name: 'type',
          title: 'Type',
        },
        { name: 'code', title: 'Code' },
        { name: 'name', title: 'Name' },
        { name: 'uom', title: 'UOM' },
        { name: 'currentStock', title: 'Current Stock' },
        { name: 'adjustmentQty', title: 'Adjustment Qty' },
      ],
      columnExtensions: [
        {
          columnName: 'type',
          type: 'select',
          options: [
            { value: 'medication', name: 'Medication' },
            { value: 'consumable', name: 'Consumable' },
          ],
          onChange: (e) => {
            this.setState({ type: e.value })
            this.props.dispatch({
              // force current edit row components to update
              type: 'global/updateState',
              payload: {
                commitCount: (commitCount += 1),
              },
            })
          },
        },
        {
          columnName: 'code',
          type: 'codeSelect',
          code:
            this.state.type === 'medication'
              ? 'ctInventoryMedication'
              : 'ctInventoryConsumable',
          disabled: this.state.type,
        },
        {
          columnName: 'name',
          type: 'select',
          options: [
            { value: 'panadol', name: 'Panadol' },
            { value: 'coughSyrup', name: 'Cough Syrup' },
            { value: 'cotton', name: 'Cotton' },
          ],
        },
        {
          columnName: 'uom',
          disabled: true,
        },
        {
          columnName: 'currentStock',
          disabled: true,
        },
        {
          columnName: 'adjustmentQty',
          type: 'number',
        },
      ],
    }
  }

  onCommitChanges = ({ rows, deleted }) => {
    if (deleted) {
      const deletedSet = new Set(deleted)
      const changedRows = rows.filter((row) => !deletedSet.has(row.id))
      // setFieldValue(`${type}`, changedRows)
      return changedRows
    }
    return rows
  }

  render () {
    const { props } = this
    const { classes, theme, footer, values, handleSubmit } = props
    // console.log('detail', props)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <GridItem md={12}>
                <FastField
                  name='transNo'
                  render={(args) => (
                    <TextField
                      label='Transaction No'
                      autoFocused
                      disabled={!!values.id}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={12}>
                <FastField
                  name='transDate'
                  render={(args) => (
                    <DatePicker label='Transaction Date' {...args} />
                  )}
                />
              </GridItem>

              <GridItem md={12}>
                <FastField
                  name='status'
                  render={(args) => {
                    return (
                      <Select
                        label='Status'
                        options={[
                          { value: 'Finalize', name: 'Finalize' },
                          { value: 'Draft', name: 'Draft' },
                        ]}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='remarks'
                render={(args) => {
                  return (
                    <OutlinedTextField
                      label='Remarks'
                      multiline
                      rowsMax={5}
                      rows={5}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            {/* <GridItem md={12}>
              <FastField
                name='effectiveDates'
                render={(args) => {
                  return (
                    <DateRangePicker
                      label='Effective Start Date'
                      label2='End Date'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem> */}
          </GridContainer>

          <EditableTableGrid
            style={{ marginTop: 10 }}
            {...this.tableParas}
            // {...consumableTableParas}
            // columnExtensions={consumableColExtensions}
            // schema={consumableSchema}
            // rows={consumablePackageItem}
            FuncProps={{
              pager: false,
            }}
            EditingProps={{
              showAddCommand: true,
              showEditCommand: false,
              // onAddedRowsChange: onAddedRowsChange,
              onCommitChanges: this.onCommitChanges,
            }}
          />
          <GridContainer
            direction='row'
            justify='flex-end'
            alignItems='flex-end'
          >
            <Button color='danger'>Cancel</Button>
            <Button color='primary' onClick={handleSubmit}>
              Save
            </Button>
            <Button color='info'>Finalize</Button>
          </GridContainer>
        </div>

        {/* {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
        <Button>Finalize</Button> */}
      </React.Fragment>
    )
  }
}

export default Detail
