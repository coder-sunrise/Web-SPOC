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

import { buttonConfigs } from './variables'
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
import Setup from './Setup/index'

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

export default function ButtonGroup (props) {
  const { dispatch, classes, theme, ...restProps } = props
  const [
    selectedStyle,
    setSelectedStyle,
  ] = React.useState()
  const [
    openSettings,
    setOpenSettings,
  ] = React.useState(false)

  const handleAction = (event, v) => {
    setSelectedStyle(v)

    const btn = buttonConfigs.find((o) => o.value === v)
    dispatch({
      type: 'dentalChartComponent/updateState',
      payload: {
        action: btn,
      },
    })
  }

  const sharedCfg = {
    alt: '',
    style: {
      height: '100%',
      padding: theme.spacing(0.25),
      marginRight: 4,
      position: 'absolute',
      left: 0,
    },
  }
  // console.log(props)
  // console.log(theme.props)
  return (
    <div>
      <Paper elevation={0} className={classes.paper}>
        <GridContainer>
          <GridItem md={9}>
            <TextField prefix={<Search />} />
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
              {buttonConfigs.map(({ value, icon, text }) => {
                return [
                  <ToggleButton value={value}>
                    <img src={icon} {...sharedCfg} />
                    <span style={{ marginLeft: 20 }}>{text}</span>
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
        // onConfirm={(ee) => {
        //   console.log(ee)
        // }}
        onClose={() => setOpenSettings(false)}
        // showFooter
        confirmText='Save'
      >
        <Setup
          {...props}
          // entity={entity}
          // refreshedSchemeData={schemeData}
          // handleOnClose={() => handleReplacementModalVisibility(false)}
        />
      </CommonModal>
    </div>
  )
}
