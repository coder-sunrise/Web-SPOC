import React, { PureComponent } from 'react'
import moment from 'moment'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// umi
import { formatMessage } from 'umi/locale'
// custom components
import {
  DatePicker,
  TextField,
  GridContainer,
  GridItem,
  NumberInput,
  SizeContainer,
} from '@/components'

const styles = (theme) => ({
  container: {
    maxHeight: '40vh',
    overflowY: 'auto',
    marginTop: theme.spacing(1.5),
  },
  schemeSection: {
    marginBottom: theme.spacing(2),
  },
  schemeTitle: {
    fontWeight: 550,
    textAlign: 'left',
    paddingLeft: theme.spacing(1),
    fontSize: '.9rem',
  },
})

const CHASScheme = ({ classes }) => (
  <div className={classes.schemeSection}>
    <p className={classes.schemeTitle}>CHAS Blue (S1234567D)</p>
    <SizeContainer size='sm'>
      <GridContainer>
        <GridItem xs md={12}>
          <FastField
            name='Validity'
            render={(args) => (
              <DatePicker
                prefix='Validity: '
                defaultValue={moment()}
                {...args}
                disabled
                noUnderline
              />
            )}
          />
        </GridItem>
        <GridItem xs md={12}>
          <FastField
            name='Balance'
            render={(args) => (
              <NumberInput
                {...args}
                currency
                disabled
                noUnderline
                defaultValue={20}
                prefix='Balance: '
              />
            )}
          />
        </GridItem>
      </GridContainer>
    </SizeContainer>
  </div>
)

const OtherScheme = ({ classes }) => (
  <div className={classes.schemeSection}>
    <p className={classes.schemeTitle}>Medisave (S1234567D)</p>
    <SizeContainer size='sm'>
      <GridContainer>
        <GridItem xs md={12}>
          <FastField
            name='payer'
            render={(args) => (
              <TextField
                {...args}
                disabled
                noUnderline
                prefix='Payer: '
                defaultValue='Medisys'
              />
            )}
          />
        </GridItem>
        <GridItem xs md={12}>
          <FastField
            name='Validity'
            render={(args) => (
              <DatePicker
                prefix='Validity: '
                defaultValue={moment()}
                {...args}
                disabled
                noUnderline
              />
            )}
          />
        </GridItem>
        <GridItem xs md={12}>
          <FastField
            name='Balance'
            render={(args) => (
              <NumberInput
                {...args}
                currency
                disabled
                noUnderline
                defaultValue={20}
                prefix='Balance: '
              />
            )}
          />
        </GridItem>
      </GridContainer>
    </SizeContainer>
  </div>
)

class SchemesCard extends PureComponent {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <CHASScheme classes={classes} />
        <OtherScheme classes={classes} />
      </div>
    )
  }
}

export default withStyles(styles, { name: 'SchemesCard' })(SchemesCard)
