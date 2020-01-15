import React, { useState, useEffect } from 'react'
import _ from 'lodash'

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
import SortItem from './SortItem'

const Diagnosis = ({
  dispatch,
  theme,
  index,
  classes,
  style,
  onChange,
  mode,
  dentalChartComponent,
  codetable,
  global,
  ...props
}) => {
  const { data = [], selected } = dentalChartComponent
  const groups = _.groupBy(data, 'toothNo')
  console.log(selected)
  return (
    <div>
      <div
        style={{
          // height: global.mainDivHeight - 115 - (selected ? 135 : 0),
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <h4>Tooth Journal</h4>
        {Object.keys(groups).map((k) => {
          return (
            <SortItem
              theme={theme}
              dispatch={dispatch}
              item={groups[k]}
              data={data}
              classes={classes}
              index={k}
              selected={selected}
            />
          )
        })}
      </div>
      {selected && (
        <OutlinedTextField
          autoFocus
          label='Remarks'
          multiline
          maxLength={2000}
          rowsMax={3}
          value={selected.remark}
          rows={3}
          onChange={(v) => {
            const shapes = data.filter(
              (o) => o.toothNo === selected.toothNo && o.id === selected.id,
            )
            if (v.target.value !== selected.remark) {
              dispatch({
                type: 'dentalChartComponent/toggleMultiSelect',
                payload: shapes.map((o) => ({
                  ...o,
                  forceSelect: true,
                  remark: v.target.value,
                })),
              })
            }
          }}
        />
      )}
    </div>
  )
}

export default Diagnosis
