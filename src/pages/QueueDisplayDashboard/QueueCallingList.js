import React, { useState, useEffect } from 'react'

const queueStyle = {
  margin: 'auto',
  borderBottom: 'solid 3px black',
  width: '100%',
  height: '30vh',
  display: 'inline-grid',
  alignContent: 'center',
}

const QueueCallingList = ({ data, rerender, setRerender }) => {
  const [
    list,
    setList,
  ] = useState([])

  const [
    startIndex,
    setStartIndex,
  ] = useState(0)

  const renderList = () => {
    const sliceIndex = rerender ? 0 : startIndex
    const currentPartition = [
      ...data,
    ].slice(sliceIndex, sliceIndex + 3)
    let elements = []
    // console.log({ currentPartition, sliceIndex, data })
    for (let index = 0; index < currentPartition.length; index++) {
      const element = (
        <div style={queueStyle}>
          <p
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {currentPartition[index].roomNo}
          </p>
          <p style={{ fontWeight: 'bold' }}>{currentPartition[index].qNo}</p>
        </div>
      )
      elements.push(element)
    }
    return elements
  }

  const renderCurrentPartition = () => {
    const currentPartition = renderList()

    const nextParitionStartIndex =
      startIndex + 3 >= data.length ? 0 : startIndex + 3
    setStartIndex(() => nextParitionStartIndex)
    setList(() => currentPartition)
  }

  useEffect(
    () => {
      const interval = setInterval(() => {
        renderCurrentPartition()
      }, 5000)
      return () => clearInterval(interval)
    },
    [
      startIndex,
      data,
    ],
  )

  useEffect(() => {
    renderCurrentPartition()
  }, [])

  useEffect(
    () => {
      if (rerender) {
        setStartIndex(() => 0)
        setRerender(false)
        renderCurrentPartition()
      }
    },
    [
      rerender,
      data,
    ],
  )

  return list
}

export default QueueCallingList
