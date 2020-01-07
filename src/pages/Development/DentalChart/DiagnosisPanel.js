/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight'
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined'
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
  CommonModal,
} from '@/components'
import { groupWidth, groupHeight } from './variables'
import Setup from './Setup/index'
import Setup2 from './Setup/index2'

import Tooth from './Tooth'

const useStyles = makeStyles((theme) => ({}))

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(0.25, 0, 0.25, 0.5),
    // border: 'none',
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
      borderLeft: '1px solid rgba(0, 0, 0, 0.38)',
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: 200,
    border: '1px solid rgba(0, 0, 0, 0.38)',
  },
}))(ToggleButtonGroup)

export default function DiagnosisPanel (props) {
  const { dispatch, classes, theme, dentalChartSetup, ...restProps } = props
  const { rows } = dentalChartSetup

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
    const btn = rows.find((o) => o.value === v)
    dispatch({
      type: 'dentalChartComponent/updateState',
      payload: {
        action: btn,
      },
    })
  }

  // const sharedCfg = {
  //   alt: '',
  //   style: {
  //     height: '100%',
  //     padding: theme.spacing(0.25),
  //     marginRight: 4,
  //     position: 'absolute',
  //     left: 0,
  //   },
  // }
  // console.log(rows)
  // console.log(theme.props)
  return (
    <div>
      <Paper elevation={0} className={classes.paper}>
        <GridContainer>
          <GridItem md={9}>
            <TextField
              prefix={<Search />}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
          </GridItem>
          <GridItem md={3} style={{ lineHeight: theme.props.singleRowHeight }}>
            <Tooltip title='Settings'>
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
          <GridItem md={12} gutter={theme.spacing(0.5)}>
            <StyledToggleButtonGroup
              classes={{
                root: classes.groupBtnRoot,
                grouped: classes.groupBtnGrouped,
              }}
              size='small'
              value={selectedStyle}
              exclusive
              onChange={handleAction}
            >
              {rows
                .filter(
                  (o) =>
                    o.isDiagnosis &&
                    !o.isDeleted &&
                    (!search ||
                      o.text.toLowerCase().indexOf(search.toLowerCase()) >= 0),
                )
                .map((row) => {
                  const { value, text } = row
                  return [
                    <ToggleButton value={value}>
                      <Tooth
                        className={classes.buttonIcon}
                        width={groupWidth / 5 + 2}
                        height={groupHeight / 5 + 2}
                        paddingLeft={1}
                        paddingTop={1}
                        zoom={1 / 5}
                        image={row.attachments}
                        action={row}
                        fill={{
                          left: row.fill,
                          right: row.fill,
                          top: row.fill,
                          bottom: row.fill,
                          centerfull: row.fill || 'white',
                        }}
                        symbol={{
                          left: row.symbol,
                          right: row.symbol,
                          top: row.symbol,
                          bottom: row.symbol,
                          centerfull: row.symbol,
                        }}
                        name={text}
                      />
                      <span style={{ marginLeft: groupWidth / 5 + 20 }}>
                        {text}
                      </span>
                    </ToggleButton>,
                    // <Divider
                    //   orientation='vertical'
                    //   className={classes.divider}
                    // />,
                  ]
                })}
            </StyledToggleButtonGroup>
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
        <div>
          <Setup {...props} />
          <Setup2 {...props} />
        </div>
      </CommonModal>
    </div>
  )
}
