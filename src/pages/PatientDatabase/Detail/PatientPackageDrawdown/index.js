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
  NumberInput,
  SizeContainer,
} from '@/components'
import model from './models'

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
})

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
    } = row

    return (
      <div>
        <p>{itemName}</p>
      </div>
    )
  }

  getDrawdownContent = (row) => {
    const {
      patientPackageDrawdownTransaction,
    } = row

    return (
      <div>
        {patientPackageDrawdownTransaction.map((transaction) => {
          return (
            <div>
              <p>- <NumberInput
                label=''
                text
                value={transaction.transactionQuantity}
                precision={1}
              />
              </p>
            </div>
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
                <DatePicker 
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
        <Accordion
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