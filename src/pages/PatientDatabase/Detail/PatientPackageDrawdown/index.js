import React, { Component } from 'react'
import { connect } from 'dva'
import { Collapse } from 'antd'
import moment from 'moment'
import withStyles from '@material-ui/core/styles/withStyles'
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter'
import {
  GridContainer,
  GridItem,
  Button,
  withFormikExtend,
  DatePicker,
  dateFormatLong,
  SizeContainer,
  CommonModal,
} from '@/components'
import model from './models'
import TransferPackage from './transferPackage'
import { ReportViewer } from '@/components/_medisys'
import customstyles from './PatientPackageDrawdownStyle.less'

window.g_app.replaceModel(model)

const smallFontSize = '0.85rem'
const styles = (theme) => ({
  titleContainer: {
    display: 'flex',
  },
  packageTitle: {
    fontWeight: 'bold',
    fontSize: smallFontSize,
  },
  titleBlack: {
    fontWeight: 'normal',
    fontSize: smallFontSize,
    color: 'black',
  },
  noRecordsDiv: {
    height: 'calc(100vh - 270px)',
    paddingTop: 5,
    marginLeft: theme.spacing(1),
  },
  contentDiv: {
    height: 'calc(100vh - 270px)',
    overflow: 'scroll',
  },
  drawdownQuantity: {
    marginLeft: theme.spacing(4),
    fontWeight: 500,
    fontSize: smallFontSize,
  },
  drawdownTitle: {
    fontWeight: 500,
    fontSize: smallFontSize,
  },
  drawdownInfo: {
    fontWeight: 500,
    fontSize: smallFontSize,
  },
  drawdownRemarks: {
    marginLeft: theme.spacing(3),
    fontSize: smallFontSize,
  },
  drawdownGrid: {
    marginTop: theme.spacing(1),
  },
  acknowledgeInfo: {
    marginLeft: theme.spacing(2),
    fontSize: smallFontSize,
  },
  transferButton: {
    marginTop: -2,
    marginLeft: theme.spacing(2),
  },
})

const parseToOneDecimalString = (value = 0.0) => value.toFixed(1)

@connect(({ patient, patientPackageDrawdown }) => ({
  patient,
  patientPackageDrawdown,
}))
@withFormikExtend({
  authority: [
    'patientdatabase.patientprofiledetails',
  ],
  enableReinitialize: true,
  mapPropsToValues: ({ patientPackageDrawdown }) => {    
    const { list = [] } = patientPackageDrawdown
    return list
  },
  handleSubmit: async (values, { props }) => {
    const {dispatch, patient} = props

    const uncompletedPackages = values.filter(p => !p.isCompleted && !p.isExpired)

    dispatch({
      type: 'patientPackageDrawdown/savePatientPackage',
      payload: {
        patientId: patient.entity.id,
        patientPackage: uncompletedPackages,
      },
    })
  },
  displayName: 'PatientPackageDrawdown',
})
class PatientPackageDrawdown extends Component {
  state = {
    isAllPackageCompleted: false,
    isShowPackageTransferModal: false,
    selectedPackageDrawdown: {},
    isShowReport: false,
    reportPayload: {
      reportID: undefined,
      reportParameters: undefined,
    },
    expandPackages: [],
    expandDrawdowns: [],
  }

  componentDidMount () {
    this.refreshPackageDrawdown()
  }

  componentWillReceiveProps (nextProps) {
    const { values } = nextProps
    const uncompletedPackages = values.filter(p => !p.isCompleted && !p.isExpired)
    this.setState({
      isAllPackageCompleted: uncompletedPackages.length <= 0,
    })
  }

  setExpandAll = (isExpandAll = false) => {
    const { values } = this.props
    if (isExpandAll) {
      if (values && values.length > 0) {
        this.setState({
          expandPackages: values.map(o => o.id),
        })

        let drawdowns = []
        values.forEach(p => {
          const { patientPackageDrawdown } = p
          drawdowns = drawdowns.concat(patientPackageDrawdown.map(o => o.id))
        })

        this.setState({ expandDrawdowns: drawdowns })
      }
    } else {
      this.setState({ expandPackages: [] })
      this.setState({ expandDrawdowns: [] })
    }
  }

  refreshPackageDrawdown = (isExpandAll = true) => {
    const { dispatch, patient } = this.props
    dispatch({
      type: 'patientPackageDrawdown/getPatientPackageDrawdown',
      payload: {
        patientId: patient.entity.id,
      },
    }).then((r) => {
      if (r && isExpandAll) {
        this.setExpandAll(true)
      }
    })
  }

  getDrawdownTitle = (row, isCompleted, isExpired) => {
    const { classes } = this.props
    const {
      itemName,
      remainingQuantity,
      totalQuantity,
      id,
    } = row

    const totalDrawdownQuantity = totalQuantity - remainingQuantity
    const label = `${itemName} (drawdown to-date: ${parseToOneDecimalString(totalDrawdownQuantity)} / ${parseToOneDecimalString(totalQuantity)})`

    return (
      <div 
        className={classes.titleContainer}
        onClick={() => {
          this.setState((preState) => {
            if (preState.expandDrawdowns.find((key) => key === id)) {
              return {
                ...preState,
                expandDrawdowns: preState.expandDrawdowns.filter(
                  (key) => key !== id,
                ),
              }
            }

            return {
              ...preState,
              expandDrawdowns: [
                ...preState.expandDrawdowns,
                id,
              ],
            }            
          })          
        }}
      >
        <p className={classes.drawdownTitle}>
          {remainingQuantity > 0 ? (
            <font color='#4255BD'>{label}</font>
          ) : (
            <font color='black'>{label}</font>
          )}
        </p>
        {!isCompleted && !isExpired && remainingQuantity > 0 && (
          <Button className={classes.transferButton}
            size='sm'
            color='info'
            justIcon
            onClick={(e) => {
              e.stopPropagation()

              this.setState({
                isShowPackageTransferModal: true,
                selectedPackageDrawdown: row,
              })
            }}
          >
            <BusinessCenterIcon />
          </Button>
        )}
      </div>
    )
  }

  getDrawdownContent = (row) => {
    const { classes } = this.props
    const {
      patientPackageDrawdownTransaction,
    } = row

    return (
      <div>
        {patientPackageDrawdownTransaction.map((transaction) => {
          const dateLabel = `on ${moment(transaction.transactionDate).format('DD MMM YYYY HH:mm')}`
          let infoLabel = `${dateLabel} by ${transaction.performingUserName}`
          if (transaction.transactionType === 'Transfer') {
            if (transaction.transferFromPatient)
              infoLabel = `${dateLabel} received from ${transaction.transferFromPatient}`
            else
              infoLabel = `${dateLabel} transferred to ${transaction.transferToPatient}`
          }

          return (
            <GridContainer className={classes.drawdownGrid}>
              <GridItem md={1}>
                <p className={classes.drawdownQuantity}>
                  {transaction.transferFromPatient ? (
                    <font color='green'>- {parseToOneDecimalString(transaction.transactionQuantity)}</font>
                  ) : (
                    <p>- {parseToOneDecimalString(transaction.transactionQuantity)}</p>
                  )}
                </p>
              </GridItem>
              <GridItem md={11}>
                <div>
                  <div className={classes.titleContainer}>
                    <p className={classes.drawdownInfo}>
                      {infoLabel}
                    </p>
                    {transaction.transactionQuantity > 0 && transaction.signatureDate && (
                    <p className={classes.acknowledgeInfo}><font color='red'>(Acknowledged on {moment(transaction.signatureDate).format('DD MMM YYYY')})</font></p>
                  )}
                  </div>
                  {transaction.remarks && (
                    <p className={classes.drawdownRemarks}>
                      Remark: {transaction.remarks}
                    </p>
                  )}
                </div>
              </GridItem>
            </GridContainer>
          )
        })}
      </div>
    )
  }

  getPackageTitle = (row) => {
    const { classes, values } = this.props
    const {
      packageCode,
      packageName,
      expiryDate,
      purchaseDate,
      isCompleted,
      isExpired,
      id,
      patientPackageDrawdown,
    } = row

    return (
      <div 
        className={classes.titleContainer} 
        onClick={() => {
          this.setState((preState) => {
            const drawdowns = patientPackageDrawdown.filter(d => d.patientPackageFK === id)
            const drawdownIds = drawdowns.map(o => o.id)

            if (preState.expandPackages.find((key) => key === id)) {
              return {
                ...preState,
                expandPackages: preState.expandPackages.filter(
                  (key) => key !== id,
                ),
                expandDrawdowns: preState.expandDrawdowns.filter(
                  (key) => !drawdownIds.includes(key),
                ),
              }
            }

            return {
              ...preState,
              expandPackages: [
                ...preState.expandPackages,
                id,
              ],
              expandDrawdowns: preState.expandDrawdowns.concat(drawdownIds),
            }            
          })          
        }}
      >
        <GridContainer>
          <GridItem md={8}>            
            <p className={classes.packageTitle}>
              {isCompleted ? (
                <font color='black'> {packageCode} - {packageName}</font>
              ) : (
                <font color='#4255BD'> {packageCode} - {packageName}</font>
              )}
            </p>
          </GridItem>
          <GridItem md={2}>
            {isCompleted && (
              <p className={classes.titleBlack}>Exp. Date: {expiryDate ? moment(expiryDate).format(dateFormatLong) : 'Nil'}</p>
              )
            }
            {!isCompleted && !isExpired && (
              <SizeContainer size='sm'>
                <div 
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <DatePicker 
                    style={{
                      width: 120, 
                      marginTop: -2,
                    }}
                    label='Exp. Date' 
                    format={dateFormatLong} 
                    value={expiryDate} 
                    onChange={
                      value => {
                        const changedPacakge = values.find(p => p.id === id)
                        if (changedPacakge) {
                          changedPacakge.expiryDate = value || undefined
                        }
                      }              
                    }
                  />
                </div>
              </SizeContainer>
              )
            }
            {!isCompleted && isExpired && (
              <p className={classes.titleBlack}>Exp. Date: 
                <font color='red'> {expiryDate ? moment(expiryDate).format(dateFormatLong) : 'Nil'}</font>
              </p>
            )
          }
          </GridItem>
          <GridItem md={2}>
            <p className={classes.titleBlack}>Purchased on: {moment(purchaseDate).format(dateFormatLong)}</p>
          </GridItem>
        </GridContainer>
      </div>
    )
  }

  getPackageContent = (row) => {
    const {
      patientPackageDrawdown,
    } = row

    return (
      <div>
        <Collapse activeKey={this.state.expandDrawdowns} expandIconPosition='left'>
          {patientPackageDrawdown.map((o) => {
            return (
              <Collapse.Panel
                header={this.getDrawdownTitle(o, row.isCompleted, row.isExpired)}
                key={o.id}
                className={customstyles.packageDrawdownPanel}
              >
                {this.getDrawdownContent(o)}
              </Collapse.Panel>
            )
          })}
        </Collapse>
      </div>
    )
  }

  closePackageTransferModal = () => {
    this.setState({
      isShowPackageTransferModal: false,
    })
  }

  confirmPackageTransferModal = () => {
    this.setState({
      isShowPackageTransferModal: false,
    })

    this.refreshPackageDrawdown(false)
  }

  onCloseReport = () => {
    this.setState({
      isShowReport: false,
      reportPayload: {
        reportID: undefined,
        reportParameters: undefined,
      },
    })
  }

  onPrintClick = () => {    
    const { patient } = this.props
    
    this.setState({
      isShowReport: true,
      reportPayload: {
        reportID: 66,
        reportParameters: { patientId: patient.entity.id },
      },
    })
  }

  render () {
    const {
      patientPackageDrawdown: { list = [] },
      patient,
      classes,
    } = this.props

    if(list.length > 0) {      
      return (      
        <div>
          <GridContainer>
            <GridItem md={12}>
              <div style={{
                textAlign: 'right',
              }}
              >
                <span
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    this.setExpandAll(true)
                  }}
                >
                  <span
                    className='material-icons'
                    style={{
                      fontSize: '1.2rem',
                    }}
                  >
                    unfold_more
                  </span>
                  <span style={{ position: 'relative', top: -5 }}>
                    Expand All
                  </span>
                </span>
                <span
                  style={{
                    cursor: 'pointer',
                    marginLeft: 20,
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.setExpandAll(false)
                  }}
                >
                  <span
                    className='material-icons'
                    style={{
                      fontSize: '1.2rem',
                    }}
                  >
                    unfold_less
                  </span>
                  <span style={{ position: 'relative', top: -5 }}>
                    Collapse All
                  </span>
                </span>
              </div>
            </GridItem>
            <GridItem md={12}>              
              <div className={classes.contentDiv}>
                <Collapse activeKey={this.state.expandPackages} expandIconPosition='right'>
                  {list.map((o) => {
                    return (
                      <Collapse.Panel
                        header={this.getPackageTitle(o)}
                        key={o.id}
                        className={customstyles.packagePanel}
                      >
                        {this.getPackageContent(o)}
                      </Collapse.Panel>
                    )
                  })}
                </Collapse>
              </div>
            </GridItem>
            <GridItem md={12}>
              {!this.state.isAllPackageCompleted && patient.entity.isActive && (
              <Button 
                color='primary' 
                onClick={this.props.handleSubmit}
              >
                Save
              </Button>
            )}
              <Button 
                color='primary'
                onClick={this.onPrintClick}
              >
              Print
              </Button>
            </GridItem>
          </GridContainer>

          <CommonModal
            cancelText='Cancel'
            maxWidth='sm'
            title='Transfering Package Item'
            onClose={this.closePackageTransferModal}
            onConfirm={this.confirmPackageTransferModal}
            open={this.state.isShowPackageTransferModal}
          >
            <TransferPackage selectedPackageDrawdown={this.state.selectedPackageDrawdown} {...this.props} />
          </CommonModal>
          <CommonModal
            open={this.state.isShowReport}
            onClose={this.onCloseReport}
            title='Package Drawdown'
            maxWidth='lg'
          >
            <ReportViewer
              showTopDivider={false}
              reportID={this.state.reportPayload.reportID}
              reportParameters={this.state.reportPayload.reportParameters}
            />
          </CommonModal>
        </div>
      )
    }

    return (
      <div className={classes.noRecordsDiv}>
        There is no records.
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientPackageDrawdown)