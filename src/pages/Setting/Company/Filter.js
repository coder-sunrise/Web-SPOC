import React, { PureComponent } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
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
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ settingCompany }) => settingCompany.filter || {},
  handleSubmit: () => {},
  displayName: 'CompanyFilter',
})
class Filter extends PureComponent {
  render () {
    const { classes, settingCompany, route } = this.props
    const { name } = route

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='code'
              render={(args) => {
                return (
                  <TextField
                    label={
                      name === 'copayer' ? 'Co-Payer Code' : 'Supplier Code'
                    }
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='displayValue'
              render={(args) => {
                return (
                  <TextField
                    label={
                      name === 'copayer' ? 'Co-Payer Name' : 'Supplier Name'
                    }
                    {...args}
                  />
                )
              }}
            />
          </GridItem>

          <GridItem xs={6} md={3}>
            {name === 'copayer' ? (
              <FastField
                name='eql_coPayerTypeFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      label='Co-Payer Type'
                      code='ctCopayerType'
                      {...args}
                    />
                  )
                }}
              />
            ) : (
              []
            )}
          </GridItem>

          <GridItem xs={6} md={3}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingCompany/query',
                    payload: this.props.values,
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingCompany/updateState',
                    payload: {
                      entity: undefined,
                    },
                  })
                  this.props.toggleModal()
                }}
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
