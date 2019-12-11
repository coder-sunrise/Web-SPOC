import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import { formatMessage,FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'

// common components
import {
  DatePicker,
  GridContainer,
  GridItem,
  DateRangePicker,
  TextField,
  ProgressButton,
} from '@/components'

const styles = (theme) => ({
  searchButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
})

const BaseSearchBar = ({
  classes,
  children,
  hideInvoiceDate,
  modelsName,
  dispatch,
  values,
}) => {
  return (
    <React.Fragment>
      <GridContainer>
        <GridItem container md={8}>
          <GridItem md={6}>
            <FastField
              name='patientName'
              render={(args) => <TextField {...args} label='Patient Name' />}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='patientAccountNo'
              render={(args) => <TextField {...args} label='Ref. No/Acc. No' />}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='invoiceNo'
              render={(args) => <TextField {...args} label='Invoice No.' />}
            />
          </GridItem>
          <GridItem md={6}>
            {!hideInvoiceDate && (
              <FastField
                name='invoiceDates'
                render={(args) => {
                  return (
                    <DateRangePicker
                      label={formatMessage({
                        id:'claimsubmission.invoiceClaim.filter.invoicedatedfrom',
                      })}
                      label2={formatMessage({
                        id:'claimsubmission.invoiceClaim.filter.invoicedateto',
                      })}
                      {...args}
                    />)
                }
                  }
              />
            )}
          </GridItem>
          <GridItem md={6} className={classes.searchButton}>
            <ProgressButton
              color='primary'
              icon={<Search />}
              onClick={() => {
                const { patientName,
                  patientAccountNo,
                  invoiceNo,
                  invoiceDates,
                  chasClaimStatusCode } = values

                const fromToDates = (index) => {
                  if (invoiceDates)
                    return invoiceDates[index]
                  return undefined
                }

                dispatch({
                  type: `${modelsName}/query`,
                  payload: {
                    lgteql_invoiceDate: fromToDates(0),
                    lsteql_invoiceDate: fromToDates(1),
                    patientName,
                    patientAccountNo,
                    invoiceNo,
                    chasClaimStatusCode,
                  },
                })
              }}
            >
              <FormattedMessage id='form.search' />
            </ProgressButton>
          </GridItem>
        </GridItem>
        <GridItem container md={4}>
          {children}
        </GridItem>
      </GridContainer>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'BaseSearchBar' })(
  React.memo(BaseSearchBar),
)
