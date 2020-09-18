import React, { Component, useState, useEffect } from 'react'
import { FastField, Carousel, CommonModal } from '@/components'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { downloadAttachment, getFileByFileID } from '@/services/file'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'

const ScaleMode = {
  FixedWH: 1,
  FixedW: 2,
  FixedH: 3,
  MaxWH: 4,
}
const base64Prefix = 'data:image/png;base64,'

class ImageItem extends Component {
  state = {
    imageList: [],
  }

  componentDidMount () {
    this.fetchImages()
  }

  fetchImages = () => {
    const { fileIds } = this.props
    const requestAry = []
    fileIds.map((f) => {
      requestAry.push(getFileByFileID(f))
    })

    Promise.all(requestAry).then((response) => {
      if (response) {
        this.processImages(response).then((contentList) => {
          this.setState({ imageList: contentList })
        })
      }
    })
  }

  processImages = async (response) => {
    const imgContentList = []

    response.map(async (item) => {
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
        fileIndexFK: item.id,
        fileName: item.fileName,
        data: contentInBase64,
        ...scaleWH,
      })
    })

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

  renderItem = ({ props }) => {
    const { children } = props

    const imgNode = children.find((m) => m.type === 'img')
    const legendNode = children.find((m) => m.type === 'legend')

    const { width, height, src } = imgNode.props

    return (
      <div>
        <img alt='' src={src} style={{ width, height }} />
        <p>image </p>
      </div>
    )
  }

  renderThumbs = (child) => {
    const thumbs = child.map((m) => {
      const { children } = m.props
      const imgNode = children.find((c) => c.type === 'img')
      const { src } = imgNode.props
      return <img alt='' src={src} style={{ width: 70, height: 60 }} />
    })
    // console.log(thumbs)

    return thumbs
  }

  render () {
    const { imageList = [] } = this.state

    return (
      <React.Fragment>
        <Carousel renderItem={this.renderItem} renderThumbs={this.renderThumbs}>
          {imageList.map((img) => {
            const { data, fileName, width, height } = img
            return (
              <div>
                <img alt={fileName} src={data} width={width} height={height} />
                <p className='legend'>{fileName}</p>
              </div>
            )
          })}
        </Carousel>
      </React.Fragment>
    )
  }
}
export default ImageItem
