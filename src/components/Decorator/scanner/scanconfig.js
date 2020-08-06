import React, { Component } from 'react'
import { ImageSearch } from '@material-ui/icons'

import {
  GridContainer,
  GridItem,
  CardContainer,
  Accordion,
  withFormikExtend,
  IconButton,
  Button,
  Tooltip,
  Tabs,
  Popconfirm,
  Select,
  CheckboxGroup,
} from '@/components'

export const Scanconfig = ({ handleScaning }) => {
  return (
    <React.Fragment>
      <GridItem xs={12}>
        <CheckboxGroup
          // label='Filter by Doctor'
          vertical
          // simple
          // value={}
          // value={{ tan1: true }}
          textField='name'
          options={[
            { value: 'AutoFeeder', name: 'Auto Feeder' },
            { value: 'Duplex', name: 'Duplex' },
          ]}
          // noUnderline
          onChange={(e) => {
            console.log(e)
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <CheckboxGroup
          label='Pixel Type'
          vertical
          // simple
          // value={}
          // value={{ tan1: true }}
          textField='name'
          options={[
            { value: 'BW', name: 'B&W' },
            { value: 'Gray', name: 'Gray' },
            { value: 'Color', name: 'Color' },
          ]}
          // noUnderline
          onChange={(e) => {
            console.log(e)
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <Select
          label='Resolution'
          options={[
            { id: '100', name: '100' },
            { id: '150', name: '150' },
            { id: '200', name: '200' },
            { id: '300', name: '300' },
          ]}
        />
      </GridItem>
      <GridItem xs={12} style={{ textAlign: 'center' }}>
        <Button onClick={handleScaning} color='primary'>
          <ImageSearch /> Scan
        </Button>
      </GridItem>
    </React.Fragment>
  )
}
