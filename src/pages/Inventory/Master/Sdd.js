import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardText,
  CardBody,
  GridContainer,
  GridItem,
  Select,
  TextField,
  Transfer,
  CodeSelect,
  FastField,
  Button,
  CommonTableGrid,
} from '@/components'

const Sdd = ({ dispatch, ...props }) => {
  console.log('prospss', props)
  useEffect(() => {
    console.log('afterefffect')

    dispatch({
      type: 'medicationDetail/querySdd',
    })
  }, [])

  return (
    <GridContainer>
      <GridItem>
        <FastField
          name='sddId'
          render={(args) => {
            return <TextField label='SDD ID/Description' {...args} />
          }}
        />
      </GridItem>
      <GridItem>
        <Button
          variant='contained'
          color='primary'
          // onClick={() => {
          //   dispatch({
          //     type: 'vaccination/query',
          //   })
          // }}
        >
          Search
        </Button>
      </GridItem>

      <CommonTableGrid
      // rows={list}
      // onRowDoubleClick={(row) => showDetail(row)}
      // columnExtensions={colExtensions}
      // ActionProps={ActionProps}
      // FuncProps={{ pager: true }}
      // {...tableParas}
      />
    </GridContainer>
  )
}

export default Sdd
