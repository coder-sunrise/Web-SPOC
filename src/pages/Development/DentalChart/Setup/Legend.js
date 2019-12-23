import React, { memo, useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'
import { SketchPicker } from 'react-color'
import ColorLens from '@material-ui/icons/ColorLens'
import { Attachment } from '@/components/_medisys'

import {
  GridContainer,
  GridItem,
  Select,
  Popper,
  Button,
  Switch,
} from '@/components'

const symbols = [
  { name: '$', value: '$' },
  { name: '%', value: '%' },
]

const Legend = ({ row, columnConfig, cellProps }) => {
  const { value, control, validSchema, text, ...restProps } = columnConfig
  const { method } = row
  if (
    [
      'na',
      'bridging',
    ].includes(method)
  )
    return null
  const { onBlur, onFocus, autoFocus, ...props } = cellProps
  // console.log(restProps)
  const [
    color,
    setColor,
  ] = useState(row.fill)
  const [
    symbol,
    setSymbol,
  ] = useState()
  const [
    mode,
    setMode,
  ] = useState('color')
  const [
    blur,
    setBlur,
  ] = useState(false)
  const debounceBlur = _.debounce(setBlur, 100, {
    leading: false,
    trailing: true,
  })
  useEffect(
    () => {
      if (blur) {
        if (onBlur) onBlur()
      }
    },
    [
      blur,
    ],
  )

  return (
    <GridContainer>
      {method === 'tooth' && (
        <GridItem xs={6}>
          <Switch
            value={mode}
            onOffMode={false}
            checkedChildren='Image'
            checkedValue='image'
            unCheckedChildren='Color & Symbol'
            unCheckedValue='color'
            onChange={(v) => {
              setMode(v)
            }}
          />
        </GridItem>
      )}
      {mode === 'color' && (
        <GridItem xs={3}>
          <Popper
            trigger='click'
            overlay={
              <SketchPicker
                color={color}
                onChangeComplete={(e) => {
                  row.fill = e.hex
                  setColor(e.hex)
                  // console.log(e)
                }}
              />
            }
          >
            <Button
              justIcon
              style={{
                backgroundColor: color || 'transparent',
                minWidth: 60,
                color: 'black',
              }}
            >
              {symbol} &nbsp;
            </Button>
          </Popper>
        </GridItem>
      )}
      {mode === 'color' &&
      method === 'tooth' && (
        <GridItem xs={3}>
          <Select
            options={symbols}
            value={symbol}
            {...restProps}
            onChange={(v) => {
              setSymbol(v)
              const { commitChanges } = control
              // row.apptDurationMinute = e
              // setEndTime(row)
              // validSchema(row)
              commitChanges({
                changed: {
                  [row.id]: {
                    symbol: v,
                  },
                },
              })
            }}
            // onBlur={() => {
            //   debounceBlur(true)
            // }}
            // onFocus={() => {
            //   debounceBlur(false)
            // }}
          />
        </GridItem>
      )}
      {mode === 'image' && (
        <GridItem xs={3}>
          <Attachment
            attachmentType='ClinicalNotes'
            filterTypes={[
              'ClinicalNotes',
              'VisitReferral',
              'Visit',
            ]}
            handleUpdateAttachments={(e) => {
              console.log(e)
            }}
            // attachments={ar  gs.field.value}
          />
        </GridItem>
      )}
    </GridContainer>
  )
}
export default memo(Legend)
