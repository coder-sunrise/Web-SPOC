import React, { PureComponent } from 'react'
import { connect } from 'dva'
import {
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
  CardContainer,
} from '@/components'
import Authorized from '@/utils/Authorized'
import { VISIT_TYPE } from '@/utils/constants'
import { List, ListItem, ListItemText } from '@material-ui/core'
import classnames from 'classnames'
import * as WidgetConfig from './config'

@connect(({ patientHistory }) => ({
  patientHistory,
}))
class HistoryDetails extends PureComponent {
  constructor (props) {
    super(props)

    this.widgets = WidgetConfig.widgets(
      props,
      props.scribbleNoteUpdateState,
    ).filter((o) => {
      const accessRight = Authorized.check(o.authority)
      return accessRight && accessRight.rights !== 'hidden'
    })
  }

  componentWillMount () {
    const { selectHistory } = this.props
    const isRetailVisit = selectHistory.visitPurposeFK === VISIT_TYPE.RETAIL
    if (isRetailVisit) {
      this.handleRetailVisitHistory(selectHistory)
    } else
      this.props
        .dispatch({
          type: 'patientHistory/queryOne',
          payload: selectHistory.coHistory[0].id,
        })
        .then((r) => {
          if (r) {
            this.props.dispatch({
              type: 'patientHistory/updateState',
              payload: {
                selectedSubRow: selectHistory.coHistory[0],
              },
            })
          }
        })
  }

  handleRetailVisitHistory = (v) => {
    this.props
      .dispatch({
        type: 'patientHistory/queryRetailHistory',
        payload: {
          id: v.invoiceFK,
        },
      })
      .then((r) => {
        if (r) {
          this.props.dispatch({
            type: 'patientHistory/updateState',
            payload: {
              selectedSubRow: v,
            },
          })
        }
      })
  }

  leftPanel = () => {
    const { patientHistory, clinicSettings, selectHistory } = this.props
    const { settings = [] } = clinicSettings
    const { selectedSubRow } = patientHistory
    const isRetailVisit = selectHistory.visitPurposeFK === VISIT_TYPE.RETAIL
    let newArray = []

    if (isRetailVisit) {
      newArray.push(selectHistory)
    } else if (
      settings.showConsultationVersioning === false ||
      settings.showConsultationVersioning === undefined
    ) {
      if (selectHistory.coHistory.length >= 1) {
        newArray.push(selectHistory.coHistory[0])
      }
    } else {
      newArray = selectHistory.coHistory
    }
    return (
      <List
        component='nav'
        classes={{
          root: this.props.classes.listRoot,
        }}
        disablePadding
        onClick={() => {}}
      >
        {newArray.map((o) => {
          const _title = o.userTitle ? `${o.userTitle} ` : ''

          return (
            <React.Fragment>
              <ListItem
                style={{ paddingLeft: 15 }}
                alignItems='flex-start'
                classes={{
                  root: this.props.classes.listItemRoot,
                }}
                selected={selectedSubRow && o.id === selectedSubRow.id}
                divider
                disableGutters
                button
                onClick={() => {
                  if (selectedSubRow && selectedSubRow.id === o.id) {
                    this.props.dispatch({
                      type: 'patientHistory/updateState',
                      payload: {
                        selectedSubRow: undefined,
                      },
                    })
                    return
                  }
                  if (isRetailVisit) {
                    this.handleRetailVisitHistory(selectHistory)
                  } else
                    this.props
                      .dispatch({
                        type: 'patientHistory/queryOne',
                        payload: o.id,
                      })
                      .then((r) => {
                        if (r) {
                          this.props.dispatch({
                            type: 'patientHistory/updateState',
                            payload: {
                              selectedSubRow: o,
                            },
                          })
                        }
                      })
                }}
              >
                <ListItemText
                  primary={
                    <div
                      style={{
                        width: '100%',
                        paddingRight: 20,
                      }}
                    >
                      <GridContainer>
                        <GridItem sm={12} style={{ fontWeight: 500 }}>
                          <TextField
                            text
                            value={selectHistory.visitPurposeName}
                          />
                          {selectHistory.visitDate && (
                            <span style={{ position: 'relative' }}>
                              &nbsp; (
                              <DatePicker
                                text
                                showTime
                                format='DD MMM YYYY h:mm a'
                                value={
                                  selectHistory.visitPurposeFK ===
                                  VISIT_TYPE.RETAIL ? (
                                    selectHistory.visitDate
                                  ) : (
                                    o.signOffDate
                                  )
                                }
                              />)
                            </span>
                          )}
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem sm={7}>
                          <TextField
                            text
                            value={
                              settings.showConsultationVersioning &&
                              !isRetailVisit ? (
                                `V${o.versionNumber}, ${_title}${o.userName}`
                              ) : (
                                `${_title}${o.userName}`
                              )
                            }
                          />
                        </GridItem>
                      </GridContainer>
                    </div>
                  }
                />
              </ListItem>
            </React.Fragment>
          )
        })}
      </List>
    )
  }

  detailPanel = () => {
    const { classes, override = {}, patientHistory, selectHistory } = this.props
    let visitDetails = {
      visitDate: selectHistory.visitDate,
      patientName: selectHistory.patientName,
      patientAccountNo: selectHistory.patientAccountNo,
    }
    const { entity } = patientHistory
    const { visitPurposeFK } = selectHistory
    return (
      <CardContainer
        hideHeader
        size='sm'
        className={classnames({
          [classes.rightPanel]: true,
          [override.rightPanel]: true,
        })}
      >
        {this.widgets
          .filter((_widget) => {
            if (visitPurposeFK === VISIT_TYPE.RETAIL) {
              return (
                _widget.id === WidgetConfig.WIDGETS_ID.INVOICE &&
                WidgetConfig.showWidget(entity || {}, _widget)
              )
            }
            return WidgetConfig.showWidget(entity || {}, _widget)
          })
          .map((o) => {
            const Widget = o.component
            return (
              <div>
                <span
                  style={{
                    fontWeight: 500,
                    color: 'darkBlue',
                    fontSize: '0.85rem',
                  }}
                >
                  {o.name}
                </span>
                <Widget
                  current={entity || {}}
                  visitDetails={visitDetails}
                  {...this.props}
                  setFieldValue={this.props.setFieldValue}
                />
              </div>
            )
          })}
      </CardContainer>
    )
  }

  render () {
    const { classes } = this.props
    return (
      <div style={{ marginLeft: 8, marginRight: 8 }}>
        <CardContainer hideHeader size='sm' className={classes.leftPanel}>
          {this.leftPanel()}
        </CardContainer>
        {this.detailPanel()}
      </div>
    )
  }
}

export default HistoryDetails
