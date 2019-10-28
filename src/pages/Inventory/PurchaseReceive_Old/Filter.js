import React, { PureComponent } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import {
  withFormikExtend,
  Field,
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
  Tooltip,
  DateRangePicker,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ purchasingReceiving }) =>
    purchasingReceiving.default.filter || {},
  handleSubmit: () => {},
  displayName: 'PurchasingReceivingFilter',
})
class Filter extends PureComponent {
  state = {
    isAllDateChecked: false,
  }

  componentDidUpdate () {
    const { values } = this.props

    this.setState({
      isAllDateChecked: values.allDate || false,
    })
  }

  render () {
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
          <GridItem md={6}>
            <Field
              name='transactionDates'
              render={(args) => {
                return (
                  <DateRangePicker
                    disabled={this.state.isAllDateChecked}
                    label={formatMessage({
                      id: 'inventory.pr.filter.datefrom',
                    })}
                    label2={formatMessage({
                      id: 'inventory.pr.filter.dateto',
                    })}
                    {...args}
                  />
                )
              }}
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
                    code='ctSupplier'
                    labelField='displayValue'
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
                          poNo,
                          supplier,
                          status,
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
