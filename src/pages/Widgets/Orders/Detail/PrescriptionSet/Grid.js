import React, { PureComponent } from 'react'
import moment from 'moment'
import _ from 'lodash'
// material ui
import { withStyles, Divider } from '@material-ui/core'
import { Collapse } from 'antd'
import { Edit, Delete } from '@material-ui/icons'
// common components
import {
  GridItem,
  GridContainer,
  CardContainer,
  NumberInput,
  Tooltip,
  Button
} from '@/components'
// utils
import { primaryColor, dangerColor, grayColor } from '@/assets/jss'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import DeleteWithPopover from '@/pages/Billing/components/DeleteWithPopover'
import CustomStyle from '../AddMedicationFromPast/CustomStyle.less'

const styles = () => ({
  nameColumn: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'inline-block',
    textOverflow: 'ellipsis',
    width: 320,
    paddingLeft: 8,
    float: 'left',
    marginTop: 6,
  },
  instructionColumn: {
    display: 'inline-block',
    width: 420,
    paddingLeft: 8,
    float: 'left',
    marginTop: 6,
  },
  quantityColumn: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'inline-block',
    textOverflow: 'ellipsis',
    width: 150,
    paddingLeft: 8,
    float: 'left',
    marginTop: 6,
  },
  addIcon: {
    cursor: 'pointer',
    color: primaryColor,
  },
  removeIcon: {
    cursor: 'pointer',
    color: dangerColor,
  },
})
class Grid extends PureComponent {
  PrescriptionSets = () => {
    const {
      classes,
      onSelectItems,
      addedPrescriptionSets,
      loadPrescriptionSets,
      isRetail,
      clickCollapseHeader,
      activeKey,
      handelDelete,
      handelEdit,
      user,
      selectType,
      generalAccessRight,
      personalAccessRight
    } = this.props

    const drugMixtureIndicator = (row) => {
      if (!row.isDrugMixture) return null

      return (
        <div style={{ position: 'relative', top: 3 }}>
          <DrugMixtureInfo values={row.prescriptionSetItemDrugMixture || []} />
        </div>
      )
    }

    return loadPrescriptionSets.filter(set => selectType === 'All' || set.type === selectType).map((o) => {
      const items = _.orderBy(
        (o.prescriptionSetItem || []).filter((drug) => {
          return !isRetail || !drug.isExternalPrescription
        }),
        [
          'drugName',
        ],
        [
          'asc',
        ],
      )

      const isSelect = addedPrescriptionSets.indexOf(o.id) >= 0
      const selectEnable = items.filter(item => (item.isDrugMixture || (item.isActive && item.inventoryDispenseUOMFK === item.dispenseUOMFK))).length > 0

      const editEnable = (o.type === 'General' && generalAccessRight.rights === "enable") || (o.type === 'Personal' && personalAccessRight.rights === "enable")
      return {
        header: (
          <div
            onClick={() => {
              clickCollapseHeader(o.id)
            }}
            style={{ display: 'relative', padding: '3px 0px 8px 0px', height: 36 }}
          >
            <div style={{
              marginLeft: 5, marginTop: 14
            }}>
              {o.sortOrder >= 0 ? `${o.sortOrder}. ` : ''}
              <Tooltip title={o.prescriptionSetName}>
                <span style={{ fontWeight: 500 }}>
                  {o.prescriptionSetName}
                </span>
              </Tooltip>
            </div>

            {(selectType === 'All' || selectType === 'General') &&
              <div style={{ position: 'absolute', top: 20, right: 110 }}> {`${o.ownedByUser}(${o.type})`}</div>
            }
            <div style={{ position: 'absolute', top: 8, right: 75 }}>
              {!isSelect ? <span
                className={classes.addIcon}
                style={{ color: selectEnable ? primaryColor : grayColor }}
                onClick={selectEnable ? (event) => {
                  event.stopPropagation()
                  onSelectItems(o.id)
                } : undefined}
              >
                <span
                  className='material-icons'
                >
                  add_circle_outline
                </span>
              </span>
                : <span
                  className={classes.removeIcon}
                  onClick={(event) => {
                    event.stopPropagation()
                    onSelectItems(o.id)
                  }}
                >
                  <span
                    className='material-icons'
                  >
                    remove_circle_outline
                  </span>
                </span>
              }
            </div>
            <Button style={{ position: 'absolute', top: 8, right: 35 }}
              disabled={!editEnable}
              justIcon
              color='primary'
              onClick={(event) => {
                event.stopPropagation()
                handelEdit(o)
              }}> <Edit />
            </Button>

            {false && <Button style={{ position: 'absolute', top: 8, right: 0 }}
              disabled={!editEnable}
              justIcon
              color='danger'
              onClick={(event) => {
                event.stopPropagation()
                handelDelete(o.id)
              }}> <Delete />

            </Button>
            }
            <div style={{ position: 'absolute', top: 8, right: 0 }}>
              <DeleteWithPopover
                index={o.id}
                title='Delete Prescription Set'
                contentText='Confirm to remove this prescription set?'
                isFromCollapseHeader
                onConfirmDelete={() => {
                  handelDelete(o.id)
                }}
                disabled={!editEnable}
              />
            </div>
          </div>
        ),
        key: o.id,
        itemCount: items.length,
        content: (
          <div>
            {items.map((item) => {
              let warningLabel
              if (!item.isActive && !item.isDrugMixture) {
                warningLabel = '#1'
              } else if (!item.isDrugMixture && item.inventoryDispenseUOMFK !== item.dispenseUOMFK) {
                warningLabel = '#2'
              } else if (item.isExternalPrescription) {
                warningLabel = '#3'
              }
              return (
                <div
                  style={{
                    width: '100%',
                    fontSize: 14,
                  }}
                >
                  <GridContainer>
                    <div className={classes.nameColumn}>
                      {warningLabel && (
                        <span style={{ color: 'red', fontStyle: 'italic' }}>
                          <sup>{warningLabel}&nbsp;</sup>
                        </span>
                      )}
                      <Tooltip title={item.drugName}>
                        <span>{item.drugName}</span>
                      </Tooltip>
                      {drugMixtureIndicator(item)}
                    </div>
                    <div className={classes.instructionColumn}>
                      <Tooltip
                        title={item.instruction}
                      >
                        <span>
                          {item.instruction}
                        </span>
                      </Tooltip>
                    </div>
                    <div className={classes.quantityColumn}>
                      <Tooltip
                        title={`${item.quantity} ${item.dispenseUOMDisplayValue}`}
                      >
                        <span>
                          {`${item.quantity} ${item.dispenseUOMDisplayValue}`}
                        </span>
                      </Tooltip>
                    </div>
                  </GridContainer>
                  <Divider style={{ marginBottom: 1 }} />
                </div>
              )
            })}
          </div>
        ),
      }
    })
  }

  content = () => {
    const {
      type,
      height,
      isRetail,
      activeKey,
    } = this.props
    let prescriptionSets = _.orderBy(
      this.PrescriptionSets().filter((ps) => {
        return ps.itemCount > 0
      }),
      [
        'prescriptionSetName',
      ],
      [
        'desc',
      ],
    )
    const ContentHeight = height - 300
    const psContentHeight = ContentHeight - 30
    if (prescriptionSets.length >= 0) {
      return (
        <div>
          <div
            style={{
              overflow: 'auto',
              height: psContentHeight,
            }}
          >
            <Collapse activeKey={activeKey} expandIconPosition={null}>
              {prescriptionSets.map((ps) => {
                return (
                  <Collapse.Panel
                    header={ps.header}
                    className={CustomStyle.customPanel}
                    key={ps.key}
                  >
                    {ps.content}
                  </Collapse.Panel>
                )
              })}
            </Collapse>
          </div>
          <div
            style={{
              height: 30,
              paddingTop: 10,
            }}
          >
            <span>
              Note:&nbsp;
              <span style={{ color: 'red', fontStyle: 'italic' }}>
                <sup>#1&nbsp;</sup>
              </span>
              inactive medication &nbsp;&nbsp;
              <span style={{ color: 'red', fontStyle: 'italic' }}>
                <sup>#2&nbsp;</sup>
              </span>
              dispensing UOM is changed&nbsp;&nbsp;
              {!isRetail && (
                <span>
                  <span style={{ color: 'red', fontStyle: 'italic' }}>
                    <sup>#3&nbsp;</sup>
                  </span>
                  external prescription
                </span>
              )}
            </span>
          </div>
        </div>
      )
    }
    return (
      <div
        style={{
          height: ContentHeight,
          paddingTop: 5,
        }}
      >
        There is no matched records.
      </div>
    )
  }

  render () {
    return <CardContainer hideHeader>{this.content()}</CardContainer>
  }
}
export default withStyles(styles, { withTheme: true })(Grid)
