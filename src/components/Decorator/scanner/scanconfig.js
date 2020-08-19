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
// import { ImageList } from './imagelist'

const PixelTypeOptions = [
  { id: 'BW', name: 'B&W' },
  { id: 'Gray', name: 'Gray' },
  { id: 'Color', name: 'Color' },
]

const ScaleByOptions = [
  { id: 'W', name: 'Width' },
  { id: 'H', name: 'Height' },
  { id: 'WH', name: 'Fixed Width&Height' },
]
const FileTypeOptions = [
  { id: 'Jpeg', name: 'Jpeg' },
  { id: 'Png', name: 'Png' },
  { id: 'Bmp', name: 'Bmp' },
]

const DpiOptions = [
  // { id: '100', name: '100' },
  // { id: '150', name: '150' },
  { id: '200', name: '200' },
  { id: '300', name: '300' },
  { id: '400', name: '400' },
]
export const Scanconfig = ({
  onScaning,
  onUploading,
  onSizeChanged,
  canUploading = false,
}) => {
  // const defaultPixelType = PixelTypeOptions.find((f) => f.id === 'Color')
  const [
    pixelType,
    setPixelType,
  ] = useState('Color')

  const [
    dpi,
    setDpi,
  ] = useState('200')

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

  const [
    fileType,
    setFileType,
  ] = useState('Jpeg')
  const onScanningClick = () => {
    onScaning({
      autoFeeder,
      duplex,
      dpi,
      fileType,
      pixelType,
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
            // { value: 'Duplex', name: 'Duplex' },
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
        <Select
          label='Pixel Type'
          valueField='id'
          value={pixelType}
          options={PixelTypeOptions}
          onChange={(v, opts) => {
            if (v === 'BW') {
              setDpi('200')
            } else setDpi('300')

            setPixelType(v)
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
        <Select
          label='File Type'
          valueField='id'
          value={fileType}
          options={FileTypeOptions}
          onChange={(v, opts) => {
            setFileType(v)
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
      {/* <GridContainer>
        <ImageList
          imgRows={imageDatas}
          handleCommitChanges={handleCommitChanges}
        />
      </GridContainer> */}
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
            Save
          </ProgressButton>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  )
}
