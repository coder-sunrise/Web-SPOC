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
    const { classes, route } = this.props
    const { name } = route

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='codeDisplayValue'
              render={(args) => {
                return (
                  <TextField
                    label={
                      name === 'copayer' ? (
                        'Co-Payer Code/Name'
                      ) : (
                        'Supplier Code/Name'
                      )
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
                name='coPayerTypeFK'
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
                  const { codeDisplayValue, coPayerTypeFK } = this.props.values
                  this.props.dispatch({
                    type: 'settingCompany/query',
                    payload: {
                      coPayerTypeFK,
                      group: [
                        {
                          code: codeDisplayValue,
                          displayValue: codeDisplayValue,
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
