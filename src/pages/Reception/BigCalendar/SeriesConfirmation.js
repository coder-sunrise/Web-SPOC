import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import Warning from '@material-ui/icons/Warning'
// common components
import { GridContainer, GridItem, RadioGroup } from '@/components'

const styles = (theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  spacing: {
    marginBottom: theme.spacing(2),
  },
  warningIcon: {
    margin: theme.spacing.unit * 2,
  },
})

const SeriesConfirmation = ({ classes, footer, onConfirm }) => {
  return (
    <React.Fragment>
      <GridContainer justify='center'>
        <GridItem md={12}>
          <div className={classes.title}>
            <Warning fontSize='large' className={classes.warningIcon} />
            <h4 style={{ textAlign: 'left' }}>
              This is an appointment in a series. What do you want to open?
            </h4>
          </div>
        </GridItem>
        <GridItem>
          <RadioGroup
            label=''
            simple
            vertical
            defaultValue='one'
            onChange={() => ({})}
            options={[
              {
                value: 'one',
                label: 'Just this one',
              },
              {
                value: 'entire',
                label: 'The entire series',
              },
            ]}
          />
        </GridItem>
      </GridContainer>
      {footer &&
        footer({
          onConfirm,
          confirmText: 'Confirm',
        })}
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'SeriesConfirmation' })(
  SeriesConfirmation,
)
