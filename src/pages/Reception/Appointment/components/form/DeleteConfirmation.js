import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
import Warning from '@material-ui/icons/Warning'
// common component
import {
  Danger,
  GridContainer,
  GridItem,
  RadioGroup,
  Button,
  TextField,
} from '@/components'

const styles = (theme) => ({
  reasonTextBox: {
    paddingTop: `${theme.spacing.unit * 4.75}px !important`,
  },
  title: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  warningIcon: {
    margin: theme.spacing.unit * 2,
  },
})

const DeleteConfirmation = ({
  ltCancelReason,
  isSeries,
  handleConfirmClick,
  onClose,
  classes,
}) => {
  const [
    error,
    setError,
  ] = useState()

  const [
    step,
    setStep,
  ] = useState(0)

  const [
    deleteType,
    setDeleteType,
  ] = useState('occurence')

  const [
    reason,
    setReason,
  ] = useState('')
  const [
    type,
    setType,
  ] = useState('')

  const [
    reasonType,
    setReasonType,
  ] = useState('1')

  const onContinueClick = () => {
    if (isSeries && type === '') {
      setError('Please choose an option')
    } else {
      setStep(1)
    }
  }

  const onChange = (event) => {
    const { target } = event
    setType(target.value)
    setError('')
  }

  const onReasonTextChange = (event) => {
    const { target } = event
    setReason(target.value)
  }

  const onReasonTypeChange = (event) => {
    const { target } = event
    setReasonType(target.value)
  }

  const onConfirmClick = () => {
    handleConfirmClick({
      type,
      reasonType,
      reason,
    })
  }

  return step === 0 ? (
    <GridContainer justify='center'>
      <GridItem>
        <div className={classes.title}>
          <Warning fontSize='large' className={classes.warningIcon} />
          <h4 style={{ textAlign: 'left' }}>
            Do you want to cancel this appointment?
          </h4>
        </div>
      </GridItem>
      {isSeries && (
        <GridItem>
          <RadioGroup
            label=''
            simple
            vertical
            defaultValue={type}
            onChange={onChange}
            options={[
              {
                value: '1',
                label: 'Only appointment that has not been modified',
              },
              {
                value: '2',
                label: 'All appointment',
              },
            ]}
          />
        </GridItem>
      )}
      <GridItem md={6} className={classes.centerText}>
        <Danger>
          <p>{error}</p>
        </Danger>
      </GridItem>
      <GridItem container justify='flex-end'>
        <Button onClick={onClose} color='danger'>
          Cancel
        </Button>
        <Button onClick={onContinueClick} color='primary'>
          Continue
        </Button>
      </GridItem>
    </GridContainer>
  ) : (
    <GridContainer justify='center'>
      <GridItem xs md={12}>
        <div className={classes.title}>
          <Warning fontSize='large' className={classes.warningIcon} />
          <h4 style={{ textAlign: 'left' }}>
            Please indicate reason for cancellation
          </h4>
        </div>
      </GridItem>
      <GridItem>
        <RadioGroup
          label=''
          simple
          vertical
          defaultValue={reasonType}
          onChange={onReasonTypeChange}
          options={ltCancelReason}
          textField='name'
          valueField='id'
          // options={[
          //   {
          //     value: 'noshow',
          //     label: 'No Show',
          //   },
          //   {
          //     value: 'other',
          //     label: 'Other',
          //   },
          // ]}
        />
      </GridItem>
      <GridItem xs md={6} className={classnames(classes.reasonTextBox)}>
        <TextField
          value={reason}
          onChange={onReasonTextChange}
          label='Reason'
          disabled={reasonType !== 'other'}
        />
      </GridItem>
      <GridItem container justify='flex-end'>
        <Button onClick={onClose} color='danger'>
          Cancel
        </Button>
        <Button onClick={onConfirmClick} color='primary'>
          Confirm
        </Button>
      </GridItem>
    </GridContainer>
  )
}

const ConnectDeleteConfirmation = connect(({ codetable }) => ({
  ltCancelReason: codetable.ltcancelreasontype,
}))(DeleteConfirmation)

export default withStyles(styles)(ConnectDeleteConfirmation)
