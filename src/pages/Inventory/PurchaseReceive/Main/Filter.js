import React, { PureComponent } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { status } from '@/utils/codes'
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
  ProgressButton,
  CodeSelect,
  DatePicker,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ purchasingReceiving }) =>
    purchasingReceiving.filter || {},
  handleSubmit: () => {},
  displayName: 'PurchasingReceivingFilter',
})
class Filter extends PureComponent {
  render () {
    const { classes, navigatePdoDetails } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='poNo'
              render={(args) => {
                return <TextField label='Purchase Order #' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='transactionDateFrom'
              render={(args) => (
                <DatePicker label='Transaction Date From' {...args} />
              )}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='transactionDateTo'
              render={(args) => (
                <DatePicker label='Transaction Date To' {...args} />
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
                      simple
                      {...args}
                    />
                  </Tooltip>
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='supplier'
              render={(args) => {
                return <Select label='Supplier' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='status'
              render={(args) => {
                return <Select label='Status' options={status} {...args} />
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
