import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  DatePicker,
  GridContainer,
  GridItem,
  NumberInput,
  OutlinedTextField,
  Switch,
} from '@/components'
import styles from './styles'

const CrNoteForm = ({ classes }) => {
  return (
    <GridContainer className={classes.form}>
      <GridItem md={6}>
        <GridContainer>
          <GridItem md={12}>
            <FastField
              name='generatedDate'
              render={(args) => <DatePicker {...args} label='Date' />}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='invoiceTotal'
              render={(args) => (
                <NumberInput
                  {...args}
                  currency
                  label='Invoice Amount'
                  disabled
                />
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='isStockIn'
              render={(args) => {
                return <Switch prefix='Update Inventory' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem md={6}>
        <GridItem md={12}>
          <FastField
            name='remark'
            render={(args) => (
              <OutlinedTextField
                {...args}
                label='Remarks'
                multiline
                rowsMax={3}
                rows={3}
                maxLength={2000}
              />
            )}
          />
        </GridItem>
      </GridItem>
    </GridContainer>
  )
}

export default withStyles(styles, { name: 'CrNoteForm' })(CrNoteForm)
