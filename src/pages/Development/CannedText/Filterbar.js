import React from 'react'
// formik
import { FastField, withFormik } from 'formik'
// common components
import { Button, GridContainer, GridItem, TextField } from '@/components'

const Filterbar = ({ handleSubmit }) => {
  return (
    <GridContainer alignItems='center'>
      <GridItem md={4}>
        <FastField
          name='search'
          render={(args) => <TextField {...args} label='Title, Canned Text' />}
        />
      </GridItem>
      <GridItem md={4}>
        <Button color='primary' size='sm' onClick={handleSubmit}>
          Search
        </Button>
      </GridItem>
    </GridContainer>
  )
}

export default withFormik({
  handleSubmit: (values, { props }) => {
    const { onSearchClick } = props
    onSearchClick(values)
  },
})(Filterbar)
