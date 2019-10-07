import React, { PureComponent } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { status } from '@/utils/codes'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  ProgressButton,
  Select,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ settingMedicationConsumptionMethod }) =>
    settingMedicationConsumptionMethod.filter || {},
  handleSubmit: () => {},
  displayName: 'MedicationConsumptionMethodFilter',
})
class Filter extends PureComponent {
  render () {
    //console.log({ props: this.props.values })
    const { classes } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='codeDisplayValue'
              render={(args) => {
                return <TextField label='Code / Display Value' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='isActive'
              render={(args) => {
                return <Select label='Status' options={status} {...args} />
              }}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={6} md={3}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  const { codeDisplayValue, isActive } = this.props.values
                  this.props.dispatch({
                    type: 'settingMedicationConsumptionMethod/query',
                    payload: {
                      isActive,
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
                  const { codeDiplayValue } = this.props.values

                  this.props.dispatch({
                    type: 'settingMedicationConsumptionMethod/updateState',
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
