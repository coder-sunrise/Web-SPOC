import React, { useEffect, useState } from 'react'
import test1 from '@/assets/img/test_attachments/testImage1.jpg'
import { getThumbnail } from './utils'

const Test = () => {
  const [
    imageData,
    setImageData,
  ] = useState(test1)

  useEffect(() => {
    const element = document.getElementById('image')
    const rootEle = document.getElementById('imageroot')
    const result = getThumbnail(element, 0.1)
    const base64Result = result.toDataURL('image/jpeg')
    console.log({ base64Result })
    rootEle.appendChild(result)
  }, [])
  return (
    <div id='imageroot'>
      <img id='image' style={{ display: 'none' }} src={imageData} alt='test' />
    </div>
  )
}

export default Test
