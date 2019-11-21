import React from 'react'
// umi locale
import { FormattedMessage } from 'umi/locale'
import { Search, Add } from '@material-ui/icons'
// formik
import { FastField } from 'formik'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  ProgressButton,
  Select,
  TextField,
  withFormikExtend,
} from '@/components'
// utils
import { status } from '@/utils/codes'

const Filter = ({ classes, dispatch, values, toggleModal }) => {
  const handleAddNew = () => {
    dispatch({
      type: 'settingAppointmentType/updateState',
      payload: {
        entity: undefined,
      },
    })
    toggleModal()
  }

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
        <GridItem md={6} />
        <GridItem>
          <ProgressButton
            color='primary'
            icon={<Search />}
            onClick={() => {
              const { codeDisplayValue, isActive } = values
              dispatch({
                type: 'settingAppointmentType/query',
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
          <Button color='primary' onClick={handleAddNew}>
            <Add />
            Add New
          </Button>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withFormikExtend({
  mapPropsToValues: () => ({}),
})(Filter)
