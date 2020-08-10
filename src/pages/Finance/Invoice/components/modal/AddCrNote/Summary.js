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

const Summary = ({ invoiceDetail, classes }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer className={classes.summary} alignItems='flex-end'>
          <GridItem md={9} />
          <GridItem md={3}>
            <FastField
              name='subTotal'
              render={(args) => (
                <NumberInput
                  {...args}
                  noUnderline
                  currency
                  disabled
                  rightAlign
                  normalText
                  prefix='Sub Total: '
                  defaultValue='0'
                />
              )}
            />
          </GridItem>

          <GridItem md={9} />
          <GridItem md={3}>
            <FastField
              name='gstAmount'
              render={(args) => {
                return (
                  <NumberInput
                    {...args}
                    noUnderline
                    currency
                    disabled
                    rightAlign
                    normalText
                    defaultValue={0}
                    prefix={
                      invoiceDetail.isGSTInclusive ? (
                        `${invoiceDetail.gstValue}% GST Inclusive:`
                      ) : (
                        `GST (${invoiceDetail.gstValue}%):`
                      )
                    }
                  />
                )
              }}
            />
          </GridItem>

          <GridItem md={9} />
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
                  prefix='Grand Total: '
                  defaultValue='0'
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default withStyles(styles, { name: 'CrNoteSummary' })(Summary)
