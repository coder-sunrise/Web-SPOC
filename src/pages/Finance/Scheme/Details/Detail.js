import React from 'react'
import { formatMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core/styles'
import { FastField } from 'formik'
import { compose } from 'redux'

import {
  CodeSelect,
  CardContainer,
  TextField,
  GridContainer,
  GridItem,
  DateRangePicker,
} from '@/components'

const styles = () => ({})

const Detail = ({ height, ...props }) => {
  let { isUserMaintainable } = props.values
  isUserMaintainable = true
  return (
    <CardContainer
      hideHeader
      style={{
        height,
        overflow: 'auto',
      }}
    >
      <GridContainer gutter={0}>
        <GridItem xs={6} md={6} direction='column'>
          <GridItem xs={9}>
            <FastField
              name='code'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'finance.scheme.detail.code',
                    })}
                    disabled={!isUserMaintainable}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={9}>
            <FastField
              name='name'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'finance.scheme.detail.name',
                    })}
                    disabled={!isUserMaintainable}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={9}>
            <FastField
              name='description'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'finance.scheme.detail.description',
                    })}
                    disabled={!isUserMaintainable}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={9}>
            <FastField
              name='remarks'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'finance.scheme.detail.remarks',
                    })}
                    multiline
                    rowsMax='5'
                    disabled={!isUserMaintainable}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridItem>
        <GridItem xs={6} md={6} direction='column'>
          <GridItem xs={9}>
            <FastField
              name='schemeTypeFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label={formatMessage({
                      id: 'finance.scheme.detail.type',
                    })}
                    code='ctSchemeType'
                    disabled
                    {...args}
                  />
                )
              }}
            />
          </GridItem>

          <GridItem xs={9}>
            <FastField
              name='schemeCategoryFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label={formatMessage({
                      id: 'finance.scheme.detail.category',
                    })}
                    code='ctSchemeCategory'
                    disabled={!isUserMaintainable}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={9}>
            <FastField
              name='companyCoPaymentSchemeDto[0].coPaymentSchemeFk'
              render={(args) => (
                <CodeSelect
                  label='Co-Payer Type'
                  code='ctCopayerType'
                  disabled
                  {...args}
                />
              )}
            />
          </GridItem>

          <GridItem xs={9}>
            <FastField
              name='companyCoPaymentSchemeDto[0].companyFk'
              render={(args) => (
                <CodeSelect
                  label={formatMessage({
                    id: 'finance.scheme.detail.coPayer',
                  })}
                  code='ctCopayer'
                  max={50}
                  disabled={!isUserMaintainable}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs={9}>
            <FastField
              name='effectiveDates'
              render={(args) => {
                return (
                  <DateRangePicker
                    label='Effective Start Date'
                    label2='End Date'
                    disabled={!isUserMaintainable}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}
export default compose(withStyles(styles, { withTheme: true }), React.memo)(
  Detail,
)
