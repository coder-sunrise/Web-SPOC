import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  NumberInput,
  TextField,
  CardContainer,
  Field,
  FastField,
} from '@/components'

const styles = theme => ({
  root: {
    padding: '10px',
    marginBottom: '10px',
  },

  boldText: {
    '& > p': {
      fontWeight: '700',
    },
  },

  gridItem: {
    marginBottom: theme.spacing(1),
    fontSize: '1.15em',
  },
})

const amountProps = {
  noUnderline: true,
  currency: true,
  disabled: true,
  rightAlign: true,
  normalText: true,
}

class Header extends PureComponent {
  render() {
    const { classes, values, theme } = this.props

    const cfg = {
      prefixProps: {
        classes: {
          root: classes.boldText,
        },
      },
      fullWidth: true,
      rightAlign: true,
      text: true,
    }

    return (
      <CardContainer hideHeader size='sm'>
        <GridContainer gutter={theme.spacing(3)}>
          <GridItem md={3} xs={6} className={classes.gridItem}>
            <Field
              name='company.displayValue'
              render={args => (
                <TextField prefix='Company Name:' {...cfg} {...args} />
              )}
            />
          </GridItem>

          <GridItem md={3} xs={6} className={classes.gridItem}>
            <FastField
              name='company.outstandingBalance'
              render={args => (
                <NumberInput
                  prefix='O/S Balance:'
                  {...cfg}
                  {...amountProps}
                  {...args}
                  defaultCurrencyFontColor
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Header)
