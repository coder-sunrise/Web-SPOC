import React, { useState } from 'react'
// material ui
import { Link } from 'umi'
import { withStyles } from '@material-ui/core'
import { Tooltip, Button, Popover } from '@/components'
import { CheckOutlined } from '@ant-design/icons'
import { REPORTINGDOCTOR_STATUS } from '@/utils/constants'

const styles = theme => ({
  panel: {
    float: 'left',
    width: 120,
    fontWeight: 400,
    letterSpacing: 'inherit',
    borderRadius: '3px',
    margin: '1px 8px 1px 0px',
    padding: '2px',
    color: 'white',
    cursor: 'hand',
  },
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

const ReportingDoctorTag = ({
  medicalCheckupDoctor = [],
  classes,
  isShowMessage = false,
  isShowLabel = false,
  label,
  updateReportingDoctor = () => {},
}) => {
  const [message, setMessage] = useState([])
  const searchMessage = doctor => {
    if (!isShowMessage) return
    setMessage([{ content: 'aaaaaa' }])
  }
  const showDoctor = () => {
    return medicalCheckupDoctor.map(d => {
      let reportingDoctorColor = '#CC0033'
      if (
        d.status === REPORTINGDOCTOR_STATUS.COMMENTDONE ||
        d.status === REPORTINGDOCTOR_STATUS.VERIFIED
      ) {
        reportingDoctorColor = '#33CC00'
      }
      const getDoctorTag = () => {
        const title = d.title && d.title.trim().length ? `${d.title} ` : ''
        const name = `${title}${d.name}`
        return (
          <div style={{ position: 'relative' }} onClick={searchMessage}>
            {d.status == 'Verified' && (
              <Tooltip title='Verified'>
                <Button
                  color='success'
                  size='small'
                  style={{ position: 'absolute', top: 0, left: 2 }}
                  justIcon
                >
                  <CheckOutlined />
                </Button>
              </Tooltip>
            )}
            <Tooltip title={name}>
              <div
                className={classes.text}
                style={{
                  paddingLeft: d.status == 'Verified' ? 30 : 0,
                }}
              >
                {name}
              </div>
            </Tooltip>
          </div>
        )
      }
      return (
        <div
          className={classes.panel}
          style={{
            backgroundColor: reportingDoctorColor,
          }}
        >
          {isShowMessage ? (
            <Popover
              icon={null}
              trigger='click'
              placement='bottomRight'
              content={
                <div style={{ width: 400 }}>
                  {message.map(item => {
                    return <div>{item.content}</div>
                  })}
                  {d.status === REPORTINGDOCTOR_STATUS.VERIFIED && (
                    <Link style={{ display: 'inline-block' }}>
                      <span
                        style={{
                          display: 'block',
                          textDecoration: 'underline',
                        }}
                        onClick={e => {
                          e.preventDefault()
                          updateReportingDoctor(d, REPORTINGDOCTOR_STATUS.NEW)
                        }}
                      >
                        Mark As Comments Done
                      </span>
                    </Link>
                  )}
                  {d.status === REPORTINGDOCTOR_STATUS.COMMENTDONE && (
                    <Link style={{ display: 'inline-block' }}>
                      <span
                        style={{
                          display: 'block',
                          textDecoration: 'underline',
                        }}
                        onClick={e => {
                          e.preventDefault()
                          updateReportingDoctor(
                            d,
                            REPORTINGDOCTOR_STATUS.VERIFIED,
                          )
                        }}
                      >
                        Verify Comments
                      </span>
                    </Link>
                  )}
                </div>
              }
            >
              {getDoctorTag()}
            </Popover>
          ) : (
            getDoctorTag()
          )}
        </div>
      )
    })
  }
  return (
    <div style={{ position: 'relative' }}>
      {isShowLabel && (
        <div style={{ float: 'left', marginRight: 6, marginTop: 6 }}>
          {label}
        </div>
      )}
      {showDoctor()}
    </div>
  )
}
export default withStyles(styles, { name: 'ReportingDoctorTag' })(
  ReportingDoctorTag,
)
