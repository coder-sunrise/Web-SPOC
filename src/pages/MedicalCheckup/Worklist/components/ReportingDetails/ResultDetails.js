import React, { useState, useEffect } from 'react'
import { List } from 'antd'
import { useDispatch } from 'dva'
import ReactHtmlParser from 'react-html-parser'
import { withStyles } from '@material-ui/core'
import { createFromIconfontCN } from '@ant-design/icons'
import defaultSettings from '@/defaultSettings'

const styles = () => ({
  '.ant-list-header': {
    padding: '5px',
  },
})

const ResultDetails = props => {
  const { visitId, showResultDetails } = props
  const [data, setData] = useState([])
  const [loaded, setLoaded] = useState(false)
  const dispatch = useDispatch()
  let IconFont = createFromIconfontCN({
    scriptUrl: defaultSettings.iconfontUrl,
  })
  useEffect(() => {
    if (!loaded && showResultDetails && visitId) {
      setLoaded(true)
      dispatch({
        type: 'workitem/getResultDetails',
        payload: { visitId: visitId },
      }).then(data => {
        setData(data)
      })
    }
  }, [showResultDetails])
  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      {data?.labResultDetails && (
        <List
          itemLayout='horizontal'
          header={
            <h4 style={{ fontWeight: 'bold', color: 'rgb(56, 158, 13)' }}>
              <IconFont
                style={{ position: 'relative', top: 1, marginRight: 6 }}
                type='icon-lab'
              />
              {`Lab Test (${data.labResultDetails.length})`}
            </h4>
          }
          className='resultDetails'
          size='small'
          dataSource={data.labResultDetails}
          renderItem={item => (
            <List.Item style={{ padding: 0 }}>
              <List.Item.Meta
                style={{ padding: '4px 8px' }}
                title={
                  <div>
                    <h5
                      style={{
                        fontWeight: 'bold',
                        color: '#4355be',
                        fontSize: '1.05em',
                      }}
                    >
                      {item.testPanel}
                    </h5>
                    <div>{`Last Verified By: ${item.verifiedBy}`}</div>
                  </div>
                }
                description={
                  <div style={{ paddingLeft: 10 }}>
                    {item.internalRemarks && (
                      <div style={{ color: 'black' }}>
                        <div
                          style={{ fontWeight: 'bold', fontStyle: 'italic' }}
                        >
                          Internal Remarks:{' '}
                        </div>
                        <div
                          style={{
                            display: 'inline-block',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {item.internalRemarks}
                        </div>
                      </div>
                    )}
                    {item.reportRemarks && (
                      <div style={{ color: 'black' }}>
                        <div
                          style={{ fontWeight: 'bold', fontStyle: 'italic' }}
                        >
                          Report Remarks:
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {item.reportRemarks}
                        </span>
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
      {data?.radiologyResultDetails && (
        <List
          itemLayout='horizontal'
          header={
            <h4 style={{ fontWeight: 'bold', color: 'rgb(56, 158, 13)' }}>
              <IconFont
                style={{ position: 'relative', top: 1, marginRight: 6 }}
                type='icon-radiology'
              />
              {`Examination (${data.radiologyResultDetails.length})`}
            </h4>
          }
          className='resultDetails'
          size='small'
          dataSource={data.radiologyResultDetails}
          renderItem={item => (
            <List.Item style={{ padding: 0 }}>
              <List.Item.Meta
                style={{ padding: '4px 8px' }}
                title={
                  <div>
                    <h5
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.05em',
                        color: '#4355be',
                      }}
                    >
                      {item.serviceName}
                    </h5>
                    <div>{`Radiology Technologist: ${item.radiologyTechnologist}`}</div>
                  </div>
                }
                description={
                  <div style={{ paddingLeft: 10 }}>
                    {item.findings && (
                      <div style={{ color: 'black' }}>
                        <div
                          style={{ fontWeight: 'bold', fontStyle: 'italic' }}
                        >
                          Findings:{' '}
                        </div>
                        <div style={{ display: 'inline-block' }}>
                          {ReactHtmlParser(item.findings)}
                        </div>
                      </div>
                    )}
                    {item.examinationComments && (
                      <div style={{ color: 'black' }}>
                        <div
                          style={{ fontWeight: 'bold', fontStyle: 'italic' }}
                        >
                          Examination Comments:
                        </div>
                        <span style={{ display: 'inline-block' }}>
                          {item.examinationComments}
                        </span>
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  )
}
export default withStyles(styles, { name: 'ResultDetails' })(ResultDetails)
