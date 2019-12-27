import React, { memo, useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'
import { SketchPicker } from 'react-color'
import ColorLens from '@material-ui/icons/ColorLens'
import { withStyles } from '@material-ui/core'

import { AttachmentWithThumbnail } from '@/components/_medisys'

import {
  GridContainer,
  GridItem,
  Select,
  Popper,
  Button,
  Switch,
} from '@/components'

import { groupWidth, groupHeight } from '../variables'

import Tooth from '../Tooth'

const symbols = [
  { name: '$', value: '$' },
  { name: '%', value: '%' },
]

const styles = (theme) => ({
  attachmentContainer: {
    margin: 0,
    width: 'auto',
  },
})

const Legend = ({ row, columnConfig, cellProps, viewOnly, classes }) => {
  const { value, control = {}, validSchema, text, ...restProps } = columnConfig
  const { method } = row
  // if (
  //   [
  //     'na',
  //     'bridging',
  //   ].includes(method)
  // )
  //   return null
  const { onBlur, onFocus, autoFocus, ...props } = cellProps
  // console.log(restProps)
  const [
    mode,
    setMode,
  ] = useState(row.editMode || 'color')
  const [
    color,
    setColor,
  ] = useState(row.fill)
  const [
    symbol,
    setSymbol,
  ] = useState(row.symbol)

  const [
    attachments,
    setAttachments,
  ] = useState(row.attachments)
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
      if (method === 'na') return
      if (mode === 'color') {
        setAttachments([])
        delete row.attachments
      } else if (mode === 'image') {
        delete row.symbol
        delete row.color
        setSymbol(undefined)
        setColor(undefined)
      }
    },
    [
      mode,
    ],
  )
  const { commitChanges } = control

  const handleUpdateAttachments = ({ added, deleted }) => {
    // console.log({ added, deleted }, args)

    let updated = [
      ...(attachments || []),
    ]
    if (added)
      updated = [
        ...updated,
        ...added.map((o) => {
          const { id, ...resetProps } = o
          return {
            ...resetProps,
            fileIndexFK: o.id,
          }
        }),
      ]

    if (deleted)
      updated = updated.reduce((_attachments, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [
            ..._attachments,
            { ...item, isDeleted: true },
          ]

        return [
          ..._attachments,
          { ...item },
        ]
      }, [])

    row.attachments = updated
    setAttachments(updated)
    commitChanges({
      changed: {
        [row.id]: {
          attachments: updated,
        },
      },
    })
  }
  // console.log(row.fill)
  // console.log(row)
  if (viewOnly) {
    return (
      <Tooth
        width={groupWidth / 5 + 2}
        height={groupHeight / 5 + 2}
        paddingLeft={1}
        paddingTop={1}
        zoom={1 / 5}
        // custom={row.getShape}
        image={row.attachments}
        fill={[
          row.fill,
          row.fill,
          row.fill,
          row.fill,
          row.fill,
        ]}
        symbol={[
          row.symbol,
          row.symbol,
          row.symbol,
          row.symbol,
          row.symbol,
          row.symbol,
        ]}
        name={row.text}
      />
    )
  }

  if (
    [
      'na',
      'bridging',
    ].includes(method)
  )
    return null
  return (
    <GridContainer>
      {method === 'tooth' &&
      !viewOnly && (
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
              commitChanges({
                changed: {
                  [row.id]: {
                    editMode: v,
                  },
                },
              })
            }}
          />
        </GridItem>
      )}
      {mode === 'color' && (
        <GridItem xs={3}>
          <Popper
            disabled={viewOnly}
            trigger='click'
            overlay={
              <SketchPicker
                color={color}
                onChangeComplete={(e) => {
                  row.fill = e.hex
                  setColor(e.hex)
                  commitChanges({
                    changed: {
                      [row.id]: {
                        fill: e.hex,
                      },
                    },
                  })
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
      {mode === 'color' && (
        <GridItem xs={3}>
          <Select
            options={symbols}
            value={symbol}
            {...restProps}
            text={viewOnly}
            onChange={(v) => {
              setSymbol(v)
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
          <AttachmentWithThumbnail
            label=''
            classes={{
              root: classes.attachmentContainer,
            }}
            attachmentType='DentalChartMethod'
            simple
            isReadOnly={!viewOnly}
            allowedMultiple={false}
            handleUpdateAttachments={handleUpdateAttachments}
            attachments={attachments}
            // isReadOnly={isReadOnly}
          />
        </GridItem>
      )}
    </GridContainer>
  )
}

export default withStyles(styles, { withTheme: true })(Legend)
