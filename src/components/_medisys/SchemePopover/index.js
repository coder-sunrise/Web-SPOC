import React, { useState } from 'react'
import Refresh from '@material-ui/icons/Sync'
import More from '@material-ui/icons/MoreHoriz'
import moment from 'moment'
import {
  CommonModal,
  GridContainer,
  GridItem,
  Button,
  Popover,
  CodeSelect,
  IconButton,
  DatePicker,
  dateFormatLong,
  NumberInput,
} from '@/components'

const SchemePopover = ({
  isBanner = false,
  data,
  schemeTypeFK,
  balanceValue,
  dateFrom,
  dateTo,
  handleRefreshChasBalance,
}) => {
  return (
    <Popover
      icon={null}
      content={
        <div>
          <GridContainer>
            <GridItem>
              <div
                style={{
                  fontWeight: 500,
                  marginBottom: 0,
                  paddingLeft: 0,
                }}
              >
                <CodeSelect text code='ctSchemeType' value={schemeTypeFK} />

                <div style={{ display: 'inline-block', position: 'absolute' }}>
                  <IconButton onClick={handleRefreshChasBalance}>
                    {' '}
                    <Refresh fontSize='large' />
                  </IconButton>
                </div>
              </div>
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem>
              <p>
                Validity:{' '}
                <DatePicker text format={dateFormatLong} value={dateFrom} />
                {' - '}
                <DatePicker text format={dateFormatLong} value={dateTo} />
              </p>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem>
              {' '}
              Balance: <NumberInput text currency value={balanceValue} />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem>
              Patient Visit Balance:{' '}
              <div
                style={{
                  fontWeight: 500,
                  display: 'inline-block',
                  paddingLeft: 2,
                }}
              >
                {data.patientSchemeBalance.length <= 0 ? (
                  ''
                ) : (
                  data.patientSchemeBalance[0].acuteVisitPatientBalance
                )}{' '}
                Remaining{' '}
              </div>{' '}
              for Year {moment().year()}
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem>
              Patient Clinic Balance:
              <div
                style={{
                  fontWeight: 500,
                  display: 'inline-block',
                  paddingLeft: 2,
                }}
              >
                {data.patientSchemeBalance.length <= 0 ? (
                  ''
                ) : (
                  data.patientSchemeBalance[0].acuteVisitClinicBalance
                )}{' '}
                Remaining
              </div>{' '}
              for {moment().format('MMMM')} {moment().year()}
            </GridItem>
          </GridContainer>
        </div>
      }
      trigger='click'
      placement='bottomLeft'
    >
      <div
        style={{
          display: 'inline-block',
          right: 10,
          position: isBanner ? '' : 'absolute',
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
