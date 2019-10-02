import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { FormattedMessage } from 'umi/locale'
import { compose } from 'redux'
import {
  GridContainer,
  GridItem,
  TextField,
  FastField,
  Button,
  CommonTableGrid,
  ProgressButton,
} from '@/components'

const Sdd = ({ dispatch, handleSelectSdd, ...props }) => {
  useEffect(() => {
    dispatch({
      type: 'sddDetail/query',
      payload: {
        keepFilter: false,
      },
    })
  }, [])

  const selectRow = (row, e) => {
    handleSelectSdd(row)
  }

  const tableParas = {
    type: 'sddDetail',
    columns: [
      { name: 'code', title: 'SDD ID' },
      { name: 'name', title: 'SDD Description' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      {
        columnName: 'code',
        wordWrapEnabled: true,
        sortingEnabled: false,
        width: 180,
      },
      {
        columnName: 'name',
        wordWrapEnabled: true,
        sortingEnabled: false,
      },
      {
        columnName: 'action',
        sortingEnabled: false,
        align: 'center',
        width: 100,
        render: (row) => {
          return (
            <Button
              link
              justIcon
              onClick={() => {
                selectRow(row)
              }}
              color='primary'
            >
              Select
            </Button>
          )
        },
      },
    ],
  }

  return (
    <GridContainer>
      <GridItem xs={5}>
        <FastField
          name='sddIdName'
          render={(args) => {
            return <TextField label='SDD ID/Description' {...args} />
          }}
        />
      </GridItem>
      <GridItem xs={3} style={{ marginTop: 10, marginBottom: 10 }}>
        {/* <Button
          variant='contained'
          color='primary'
          // onClick={() => {
          //   dispatch({
          //     type: 'vaccination/query',
          //   })
          // }}
        >
          Search
        </Button> */}

        <ProgressButton
          color='primary'
          icon={null}
          onClick={() => {
            console.log('search', props.values)

            const { sddIdName } = props.values

            dispatch({
              type: 'sddDetail/query',
              payload: {
                keepFilter: false,
                group: [
                  {
                    code: sddIdName,
                    displayValue: sddIdName,
                    combineCondition: 'or',
                  },
                ],
              },
            })
          }}
        >
          <FormattedMessage id='form.search' />
        </ProgressButton>
      </GridItem>

      <CommonTableGrid
        // onRowDoubleClick={(row) => showDetail(row)}
        // columnExtensions={colExtensions}
        // ActionProps={ActionProps}
        FuncProps={{ pager: true }}
        {...tableParas}
      />
    </GridContainer>
  )
}

export default compose(
  connect(({ sddDetail }) => ({
    sddDetail,
  })),
)(Sdd)
