import React, { Component, useState, useEffect } from 'react'

import classNames from 'classnames'
// material ui
import { withStyles, Chip } from '@material-ui/core'
import {
  FastField,
  CommonModal,
  Button,
  GridContainer,
  GridItem,
  Select,
  TextField,
} from '@/components'
import { LoadingWrapper } from 'medisys-components'
// import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { downloadAttachment, getFileByFileID } from '@/services/file'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'
import { Carousel } from 'antd'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

// import 'antd/dist/antd.css'
import './style.css'

const ScaleMode = {
  FixedWH: 1,
  FixedW: 2,
  FixedH: 3,
  MaxWH: 4,
}
const base64Prefix = 'data:image/png;base64,'
const styles = (theme) => ({
  previousNext: {
    width: 25,
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  imageContainer: {
    // border: '1px solid #cccf',
    display: 'inherit',
    textAlign: 'center',
    width: '100%',
  },
})

class ImageItem extends Component {
  constructor (props) {
    super(props)
    this.carouselRef = React.createRef()
    this.state = {
      imageList: [],
    }
  }

  componentDidMount () {
    const { selectedFileId, files } = this.props
    const imageList = files.map((m, i) => {
      return {
        slideNumber: i,
        fileIndexFK: m.fileIndexFK,
        fileName: m.fileName,
        data: undefined,
        width: undefined,
        height: undefined,
        isSelected: false,
        selectedTags: [],
      }
    })

    this.fetchImage(imageList, selectedFileId)
  }

  fetchImage = (imageList, selectedFileId) => {
    this.setState({ loading: true })
    const requestAry = [
      getFileByFileID(selectedFileId),
    ]
    Promise.all(requestAry).then((response) => {
      if (response) {
        this.processImages(response).then((content) => {
          let selectedImg
          imageList.map((i) => {
            if (i.fileIndexFK === selectedFileId) {
              i.isSelected = true
              selectedImg = i
            } else {
              i.isSelected = false
            }
          })
          if (selectedImg) {
            const [
              selected,
            ] = content
            selectedImg.data = selected.data
            selectedImg.width = selected.width
            selectedImg.height = selected.height

            this.setState({ imageList, loading: false })
            setTimeout(() => {
              this.carouselRef.goTo(selectedImg.slideNumber, true)
            }, 100)
          }
        })
      }
    })
  }

  processImages = async (response) => {
    const imgContentList = []

    for (let index = 0; index < response.length; index++) {
      const item = response[index]
      const { data } = item
      const contentInBase64 = base64Prefix + arrayBufferToBase64(data)

      let scaleWH = {}

      await new Promise((resolve, reject) => {
        try {
          const image = new Image()
          image.src = contentInBase64
          image.onload = () => {
            scaleWH = this.scaleImage(image, 900, 680, ScaleMode.MaxWH)
            resolve()
          }
        } catch (ex) {
          reject(ex)
        }
      })

      imgContentList.push({
        data: contentInBase64,
        ...scaleWH,
      })
    }

    return imgContentList
  }

  scaleImage = (image, w, h, mode) => {
    let towidth = w
    let toheight = h

    switch (mode) {
      case ScaleMode.FixedWH:
        break
      case ScaleMode.FixedW:
        toheight = image.height * w / image.width
        break
      case ScaleMode.FixedH:
        towidth = image.width * h / image.height
        break
      case ScaleMode.MaxWH:
        let rmaxhw_d1w = image.width * 1.0 / w
        let rmaxhw_d2h = image.height * 1.0 / h
        if (rmaxhw_d1w > rmaxhw_d2h) {
          if (rmaxhw_d1w <= 1) {
            towidth = image.width
            h = image.height
            // goto case ScaleMode.FixedWH;
            break
          }
          towidth = w
          // goto case ScaleMode.FixedW;
          toheight = image.height * w / image.width
          break
        }
        if (rmaxhw_d2h <= 1) {
          towidth = image.width
          h = image.height
          // goto case ScaleMode.FixedWH;
          break
        }
        toheight = h
        // goto case ScaleMode.FixedH;
        towidth = image.width * h / image.height
        break
      default:
        break
    }
    return { width: towidth, height: toheight }
  }

  previous = () => {
    this.carouselRef.prev()
  }

  next = () => {
    this.carouselRef.next()
  }

  afterChangeImage = (current) => {
    const { imageList } = this.state

    const currentImg = imageList.find((s) => s.slideNumber === current)
    if (currentImg.data) {
      imageList.map((m) => {
        m.isSelected = false
      })
      currentImg.isSelected = true
      this.setState({ imageList })
    } else {
      this.fetchImage(imageList, currentImg.fileIndexFK)
    }
  }

  render () {
    const { imageList = [], loading = false } = this.state
    const { classes } = this.props
    const selectedImage = imageList.find((s) => s.isSelected) || {}

    return (
      <div style={{ display: 'table' }}>
        <div className={classes.previousNext}>
          <ArrowBackIosIcon onClick={this.previous} />
        </div>
        <LoadingWrapper
          loading={loading}
          text={<font color='white'>loading...</font>}
        >
          <div style={{ background: 'black', width: 900 }}>
            <Carousel
              ref={(el) => {
                this.carouselRef = el
              }}
              afterChange={this.afterChangeImage}
            >
              {imageList.map((img) => {
                const { data, fileName, width, height } = img
                return (
                  <div>
                    <div className={classes.imageContainer}>
                      {data && (
                        <img
                          alt={fileName}
                          src={data}
                          width={width}
                          height={height}
                          style={{ display: 'inline' }}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </Carousel>
          </div>
        </LoadingWrapper>
        <div className={classes.previousNext}>
          <ArrowBackIosIcon
            onClick={this.next}
            style={{ transform: 'rotate(180deg)' }}
          />
        </div>
        <div
          style={{
            display: 'table-cell',
          }}
        >
          <GridContainer>
            <GridItem md={12}>
              <TextField label='File Name' value={selectedImage.fileName} />
            </GridItem>
            <GridItem md={12}>
              <Select
                label='Tags'
                mode='tags'
                disableAll
                labelField='name'
                maxTagCount={0}
                value={selectedImage.selectedTags}
                options={[
                  { name: 'cate', value: 1 },
                  { name: 'sights', value: 3 },
                  { name: 'animal', value: 3 },
                ]}
                onChange={(e) => {
                  selectedImage.selectedTags = e

                  console.log(selectedImage.selectedTags)
                  this.setState({ imageList })
                }}
              />
            </GridItem>
            {selectedImage.selectedTags &&
            Array.isArray(selectedImage.selectedTags) && (
              <GridItem md={12}>
                {selectedImage.selectedTags.map((item) => (
                  <Chip
                    style={{ margin: 8 }}
                    key={item}
                    size='small'
                    variant='outlined'
                    label={item}
                    color='primary'
                    onDelete={() => {
                      selectedImage.selectedTags = selectedImage.selectedTags.filter(
                        (i) => i !== item,
                      )
                      this.setState({ imageList })
                    }}
                  />
                ))}
              </GridItem>
            )}
          </GridContainer>
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ImageItem)
