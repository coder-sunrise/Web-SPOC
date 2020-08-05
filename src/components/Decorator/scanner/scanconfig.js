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
} from '@/components'

export const Scanconfig = ({ handleScaning }) => {
  return (
    <React.Fragment>
      <Button onClick={handleScaning} color='primary'>
        <ImageSearch /> Scan
      </Button>
    </React.Fragment>
  )
}
