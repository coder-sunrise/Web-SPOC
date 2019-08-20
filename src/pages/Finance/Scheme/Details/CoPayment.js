import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi/locale'
import { Divider } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'
import { compose } from 'redux'
import { GridContainer, GridItem, ButtonGroup, NumberInput } from '@/components'
import Radio from '@material-ui/core/Radio'

const styles = () => ({
  buttonGroupDiv: {
    margin: 'auto',
    textAlign: 'right',
  },
  radioDiv: {
    marginTop: '25px',
  },
})

const options = [
  {
    label: '$',
    value: '$',
  },
  {
    label: '%',
    value: '%',
  },
]

const CoPayment = ({ classes }) => {
  const [
    radioSelectedValue,
    setRadioSelectedValue,
  ] = useState('all')
  const [
    allDisabled,
    setAllDisabled,
  ] = useState(false)

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
      <GridItem md={8}>
        <Field
          name='allItem'
          render={(args) => (
            <NumberInput
              disabled={allDisabled}
              label={formatMessage({
                id: 'finance.scheme.setting.allItems',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={3} className={classes.buttonGroupDiv}>
        <ButtonGroup options={options} disabled={allDisabled} />
      </GridItem>
      <GridItem md={12} style={{ marginBottom: '20px' }} />
      <GridItem md={1} />
      <GridItem md={8}>
        <Field
          name='consumables'
          render={(args) => (
            <NumberInput
              disabled={!allDisabled}
              label={formatMessage({
                id: 'finance.scheme.setting.consumables',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={3} className={classes.buttonGroupDiv}>
        <ButtonGroup options={options} disabled={!allDisabled} />
      </GridItem>
      <GridItem md={1} />
      <GridItem md={8}>
        <Field
          name='medications'
          render={(args) => (
            <NumberInput
              label={formatMessage({
                id: 'finance.scheme.setting.medications',
              })}
              disabled={!allDisabled}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={3} className={classes.buttonGroupDiv}>
        <ButtonGroup options={options} disabled={!allDisabled} />
      </GridItem>
      <GridItem md={1} className={classes.radioDiv}>
        <Radio
          checked={radioSelectedValue === 'sub'}
          onChange={handleChange}
          value='sub'
          name='sub'
        />
      </GridItem>
      <GridItem md={8}>
        <Field
          name='vaccines'
          render={(args) => (
            <NumberInput
              disabled={!allDisabled}
              label={formatMessage({
                id: 'finance.scheme.setting.vaccines',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={3} className={classes.buttonGroupDiv}>
        <ButtonGroup options={options} disabled={!allDisabled} />
      </GridItem>
      <GridItem md={1} />
      <GridItem md={8}>
        <Field
          name='services'
          render={(args) => (
            <NumberInput
              disabled={!allDisabled}
              label={formatMessage({
                id: 'finance.scheme.setting.services',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={3} className={classes.buttonGroupDiv}>
        <ButtonGroup options={options} disabled={!allDisabled} />
      </GridItem>
      <GridItem md={1} />
      <GridItem md={8}>
        <Field
          name='packages'
          render={(args) => (
            <NumberInput
              disabled={!allDisabled}
              label={formatMessage({
                id: 'finance.scheme.setting.packages',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={3} className={classes.buttonGroupDiv}>
        <ButtonGroup options={options} disabled={!allDisabled} />
      </GridItem>
    </GridContainer>
  )
}
export default compose(withStyles(styles, { withTheme: true }), React.memo)(
  CoPayment,
)
