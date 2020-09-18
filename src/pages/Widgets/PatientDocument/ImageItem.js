import React, { Component, useState, useEffect } from 'react'
import { FastField, Carousel, CommonModal } from '@/components'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { downloadAttachment, getFileByFileID } from '@/services/file'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'

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
        const imgContentList = []
        response.map((r) => {
          const { data } = r
          const contentInBase64 = arrayBufferToBase64(data)
          imgContentList.push({
            fileIndexFK: r.id,
            fileName: r.fileName,
            data: contentInBase64,
          })
        })
        this.setState({ imageList: imgContentList })
      }
    })
  }

  render () {
    const { imageList = [] } = this.state
    const base64Prefix = 'data:image/png;base64,'
    const styles = {
      div: {
        // backgroundImage: 'url(/img/'+asset.link+')',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        cursor: 'pointer',
      },
      img: {
        width: '100%',
        // height: 500,
      },
    }

    return (
      <React.Fragment>
        <Carousel dynamicHeight>
          {imageList.map((img) => {
            const { data, fileName } = img
            return (
              <div style={styles.div}>
                <img
                  style={styles.img}
                  alt={fileName}
                  src={`${base64Prefix}${data}`}
                  role='presentation'
                />
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
