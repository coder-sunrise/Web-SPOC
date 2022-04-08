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

const Summary = ({ invoiceDetail, classes, showGST = true }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer className={classes.summary} alignItems='flex-end'>
          {showGST && <GridItem md={9} />}
          {showGST && (
            <GridItem md={3}>
              <FastField
                name='subTotal'
                render={args => (
                  <NumberInput
                    {...args}
                    noUnderline
                    style={{ float: 'right' }}
                    currency
                    text
                    rightAlign
                    prefix='Sub Total: '
                    defaultValue='0'
                  />
                )}
              />
            </GridItem>
          )}
          {showGST && <GridItem md={9} />}
          {showGST && (
            <GridItem md={3}>
              <FastField
                name='gstAmount'
                render={args => {
                  return (
                    <NumberInput
                      {...args}
                      noUnderline
                      currency
                      text
                      style={{ float: 'right' }}
                      rightAlign
                      defaultValue={0}
                      prefix={
                        invoiceDetail.isGSTInclusive
                          ? `${invoiceDetail.gstValue}% GST Inclusive:`
                          : `GST (${invoiceDetail.gstValue}%):`
                      }
                    />
                  )
                }}
              />
            </GridItem>
          )}

          <GridItem md={9} />
          <GridItem md={3}>
            <FastField
              name='finalCredit'
              render={args => (
                <NumberInput
                  {...args}
                  style={{ float: 'right' }}
                  noUnderline
                  currency
                  text
                  rightAlign
                  prefix='Final Credit: '
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
