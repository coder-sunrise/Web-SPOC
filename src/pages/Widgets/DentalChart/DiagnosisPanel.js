/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import _ from 'lodash'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Settings from '@material-ui/icons/Settings'
import Search from '@material-ui/icons/Search'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  DatePicker,
  Checkbox,
  Popover,
  Tooltip,
  Select,
  ButtonSelect,
  Tabs,
  Skeleton,
  CommonModal,
} from '@/components'

import Setup from './Setup/index'
import Tooth from './Tooth'

const styles = (theme) => {
  return {
    groupBtnRoot: {
      '&.Mui-disabled': {
        color: 'inherit',
      },
    },
    groupBtnGroupRoot: {
      display: 'block',
      marginBottom: theme.spacing(1),
    },
    buttonIcon: {
      position: 'absolute',
      left: -1,
      top: -1,
    },
    grouped: {
      fontSize: '0.75rem',
      margin: theme.spacing(0.25, 0, 0.25, 0.5),
      // border: 'none',
      '&:not(:first-child)': {
        marginLeft: theme.spacing(0.5),
        borderRadius: Number(theme.shape.borderRadius),
        borderLeft: '1px solid rgba(0, 0, 0, 0.38)',
      },
      '&:first-child': {
        borderRadius: Number(theme.shape.borderRadius),
      },
      height: 34,
      lineHeight: 1,
      // whiteSpace: 'nowrap',
      paddingLeft: 37,
      overflow: 'hidden',
      width: 194,
      border: '1px solid rgba(0, 0, 0, 0.38)',
      // borderRadius: '8px',
    },
  }
}

const DiagnosisPanel = (props) => {
  const {
    dispatch,
    classes,
    theme,
    codetable,
    searchable,
    paperProps,
    viewOnly,
    chartmethods,
    ...restProps
  } = props

  let { ctchartmethod } = codetable
  if (chartmethods) {
    ctchartmethod = chartmethods
  }
  if (!ctchartmethod) return <Skeleton height={120} />
  const [
    selectedStyle,
    setSelectedStyle,
  ] = React.useState()
  const [
    openSettings,
    setOpenSettings,
  ] = React.useState(false)
  const [
    search,
    setSearch,
  ] = React.useState('')
  const handleAction = (event, v) => {
    setSelectedStyle(v)

    // console.log(v, list)
    const btn = ctchartmethod.find((o) => o.id === v)
    dispatch({
      type: 'dentalChartComponent/updateState',
      payload: {
        action: btn,
      },
    })
  }
  return (
    <div>
      <Paper className={classes.paper} {...paperProps}>
        <GridContainer>
          {searchable && (
            <GridItem md={9}>
              <TextField
                prefix={<Search />}
                onChange={(e) => {
                  setSearch(e.target.value)
                }}
              />
            </GridItem>
          )}
          {searchable && (
            <GridItem
              md={3}
              style={{ lineHeight: theme.props.singleRowHeight }}
            >
              <Tooltip title='Chart Method'>
                <Button
                  // style={{ margin: `${theme.spacing(1)}px 0` }}

                  size='sm'
                  onClick={(e) => {
                    setOpenSettings(!openSettings)
                  }}
                  justIcon
                  color='primary'
                >
                  <Settings />
                </Button>
              </Tooltip>
            </GridItem>
          )}
          <GridItem md={12} gutter={theme.spacing(0.5)}>
            <ToggleButtonGroup
              classes={{
                root: classes.groupBtnGroupRoot,
                grouped: classes.grouped,
              }}
              size='small'
              value={selectedStyle}
              exclusive
              onChange={handleAction}
            >
              {ctchartmethod
                .filter(
                  (o) =>
                    !!o &&
                    o.isDisplayInDiagnosis &&
                    !o.isDeleted &&
                    (!search ||
                      o.displayValue
                        .toLowerCase()
                        .indexOf(search.toLowerCase()) >= 0),
                )
                .map((row) => {
                  const { id, displayValue } = row
                  return (
                    <ToggleButton
                      value={id}
                      key={id}
                      disabled={viewOnly}
                      classes={{
                        root: classes.groupBtnRoot,
                      }}
                    >
                      <Tooth
                        className={classes.buttonIcon}
                        width={35}
                        height={35}
                        paddingLeft={1}
                        paddingTop={1}
                        zoom={0.28}
                        image={row.image}
                        action={row}
                        fill={{
                          left: row.chartMethodColorBlock,
                          right: row.chartMethodColorBlock,
                          top: row.chartMethodColorBlock,
                          bottom: row.chartMethodColorBlock,
                          centerfull: row.chartMethodColorBlock || 'white',
                        }}
                        symbol={{
                          left: row.chartMethodText,
                          right: row.chartMethodText,
                          top: row.chartMethodText,
                          bottom: row.chartMethodText,
                          centerfull: row.chartMethodText,
                        }}
                        name={displayValue}
                      />

                      <Tooltip title={displayValue}>
                        <span>{displayValue}</span>
                      </Tooltip>
                    </ToggleButton>
                  )
                })}
            </ToggleButtonGroup>
          </GridItem>
        </GridContainer>
      </Paper>
      <CommonModal
        open={openSettings}
        title='Dental Chart Method Setup'
        maxWidth='lg'
        bodyNoPadding
        onConfirm={() => {
          setOpenSettings(false)
        }}
        onClose={() => setOpenSettings(false)}
        // showFooter
        confirmText='Save'
      >
        <Setup {...props} />
      </CommonModal>
    </div>
  )
}
export default React.memo(
  withStyles(styles, { withTheme: true })(DiagnosisPanel),
  ({ codetable }, { codetable: codetableNext }) => {
    return codetable.ctchartmethod === codetableNext.ctchartmethod
  },
)
