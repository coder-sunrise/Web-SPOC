import React, { useState } from 'react'
import classNames from 'classnames'
import { compose } from 'redux'
import { MenuItem, MenuList, withStyles } from '@material-ui/core'
import { Popper, CommonModal } from '@/components'
import { ReportViewer } from '@/components/_medisys'

const styles = () => ({})

const PrintStatementReport = (props) => {
  const { id, classes } = props

  const [
    open,
    setOpen,
  ] = useState(false)

  const [
    reportGroupBy,
    setReportGroupBy,
  ] = useState('')

  const [
    selectedStatementNo,
    setSelectedStatementNo,
  ] = useState(false)

  const toggleReport = (v) => {
    setOpen(!open)
    setReportGroupBy(v)
    setSelectedStatementNo(id)
  }

  return (
    <React.Fragment>
      <Popper
        className={classNames({
          [classes.pooperResponsive]: true,
          [classes.pooperNav]: true,
        })}
        style={{
          zIndex: 1,
        }}
        overlay={
          <MenuList role='menu'>
            <MenuItem onClick={() => toggleReport('Patient')}>
              By Patient
            </MenuItem>
            <MenuItem onClick={() => toggleReport('Doctor')}>
              By Doctor
            </MenuItem>
            <MenuItem onClick={() => toggleReport('Item')}>By Item</MenuItem>
          </MenuList>
        }
      >
        {props.children}
      </Popper>
      <CommonModal
        open={open}
        onClose={toggleReport}
        title='Statement'
        maxWidth='lg'
      >
        <ReportViewer
          reportID={25}
          reportParameters={{
            StatementId: selectedStatementNo,
            GroupBy: reportGroupBy,
          }}
        />
      </CommonModal>
    </React.Fragment>
  )
}

export default compose(withStyles(styles))(PrintStatementReport)
