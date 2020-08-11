import React, { useState } from 'react'
import _ from 'lodash'
import { ImageSearch, CloudUpload } from '@material-ui/icons'

import {
  GridContainer,
  GridItem,
  Button,
  ProgressButton,
  Select,
  CheckboxGroup,
  RadioButtonGroup,
  TextField,
  Checkbox,
  NumberInput,
} from '@/components'

const PixelTypeOptions = [
  { value: 'BW', label: 'B&W' },
  { value: 'Gray', label: 'Gray' },
  { value: 'Color', label: 'Color' },
]

const ScaleByOptions = [
  { id: 'W', name: 'Width' },
  { id: 'H', name: 'Height' },
  { id: 'WH', name: 'Fixed Width&Height' },
]

const DpiOptions = [
  { id: '100', name: '100' },
  { id: '150', name: '150' },
  { id: '200', name: '200' },
  { id: '300', name: '300' },
]
export const Scanconfig = ({
  onScaning,
  onUploading,
  onSizeChanged,
  canUploading = false,
}) => {
  const defaultPixelType = PixelTypeOptions.find((f) => f.value === 'Color')
  const [
    pixelType,
    setPixelType,
  ] = useState(defaultPixelType)

  const [
    dpi,
    setDpi,
  ] = useState('300')

  const [
    autoFeeder,
    setAutoFeeder,
  ] = useState(false)

  const [
    duplex,
    setDuplex,
  ] = useState(false)

  const [
    isScale,
    setIsScale,
  ] = useState(false)

  const [
    scaleWidth,
    setScaleWidth,
  ] = useState(undefined)

  const [
    scaleHeight,
    setScaleHeight,
  ] = useState(undefined)
  const [
    scaleBy,
    setScaleBy,
  ] = useState('W')

  const onScanningClick = () => {
    onScaning({
      autoFeeder,
      duplex,
      dpi,
      pixelType: pixelType.value,
      isScale,
      scaleBy,
      scaleWidth,
      scaleHeight,
    })
  }
  const debounceOnUploading = _.debounce(onUploading, 500, {
    leading: true,
    trailing: false,
  })

  return (
    <React.Fragment>
      <GridItem xs={12}>
        <CheckboxGroup
          vertical
          textField='name'
          options={[
            { value: 'AutoFeeder', name: 'Auto Feeder' },
            { value: 'Duplex', name: 'Duplex' },
          ]}
          noUnderline
          onChange={(e) => {
            const isAutoFeeder = e.target.value.indexOf('AutoFeeder') >= 0
            const isDuplex = e.target.value.indexOf('Duplex') >= 0
            setAutoFeeder(isAutoFeeder)
            setDuplex(isDuplex)
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <RadioButtonGroup
          label='Pixel Type'
          row
          itemHorizontal
          field={pixelType}
          options={PixelTypeOptions}
          onChange={(e, v) => {
            const selected = PixelTypeOptions.find((f) => f.value === v)
            setPixelType(selected)
            if (v === 'BW') {
              setDpi('200')
            } else setDpi('300')
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <Select
          label='Dpi'
          valueField='id'
          value={dpi}
          options={DpiOptions}
          onChange={(v, opts) => {
            setDpi(v)
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <Checkbox
          label='Scale'
          checked={isScale}
          onChange={(e) => {
            setIsScale(e.target.value)
            setTimeout(onSizeChanged, 100)
          }}
        />
      </GridItem>
      {isScale && (
        <React.Fragment>
          <GridItem xs={12}>
            <Select
              label='Scale by'
              valueField='id'
              value={scaleBy}
              options={ScaleByOptions}
              onChange={(v) => {
                setScaleBy(v)
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <React.Fragment>
              <div style={{ display: 'flex' }}>
                <NumberInput
                  label='Width'
                  disabled={!isScale || (scaleBy !== 'W' && scaleBy !== 'WH')}
                  value={scaleWidth}
                  min={1}
                  onChange={(e) => {
                    setScaleWidth(e.target.value)
                  }}
                />
                <div style={{ width: 60, marginTop: 30, textAlign: 'center' }}>
                  x
                </div>
                <NumberInput
                  label='Height'
                  disabled={!isScale || (scaleBy !== 'H' && scaleBy !== 'WH')}
                  value={scaleHeight}
                  min={1}
                  onChange={(e) => {
                    setScaleHeight(e.target.value)
                  }}
                />
              </div>
            </React.Fragment>
          </GridItem>
        </React.Fragment>
      )}

      <GridContainer>
        <GridItem xs={6}>
          <Button onClick={onScanningClick} color='primary'>
            <ImageSearch /> Scan
          </Button>
        </GridItem>
        <GridItem xs={6}>
          <ProgressButton
            onClick={debounceOnUploading}
            disabled={!canUploading}
            color='primary'
            icon={<CloudUpload />}
          >
            Upload
          </ProgressButton>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  )
}
