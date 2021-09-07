import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Typography, Card } from 'antd'
import ProCard from '@ant-design/pro-card'
import moment from 'moment'
import { withStyles } from '@material-ui/core'
import {
  Icon,
  dateFormatLongWithTimeNoSec12h,
  Tooltip,
  CommonTableGrid,
  Popover,
} from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { VISIT_TYPE, VISIT_TYPE_NAME } from '@/utils/constants'
import { calculateAgeFromDOB } from '@/utils/dateUtils'
import { FileDoneOutlined } from '@ant-design/icons'
import Warning from '@material-ui/icons/Error'
import WorlistContext from '../Worklist/WorklistContext'

const blueColor = '#1890f8'

const styles = theme => ({
  mainPanel: {
    height: 140,
    margin: '5px',
    borderRadius: 6,
    border: '#cdcdcd solid 2px',
  },
  titlePanel: {
    display: 'flex',
    width: '100%',
    fontSize: '0.9rem',
    borderBottom: '#cdcdcd solid 1px',
    padding: '5px 8px',
  },
  commonText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  subRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(1),
    },
  },
  bodayPanel: {
    display: 'flex',
    width: '100%',
    fontSize: '0.9rem',
    lineHeight: '1.6rem',
    padding: '3px 8px',
    flexDirection: 'column',
  },
  warningIcon: {
    color: 'red',
    marginLeft: 10,
    position: 'relative',
    bottom: '-4px',
    fontSize: '1rem',
  },
})

const printPrescription = visitID => {}

const WorkitemTitle = ({ item, classes }) => {
  const age = item.dob ? calculateAgeFromDOB(item.dob) : 0
  let gender
  let genderColor
  if (item.genderFK === 1) {
    gender = 'female'
    genderColor = 'pink'
  } else if (item.genderFK === 2) {
    gender = 'male'
    genderColor = blueColor
  }
  return (
    <div className={classes.titlePanel}>
      <div style={{ marginRight: 'auto' }}>
        <div
          style={{
            color: blueColor,
            fontWeight: 500,
            fontSize: '1rem',
            width: 'calc(100% - 20px)',
          }}
        >
          {item.name}
        </div>
        <div>{item.patientReferenceNo}</div>
      </div>
      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
        <div>
          {gender && (
            <Tooltip title={gender}>
              <Icon
                type={gender}
                style={{ color: genderColor, fontSize: '1rem', marginRight: 3 }}
              />
            </Tooltip>
          )}
          <span>
            {age} {age > 1 ? 'Yrs' : 'Yr'}
          </span>
        </div>
        <div>{item.patientAccountNo}</div>
      </div>
    </div>
  )
}

const WorkitemBody = ({ item, classes }) => {
  const { setDetailsId } = useContext(WorlistContext)
  const orderDate = moment(item.generateDate).format(
    dateFormatLongWithTimeNoSec12h,
  )

  const visitGroup = item => {
    const visitGroupRow = p => {
      const { row, children, tableRow } = p
      let newchildren = []
      const middleColumns = children.slice(2, 4)

      if (row.countNumber === 1) {
        newchildren.push(
          children
            .filter((value, index) => index < 2)
            .map(item => ({
              ...item,
              props: {
                ...item.props,
                rowSpan: row.rowspan,
              },
            })),
        )

        newchildren.push(middleColumns)

        newchildren.push(
          children
            .filter((value, index) => index > 4)
            .map(item => ({
              ...item,
              props: {
                ...item.props,
                rowSpan: row.rowspan,
              },
            })),
        )
      } else {
        newchildren.push(middleColumns)
      }

      const selectedData = {
        ...tableRow.row,
        doctor: null,
      }

      if (row.countNumber === 1) {
        return <Table.Row {...p}>{newchildren}</Table.Row>
      }
      return (
        <Table.Row {...p} className={classes.subRow}>
          {newchildren}
        </Table.Row>
      )
    }
    return (
      <CommonTableGrid
        forceRender
        size='sm'
        FuncProps={{ pager: false }}
        rows={item.groupVisit || []}
        columns={[
          { name: 'queueNo', title: 'Q. No.' },
          { name: 'name', title: 'Name' },
          { name: 'gender', title: 'Gender' },
          { name: 'age', title: 'Age' },
        ]}
        columnExtensions={[
          {
            columnName: 'queueNo',
            width: 70,
            sortingEnabled: false,
          },
          {
            columnName: 'name',
            sortingEnabled: false,
          },
          {
            columnName: 'gender',
            width: 60,
            sortingEnabled: false,
          },
          {
            columnName: 'age',
            width: 60,
            sortingEnabled: false,
          },
        ]}
        TableProps={{ rowComponent: visitGroupRow }}
      />
    )
  }

  const showGroup = item.visitGroup && item.visitGroup.trim().length
  return (
    <div className={classes.bodayPanel}>
      <div
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        <div style={{ marginRight: 'auto', flexGrow: 1 }}>
          <div style={{ fontSize: '1rem', fontWeight: 500 }}>{`${
            item.doctorTitle && item.doctorTitle.trim().length
              ? `${item.doctorTitle}. `
              : ''
          }${item.doctorName || ''}`}</div>
          <div>
            <FileDoneOutlined
              style={{ color: blueColor, fontSize: '1rem', marginRight: 3 }}
            />
            {orderDate}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div>Q. No.: {item.queueNo}</div>
          {item.isPaid && (
            <div>
              <Tooltip title='Paid'>
                <Icon
                  type='Dollar'
                  style={{ color: 'green', fontSize: '1rem', marginRight: 3 }}
                />
              </Tooltip>
              {moment(item.paymentDate).format('HH:mm, DD MMM')}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          color: blueColor,
        }}
      >
        <Typography.Text
          underline
          style={{
            cursor: 'pointer',
          }}
          onClick={() => {
            setDetailsId(item.id)
          }}
        >
          Details
        </Typography.Text>
        <Typography.Text
          underline
          style={{
            cursor: 'pointer',
            marginLeft: 10,
          }}
          onClick={() => {
            printPrescription(item.visitFK)
          }}
        >
          Print Prescription
        </Typography.Text>
        {item.isOrderUpdate && (
          <Tooltip title='Order has been amended, please retrieve latest order from Details link'>
            <Warning className={classes.warningIcon} />
          </Tooltip>
        )}
        {showGroup && (
          <Popover
            icon={null}
            trigger='hover'
            placement='right'
            content={
              <div style={{ padding: 3, width: 400 }}>{visitGroup(item)}</div>
            }
          >
            <Icon
              type='team'
              style={{
                color: 'red',
                fontSize: '1rem',
                marginLeft: 10,
              }}
            />
          </Popover>
        )}
        {showGroup && (
          <span style={{ fontWeight: 500, color: 'black' }}>
            {item.visitGroup}
          </span>
        )}
      </div>
    </div>
  )
}

const PharmacyWorkItem = props => {
  const { item, classes } = props
  return (
    <div key={item.id} className={classes.mainPanel}>
      <WorkitemTitle {...props} />
      <WorkitemBody {...props} />
    </div>
  )
}

export default withStyles(styles, {
  withTheme: true,
  name: 'PharmacyWorkItem',
})(PharmacyWorkItem)
