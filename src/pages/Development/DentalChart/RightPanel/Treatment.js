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
import { getUniqueId } from '@/utils/utils'

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
  codetable,
  ...props
}) => {
  const { data = [], list = [], pedoChart, surfaceLabel } = dentalChartSetup
  const [
    search,
    setSearch,
  ] = useState()
  const [
    treatments,
    setTreatments,
  ] = useState([])
  // console.log(codetable)
  useEffect(() => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'cttreatment' },
    }).then((rows) => {
      // console.log(list)
      const treeItems = Object.values(
        _.groupBy(
          rows.filter((o) => !o.isDisplayInDiagnosis),
          'treatmentCategoryFK',
        ),
      ).map((o) => {
        return {
          id: getUniqueId(),
          text: o[0].treatmentCategory.displayValue,
          subItems: o.map((m) => ({
            id: m.id,
            text: m.displayValue,
            chartMethodFK: m.chartMethodFK,
          })),
        }
      })

      setTreatments(treeItems)
    })
  }, [])

  // console.log(treeItems)
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
          items={treatments}
          search={search}
          labelField='text'
          onItemFocus={(item) => {
            if (!item.subItems) {
              const action = list.find((o) => o.id === item.chartMethodFK)
              // console.log(action)

              dispatch({
                type: 'dentalChartComponent/updateState',
                payload: {
                  mode: 'treatment',
                  action,
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
