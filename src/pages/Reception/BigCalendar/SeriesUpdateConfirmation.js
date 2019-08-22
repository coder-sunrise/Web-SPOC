import React, { useState } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import Warning from '@material-ui/icons/Warning'
// common components
import { Danger, GridContainer, GridItem, RadioGroup } from '@/components'

const styles = (theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  spacing: {
    marginBottom: theme.spacing(2),
  },
  warningIcon: {
    margin: theme.spacing.unit * 2,
  },
})

const SeriesUpdateConfirmation = ({ classes, footer, handleConfirm }) => {
  const [
    type,
    setType,
  ] = useState('')

  const [
    error,
    setError,
  ] = useState()

  const onChange = (event, value) => {
    const { target } = event
    setType(target.value)
    setError('')
  }

  const validate = () => {
    if (type === '') {
      setError('Please choose an option')
    } else {
      handleConfirm(type)
    }
  }

  return (
    <React.Fragment>
      <GridContainer justify='center'>
        <GridItem md={12}>
          <div className={classes.title}>
            <Warning fontSize='large' className={classes.warningIcon} />
            <h4 style={{ textAlign: 'left' }}>
              Update appointments match the series
            </h4>
          </div>
        </GridItem>

        <GridItem>
          <RadioGroup
            label=''
            simple
            vertical
            defaultValue={type}
            onChange={onChange}
            options={[
              {
                value: 'single',
                label: 'Only appointment that has not been modified',
              },
              {
                value: 'all',
                label: 'All appointment',
              },
            ]}
          />
        </GridItem>
        <GridItem md={6} className={classes.centerText}>
          <Danger>
            <p>{error}</p>
          </Danger>
        </GridItem>
      </GridContainer>
      {footer &&
        footer({
          onConfirm: validate,
          confirmText: 'Confirm',
        })}
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'SeriesConfirmation' })(
  SeriesUpdateConfirmation,
)
