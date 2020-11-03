import React, { useState } from 'react'
import $ from 'jquery'
import { getOffset } from 'rc-util/lib/Dom/css'

import { IconButton } from '@/components'
import { RotateLeft, RotateRight, ZoomOut, ZoomIn } from '@material-ui/icons'

import useFrameSetState from './hooks/useFrameSetState'

const initialPosition = {
  x: 0,
  y: 0,
}

const ZImage = (props) => {
  const imgRef = React.useRef()
  const [
    scale,
    setScale,
  ] = useState(1)
  const [
    rotate,
    setRotate,
  ] = useState(0)
  const [
    position,
    setPosition,
  ] = useFrameSetState(initialPosition)

  const [
    isMoving,
    setMoving,
  ] = React.useState(false)

  const originPositionRef = React.useRef({
    originX: 0,
    originY: 0,
    deltaX: 0,
    deltaY: 0,
  })

  const onZoomIn = () => {
    const tempScale = parseInt($(imgRef.current).attr('scale'), 10)
    if (tempScale < 10) {
      setScale((value) => value + 1)
    }
    setPosition(initialPosition)
  }
  const onZoomOut = () => {
    const tempScale = parseInt($(imgRef.current).attr('scale'), 10)

    if (tempScale > 1) {
      setScale((value) => value - 1)
    }
    setPosition(initialPosition)
  }

  const onRotateRight = () => {
    setRotate((value) => value + 90)
  }

  const onRotateLeft = () => {
    setRotate((value) => value - 90)
  }
  const tools = [
    {
      icon: <ZoomIn />,
      onClick: onZoomIn,
      disabled: scale >= 10,
    },
    {
      icon: <ZoomOut />,
      onClick: onZoomOut,
      disabled: scale <= 1,
    },
    {
      icon: <RotateRight />,
      onClick: onRotateRight,
    },
    {
      icon: <RotateLeft />,
      onClick: onRotateLeft,
    },
  ]

  const fixPoint = (key, start, width, clientWidth) => {
    const startAddWidth = start + width
    const offsetStart = (width - clientWidth) / 2

    // console.log({ key, start, width, clientWidth, startAddWidth, offsetStart })
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

  const getFixScaleEleTransPosition = (width, height, left, top) => {
    const clientWidth = $(imgRef.current).parent().width()
    const clientHeight = $(imgRef.current).parent().height()

    let fixPos = null

    if (width <= clientWidth && height <= clientHeight) {
      fixPos = {
        x: 0,
        y: 0,
      }
    } else if (width > clientWidth || height > clientHeight) {
      fixPos = {
        ...fixPoint('x', left, width, clientWidth),
        ...fixPoint('y', top, height, clientHeight),
      }
    }

    return fixPos
  }

  const onMouseUp = () => {
    if (isMoving) {
      const sWidth = imgRef.current.offsetWidth * scale
      const sHeight = imgRef.current.offsetHeight * scale
      const { left, top } = getOffset(imgRef.current)
      const isRotate = rotate % 180 !== 0

      setMoving(false)

      const fixState = getFixScaleEleTransPosition(
        isRotate ? sHeight : sWidth,
        isRotate ? sWidth : sHeight,
        left,
        top,
      )

      if (fixState) {
        setPosition({ ...fixState })
      }
    }
  }

  const onMouseWheel = (event) => {
    if (event.wheelDelta > 0) {
      onZoomIn()
    } else {
      onZoomOut()
    }
  }

  const onMouseDown = (event) => {
    event.preventDefault()
    event.stopPropagation()
    console.log('onMouseDown', props.fileIndexFK)

    originPositionRef.current.deltaX = event.pageX - position.x
    originPositionRef.current.deltaY = event.pageY - position.y
    originPositionRef.current.originX = position.x
    originPositionRef.current.originY = position.y
    setMoving(true)
  }

  const onMouseMove = (event) => {
    if (isMoving) {
      const tempPosition = {
        x: event.pageX - originPositionRef.current.deltaX,
        y: event.pageY - originPositionRef.current.deltaY,
      }
      setPosition(tempPosition)
    }
  }

  React.useEffect(
    () => {
      window.addEventListener('mouseup', onMouseUp, false)
      window.addEventListener('mousemove', onMouseMove, false)
      window.addEventListener('mousewheel', onMouseWheel, false)

      try {
        // Resolve if in iframe lost event
        /* istanbul ignore next */
        if (window.top !== window.self) {
          window.top.addEventListener('mouseup', onMouseUp, false)
          window.top.addEventListener('mousemove', onMouseMove, false)
          window.top.addEventListener('mousewheel', onMouseWheel, false)
        }
      } catch (error) {
        /* istanbul ignore next */
        console.log(`[rc-image] ${error}`)
      }

      return () => {
        window.removeEventListener('mouseup', onMouseUp)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mousewheel', onMouseWheel)

        /* istanbul ignore next */
        if (window.top !== window.self) {
          window.top.removeEventListener('mouseup', onMouseUp)
          window.top.removeEventListener('mousemove', onMouseMove)
          window.top.removeEventListener('mousewheel', onMouseWheel)
        }
      }
    },
    [
      isMoving,
    ],
  )
  return (
    <div className='ant-image-preview-root'>
      <div
        tabIndex='-1'
        className={`ant-image-preview-wrap ${isMoving
          ? 'ant-image-preview-moving'
          : ''}`}
        role='dialog'
      >
        <div role='document' className='ant-image-preview'>
          <div className='ant-image-preview-content'>
            <div className='ant-image-preview-body'>
              <ul className='ant-image-preview-operations'>
                {tools.map((t) => (
                  <li className='ant-image-preview-operations-operation'>
                    <span
                      role='img'
                      className={`anticon anticon-zoom-in ant-image-preview-operations-icon ${t.disabled
                        ? 'ant-image-preview-operations-operation-disabled'
                        : ''}`}
                      onClick={t.onClick}
                    >
                      <IconButton
                        style={{ color: t.disabled ? 'Gray' : 'white' }}
                      >
                        {t.icon}
                      </IconButton>
                    </span>
                  </li>
                ))}
              </ul>
              <div
                className='ant-image-preview-img-wrapper'
                transData='0,0'
                style={{
                  transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                }}
              >
                <img
                  onMouseDown={onMouseDown}
                  ref={imgRef}
                  alt=''
                  className='ant-image-preview-img'
                  src={props.src}
                  width={props.width}
                  height={props.height}
                  scale={scale}
                  style={{
                    transform: `scale3d(${scale},${scale},1) rotate(${rotate}deg)`,
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
export default ZImage
