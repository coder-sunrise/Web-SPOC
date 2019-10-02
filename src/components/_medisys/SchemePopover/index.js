import React, { PureComponent } from 'react'
import Refresh from '@material-ui/icons/Sync'
import More from '@material-ui/icons/MoreHoriz'
import {
  GridContainer,
  GridItem,
  Button,
  Popover,
  CodeSelect,
  IconButton,
  DatePicker,
  dateFormatLong,
} from '@/components'

const SchemePopover = ({
  isBanner = false,
  data,
  handleRefreshChasBalance,
}) => {
  return (
    <Popover
      icon={null}
      content={
        <div>
          <div
            style={{
              fontWeight: 500,
              marginBottom: 0,
            }}
          >
            <CodeSelect text code='ctSchemeType' value={data.schemeTypeFK} />
            <CodeSelect text code='ctSchemeType' />
            <IconButton onClick={handleRefreshChasBalance}>
              <Refresh fontSize='large' />
            </IconButton>
          </div>

          <div>
            <p>
              Validity:{' '}
              <DatePicker text format={dateFormatLong} value={data.validFrom} />
              {' - '}
              <DatePicker text format={dateFormatLong} value={data.validTo} />
            </p>
          </div>
          <div>Balance: </div>
          <div>Patient Visit Balance: </div>
          <div>Patient Clinic Balance: </div>
        </div>
      }
      trigger='click'
      placement='bottomLeft'
    >
      <div
        style={{
          display: 'inline-block',
          right: 10,
          position: 'absolute',
        }}
      >
        {isBanner ? (
          <Button simple variant='outlined' color='info' size='sm'>
            More
          </Button>
        ) : (
          <IconButton>
            <More />
          </IconButton>
        )}
      </div>
    </Popover>
  )
}

export default SchemePopover
