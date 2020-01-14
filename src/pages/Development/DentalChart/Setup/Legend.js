import React, { memo, useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'
import { SketchPicker } from 'react-color'
import ColorLens from '@material-ui/icons/ColorLens'
import { withStyles } from '@material-ui/core'

import { AttachmentWithThumbnail } from '@/components/_medisys'
import { getUniqueId } from '@/utils/utils'

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
  if (!row) return null
  const { chartMethodTypeFK } = row
  // if (
  //   [
  //     4,
  //     3,
  //   ].includes(chartMethodTypeFK)
  // )
  //   return null
  // console.log(restProps)
  // console.log(row)
  const [
    mode,
    setMode,
  ] = useState(row.image ? 'image' : 'color')
  // console.log(chartMethodTypeFK, row.editMode, mode)
  // if (chartMethodTypeFK === 1 && mode !== 'color') {
  //   setMode('color')
  // }
  // const [
  //   color,
  //   setColor,
  // ] = useState(row.chartMethodColorBlock)
  // const [
  //   symbol,
  //   setSymbol,
  // ] = useState(row.chartMethodText)

  // const [
  //   blur,
  //   setBlur,
  // ] = useState(false)
  // const debounceBlur = _.debounce(setBlur, 100, {
  //   leading: false,
  //   trailing: true,
  // })
  // useEffect(
  //   () => {
  //     if (chartMethodTypeFK === 4) return

  //     if (mode === 'color') {
  //       row.image = ''
  //     } else if (mode === 'image') {
  //       row.chartMethodColorBlock = ''
  //       row.chartMethodText = ''
  //       setSymbol(undefined)
  //       setColor(undefined)
  //     }
  //   },
  //   [
  //     mode,
  //   ],
  // )
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
  const { onBlur, onFocus, autoFocus, ...props } = cellProps
  const { value, control = {}, validSchema, text, ...restProps } = columnConfig
  const { commitChanges } = control

  const handleUpdateAttachments = ({ added, deleted }) => {
    const image = added
      ? added.map(
          (o) =>
            `data:image/${o.thumbnail.fileExtension.replace('.', '')};base64,${o
              .thumbnail.content}`,
        )[0]
      : ''
    row.image = image
    commitChanges({
      changed: {
        [row.id]: {
          image,
          chartMethodColorBlock: '',
          chartMethodText: '',
        },
      },
    })
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
              if (v === 'color') {
                row.chartMethodColorBlock = '#ffffff'
                row.image = ''
              } else {
                row.chartMethodColorBlock = ''
                row.chartMethodText = ''
              }
              commitChanges({
                changed: {
                  [row.id]: row,
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
                color={row.chartMethodColorBlock}
                onChangeComplete={(e) => {
                  row.chartMethodColorBlock = e.hex
                  row.image = ''

                  // setColor(e.hex)
                  commitChanges({
                    changed: {
                      [row.id]: {
                        chartMethodColorBlock: e.hex,
                        image: '',
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
                backgroundColor: row.chartMethodColorBlock || 'transparent',
                minWidth: 60,
                color: 'black',
              }}
            >
              {
                (symbols.find((o) => o.value === row.chartMethodText) || {})
                  .name
              }{' '}
              &nbsp;
            </Button>
          </Popper>
        </GridItem>
      )}
      {mode === 'color' && (
        <GridItem xs={3}>
          <Select
            options={symbols}
            value={row.chartMethodText}
            {...restProps}
            text={viewOnly}
            onChange={(v, option = {}) => {
              // console.log(v, option)
              // setSymbol(v)
              row.chartMethodText = option.name || ''
              row.image = ''
              // row.apptDurationMinute = e
              // setEndTime(row)
              // validSchema(row)
              commitChanges({
                changed: {
                  [row.id]: {
                    chartMethodText: option.name || '',
                    image: '',

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
            simple
            local
            isReadOnly={viewOnly}
            allowedMultiple={false}
            handleUpdateAttachments={handleUpdateAttachments}
            attachments={
              row.image ? (
                [
                  {
                    fileIndexFK: getUniqueId(),
                    thumbnailData: row.image,
                  },
                ]
              ) : (
                []
              )
            }
            // isReadOnly={isReadOnly}
          />
        </GridItem>
      )}
    </GridContainer>
  )
}

export default withStyles(styles, { withTheme: true })(Legend)
