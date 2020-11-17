import React, { PureComponent } from 'react'
import { connect } from 'dva'
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
import moment from 'moment'
import withStyles from '@material-ui/core/styles/withStyles'
import {
  GridContainer,
  GridItem,
  Button,
  withFormikExtend,
  Accordion,
  DatePicker,
  dateFormatLong,
  SizeContainer,
} from '@/components'
import model from './models'
import PackageDrawdownAccordion from './PackageDrawdownAccordion'

window.g_app.replaceModel(model)

const styles = (theme) => ({
  titleContainer: {
    display: 'flex',
  },
  titleBlack: {
    fontWeight: 'normal',
    color: 'black',
  },
  noRecordsDiv: {
    height: 'calc(100vh - 250px)',
    paddingTop: 5,
    marginLeft: theme.spacing(1),
  },
  contentDiv: {
    height: 'calc(100vh - 250px)',
    overflow: 'scroll',
  },
  drawdownQuantity: {
    marginLeft: theme.spacing(4),
    fontWeight: 'bold',
  },
  drawdownInfo: {
    fontWeight: 'bold',
  },
  drawdownRemarks: {
    marginLeft: theme.spacing(3),
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
class PatientPackageDrawdown extends PureComponent {
  state = {
    isAllPackageCompleted: false,
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

  refreshPackageDrawdown = () => {
    const { dispatch, patient } = this.props
    dispatch({
      type: 'patientPackageDrawdown/getPatientPackageDrawdown',
      payload: {
        patientId: patient.entity.id,
      },
    })
  }

  getDrawdownTitle = (row) => {
    const {
      itemName,
      remainingQuantity,
      totalQuantity,
    } = row

    const totalDrawdownQuantity = totalQuantity - remainingQuantity
    const label = `${itemName} (drawdown to-date: ${parseToOneDecimalString(totalDrawdownQuantity)} / ${parseToOneDecimalString(totalQuantity)})`

    return (
      <div>
        {remainingQuantity > 0 && (
        <p>{label}</p>
        )
        }
        {remainingQuantity <= 0 && (
        <p><font color='black'>{label}</font></p>
        )
        }
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
            <GridContainer>
              <GridItem md={1}>
                <p className={classes.drawdownQuantity}>
                  - {parseToOneDecimalString(transaction.transactionQuantity)}           
                </p>
              </GridItem>
              <GridItem md={11}>
                <div>
                  <p className={classes.drawdownInfo}>
                    {infoLabel}
                  </p>
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
    } = row

    return (
      <div className={classes.titleContainer}>
        <GridContainer>
          <GridItem md={8}>
            {isCompleted && (
              <p>
                <font color='black'> {packageCode} - {packageName}</font>
              </p>
              )
            }
            {!isCompleted && (
              <p>{packageCode} - {packageName}</p>
            )
          }
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
                    onChange={value => {
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

    let expandArrary = []
    let index = 0
    patientPackageDrawdown.forEach(d => {
      expandArrary.push(index)
      index += 1
    })

    return (
      <div>
        <PackageDrawdownAccordion
          defaultActive={expandArrary}
          leftIcon
          expandIcon={<SolidExpandMore fontSize='large' />}
          mode='multiple'
          collapses={patientPackageDrawdown.map((o) => {
            const returnValue = {
              title: this.getDrawdownTitle(o),
              content: this.getDrawdownContent(o),
            }
            return {
              ...returnValue,
              row: o,
            }
          })}
        />
      </div>
    )
  }

  render () {
    const {
      patientPackageDrawdown: { list = [] },
      patient,
      classes,
    } = this.props

    if(list.length > 0) {      
      return (      
        <GridContainer>
          <GridItem md={12}>
            <div className={classes.contentDiv}>
              <Accordion
                mode='multiple'
                collapses={list.map((o) => {
                  const returnValue = {
                    title: this.getPackageTitle(o),
                    content: this.getPackageContent(o),
                  }
                  return {
                    ...returnValue,
                    row: o,
                  }
                })}
              />
            </div>
          </GridItem>
          <GridItem md={12}>
            <Button 
              color='primary' 
              onClick={this.props.handleSubmit}
              disabled={this.state.isAllPackageCompleted || patient.entity.isActive === false}
            >
              Save
            </Button>
            <Button color='primary'>
              Print
            </Button>
          </GridItem>
        </GridContainer>
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