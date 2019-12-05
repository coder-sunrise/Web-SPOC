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
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import { buttonConfigs } from './variables'

const useStyles = makeStyles((theme) => ({}))

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: 'none',
    padding: theme.spacing(0, 1),
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup)

export default function ButtonGroup ({ dispatch, classes }) {
  const [
    alignment,
    setAlignment,
  ] = React.useState('left')
  const [
    formats,
    setFormats,
  ] = React.useState(() => [
    'italic',
  ])

  const handleAction = (event, v) => {
    setAlignment(v)

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
    style: { width: 24, marginRight: 4 },
  }
  return (
    <div>
      <Paper elevation={0} className={classes.paper}>
        <StyledToggleButtonGroup
          size='small'
          value={alignment}
          exclusive
          onChange={handleAction}
        >
          {buttonConfigs.map(({ value, icon, text }) => {
            return [
              <ToggleButton value={value}>
                <img src={icon} {...sharedCfg} />
                {text}
              </ToggleButton>,
              <Divider orientation='vertical' className={classes.divider} />,
            ]
          })}
        </StyledToggleButtonGroup>
      </Paper>
    </div>
  )
}
