import React, { Component } from 'react'
import { Search } from '@material-ui/icons'
import { FastField } from 'formik'
import { Paper } from '@material-ui/core'
import axios from 'axios'

import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  Select,
  RadioGroup,
} from '@/components'

import { countries, addressTypes } from '@/utils/codes'

const API = 'https://developers.onemap.sg/commonapi/search?returnGeom=Y&getAddrDetails=Y&searchVal='

class Address extends Component {
  handleAddressType = (e) => {
    console.log(e, 'address-handleAddressType')
  }

  render () {
    const { address, defaultValue, formikProps: { values, setFieldValue }, classes } = this.props

    const handleGetAddress = () => {
      const { postalCode } = values[address]
      if (postalCode === '') return

      axios.get(`${API}${postalCode}`)
        .then(result => {
          if (result.data.found > 0) {
            const { BLK_NO, BUILDING, ROAD_NAME, POSTAL } = result.data.results[0]

            setFieldValue(`${address}.postalCode`, POSTAL)
            setFieldValue(`${address}.blockNo`, BLK_NO)
            setFieldValue(`${address}.building`, BUILDING)
            setFieldValue(`${address}.street`, ROAD_NAME)
          }
        })
        .catch(error => console.log(error))
    }


    return (
      <Paper>
        <GridContainer>
          <GridItem xs={12} md={5}>
            <FastField
              name={`${address}.addressType`}
              render={(args) => (
                <RadioGroup
                  label=' '
                  simple
                  defaultValue={defaultValue}
                  options={addressTypes}
                  onChange={this.handleAddressType}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name={`${address}.postalCode`}
              render={args => <TextField label='Postal Code' {...args} />}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <Button
              key='search'
              color='info'
              size='sm'
              onClick={() => handleGetAddress()}
              className={classes.btnContainer}
              style={{ marginTop: 20 }}
            >
              <Search />Get Address
            </Button>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} md={3}>
            <FastField
              name={`${address}.blockNo`}
              render={args => <TextField label='Block No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name={`${address}.unitNo`}
              render={args => <TextField label='Unit No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={6}>
            <FastField
              name={`${address}.building`}
              render={args => <TextField label='Building Name' {...args} />}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} md={8}>
            <FastField
              name={`${address}.street`}
              render={args => <TextField multiline rowsMax='2' label='Street' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={4}>
            <FastField
              name={`${address}.country`}
              render={args => <Select label='Country' options={countries} {...args} />}
            />
          </GridItem>
        </GridContainer>
      </Paper>
    )
  }
}

export default Address