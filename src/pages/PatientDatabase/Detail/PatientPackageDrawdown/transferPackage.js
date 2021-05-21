import React, { Component } from 'react'
import * as Yup from 'yup'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import { formatMessage } from 'umi'
import { Search, Replay } from '@material-ui/icons'
import {
  CardContainer,
  withFormikExtend,
  GridContainer,
  GridItem,
  NumberInput,
  FastField,
  SizeContainer,
  TextField,
  ProgressButton,
  CommonModal,
  notification,
} from '@/components'
import PatientSearchModal from './PatientSearch'

const styles = theme => ({
  gridItemLabel: {
    paddingTop: theme.spacing(3),
  },
  gridItemButton: {
    paddingTop: theme.spacing(2),
  },
})

const parseToOneDecimalString = (value = 0.0) => value.toFixed(1)

@connect(({ patientSearch }) => ({
  patientSearchResult: patientSearch.list,
}))
@withFormikExtend({
  mapPropsToValues: ({ selectedPackageDrawdown }) => ({
    remainingQuantity: selectedPackageDrawdown.remainingQuantity,
    fromPackageDrawdownFK: selectedPackageDrawdown.id,
    transferQuantity: undefined,
    transferToPatientId: undefined,
    transferToPatientName: undefined,
    patientSearchValue: '',
  }),
  validationSchema: Yup.object().shape({
    transferQuantity: Yup.number()
      .required()
      .min(1, 'Transfer quantity must be greater than or equal to 1')
      .max(
        Yup.ref('remainingQuantity'),
        'Transfer quantity cannot exceed Remaining Quantity',
      ),
    transferToPatientId: Yup.number().required(),
  }),
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm } = props

    dispatch({
      type: 'patientPackageDrawdown/transferPatientPackage',
      payload: {
        ...values,
      },
    }).then(() => {
      if (onConfirm) onConfirm()
    })
  },
  displayName: 'TransferPackage',
})
class TransferPackage extends Component {
  state = {
    showSearchPatientModal: false,
  }

  onSearchPatientClick = async () => {
    const { dispatch, values } = this.props
    await dispatch({
      type: 'patientSearch/query',
      payload: {
        apiCriteria: {
          searchValue: values.patientSearchValue,
        },
      },
    })
    this.showSearchResult()
  }

  checkShouldPopulate = patientSearchResult => patientSearchResult.length === 1

  showSearchResult = () => {
    const { patientSearchResult } = this.props

    if (patientSearchResult) {
      const shouldPopulate = this.checkShouldPopulate(patientSearchResult)

      if (shouldPopulate) {
        this.onSelectPatientClick(patientSearchResult[0], true)
        this.resetPatientSearchResult()
      } else this.toggleSearchPatientModal()
    }
  }

  onSelectPatientClick = async (patientProfile, autoPopulate = false) => {
    const { id, name, patientAccountNo } = patientProfile
    const { values, setValues, patientPackageDrawdown } = this.props
    const { list } = patientPackageDrawdown
    const fromPatientId = list[0].patientProfileFK

    if (fromPatientId === id) {
      notification.error({
        message: 'Transfer to patient cannot as same as from patient',
      })
      this.resetPatientSearchResult()
      this.toggleSearchPatientModal()
      return false
    }

    await setValues({
      ...values,
      transferToPatientId: id,
      transferToPatientName: `${name} (${patientAccountNo})`,
    })
    if (!autoPopulate) this.toggleSearchPatientModal()

    return true
  }

  onResetPatientClick = () => {
    const { setFieldValue } = this.props
    setFieldValue('transferToPatientId', undefined)
    setFieldValue('transferToPatientName', undefined)
    setFieldValue('patientSearchValue', '')

    this.resetPatientSearchResult()
  }

  toggleSearchPatientModal = () => {
    const { showSearchPatientModal } = this.state
    this.setState({ showSearchPatientModal: !showSearchPatientModal })
    if (showSearchPatientModal) {
      this.resetPatientSearchResult()
    }
  }

  resetPatientSearchResult = () => {
    this.props.dispatch({
      type: 'patientSearch/updateState',
      payload: {
        filter: {},
        list: [],
      },
    })
  }

  render() {
    const {
      footer,
      selectedPackageDrawdown,
      patientPackageDrawdown,
      classes,
      values,
    } = this.props
    const { list } = patientPackageDrawdown
    const fromPackage = list.find(
      p => p.id === selectedPackageDrawdown.patientPackageFK,
    )
    const fromPackageLabel = `${fromPackage.packageCode} - ${fromPackage.packageName}`

    return (
      <CardContainer hideHeader>
        <SizeContainer size='sm'>
          <React.Fragment>
            <GridContainer>
              <GridItem xs={12}>
                <TextField
                  label='From Package'
                  disabled
                  value={fromPackageLabel}
                />
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  label='Item Code'
                  disabled
                  value={selectedPackageDrawdown.itemCode}
                />
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  label='Item Name'
                  disabled
                  value={selectedPackageDrawdown.itemName}
                />
              </GridItem>
              <GridItem xs={3}>
                <FastField
                  name='transferQuantity'
                  render={args => (
                    <NumberInput
                      {...args}
                      label='Transfer Quantity'
                      min={1}
                      max={selectedPackageDrawdown.remainingQuantity}
                      precision={1}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={9}>
                <p className={classes.gridItemLabel}>
                  (Remaining:{' '}
                  {parseToOneDecimalString(
                    selectedPackageDrawdown.remainingQuantity,
                  )}
                  )
                </p>
              </GridItem>
              <GridItem xs={3}>
                <p className={classes.gridItemLabel}>
                  Transfer To:
                  {values.transferToPatientId === undefined && (
                    <font color='red'> *</font>
                  )}
                </p>
              </GridItem>
              <GridItem xs={7}>
                <div>
                  {values.transferToPatientId === undefined && (
                    <FastField
                      name='patientSearchValue'
                      render={args => {
                        return (
                          <TextField
                            {...args}
                            defaultValue={undefined}
                            label={formatMessage({
                              id: 'reception.queue.patientSearchPlaceholder',
                            })}
                          />
                        )
                      }}
                    />
                  )}
                  {values.transferToPatientId !== undefined && (
                    <TextField
                      label='Selected Patient'
                      disabled
                      value={values.transferToPatientName}
                    />
                  )}
                </div>
              </GridItem>
              <GridItem xs={2}>
                <div className={classes.gridItemButton}>
                  {values.transferToPatientId === undefined && (
                    <ProgressButton
                      size='sm'
                      color='primary'
                      onClick={this.onSearchPatientClick}
                      icon={<Search />}
                    >
                      Search
                    </ProgressButton>
                  )}
                  {values.transferToPatientId !== undefined && (
                    <ProgressButton
                      size='sm'
                      color='danger'
                      onClick={this.onResetPatientClick}
                      icon={<Replay />}
                    >
                      Reset
                    </ProgressButton>
                  )}
                </div>
              </GridItem>
            </GridContainer>

            <CommonModal
              open={this.state.showSearchPatientModal}
              title='Search Patient'
              onClose={this.toggleSearchPatientModal}
              onConfirm={this.toggleSearchPatientModal}
              maxWidth='md'
              showFooter={false}
              overrideLoading
            >
              <PatientSearchModal
                search={values.patientSearchValue}
                handleSelectClick={this.onSelectPatientClick}
              />
            </CommonModal>
          </React.Fragment>
        </SizeContainer>
        {footer &&
          footer({
            onConfirm: this.props.handleSubmit,
            confirmBtnText: 'Transfer',
          })}
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(TransferPackage)
