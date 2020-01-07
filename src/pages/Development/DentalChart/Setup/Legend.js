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
  const { chartMethodTypeFK } = row
  // if (
  //   [
  //     4,
  //     3,
  //   ].includes(chartMethodTypeFK)
  // )
  //   return null
  const { onBlur, onFocus, autoFocus, ...props } = cellProps
  // console.log(restProps)

  const [
    mode,
    setMode,
  ] = useState(row.image ? 'image' : 'color')
  // console.log(chartMethodTypeFK, row.editMode, mode)
  // if (chartMethodTypeFK === 1 && mode !== 'color') {
  //   setMode('color')
  // }
  const [
    color,
    setColor,
  ] = useState(row.chartMethodColorBlock)
  const [
    symbol,
    setSymbol,
  ] = useState(row.chartMethodText)

  const [
    attachments,
    setAttachments,
  ] = useState(row.attachments)
  // const [
  //   blur,
  //   setBlur,
  // ] = useState(false)
  // const debounceBlur = _.debounce(setBlur, 100, {
  //   leading: false,
  //   trailing: true,
  // })
  useEffect(
    () => {
      if (chartMethodTypeFK === 4) return

      if (mode === 'color') {
        setAttachments([])
        delete row.attachments
        delete row.image
      } else if (mode === 'image') {
        delete row.chartMethodColorBlock
        delete row.chartMethodText
        setSymbol(undefined)
        setColor(undefined)
      }
    },
    [
      mode,
    ],
  )
  useEffect(
    () => {
      // console.log('legend', chartMethodTypeFK)
      if (chartMethodTypeFK === 1 && mode !== 'color') {
        setMode('color')
      }
    },
    [
      chartMethodTypeFK,
    ],
  )
  const { commitChanges } = control

  const handleUpdateAttachments = ({ added, deleted }) => {
    console.log({ added, deleted })

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

    row.attachments = updated.map((o) => ({ thumbnailData: o.thumbnailData }))
    setAttachments(updated)
    commitChanges({
      changed: {
        [row.id]: {
          image: updated[0].thumbnailData,
          attachments: updated,
        },
      },
    })
  }
  // console.log(row.chartMethodColorBlock)
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
        image={row.image}
        action={row}
        fill={{
          left: row.chartMethodColorBlock,
          right: row.chartMethodColorBlock,
          top: row.chartMethodColorBlock,
          bottom: row.chartMethodColorBlock,
          centerfull: row.chartMethodColorBlock || 'white',
        }}
        symbol={{
          left: row.chartMethodText,
          right: row.chartMethodText,
          top: row.chartMethodText,
          bottom: row.chartMethodText,
          centerfull: row.chartMethodText,
        }}
        name={row.text}
      />
    )
  }

  if (
    [
      4,
      3,
    ].includes(chartMethodTypeFK)
  )
    return null
  return (
    <GridContainer>
      {chartMethodTypeFK === 2 &&
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
                  row.chartMethodColorBlock = e.hex
                  setColor(e.hex)
                  commitChanges({
                    changed: {
                      [row.id]: {
                        chartMethodColorBlock: e.hex,
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
              {(symbols.find((o) => o.value === symbol) || {}).name} &nbsp;
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
            onChange={(v, option) => {
              console.log(v, option)
              setSymbol(v)
              row.chartMethodText = option.name
              // row.apptDurationMinute = e
              // setEndTime(row)
              // validSchema(row)
              commitChanges({
                changed: {
                  [row.id]: {
                    chartMethodText: option.name,
                    // symbol: v,
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
            local
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
