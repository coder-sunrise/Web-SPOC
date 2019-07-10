import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'
import { compose } from 'redux'
import Radio from '@material-ui/core/Radio'
import { GridContainer, GridItem, NumberInput } from '@/components'

const styles = () => ({
  radioDiv: {
    marginTop: '25px',
  },
})

const CoverageCap = ({ classes }) => {
  const [ radioSelectedValue, setRadioSelectedValue ] = useState('all')
  const [ allDisabled, setAllDisabled ] = useState(false)

  const handleChange = (event) => {
    setRadioSelectedValue(event.target.value)

    if (event.target.value === 'all') {
      setAllDisabled(false)
    } else {
      setAllDisabled(true)
    }
  }
  return (
    <GridContainer>
      <GridItem md={1} className={classes.radioDiv}>
        <Radio
          checked={radioSelectedValue === 'all'}
          onChange={handleChange}
          value='all'
          name='all'
        />
      </GridItem>
      <GridItem md={11}>
        <Field
          name='maximumCapAll'
          render={(args) => (
            <NumberInput
              disabled={allDisabled}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapAll',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={12} style={{ marginBottom: '20px' }} />
      <GridItem md={1} />
      <GridItem md={11}>
        <Field
          name='maximumCapConsumables'
          render={(args) => (
            <NumberInput
              disabled={!allDisabled}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapConsumables',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={1} />
      <GridItem md={11}>
        <Field
          name='maximumCapMedications'
          render={(args) => (
            <NumberInput
              disabled={!allDisabled}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapMedications',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={1} className={classes.radioDiv}>
        <Radio
          checked={radioSelectedValue === 'sub'}
          onChange={handleChange}
          value='sub'
          name='sub'
        />
      </GridItem>
      <GridItem md={11}>
        <Field
          name='maximumCapVaccines'
          render={(args) => (
            <NumberInput
              disabled={!allDisabled}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapVaccines',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={1} />
      <GridItem md={11}>
        <Field
          name='maximumCapServices'
          render={(args) => (
            <NumberInput
              disabled={!allDisabled}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapServices',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={1} />
      <GridItem md={11}>
        <Field
          name='maximumCapPackages'
          render={(args) => (
            <NumberInput
              disabled={!allDisabled}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapPackages',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
    </GridContainer>
  )
}
export default compose(withStyles(styles, { withTheme: true }), React.memo)(
  CoverageCap,
)
