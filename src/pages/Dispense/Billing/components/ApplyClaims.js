import React, { useEffect, useState } from 'react'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Add from '@material-ui/icons/AddCircle'
import Reset from '@material-ui/icons/Cached'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  Select,
  Field,
  FastField,
  NumberInput,
  TextField,
} from '@/components'
// sub components
import TableData from '../../DispenseDetails/TableData'
import {
  ItemData,
  ItemTableColumn,
  ItemTableColumnExtensions,
} from '../variables'

const styles = (theme) => ({
  gridRow: {
    margin: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,

    '& > h5': {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
    },
  },
})

const ApplyClaims = ({
  classes,
  values,
  setFieldValue,
  handleAddCopayerClick,
}) => {
  const { invoicePayers, invoice, claimableSchemes } = values
  const [
    tempInvoicePayer,
    setTempInvoicePayer,
  ] = useState([])

  useEffect(
    () => {
      // if(invoicePayers){
      // }
    },
    [
      invoicePayers,
    ],
  )

  const onClaimAmountChange = ({ target }) => {
    const { name, value } = target
    const _id = name.split('-')[1]
    const lookupItem = invoice.invoiceItems.find(
      (item) => item.id === parseInt(_id, 10),
    )
    // setFieldValue(`invoice.invoiceItems[${name}]`, lookupItem)
  }
  const invoiceItemColExtensions = (index) => [
    { columnName: 'totalAftGst', type: 'currency', currency: true },
    {
      columnName: 'claimAmount',
      render: (row) => (
        <FastField
          name={`${index}-${row.id}`}
          render={(args) => (
            <NumberInput {...args} currency onChange={onClaimAmountChange} />
          )}
        />
      ),
    },
  ]

  const onSchemeChange = (index) => (value) => {
    const flattenSchemes = claimableSchemes.reduce(
      (schemes, cs) => [
        ...schemes,
        ...cs.map((item) => ({ ...item })),
      ],
      [],
    )
    const {
      coverageMaxCap = 0,
      overAllCoPaymentValue = 0,
    } = flattenSchemes.find((item) => item.id === value)

    setFieldValue(`${index}-claimableSchemesMaxCap`, coverageMaxCap)
    setFieldValue(`${index}-balance`, overAllCoPaymentValue)
    // setFieldValue(`invoicePayer[${index}]`, {
    //   payerTypeFK
    // })
  }

  // const getInvoiceItems = (index) => {
  //   const _selectedScheme = values[`${index}-claimableSchemes`]
  //   if (!_selectedScheme) return []

  //   const _scheme = claimableSchemes[index].find(
  //     (item) => item.id === _selectedScheme,
  //   )
  //   if(_scheme){
  //     const _invoiceItems = values.invoice.invoiceItems.filter(item => _scheme.)
  //   }
  //   return []
  // }

  return (
    <React.Fragment>
      <GridItem md={2}>
        <h5>Apply Claims</h5>
      </GridItem>
      <GridItem md={10} container justify='flex-end'>
        <Button color='primary' size='sm' onClick={handleAddCopayerClick}>
          <Add />
          Co-Payer
        </Button>
        <Button color='primary' size='sm' disabled>
          <Reset />
          Reset
        </Button>
      </GridItem>
      <GridItem md={12}>
        {claimableSchemes.map((schemes, index) => {
          return (
            <Paper className={classes.gridRow}>
              <GridContainer style={{ marginBottom: 16 }}>
                <GridItem md={2}>
                  <Field
                    name={`${index}-claimableSchemes`}
                    render={(args) => (
                      <Select
                        simple
                        {...args}
                        valueField='id'
                        onChange={onSchemeChange(index)}
                        options={[
                          ...schemes.map((item) => ({
                            id: item.id,
                            name: item.coPaymentSchemeName,
                          })),
                        ]}
                      />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <Field
                    name={`${index}-balance`}
                    render={(args) => (
                      <NumberInput {...args} currency text prefix='Balance:' />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <Field
                    name={`${index}-claimableSchemesMaxCap`}
                    render={(args) => (
                      <NumberInput {...args} currency text prefix='Max Cap.:' />
                    )}
                  />
                </GridItem>
                <GridItem md={12}>
                  <TableData
                    height={150}
                    columns={ItemTableColumn}
                    colExtensions={invoiceItemColExtensions(index)}
                    data={values.invoice.invoiceItems}
                  />
                </GridItem>
              </GridContainer>
            </Paper>
          )
        })}
      </GridItem>
      <GridItem md={12}>
        <Paper className={classes.gridRow}>
          {invoicePayers.map((payer, index) => {
            return (
              <TableData
                height={150}
                columns={ItemTableColumn}
                colExtensions={invoiceItemColExtensions}
                data={payer.invoicePayerItems}
                title={payer.name}
              />
            )
          })}
          {/* <TableData
            height={200}
            columns={ItemTableColumn}
            colExtensions={ItemTableColumnExtensions}
            data={ItemData}
            title='Corporate A'
          />
          <TableData
            height={200}
            columns={ItemTableColumn}
            colExtensions={ItemTableColumnExtensions}
            data={ItemData}
            title='Corporate B'
          /> */}
        </Paper>
      </GridItem>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'ApplyClaims' })(ApplyClaims)
