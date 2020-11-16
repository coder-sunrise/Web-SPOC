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
} from '@/components'
import model from './models'

window.g_app.replaceModel(model)

const styles = () => ({
  titleContainer: {
    display: 'flex',
  },
  titleBlack: {
    fontWeight: 'normal',
    color: 'black',
  },
  // titleBold: {
  //   marginRight: 30,
  //   marginTop: 5,
  //   fontWeight: 'bold',
  //   color: 'red',
  // },
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

    dispatch({
      type: 'patientPackageDrawdown/savePatientPackage',
      payload: {
        patientId: patient.entity.id,
        patientPackage: values,
      },
    })
  },
  displayName: 'PatientPackageDrawdown',
})
class PatientPackageDrawdown extends PureComponent {
  componentDidMount () {
    this.refreshPackageDrawdown()
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
    } = this.props

    if(list.length > 0) {      
      return (      
        <GridContainer>
          <GridItem md={12}>
            <div style={{
              height: 'calc(100vh - 250px)',
              overflow: 'scroll',
            }}
            >
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
            <Button color='primary' onClick={this.props.handleSubmit}>
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
      <div
        style={{
          height: 'calc(100vh - 250px)',
          paddingTop: 5,
          marginLeft: 5,
        }}
      >
        There is no records.
      </div>
    )
  }
}

export default withStyles(styles)(PatientPackageDrawdown)