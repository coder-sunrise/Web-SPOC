import numeral from 'numeral'
import _ from 'lodash'
import { Edit, Delete } from '@material-ui/icons'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'

const wrapCellTextStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
}

const rightIcon = {
  position: 'absolute',
  bottom: 2,
  fontWeight: 500,
  color: 'white',
  fontSize: '0.7rem',
  padding: '2px 3px',
  height: 20,
  right: -30,
  borderRadius: 4,
  backgroundColor: 'green',
  cursor: 'pointer',
}

const Grid = ({ prescriptionSet, dispatch }) => {
  const editRow = row => {
    if ((!row.isActive || !row.orderable) && !row.isDrugMixture) return
    else {
      dispatch({
        type: 'prescriptionSet/updateState',
        payload: {
          editPrescriptionSetItem: row,
        },
      })
    }
  }

  const drugMixtureIndicator = (row, right) => {
    const activePrescriptionSetItemDrugMixture = row.prescriptionSetItemDrugMixture.filter(
      item => !item.isDeleted,
    )

    return (
      <DrugMixtureInfo
        values={activePrescriptionSetItemDrugMixture}
        right={right}
      />
    )
  }

  const isEditingEntity = !_.isEmpty(prescriptionSet.editPrescriptionSetItem)
  return (
    <CommonTableGrid
      size='sm'
      style={{ margin: 0 }}
      forceRender
      rows={(prescriptionSet.prescriptionSetItems || [])
        .filter(item => !item.isDeleted)
        .map(item => ({
          ...item,
          isEditingEntity: isEditingEntity,
        }))}
      onRowDoubleClick={editRow}
      getRowId={r => r.uid}
      FuncProps={{
        pager: false,
      }}
      columns={[
        { name: 'type', title: 'Type' },
        { name: 'drugName', title: 'Name' },
        { name: 'instruction', title: 'Instructions' },
        { name: 'precaution', title: 'Precautions' },
        { name: 'quantity', title: 'Qty.' },
        { name: 'actions', title: 'Actions' },
      ]}
      columnExtensions={[
        {
          columnName: 'type',
          width: 150,
          render: row => {
            let texts = []
            const firstInstruction = (
              row.prescriptionSetItemInstruction || []
            ).find(item => !item.isDeleted)
            if (row.isDrugMixture === true) texts = 'Drug Mixture'
            else {
              texts = [
                'Medication',
                row.isExternalPrescription === true ? '(Ext.)' : '',
              ].join(' ')
            }

            let warningLabel
            if (row.isDrugMixture) {
              const drugMixtures = row.prescriptionSetItemDrugMixture || []
              if (drugMixtures.find(drugMixture => !drugMixture.isActive)) {
                warningLabel = '#1'
              } else if (
                drugMixtures.find(drugMixture => !drugMixture.orderable)
              ) {
                warningLabel = '#2'
              } else if (
                drugMixtures.find(
                  drugMixture =>
                    drugMixture.inventoryDispenseUOMFK !== drugMixture.uomfk ||
                    drugMixture.inventoryPrescribingUOMFK !==
                      drugMixture.prescribeUOMFK,
                )
              ) {
                warningLabel = '#3'
              }
            } else {
              if (!row.isActive) {
                warningLabel = '#1'
              } else if (!row.orderable) {
                warningLabel = '#2'
              } else if (
                row.inventoryDispenseUOMFK !== row.dispenseUOMFK ||
                firstInstruction?.prescribeUOMFK !==
                  row.inventoryPrescribingUOMFK
              ) {
                warningLabel = '#3'
              }
            }

            let paddingRight = 0
            if (row.isExclusive) {
              paddingRight = 24
            }
            if (row.isDrugMixture) {
              paddingRight = 10
            }
            return (
              <div style={{ ...wrapCellTextStyle, paddingRight: paddingRight }}>
                <Tooltip title={texts}>
                  <span>
                    {warningLabel && (
                      <span style={{ color: 'red', fontStyle: 'italic' }}>
                        <sup>{warningLabel}&nbsp;</sup>
                      </span>
                    )}
                    <span>{texts}</span>
                  </span>
                </Tooltip>
                <div style={{ position: 'relative' }}>
                  {row.isDrugMixture && drugMixtureIndicator(row, -20)}
                  {row.isExclusive && (
                    <Tooltip title='The item has no local stock, we will purchase on behalf and charge to patient in invoice'>
                      <div style={rightIcon}>Excl.</div>
                    </Tooltip>
                  )}
                </div>
              </div>
            )
          },
        },
        {
          columnName: 'instruction',
          width: 180,
          render: row => {
            return (
              <Tooltip title={row.instruction}>
                <div
                  style={{
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {row.instruction || ''}
                </div>
              </Tooltip>
            )
          },
        },
        {
          columnName: 'precaution',
          width: 200,
          render: row => {
            const { prescriptionSetItemPrecaution = [] } = row
            return (
              <div style={{ position: 'relative' }}>
                {prescriptionSetItemPrecaution.map(precaution => {
                  return (
                    <div
                      style={{
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {precaution.precaution}
                    </div>
                  )
                })}
              </div>
            )
          },
        },
        {
          columnName: 'quantity',
          type: 'number',
          width: 120,
          render: row => {
            const qty = `${numeral(row.quantity || 0).format('0,0.0')} ${
              row.dispenseUOMDisplayValue
            }`

            return (
              <Tooltip title={qty}>
                <span>{qty}</span>
              </Tooltip>
            )
          },
        },
        {
          columnName: 'actions',
          width: 70,
          align: 'center',
          sortingEnabled: false,
          render: row => {
            return (
              <div>
                <Tooltip title='Edit'>
                  <Button
                    size='sm'
                    onClick={() => {
                      editRow(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginRight: 5 }}
                    disabled={
                      row.isEditingEntity ||
                      ((!row.isActive || !row.orderable) && !row.isDrugMixture)
                    }
                  >
                    <Edit />
                  </Button>
                </Tooltip>
                <Tooltip title='Delete'>
                  <Button
                    size='sm'
                    color='danger'
                    justIcon
                    disabled={row.isEditingEntity}
                  >
                    <Delete
                      onClick={() => {
                        dispatch({
                          type: 'prescriptionSet/deleteRow',
                          payload: {
                            uid: row.uid,
                          },
                        })

                        dispatch({
                          type: 'prescriptionSet/updateState',
                          payload: {
                            editPrescriptionSetItem: undefined,
                          },
                        })
                      }}
                    />
                  </Button>
                </Tooltip>
              </div>
            )
          },
        },
      ]}
    />
  )
}

export default Grid
