import React, { Fragment, useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Ticker from 'react-ticker'
import { compose } from 'redux'
import { connect } from 'dva'
import Clock from './Clock'
import QueueCallingList from './QueueCallingList'
import Carousel from './Carousel'
import CurrentCallingQueue from './CurrentCallingQueue'
import { withFormikExtend } from '@/components'
import { VALUE_KEYS } from '@/utils/constants'
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
  header,
}) => {
  const { images = [], message, showDateTime } = values
  const {
    qCallList,
    pendingQCall,
    currentQCall,
    isSync,
    lastUpdateDate,
  } = queueCalling
  const { signalRConnected } = header

  const [
    currentImageIndex,
    setCurrentImageIndex,
  ] = useState(1)

  const [
    rerender,
    setRerender,
  ] = useState(false)

  const [
    imageSources,
    setImageSources,
  ] = useState([])

  const getExistingQCallingList = async () => {
    await dispatch({
      type: 'queueCalling/getExistingQueueCallList',
      payload: {
        keys: VALUE_KEYS.QUEUECALLING,
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
        keys: VALUE_KEYS.QUEUEDISPLAYSETUP,
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
      if (images.length > 0) {
        getImageSources()
      }
    },
    [
      images,
    ],
  )

  const getLastQueueCallList = (setIsSyncValue) => {
    dispatch({
      type: 'queueCalling/getStatus',
      payload: {
        keys: VALUE_KEYS.QUEUECALLING,
      },
    }).then((response) => {
      const { lastUpdateDate: serverLastUpdateDate } = response
      if (serverLastUpdateDate !== lastUpdateDate) {
        dispatch({
          type: 'queueCalling/syncUp',
          payload: {
            keys: VALUE_KEYS.QUEUECALLING,
            isSync: setIsSyncValue,
          },
        })
      } else {
        dispatch({
          type: 'queueCalling/updateisSyncStatus',
          payload: {
            isSync: setIsSyncValue,
          },
        })
      }
    })
  }

  useEffect(
    () => {
      let getLastestQCallTimer = null

      if (signalRConnected && !isSync) {
        getLastQueueCallList(true)
      }

      if (!signalRConnected) {
        getLastestQCallTimer = setInterval(() => {
          getLastQueueCallList(false)
        }, 5000)
      }

      const timer = setInterval(() => {
        if (pendingQCall.length > 0) {
          if (!currentQCall) {
            dispatch({
              type: 'queueCalling/displayCallQueue',
            })
            setRerender(true)
            setTimeout(() => {
              dispatch({
                type: 'queueCalling/clearCurrentQCall',
              })
            }, 3000)
          }
        }
      }, 500)
      return () => {
        clearInterval(timer)
        clearInterval(getLastestQCallTimer)
      }
    },
    [
      pendingQCall,
      currentQCall,
      signalRConnected,
      lastUpdateDate,
    ],
  )

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
          {qCallList.length > 0 && (
            <QueueCallingList
              data={qCallList}
              rerender={rerender}
              setRerender={setRerender}
            />
          )}
        </div>
        <div className={classes.rightContainer}>
          {currentQCall ? (
            <CurrentCallingQueue callingQueue={currentQCall} />
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

        <div
          className={classes.footerCenterContainer}
          style={{ width: showDateTime ? '60%' : '80%' }}
        >
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
        {showDateTime && (
          <div className={classes.footerRightContainer}>
            <Clock />
          </div>
        )}
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
