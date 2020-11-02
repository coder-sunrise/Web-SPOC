import React, { useState } from 'react'

const initialPosition = {
  x: 0,
  y: 0,
}

const ZImage = ({ src, alt, width, height }) => {
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
  ] = useState(initialPosition)

  const onZoomIn = () => {
    setScale((value) => value + 1)

    setPosition(initialPosition)
  }
  const onZoomOut = () => {
    if (scale > 1) {
      setScale((value) => value - 1)
    }
    setPosition(initialPosition)
  }
  const imgRef = React.useRef<HTMLImageElement>()
  return (
    <div className='ant-image-preview-root'>
      <div tabIndex='-1' className='ant-image-preview-wrap' role='dialog'>
        <div role='document' className='ant-image-preview'>
          <div className='ant-image-preview-content'>
            <div
              className='ant-image-preview-body'
              // ref={this.bodyRef}
              style={{ backgroundColor: 'lightblue' }}
            >
              <ul className='ant-image-preview-operations'>
                <li className='ant-image-preview-operations-operation'>
                  <span
                    role='img'
                    aria-label='zoom-in'
                    className='anticon anticon-zoom-in ant-image-preview-operations-icon'
                    onClick={onZoomIn}
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
                    onClick={onZoomOut}
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
              >
                <img
                  onMouseDown={imageMouseDown}
                  ref={imgRef}
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
export default ZImage
