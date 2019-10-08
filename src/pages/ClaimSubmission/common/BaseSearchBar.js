import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Search from '@material-ui/icons/Search'
// common components
import {
  Button,
  DatePicker,
  GridContainer,
  GridItem,
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
                name='invoiceDate'
                render={(args) => <DatePicker {...args} label='Invoice Date' />}
              />
            )}
          </GridItem>
          <GridItem md={6} className={classes.searchButton}>
            <ProgressButton
              color='primary'
              text='Search'
              icon={null}
              onClick={() => {
                const { patientName, patientAccountNo, invoiceNo } = values
                dispatch({
                  type: `${modelsName}/query`,
                  payload: {
                    group: [
                      {
                        patientName,
                        patientAccountNo,
                        invoiceNo,
                        combineCondition: 'or',
                      },
                    ],
                  },
                })
              }}
              // onClick={() => {
              //   const {
              //     codeDisplayValue,
              //     isActive,
              //     serviceCenterFK,
              //   } = this.props.values
              //   this.props.dispatch({
              //     type: 'settingClinicService/query',
              //     payload: {
              //       //[`${prefix}name`]: this.props.values.search
              //       isActive,
              //       group: [
              //         {
              //           code: codeDisplayValue,
              //           displayValue: codeDisplayValue,
              //           serviceCenterFK: serviceCenterFK,
              //           combineCondition: 'or',
              //         },
              //       ],
              //     },
              //   })
              // }}
            />
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
