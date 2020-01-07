import React, { useState, useEffect } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { Field, FastField } from 'formik'
import _ from 'lodash'
import Search from '@material-ui/icons/Search'
import AttachMoney from '@material-ui/icons/AttachMoney'
import History from '@material-ui/icons/History'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import moment from 'moment'
import {
  SortableContainer,
  SortableHandle,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc'
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
  OutlinedTextField,
  ProgressButton,
  IconButton,
  dateFormatLong,
  Tree,
} from '@/components'
import Tooth from '../Tooth'

const Treatment = ({
  dispatch,
  theme,
  index,
  classes,
  style,
  onChange,
  mode,
  dentalChartSetup,
  global,
  ...props
}) => {
  const { data = [], rows, pedoChart, surfaceLabel } = dentalChartSetup
  const [
    search,
    setSearch,
  ] = useState()

  return (
    <div>
      <div
        style={{
          // height: global.mainDivHeight - 115,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <TextField
          value={search}
          autocomplete='off'
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          prefix={<Search />}
        />
        <Tree
          items={rows.filter((o) => !o.isDiagnosis)}
          search={search}
          labelField='text'
          onItemFocus={(item) => {
            if (!item.subItems) {
              dispatch({
                type: 'dentalChartComponent/updateState',
                payload: {
                  mode: 'treatment',
                  action: item,
                },
              })
            }
          }}
        />
      </div>
    </div>
  )
}

export default Treatment
