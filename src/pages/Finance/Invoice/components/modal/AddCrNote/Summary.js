import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  GridContainer,
  GridItem,
  NumberInput,
  SizeContainer,
} from '@/components'
import styles from './styles'

const Summary = ({ classes }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer className={classes.summary} alignItems='flex-end'>
          {/* <GridItem md={4}>
            <FastField
              name='gst'
              render={(args) => (
                <NumberInput
                  {...args}
                  noUnderline
                  currency
                  disabled
                  rightAlign
                  normalText
                  defaultValue={8.4}
                  prefix='GST (7%)'
                />
              )}
            />
          </GridItem> */}
          {/* <GridItem md={8} />
          <GridItem md={3}>
            <FastField
              name='creditNoteBalance'
              render={(args) => (
                <NumberInput
                  {...args}
                  noUnderline
                  currency
                  disabled
                  rightAlign
                  normalText
                  prefix='Total Paid: '
                  defaultValue='0'
                />
              )}
            />
            <GridItem md={1} />
          </GridItem> */}

          <GridItem md={8} />
          <GridItem md={3}>
            <FastField
              name='finalCredit'
              render={(args) => (
                <NumberInput
                  {...args}
                  noUnderline
                  currency
                  disabled
                  rightAlign
                  normalText
                  prefix='Final Credit: '
                  defaultValue='0'
                />
              )}
            />
            <GridItem md={1} />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default withStyles(styles, { name: 'CrNoteSummary' })(Summary)
