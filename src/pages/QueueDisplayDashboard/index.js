import React, { Fragment, useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Ticker from 'react-ticker'
import { compose } from 'redux'
import { connect } from 'dva'
import Clock from './Clock'
import Marquee from './Marquee'
import QueueCallingList from './QueueCallingList'
import Carousel from './Carousel'
import CurrentCallingQueue from './CurrentCallingQueue'
import { withFormikExtend } from '@/components'
import { KEYS } from '@/utils/constants'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'
import { getFileByFileID } from '@/services/file'

const styles = (theme) => ({
  mainContainer: {
    position: 'relative',
    height: '90vh',
  },
  leftContainer: {
    width: '30%',
    float: 'left',
  },
  rightContainer: {
    width: '70%',
    float: 'right',
    border: '1px solid black',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '10vh',
    background: '#0093f1',
    color: 'white',
  },
  clock: {
    float: 'right',
  },
  footerLeftContainer: {
    width: '20%',
    height: '10vh',
    padding: 15,
    float: 'left',
  },
  footerCenterContainer: {
    width: '60%',
    height: '10vh',
    lineHeight: '10vh',
    float: 'left',
  },
  footerRightContainer: {
    width: '20%',
    height: '10vh',
    float: 'right',
  },
  callingQueueSection: {
    height: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    lineHeight: '10vw',
    fontSize: '8vw',
  },
})

const QueueDisplayDasboard = ({
  classes,
  values = {},
  dispatch,
  queueCalling,
}) => {
  const { images = [], message, showDateTime } = values
  const { calling, qCallList, pendingQCall } = queueCalling

  const [
    showCurrentCallQueue,
    setShowCurrentCallQueue,
  ] = useState(calling)

  const [
    currentImageIndex,
    setCurrentImageIndex,
  ] = useState(1)

  const [
    rerender,
    setRerender,
  ] = useState(false)

  const [
    data,
    setData,
  ] = useState(qCallList)

  const [
    pendingCallData,
    setPendingCallData,
  ] = useState(pendingQCall)

  const [
    imageSources,
    setImageSources,
  ] = useState([])

  const getExistingQCallingList = async () => {
    await dispatch({
      type: 'queueCalling/getExistingQueueCallList',
      payload: {
        keys: KEYS.QUEUECALLING,
      },
    })
  }

  const getImageSources = async () => {
    let imageArray = [
      'https://semr2webuat2010.emr.com.sg/static/logo_white_with_text.5b2219f7.png',
    ]
    images.map(async (image, idx) => {
      try {
        let src
        const thumbnailId = image.thumbnailIndexFK

        if (thumbnailId) {
          const response = await getFileByFileID(thumbnailId)
          if (response && response.status === 200) {
            const { data: imageData } = response
            const thumbnailDataInBase64 = arrayBufferToBase64(imageData)
            const base64Prefix = 'data:image/png;base64,'
            src = `${base64Prefix}${thumbnailDataInBase64}`
            imageArray[idx] = src
          }
        }
      } catch (error) {
        console.error(error)
        return null
      }
    })
    // console.log({ imageArray })

    setImageSources(imageArray)
  }

  const getQueueDisplaySetup = () => {
    dispatch({
      type: 'queueDisplaySetup/query',
      payload: {
        keys: KEYS.QUEUEDISPLAYSETUP,
      },
    })
  }

  useEffect(() => {
    getQueueDisplaySetup()
    getExistingQCallingList()
    dispatch({
      type: 'queueCalling/updateState',
      payload: {
        pendingQCall: [],
      },
    })
  }, [])

  useEffect(
    () => {
      setData(qCallList)
    },
    [
      qCallList,
    ],
  )

  useEffect(
    () => {
      if (images.length > 0) {
        getImageSources()
      }
    },
    [
      images,
    ],
  )

  useEffect(
    () => {
      if (calling && pendingQCall.length > 0) {
        const qIsExist = data.find((q) => q.qNo === pendingQCall[0].qNo)

        let qArray = []
        if (qIsExist) {
          const otherQCalls = data.filter((q) => q.qNo !== pendingQCall[0].qNo)
          qArray = [
            qIsExist,
            ...otherQCalls,
          ]
        } else {
          qArray = [
            pendingQCall[0],
            ...data,
          ]
        }

        setData(qArray)
        // dispatch({
        //   type: 'queueCalling/updateState',
        //   payload: {
        //     qCallList: qArray,
        //   },
        // })
        setShowCurrentCallQueue(true)
      }
      setRerender(true)
    },
    [
      calling,
      pendingQCall,
    ],
  )

  // console.log({ pendingQCall })

  return (
    <Fragment>
      <div className={classes.mainContainer}>
        <div
          className={classes.leftContainer}
          style={{
            display: 'grid',
            gridGap: 3,
            textAlign: 'center',
            color: 'black',
            fontSize: '5vw',
            lineHeight: '6vw',
          }}
        >
          {data.length > 0 && (
            <QueueCallingList
              data={data}
              rerender={rerender}
              setRerender={setRerender}
            />
          )}
        </div>
        <div className={classes.rightContainer}>
          {showCurrentCallQueue ? (
            <CurrentCallingQueue
              callingQueue={pendingQCall}
              setShowCurrentCallQueue={setShowCurrentCallQueue}
              dispatch={dispatch}
              qCallList={qCallList}
              setRerender={setRerender}
              setPendingCallData={setPendingCallData}
            />
          ) : (
            <Carousel
              images={imageSources}
              setCurrentImageIndex={setCurrentImageIndex}
              currentImageIndex={currentImageIndex}
            />
          )}
        </div>
      </div>
      <div className={classes.footerContainer}>
        <div className={classes.footerLeftContainer}>
          <img
            alt=''
            src='https://semr2webuat2010.emr.com.sg/static/logo_white_with_text.5b2219f7.png'
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* <Ticker mode='smooth'>
            {() => (
              <h1
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </h1>
            )}
          </Ticker> */}

        <div className={classes.footerCenterContainer}>
          <marquee
            style={{
              fontSize: '1.5vw',
              fontStyle: 'italic',
              boxShadow: '-5px 0 5px -5px white, 5px 0 5px -5px white',
            }}
          >
            {/* Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. */}
            {message}
          </marquee>
          {/* <button
            type='submit'
            onClick={() => {
              setTest(!test)
              const newData = [
                ...data,
              ]
              const calledQIndex = newData.findIndex(
                (q) => q.qNo === callingQueueNo.qNo,
              )
              const filteredData = newData.filter(
                (o) => o.qNo !== callingQueueNo.qNo,
              )
              setData([
                newData[calledQIndex],
                ...filteredData,
              ])
              setRerender(true)
            }}
          >
            asdds
          </button> */}
        </div>
        <div className={classes.footerRightContainer}>
          {showDateTime && <Clock />}
        </div>
      </div>
    </Fragment>
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ queueCalling, header, queueDisplaySetup }) => ({
    queueCalling,
    header,
    queueDisplaySetup,
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ queueDisplaySetup }) => {
      if (!queueDisplaySetup.entity) return queueDisplaySetup.default
      return queueDisplaySetup.entity.value
    },
  }),
)(QueueDisplayDasboard)
