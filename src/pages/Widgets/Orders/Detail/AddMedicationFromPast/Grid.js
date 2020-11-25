import React, { PureComponent } from 'react'
import moment from 'moment'
import _ from 'lodash'
// material ui
import { withStyles, Divider } from '@material-ui/core'
import { Collapse } from 'antd'
// common components
import {
  GridItem,
  GridContainer,
  CardContainer,
  NumberInput,
  Tooltip,
} from '@/components'
// utils
import { primaryColor } from '@/assets/jss'
import CustomStyle from './CustomStyle.less'

const styles = () => ({
  nameColumn: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'inline-block',
    textOverflow: 'ellipsis',
    width: 300,
    paddingLeft: 8,
    float: 'left',
    marginTop: 6,
  },
  instructionColumn: {
    display: 'inline-block',
    width: 340,
    paddingLeft: 8,
    float: 'left',
    marginTop: 6,
  },
  quantityColumn: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'inline-block',
    textOverflow: 'ellipsis',
    width: 120,
    paddingLeft: 8,
    float: 'left',
    marginTop: 6,
  },
  totalPriceColumn: {
    width: 120,
    paddingRight: 8,
    float: 'left',
    marginTop: 6,
  },
  actionColumn: {
    width: 30,
    float: 'left',
  },
  addIcon: {
    cursor: 'pointer',
    color: primaryColor,
  },
})
class Grid extends PureComponent {
  constructor (props) {
    super(props)
    this.scrollRef = React.createRef()
  }

  componentDidMount () {
    if (this.scrollRef) {
      this.scrollRef.addEventListener('scroll', (e) => {
        const { isScrollBottom, setScrollBottom } = this.props
        if (!isScrollBottom) {
          const { clientHeight, scrollHeight, scrollTop } = e.target
          const isBottom = clientHeight + scrollTop === scrollHeight
          if (isBottom) {
            setScrollBottom(isBottom)
          }
        }
      })
    }
  }

  Visits = () => {
    const {
      classes,
      onSelectItems,
      addedItems,
      type,
      loadVisits,
      isRetail,
    } = this.props
    return loadVisits.map((o) => {
      let items = []
      if (type === '1') {
        if (o.corPrescriptionItem && o.corPrescriptionItem.length > 0) {
          items = _.orderBy(
            o.corPrescriptionItem.filter((drug) => {
              return !isRetail || !drug.isExternalPrescription
            }),
            [
              'drugName',
            ],
            [
              'asc',
            ],
          )
        } else if (
          o.retailPrescriptionItem &&
          o.retailPrescriptionItem.length > 0
        ) {
          items = _.orderBy(
            o.retailPrescriptionItem,
            [
              'drugName',
            ],
            [
              'asc',
            ],
          )
        }
      } else if (type === '2') {
        if (o.corVaccinationItem && o.corVaccinationItem.length > 0) {
          items = _.orderBy(
            o.corVaccinationItem,
            [
              'vaccinationName',
            ],
            [
              'asc',
            ],
          )
        }
      }
      return {
        header: (
          <GridContainer>
            <GridItem xs={4} md={3} style={{ padding: 0 }}>
              <span>
                Visit Date:&nbsp;{moment(o.visitDate).format('DD MMM YYYY')}
              </span>
            </GridItem>
            <GridItem xs={4} md={4}>
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
                  style={{ position: 'absolute', marginTop: -2 }}
                >
                  add_circle_outline
                </span>
                <span
                  style={{
                    marginLeft: 30,
                  }}
                >
                  Add All
                </span>
              </span>
            </GridItem>
          </GridContainer>
        ),
        key: o.id,
        itemCount: items.length,
        visitDate: o.visitDate,
        content: (
          <div>
            {items.map((item) => {
              let addedItem = addedItems.find((added) => added.id === item.id)
              let warningLabel
              if (item.isExternalPrescription) {
                warningLabel = '*'
              } else if (!item.isActive) {
                warningLabel = '**'
              } else if (item.inventoryDispenseUOMFK !== item.dispenseUOMFK) {
                warningLabel = '***'
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
                        <span style={{ color: 'red' }}>{warningLabel}</span>
                      )}
                      <Tooltip title={item.drugName || item.vaccinationName}>
                        <span>{item.drugName || item.vaccinationName}</span>
                      </Tooltip>
                    </div>
                    <div className={classes.instructionColumn}>
                      <Tooltip
                        title={
                          item.instruction ||
                          `${item.usageMethodDisplayValue ||
                            ''} ${item.dosageDisplayValue ||
                            ''} ${item.uomDisplayValue || ''}`
                        }
                      >
                        <span>
                          {item.instruction ||
                            `${item.usageMethodDisplayValue ||
                              ''} ${item.dosageDisplayValue ||
                              ''} ${item.uomDisplayValue || ''}`}
                        </span>
                      </Tooltip>
                    </div>
                    <div className={classes.quantityColumn}>
                      <Tooltip
                        title={`${item.quantity} ${item.dispenseUOMDisplayValue ||
                          item.uomDisplayValue}`}
                      >
                        <span>
                          {`${item.quantity} ${item.dispenseUOMDisplayValue ||
                            item.uomDisplayValue}`}
                        </span>
                      </Tooltip>
                    </div>
                    <div className={classes.totalPriceColumn}>
                      <span style={{ float: 'right' }}>
                        <NumberInput text currency value={item.totalPrice} />
                      </span>
                    </div>
                    <div className={classes.actionColumn}>
                      {item.isActive &&
                        item.inventoryDispenseUOMFK === item.dispenseUOMFK &&
                        (!addedItem ? (
                          <span
                            className='material-icons'
                            style={{
                              cursor: 'pointer',
                              color: primaryColor,
                              marginTop: 4,
                              marginLeft: 5,
                            }}
                            onClick={() => {
                              onSelectItems(item)
                            }}
                          >
                            add_circle_outline
                          </span>
                        ) : (
                          <span
                            className='material-icons'
                            style={{
                              cursor: 'pointer',
                              color: 'red',
                              marginTop: 4,
                              marginLeft: 5,
                            }}
                            onClick={() => {
                              onSelectItems(item)
                            }}
                          >
                            remove_circle_outline
                          </span>
                        ))}
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
      isScrollBottom,
      isRetail,
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
            ref={(e) => (this.scrollRef = e)}
            style={{
              overflow: 'auto',
              height: visitContentHeight,
            }}
          >
            <Collapse expandIconPosition='right'>
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
                  Note:&nbsp;{!isRetail && (
                    <span>
                      <span style={{ color: 'red' }}>*</span>
                      external prescription &nbsp;&nbsp;
                    </span>
                  )}
                  <span style={{ color: 'red' }}>**</span>
                  inactive medication &nbsp;&nbsp;<span
                    style={{ color: 'red' }}
                  >
                    ***
                  </span>
                  dispensing UOM changed
                </span>
              )}
              {type === '2' && (
                <span>
                  Note:&nbsp;<span style={{ color: 'red' }}>**</span>
                  inactive vaccination
                </span>
              )}
            </div>
            {isScrollBottom &&
            moreData && (
              <div
                style={{
                  display: 'inline-Block',
                  float: 'right',
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
