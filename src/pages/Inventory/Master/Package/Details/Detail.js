import React, { useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import { FastField } from 'formik'
import { compose } from 'redux'

import {
  CodeSelect,
  NumberInput,
  CardContainer,
  TextField,
  GridContainer,
  GridItem,
  DateRangePicker,
  dateFormatLong,
} from '@/components'

const styles = () => ({})

const Detail = ({ packageDetail, dispatch, values, theme }) => {
  useEffect(() => {
    if (packageDetail.currentId) {
      dispatch({
        type: 'packageDetail/query',
        payload: {
          id: packageDetail.currentId,
        },
      })
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
        <GridItem xs={5} md={5}>
          <FastField
            name='code'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.master.package.code',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={2} md={2} />
        <GridItem xs={5} md={5}>
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
        <GridItem xs={5} md={5}>
          <FastField
            name='displayValue'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.master.package.name',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={2} md={2} />
        <GridItem xs={5} md={5}>
          <GridContainer gutter={0}>
            <GridItem xs={5} md={5}>
              <FastField
                name='validDuration'
                render={(args) => {
                  return (
                    <NumberInput
                      label={formatMessage({
                        id: 'inventory.master.package.validDuration',
                      })}
                      step={1}
                      min={0}
                      precision={0}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={1} md={1} />
            <GridItem xs={6} md={6}>
              <FastField
                name='durationUnitFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.master.package.durationUnit',
                      })}
                      code='ctDurationUnit'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem xs={5} md={5}>
          <FastField
            name='description'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.master.package.description',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={2} md={2} />
        <GridItem xs={5} md={5}>
          <FastField
            name='remarks'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.master.package.remarks',
                  })}
                  multiline
                  rowsMax='5'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
      </GridContainer>
      {/* <Divider style={{ margin: '40px 0 20px 0' }} /> */}
    </CardContainer>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
  connect(({ packageDetail }) => ({
    packageDetail,
  })),
)(Detail)
