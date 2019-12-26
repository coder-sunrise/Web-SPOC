import React, { useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import { FastField } from 'formik'
import { compose } from 'redux'

import {
  CodeSelect,
  CardContainer,
  TextField,
  GridContainer,
  GridItem,
  DatePicker,
  Switch,
  DateRangePicker,
  dateFormatLong,
} from '@/components'

const styles = () => ({})

const Detail = ({ orderSetDetail, dispatch, values, theme }) => {
  useEffect(() => {
    if (orderSetDetail.currentId) {
      dispatch({
        type: 'orderSetDetail/query',
        payload: {
          id: orderSetDetail.currentId,
        },
      }) // .then((v) => console.log('v', v))
    }
  }, [])
  return (
    <CardContainer
      hideHeader
      style={{
        margin: theme.spacing(1),
        minHeight: 700,
        maxHeight: 700,
      }}
    >
      <GridContainer gutter={0}>
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name='code'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.orderset.code',
                      })}
                      disabled={!values.isActive}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='displayValue'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.orderset.name',
                      })}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='description'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.orderset.description',
                      })}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='remarks'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.orderset.remarks',
                      })}
                      multiline
                      rowsMax='5'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            {/* <GridItem xs={12}>
              <FastField
                name='isOrderable'
                render={(args) => {
                  return (
                    <Switch
                      label={formatMessage({
                        id: 'inventory.master.package.orderable',
                      })}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem> */}
          </GridContainer>
        </GridItem>
        <GridItem xs={12} md={2} />
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name='effectiveDates'
                render={(args) => (
                  <DateRangePicker
                    format={dateFormatLong}
                    label='Effective Start Date'
                    label2='End Date'
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
      {/* <Divider style={{ margin: '40px 0 20px 0' }} /> */}
    </CardContainer>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
  connect(({ orderSetDetail }) => ({
    orderSetDetail,
  })),
)(Detail)
