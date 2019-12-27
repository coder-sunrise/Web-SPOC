import React, { useState, useEffect } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { Field, FastField } from 'formik'
import _ from 'lodash'
import Delete from '@material-ui/icons/Delete'
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
} from '@/components'

const Diagnosis = ({
  dispatch,
  theme,
  index,
  arrayHelpers,
  classes,
  form,
  field,
  style,
  onChange,
  value,
  mode,
  onDataSouceChange,
  dentalChartComponent,
  global,
  ...props
}) => {
  const { data = [], pedoChart, surfaceLabel } = dentalChartComponent
  const groups = _.groupBy(data, 'toothIndex')
  // console.log(groups)
  const [
    selected,
    setSelected,
  ] = useState()
  return (
    <div
      style={{
        height: global.mainDivHeight - 115,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <h4>Tooth Journal</h4>
      {Object.keys(groups).map((k) => {
        const ary = groups[k]

        // console.log(k, ary)
        const valueGroups = _.groupBy(ary, 'value')
        return (
          <List
            classes={{
              padding: classes.toothJournal,
            }}
          >
            {Object.keys(valueGroups).map((j) => {
              // console.log(j, valueGroups[j])
              const subAry = valueGroups[j]
              const v = subAry[0]
              v.info = subAry.map((o) => o.name).join(',')
              return (
                <ListItem
                  classes={{
                    root: classes.toothJournalItem,
                    secondaryAction: classes.toothJournalItemSecondaryAction,
                  }}
                  button
                  // selected={selectedIndex === 0}
                  onClick={(event) => setSelected(v)}
                >
                  <ListItemText
                    primary={
                      <GridContainer gutter={0}>
                        <GridItem xs={12}>
                          <div>
                            #{v.toothIndex}.&nbsp;
                            {moment(v.timestamp).format(dateFormatLong)} -&nbsp;
                            {v.value}
                            {v.info && ` (${v.info})`}
                          </div>
                        </GridItem>
                      </GridContainer>
                    }
                  />
                  <ListItemSecondaryAction
                    classes={{
                      root: classes.toothJournalSecondaryAction,
                    }}
                  >
                    <Tooltip title='Delete'>
                      <IconButton
                        onClick={() => {
                          dispatch({
                            type: 'dentalChartComponent/toggleMultiSelect',
                            payload: subAry.map((o) => ({
                              ...o,
                              deleted: true,
                            })),
                          })
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })}
          </List>
        )
      })}

      <OutlinedTextField
        label='Remarks'
        multiline
        maxLength={2000}
        rowsMax={3}
        rows={3}
      />
      {/* <p style={{ textAlign: 'right' }}>
        <ProgressButton style={{ marginRight: 0 }}>Save</ProgressButton>
      </p> */}
    </div>
  )
}

export default Diagnosis
