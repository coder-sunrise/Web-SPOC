import React, { useEffect, useState } from 'react'
import {
  GridContainer,
  GridItem,
  FastField,
  Switch,
  TextField,
  NumberInput,
} from '@/components'

const BooleanProvider = (props) => {
  const { index, item, classes } = props
  const fieldName = `reportSettingParameter[${index}].settingValue`

  return (
    <GridContainer className={classes.verticalSpacing}>
      <GridItem md={2}>
        <h4>
          <b>{item.displayValue}</b>
        </h4>
      </GridItem>
      <GridItem md={3}>
        <FastField
          name={fieldName}
          render={(args) => {
            const parameters = args.form.values.reportSettingParameter
            if (parameters && parameters[index]) {
              const setting = parameters[index]

              if (typeof setting.settingValue !== 'boolean')
                args.form.setFieldValue(
                  fieldName,
                  setting.settingValue.toString().toUpperCase() === 'TRUE',
                )
            }
            return <Switch style={{ marginTop: 0 }} {...args} />
          }}
        />
      </GridItem>
    </GridContainer>
  )
}
const StringProvider = (props) => {
  const { index, item } = props
  const fieldName = `reportSettingParameter[${index}].settingValue`

  return (
    <GridContainer>
      <GridItem md={3}>
        <FastField
          name={fieldName}
          render={(args) => {
            return (
              <TextField label={item.displayValue} {...args} maxLength={255} />
            )
          }}
        />
      </GridItem>
    </GridContainer>
  )
}
const NumberProvider = (props) => {
  const { index, item, classes } = props
  const fieldName = `reportSettingParameter[${index}].settingValue`

  return (
    <GridContainer>
      <GridItem md={3}>
        <FastField
          name={fieldName}
          render={(args) => {
            return <NumberInput label={item.displayValue} {...args} />
          }}
        />
      </GridItem>
    </GridContainer>
  )
}

const dataTypeProvider = [
  {
    type: 'boolean',
    render: (props) => {
      return <BooleanProvider {...props} />
    },
  },
  {
    type: 'string',
    render: (props) => {
      return <StringProvider {...props} />
    },
  },
  {
    type: 'number',
    render: (props) => {
      return <NumberProvider {...props} />
    },
  },
]

const SettingParameter = (props) => {
  const { values } = props
  const { reportSettingParameter = [] } = values
  return reportSettingParameter.map((item, index) => {
    const { dataType } = item
    const provider = dataTypeProvider.find(
      (f) => f.type === dataType.toLowerCase(),
    )
    if (provider && provider.render) {
      return provider.render({ ...props, item, index })
    }
    return <StringProvider {...props} item={item} index={index} />
  })
}

export default SettingParameter
