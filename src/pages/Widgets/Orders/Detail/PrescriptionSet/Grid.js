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
import { primaryColor } from '@/assets/jss'
import CustomStyle from '../AddMedicationFromPast/CustomStyle.less'

const styles = () => ({
  nameColumn: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'inline-block',
    textOverflow: 'ellipsis',
    width: 340,
    paddingLeft: 8,
    float: 'left',
    marginTop: 6,
  },
  instructionColumn: {
    display: 'inline-block',
    width: 400,
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
})
class Grid extends PureComponent {
  Visits = () => {
    const {
      classes,
      onSelectItems,
      addedItems,
      loadPrescriptionSets,
      isRetail,
      clickCollapseHeader,
      activeKey,
    } = this.props
    return loadPrescriptionSets.map((o) => {
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

      return {
        header: (
          <div
            onClick={() => {
              clickCollapseHeader(o.id)
            }}
            style={{ display: 'flex', }}
          >
            <div style={{ marginLeft: 5, marginTop: 10, width: 200 }}>
              <span>
                {o.prescriptionSetName}
              </span>
            </div>
            <div style={{ alignItems: 'center', marginLeft: 8 }}>
              <span
                className={classes.addIcon}
                onClick={(event) => {
                  event.stopPropagation()
                  onSelectItems(
                    items.filter(
                      (item) =>
                        item.isActive &&
                        item.inventoryDispenseUOMFK === item.dispenseUOMFK,
                    ),
                  )
                }}
              >
                <span
                  className='material-icons'
                  style={{ marginTop: -2 }}
                >
                  add_circle_outline
                </span>
                <span
                  className='material-icons'
                  style={{ marginTop: -2 }}
                >
                  remove_circle_outline
                </span>
              </span>
              <Button justIcon color='primary' onClick={(event) => {
                event.stopPropagation()
              }}> <Edit /></Button>
              <Button justIcon color='danger' onClick={(event) => {
                event.stopPropagation()
              }}> <Delete /></Button>
            </div>
            <div
              style={{
                marginLeft: 'auto',
                alignItems: 'center',
                marginRight: 3,
              }}
            >
              <span className='material-icons'>
                {activeKey.find((key) => key === o.id) ? (
                  'expand_more'
                ) : (
                  'navigate_next'
                )}
              </span>
            </div>
          </div>
        ),
        key: o.id,
        itemCount: items.length,
        content: (
          <div>
            {items.map((item) => {
              let addedItem = addedItems.find((added) => added.id === item.id)
              let warningLabel
              if (!item.isActive) {
                warningLabel = '#1'
              } else if (item.inventoryDispenseUOMFK !== item.dispenseUOMFK) {
                warningLabel = '#2'
              } else if (item.isExternalPrescription) {
                warningLabel = '#3'
              }
              return (
                <div
                  style={{
                    background: addedItem ? 'lightGray' : 'white',
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
                      <Tooltip title={item.drugName || item.vaccinationName}>
                        <span>{item.drugName || item.vaccinationName}</span>
                      </Tooltip>
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
      handelLoadMore,
      moreData,
      isRetail,
      activeKey,
    } = this.props
    let visits = _.orderBy(
      this.Visits().filter((visit) => {
        return visit.itemCount > 0
      }),
      [
        'visitDate',
      ],
      [
        'desc',
      ],
    )
    const ContentHeight = height - 300
    const visitContentHeight = ContentHeight - 30
    if (visits.length >= 0) {
      return (
        <div>
          <div
            style={{
              overflow: 'auto',
              height: visitContentHeight,
            }}
          >
            <Collapse activeKey={activeKey} expandIconPosition={null}>
              {visits.map((visit) => {
                return (
                  <Collapse.Panel
                    header={visit.header}
                    className={CustomStyle.customPanel}
                    key={visit.key}
                  >
                    {visit.content}
                  </Collapse.Panel>
                )
              })}
            </Collapse>
            {moreData && (
              <div
                style={{
                  display: 'inline-Block',
                  float: 'right',
                  marginRight: 10,
                  marginTop: 8,
                }}
              >
                <a
                  style={{ textDecoration: 'underline', fontStyle: 'italic' }}
                  onClick={handelLoadMore}
                >
                  Load More
                </a>
              </div>
            )}
          </div>
          <div
            style={{
              height: 30,
              paddingTop: 10,
            }}
          >
            <div
              style={{
                display: 'inline-Block',
              }}
            >
              {type === '1' && (
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
              )}
              {type === '2' && (
                <span>
                  Note:&nbsp;<span
                    style={{ color: 'red', fontStyle: 'italic' }}
                  >
                    <sup>#1&nbsp;</sup>
                  </span>
                  inactive vaccination
                </span>
              )}
            </div>
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
