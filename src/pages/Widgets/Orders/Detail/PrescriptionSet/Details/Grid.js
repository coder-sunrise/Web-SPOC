import numeral from 'numeral'
import _ from 'lodash'
import { Edit, Delete } from '@material-ui/icons'
import {
  CommonTableGrid,
  Button,
  Tooltip,
} from '@/components'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'

const wrapCellTextStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
}

const Grid = ({ values: { prescriptionSetItem = [] }, prescriptionSet, dispatch }) => {

  const editRow = (row) => {
    if (!row.isActive && !row.isDrugMixture) return
    else {
      dispatch({
        type: 'prescriptionSet/updateState',
        payload: {
          editPrescriptionSetItem: row,
        },
      })
    }
  }

  const drugMixtureIndicator = (row) => {
    if (!row.isDrugMixture) return null
    const activePrescriptionSetItemDrugMixture = row.prescriptionSetItemDrugMixture.filter(
      (item) => !item.isDeleted,
    )

    return (
      <div style={{ position: 'relative', top: 2 }}>
        <DrugMixtureInfo
          values={activePrescriptionSetItemDrugMixture}
          isShowTooltip={false}
        />
      </div>
    )
  }

  return <CommonTableGrid
    size='sm'
    style={{ margin: 0 }}
    forceRender
    rows={prescriptionSetItem}
    onRowDoubleClick={editRow}
    getRowId={(r) => r.uid}
    FuncProps={{
      pager: false,
    }}
    columns={[
      { name: 'type', title: 'Type' },
      { name: 'drugName', title: 'Name' },
      { name: 'instruction', title: 'Instructions' },
      { name: 'quantity', title: 'Qty.' },
      { name: 'actions', title: 'Actions' },
    ]}
    columnExtensions={[
      {
        columnName: 'type',
        width: 160,
        render: (row) => {
          let texts = []
          if (row.isDrugMixture === true) texts = 'Drug Mixture'
          else {
            texts = [
              'Medication',
              row.isExternalPrescription === true ? '(Ext.)' : '',
              row.isActive ? '' : '(Inactive)',
            ].join(' ')
          }

          return (
            <div style={wrapCellTextStyle}>
              <Tooltip title={texts}><span>{texts}</span></Tooltip>
              {drugMixtureIndicator(row)}
            </div>
          )
        },
      },
      {
        columnName: 'instruction',
        width: 240,
        render: (row) => {
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
        columnName: 'quantity',
        type: 'number',
        width: 140,
        render: (row) => {
          const qty = `${numeral(row.quantity || 0).format(
            '0,0.0',
          )} ${row.dispenseUOMDisplayValue}`

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
        render: (row) => {
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
                    (!row.isActive && !row.isDrugMixture)
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
                          editPrescriptionSetItem: undefined
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
}

export default Grid