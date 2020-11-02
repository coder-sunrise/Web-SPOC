/**
 * @param {type: number, desc: 当前点击的图片索引} imgIndex
 * @param {type: array, desc: 传入的图片列表，结构也应该是[{bigUrl:'imgUrl', alt:'图片描述'}]} imgs
 * @param {type: string, desc: 弹框显示出来的大图} bigUrl
 * @param {type: string, desc: 默认显示的小图片} url
 * @param {type: string, desc: 图片描述} alt
 * @param {type: object, desc: 操作按钮显示，默认都显示，如果对象中指定哪个按钮为false那么表示不显示, 
  example : {
    toSmall: bool,  //缩小按钮是否显示
    toBig: bool,   //放大按钮是否显示
    turnLeft: bool, //左转按钮是否显示
    turnRight: bool  //右转按钮是否显示
    close: bool, //关闭按钮是否显示
    esc: bool, //键盘中的esc键事件是否触发
    mousewheel: bool, // 鼠标滚轮事件是否触发
}} tool
*
* 示例: @example
*  <PhotoPreview 
*      bigUrl={item.bigUrl} 
*      url={item.url} 
*      alt={item.alt} 
*      tool={{ turnLeft: false, turnRight: false }} 
*   />
* 
*/
import React from 'react'
import PropTypes from 'prop-types'
// import './zimage.scss'
import { Button } from '@/components'
import { withStyles } from '@material-ui/core'
import $ from 'jquery'
import { set } from 'immutable'

class ZImage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tool: Object.assign(ZImage.defaultProps.tool, props.tool),

      imgOriginalWidth: 0, // 当前大图默认宽度值
      imgOriginalHeight: 0, // 当前大图默认高度值
      imgAttr: {
        // 大图的地址及描述
        src: '',
        alt: '',
      },
      imgParentStyle: {
        // 大图父级div元素样式
        width: '0px',
        height: '0px',
      },
      rotateDeg: 0, // 图片旋转角度
      scale3d: { x: 1, y: 1, z: 1 },
      rotate: 0,
      shake: 5,
    }

    // 获取相关元素
    this.imgRef = React.createRef()
    this.bodyRef = React.createRef()
  }

  componentDidMount = () => {}

  // 图片放大事件
  zoomIn = () => {
    this.setState((pre) => ({
      scale3d: {
        x: pre.scale3d.x + 1,
        y: pre.scale3d.y + 1,
        z: 1,
      },
    }))
  }

  // 图片缩小事件
  zoomOut = () => {
    this.setState((pre) => ({
      scale3d: {
        x: pre.scale3d.x - 1,
        y: pre.scale3d.y - 1,
        z: 1,
      },
    }))
  }

  rotateLeft = () => {
    this.setState((pre) => ({
      rotate: pre.rotate - 90,
    }))
  }

  rotateRight = () => {
    this.setState((pre) => ({
      rotate: pre.rotate + 90,
    }))
  }

  checkImageInBody = (JQImgEl) => {
    const { scale3d } = this.state
    // const body = $(this.bodyRef.current)
    const width = JQImgEl.width()
    const height = JQImgEl.height()
    const scaleWidth = width * scale3d.x
    const scaleHeight = height * scale3d.y
    const imgWidth = JQImgEl.find('img').width()
    const imgHeight = JQImgEl.find('img').height()

    const realWidth = imgWidth > scaleWidth ? imgWidth : scaleWidth
    const realHeight = imgHeight > scaleHeight ? imgHeight : scaleHeight

    return width >= realWidth && height >= realHeight
  }

  fixPoint = (key, start, width, clientWidth) => {
    const startAddWidth = start + width
    const offsetStart = (width - clientWidth) / 2

    console.log({ key, start, width, clientWidth, startAddWidth, offsetStart })
    if (width > clientWidth) {
      if (start > 0) {
        return {
          [key]: offsetStart,
        }
      }
      if (start < 0 && startAddWidth < clientWidth) {
        return {
          [key]: -offsetStart,
        }
      }
    } else if (start < 0 || startAddWidth > clientWidth) {
      return {
        [key]: start < 0 ? offsetStart : -offsetStart,
      }
    }
    return {}
  }

  // 大图被执行拖拽操作
  imageMouseDown = (event) => {
    event.preventDefault()
    const { scale3d, shake } = this.state
    const body = $(this.bodyRef.current)
    const imgEl = this.imgRef.current
    const JQImg = $(imgEl)

    const imgOffset = JQImg.offset()
    const mouseDownX = event.clientX
    const mouseDownY = event.clientY
    const diffX = mouseDownX - imgOffset.left
    const diffY = mouseDownY - imgOffset.top

    const width = JQImg.width()
    const height = JQImg.height()

    const scaleWidth = JQImg.find('img').width() * scale3d.x
    const scaleHeight = JQImg.find('img').height() * scale3d.y
    let moved = false

    // console.log('imageMouseDown', event.clientX, event.clientY, diffX, diffY)
    $('.ant-image-preview-operations-operation:last span').html(
      `X:${event.clientX} 
       Y:${event.clientY} 
       left:${imgOffset.left} 
       top:${imgOffset.top} 
       width:${scaleWidth} 
       height:${scaleHeight} `,
    )

    const handleMouseUp = (ev) => {
      if (!moved) return

      imgEl.onmousemove = null
      imgEl.onmouseup = null
      const boderOffset = { top: 61, left: 38 }

      const isInBody = this.checkImageInBody($(imgEl))
      if (isInBody) {
        $(imgEl).css('transform', 'translate3d( 0px,0px, 0px)')
      } else {
        // top:61,left:38
        const offset = $(imgEl).offset()
        // console.log(offset)
        // // 垂直超出的部分
        // const outTop = (scaleHeight - height) / 2
        // const outLeft = (scaleWidth - width) / 2
        // console.log({ outTop, outLeft })

        // let moveY = offset.top
        // let moveX = offset.left
        // if (offset.top > 0) {
        //   // 上面出现空白
        //   if (offset.top - outTop > 0) {
        //     moveY = outTop
        //   }
        // } else if (offset.top < outTop) {
        //   // 下面出现空白
        //   moveY = outTop * -1
        // }

        // // 放大后的图片宽度可以完整显示
        // if (scaleWidth < width) {
        //   if (offset.left + outLeft * -1 < 0) {
        //     moveX = outLeft
        //   } else {
        //     moveX = outLeft * -1
        //   }
        // } else {
        //   //
        //   moveX = outLeft
        // }

        const moveX = this.fixPoint('x', offset.left, scaleWidth, width).x
        const moveY = this.fixPoint('y', offset.top, scaleHeight, height).y

        console.log(moveX, moveY)
        $(imgEl).css('transform', `translate3d(${moveX}px,${moveY}px, 0px)`)

        // offset.top +
      }
      moved = false
    }
    const handleMouseMove = (ev) => {
      const { clientX, clientY } = ev
      const moveX = parseFloat(clientX - diffX)
      const moveY = parseFloat(clientY - diffY)

      if (
        Math.abs(mouseDownX - clientX) > shake ||
        Math.abs(mouseDownY - clientY) > shake
      ) {
        moved = true
        JQImg.css('transform', `translate3d(${moveX}px, ${moveY}px, 0px)`)
      }
    }
    // 鼠标移动的时候
    imgEl.onmousemove = handleMouseMove
    // 鼠标抬起的时候
    imgEl.onmouseup = handleMouseUp
    // 鼠标离开的时候
    imgEl.onmouseout = () => {
      imgEl.onmousemove = null
      imgEl.onmouseup = null
      imgEl.onmouseout = null
      moved = false
    }
  }

  // 鼠标滚轮事件
  _psMousewheelEvent = (event) => {
    // event.preventDefault();
    const { figureEl, tool } = this.state
    if (figureEl && tool.mousewheel) {
      if (event.wheelDelta > 0) {
        this.zoomIn()
      } else {
        this.zoomOut()
      }
    }
  }

  // UNSAFE_componentWillReceiveProps (newProps) {
  //   console.log(`new-props:${newProps.imgIndex}`)
  // }

  render () {
    const { alt, src, classes, width, height } = this.props
    const { scale3d, rotate } = this.state

    return (
      <div className='ant-image-preview-root'>
        <div tabIndex='-1' className='ant-image-preview-wrap' role='dialog'>
          <div role='document' className='ant-image-preview'>
            <div className='ant-image-preview-content'>
              <div
                className='ant-image-preview-body'
                ref={this.bodyRef}
                style={{ backgroundColor: 'lightblue' }}
              >
                <ul className='ant-image-preview-operations'>
                  <li className='ant-image-preview-operations-operation'>
                    <span
                      role='img'
                      aria-label='zoom-in'
                      className='anticon anticon-zoom-in ant-image-preview-operations-icon'
                      onClick={this.zoomIn}
                    >
                      <svg
                        viewBox='64 64 896 896'
                        focusable='false'
                        className=''
                        data-icon='zoom-in'
                        width='1em'
                        height='1em'
                        fill='currentColor'
                        aria-hidden='true'
                      >
                        <path d='M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z' />
                      </svg>
                    </span>
                  </li>
                  <li className='ant-image-preview-operations-operation'>
                    {/* ant-image-preview-operations-operation-disabled */}
                    <span
                      role='img'
                      aria-label='zoom-out'
                      className='anticon anticon-zoom-out ant-image-preview-operations-icon'
                      onClick={this.zoomOut}
                    >
                      <svg
                        viewBox='64 64 896 896'
                        focusable='false'
                        className=''
                        data-icon='zoom-out'
                        width='1em'
                        height='1em'
                        fill='currentColor'
                        aria-hidden='true'
                      >
                        <path d='M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z' />
                      </svg>
                    </span>
                  </li>
                  <li className='ant-image-preview-operations-operation'>
                    <span
                      role='img'
                      aria-label='rotate-right'
                      className='anticon anticon-rotate-right ant-image-preview-operations-icon'
                      onClick={this.rotateRight}
                    >
                      <svg
                        viewBox='64 64 896 896'
                        focusable='false'
                        className=''
                        data-icon='rotate-right'
                        width='1em'
                        height='1em'
                        fill='currentColor'
                        aria-hidden='true'
                      >
                        <defs>
                          <style />
                        </defs>
                        <path d='M480.5 251.2c13-1.6 25.9-2.4 38.8-2.5v63.9c0 6.5 7.5 10.1 12.6 6.1L660 217.6c4-3.2 4-9.2 0-12.3l-128-101c-5.1-4-12.6-.4-12.6 6.1l-.2 64c-118.6.5-235.8 53.4-314.6 154.2A399.75 399.75 0 00123.5 631h74.9c-.9-5.3-1.7-10.7-2.4-16.1-5.1-42.1-2.1-84.1 8.9-124.8 11.4-42.2 31-81.1 58.1-115.8 27.2-34.7 60.3-63.2 98.4-84.3 37-20.6 76.9-33.6 119.1-38.8z' />
                        <path d='M880 418H352c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32zm-44 402H396V494h440v326z' />
                      </svg>
                    </span>
                  </li>
                  <li className='ant-image-preview-operations-operation'>
                    <span
                      role='img'
                      aria-label='rotate-left'
                      className='anticon anticon-rotate-left ant-image-preview-operations-icon'
                      onClick={this.rotateLeft}
                    >
                      <svg
                        viewBox='64 64 896 896'
                        focusable='false'
                        className=''
                        data-icon='rotate-left'
                        width='1em'
                        height='1em'
                        fill='currentColor'
                        aria-hidden='true'
                      >
                        <defs>
                          <style />
                        </defs>
                        <path d='M672 418H144c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32zm-44 402H188V494h440v326z' />
                        <path d='M819.3 328.5c-78.8-100.7-196-153.6-314.6-154.2l-.2-64c0-6.5-7.6-10.1-12.6-6.1l-128 101c-4 3.1-3.9 9.1 0 12.3L492 318.6c5.1 4 12.7.4 12.6-6.1v-63.9c12.9.1 25.9.9 38.8 2.5 42.1 5.2 82.1 18.2 119 38.7 38.1 21.2 71.2 49.7 98.4 84.3 27.1 34.7 46.7 73.7 58.1 115.8a325.95 325.95 0 016.5 140.9h74.9c14.8-103.6-11.3-213-81-302.3z' />
                      </svg>
                    </span>
                  </li>
                  <li
                    className='ant-image-preview-operations-operation'
                    style={{ backgroundColor: 'black' }}
                  >
                    <span> </span>
                  </li>
                </ul>
                <div
                  className='ant-image-preview-img-wrapper'
                  transData='0,0'
                  style={{
                    transform: 'translate3d(0px, 0px, 0px)',
                    backgroundColor: 'pink',
                  }}
                  ref={this.imgRef}
                >
                  <img
                    onMouseDown={this.imageMouseDown}
                    alt=''
                    className='ant-image-preview-img'
                    src={src}
                    width={width}
                    height={height}
                    style={{
                      transform: `scale3d(${scale3d.x},${scale3d.y},${scale3d.z}) rotate(${rotate}deg)`,
                      display: 'inline',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ZImage.defaultProps = {
  alt: '',
  tool: {
    toSmall: true, // 缩小按钮
    toBig: true, // 放大按钮
    turnLeft: true, // 左转按钮
    turnRight: true, // 右转按钮
    close: true, // 关闭按钮
    esc: true, // esc键触发
    mousewheel: true, // 鼠标滚轮事件是否触发
  },
}
ZImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  tool: PropTypes.object,
}
export default ZImage
// export default withStyles()(ZImage)
