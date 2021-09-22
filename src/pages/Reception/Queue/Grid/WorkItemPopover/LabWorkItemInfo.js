import {
  IconButton,
  Popover,
} from '@/components'
  import { createFromIconfontCN } from '@ant-design/icons'
  import defaultSettings from '@/defaultSettings'
  
  const LabWorkItemInfo = (values = {} ) => {
    console.log('Lab',values)
    let IconFont = createFromIconfontCN({
      scriptUrl: defaultSettings.iconfontUrl,
    })
  
    const dotStyle = {
      height: '18px',
      width: '18px',
      backgroundColor: 'red',
      borderRadius: '50%',
      display: 'inline-block',
      position:'relative',
      top:'-11px',
      right :'8px',
      textAlign : 'center',
      fontSize : 11,
      color: 'white',
    }

  
    return (
      <Popover
        icon={null}
        placement='bottomLeft'
        arrowPointAtCenter
        content={
          <div
            style={{
              fontSize: 14,
            }}
          >
            <strong>Lab</strong>
          </div>
        }
      >
        <div style={{ display: 'inline-block' }}>
          <IconButton
            style={{
              position: 'relative',
              top: '0px',
              color:'white',
              backgroundColor:'blue',
            }}
            size='large'
          >
            <IconFont type='icon-radiology' />
          </IconButton>
          <span
            style={dotStyle}
          >
            2
          </span>
        </div>
      </Popover>
    )
  }
  
  export default LabWorkItemInfo
  