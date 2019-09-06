import React, { PureComponent } from 'react'

export class ReceivingDetailsGrid extends PureComponent {
  constructor (props) {
    super(props)
    this.tableParas = {
      rows: [
        // {
        //   id: 1,
        //   //type: 'Consumable',
        //   code: 'M/000001',
        //   name: 'Colgate 360 Toothbrush',
        //   uom: 'Box',
        //   orderQty: 100,
        //   bonusQty: 0,
        //   totalReceived: 100,
        //   totalBonusReceived: 0,
        //   currentReceivingQty: 100,
        //   currentReceivingBonusQty: 0,
        //   batchNo: 'B0001',
        //   expiryDate: moment(),
        // },
        // {
        //   id: 1,
        //   //type: 'Medication',
        //   code: 'D/000001',
        //   name: 'Panadol',
        //   uom: 'Tablet',
        //   orderQty: 100,
        //   bonusQty: 9,
        //   totalReceived: 109,
        //   totalBonusReceived: 9,
        //   currentReceivingQty: 109,
        //   currentReceivingBonusQty: 9,
        //   batchNo: 'B0001',
        //   expiryDate: moment(),
        // },
      ],
      columns: [
        { name: 'type', title: 'Type' },
        { name: 'code', title: 'Code' },
        { name: 'name', title: 'Name' },
        { name: 'uom', title: 'UOM' },
        { name: 'orderQty', title: 'Order Qty' },
        { name: 'bonusQty', title: 'Bonus Qty' },
        { name: 'totalReceived', title: 'Total Received' },
        { name: 'totalBonusReceived', title: 'Total Bonus Received' },
        { name: 'currentReceivingQty', title: 'Current Receiving Qty' },
        {
          name: 'currentReceivingBonusQty',
          title: 'Current Receiving Bonus Qty',
        },
        { name: 'batchNo', title: 'Batch No.' },
        { name: 'expiryDate', title: 'Expiry Date' },
      ],
      columnExtensions: [
        {
          columnName: 'type',
          type: 'codeSelect',
          options: podoOrderType,
          label: 'Type',
        },
        {
          columnName: 'code',
          type: 'codeSelect',
          //Consumable = InventoryConsumable | Medication = InventoryMedication | Vacination = InventoryVaccination
          code: 'InventoryConsumable',
        },
        {
          columnName: 'expiryDate',
          type: 'date',
          format: 'DD MMM YYYY',
        },
        {
          columnName: 'orderQty',
          type: 'number',
        },
        {
          columnName: 'bonusQty',
          type: 'number',
        },
        {
          columnName: 'totalReceived',
          type: 'number',
        },
        {
          columnName: 'totalBonusReceived',
          type: 'number',
          width: 180,
        },
        {
          columnName: 'currentReceivingQty',
          type: 'number',
          width: 150,
        },
        {
          columnName: 'currentReceivingBonusQty',
          type: 'number',
          width: 180,
        },
      ],
    }
  }

  onCommitChanges = ({ rows, deleted }) => {}

  render () {
    return (
      <React.Fragment>
        <EditableTableGrid
          //rows={rows}
          //schema={schema}
          //setArrayValue={this.updateValue('Allergy')}
          FuncProps={{
            edit: isEditable,
            pager: false,
            // pagerConfig: {
            //   containerExtraComponent: (
            //     <Button
            //       onClick={this.toggleReceivingItemModal}
            //       hideIfNoEditRights
            //       color='info'
            //       link
            //     >
            //       <Add />{' '}
            //       {formatMessage({
            //         id: 'inventory.pr.detail.dod.addNewDeliveryOrder',
            //       })}
            //     </Button>
            //   ),
            // },
          }}
          EditingProps={{
            showAddCommand: isEditable,
            showEditCommand: isEditable,
            showDeleteCommand: isEditable,
            onCommitChanges: this.commitChanges,
            //onAddedRowsChange: this.onAddedRowsChange,
          }}
          {...this.tableParas}
        />
      </React.Fragment>
    )
  }
}

export default ReceivingDetailsGrid
