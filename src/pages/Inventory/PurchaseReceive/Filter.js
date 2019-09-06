import React, { PureComponent } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Tooltip } from '@material-ui/core'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  Select,
  CodeSelect,
  ProgressButton,
  DatePicker,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ purchasingReceiving }) =>
    purchasingReceiving.default.filter || {},
  handleSubmit: () => {},
  displayName: 'PurchasingReceivingFilter',
})
class Filter extends PureComponent {
  render () {
    console.log('filter', this.props)

    const { classes, navigatePdoDetails } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='poNo'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'inventory.pr.pono',
                    })}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='transactionDateFrom'
              render={(args) => (
                <DatePicker
                  label={formatMessage({
                    id: 'inventory.pr.filter.datefrom',
                  })}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='transactionDateTo'
              render={(args) => (
                <DatePicker
                  label={formatMessage({
                    id: 'inventory.pr.filter.dateto',
                  })}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={6} md={3}>
            <FastField
              name='allDate'
              render={(args) => {
                return (
                  <Tooltip
                    title={formatMessage({
                      id: 'form.date.placeholder.allDate',
                    })}
                    placement='bottom'
                  >
                    <Checkbox
                      label={formatMessage({
                        id: 'form.date.placeholder.allDate',
                      })}
                      inputLabel=' '
                      {...args}
                    />
                  </Tooltip>
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='invoiceStatus'
              render={(args) => {
                return (
                  <Select
                    label={formatMessage({
                      id: 'inventory.pr.invoiceStatus',
                    })}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='supplier'
              render={(args) => {
                return (
                  <CodeSelect
                    label={formatMessage({
                      id: 'inventory.pr.supplier',
                    })}
                    code='ctCompany'
                    //max={10}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='poStatus'
              render={(args) => {
                return (
                  <Select
                    label={formatMessage({
                      id: 'inventory.pr.poStatus',
                    })}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  const { poNo, supplier, status } = this.props.values

                  this.props.dispatch({
                    type: 'purchasingReceiving/query',
                    payload: {
                      group: [
                        {
                          poNo: poNo,
                          supplier: supplier,
                          status: status,
                          combineCondition: 'or',
                        },
                      ],
                    },
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                id='pdodetails'
                onClick={navigatePdoDetails}
                color='primary'
              >
                Add New
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Filter
