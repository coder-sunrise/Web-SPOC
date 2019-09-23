import React, { PureComponent, Component } from 'react'
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
  Field,
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
  displayName: 'InventoryAdjustment',
})
class Detail extends PureComponent {
  state = {
    type: undefined,
    rows: [
      {
        id: 1,
        type: 'medication',
        code: 'abc',
        name: 'panadol',
        uom: 'Tablet',
        currentStock: 100,
        adjustmentQty: 200,
      },
      {
        id: 2,
        type: 'medication',
        code: 'cg',
        name: 'coughSyrup',
        uom: 'Bottle',
        currentStock: 100,
        adjustmentQty: 200,
      },
      {
        id: 3,
        type: 'consumable',
        code: 'ct',
        name: 'cotton',
        uom: 'Piece',
        currentStock: 100,
        adjustmentQty: 200,
      },
    ],
  }

  constructor (props) {
    super(props)
    let commitCount = 1000 // uniqueNumber

    this.tableParas = {
      columns: [
        {
          name: 'type',
          title: 'Type',
        },
        { name: 'code', title: 'Code' },
        { name: 'name', title: 'Name' },
        { name: 'uom', title: 'UOM' },
        { name: 'batchNo', title: 'Batch #' },
        { name: 'expiryDate', title: 'Expiry Date' },
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
            { value: 'vaccination', name: 'Vaccination' },
          ],
          onChange: (e) => {
            this.setState({ type: `inventory${e.value}` })
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
          labelField: 'displayValue',
          code:
            this.state.type === 'medication'
              ? 'InventoryMedication'
              : 'InventoryConsumable',
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
          columnName: 'batchNo',
          type: 'select',
          options: [],
        },
        {
          columnName: 'expiryDate',
          type: 'date',
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
      columnEditingEnabled: false,
    }
  }

  onCommitChanges = ({ rows, deleted }) => {
    if (deleted) {
      const deletedSet = new Set(deleted)
      const changedRows = rows.filter((row) => !deletedSet.has(row.id))
      // setFieldValue('patientEmergencyContact', rows)

      return changedRows
    }

    console.log('row', rows)
    this.setState({ rows })
    return rows
  }

  handleCancel = () => {
    this.props.dispatch({
      type: 'inventoryAdjustment/updateState',
      payload: {
        showModal: false,
      },
    })
  }

  render () {
    const { props } = this
    const { classes, theme, footer, values, handleSubmit } = props
    console.log('detail', props)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <GridItem md={12}>
                <FastField
                  name='transNo'
                  render={(args) => (
                    <TextField label='Transaction No' disabled {...args} />
                  )}
                />
              </GridItem>
              <GridItem md={12}>
                <Field
                  name='transDate'
                  render={(args) => (
                    <DatePicker
                      label='Transaction Date'
                      {...args}
                      disabled={values.status === 'Finalized'}
                    />
                  )}
                />
              </GridItem>

              <GridItem md={12}>
                <FastField
                  name='status'
                  render={(args) => {
                    return <TextField label='Status' disabled {...args} />
                  }}
                />
              </GridItem>
            </GridItem>
            <GridItem md={6}>
              <Field
                name='remarks'
                render={(args) => {
                  return (
                    <OutlinedTextField
                      label='Remarks'
                      multiline
                      rowsMax={2}
                      rows={2}
                      disabled={values.status === 'Finalized'}
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
            rows={this.state.rows}
            FuncProps={{
              edit: values.status !== 'Finalized',
              pager: false,
              addNewLabelName: 'New Inventory Adjustment',
            }}
            EditingProps={{
              showAddCommand: values.status !== 'Finalized',
              showEditCommand: values.status !== 'Finalized',
              showDeleteCommand: values.status !== 'Finalized',
              onCommitChanges: this.onCommitChanges,
              onAddedRowsChange: this.onAddedRowsChange,
              // columnEditingEnabled: false,
              // editingEnabled: false,
            }}
            {...this.tableParas}
          />
          <GridContainer
            direction='row'
            justify='flex-end'
            alignItems='flex-end'
          >
            <Button color='danger' onClick={() => this.handleCancel()}>
              Cancel
            </Button>
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
