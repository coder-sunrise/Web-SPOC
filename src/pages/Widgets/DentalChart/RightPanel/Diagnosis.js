import React, { useState, useEffect, useRef } from 'react'
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
  // console.log(data)

  const groups = Object.values(_.groupBy(data, 'toothNo'))
  return (
    <div>
      <div
        style={{
          height: selected ? 300 : 'auto',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <h4>Tooth Journal</h4>
        {groups.map((k) => {
          const cfg = {
            theme,
            dispatch,
            data,
            classes,
            index: k[0].toothNo,
            selected,
          }

          // console.log(k[0])
          return (
            <React.Fragment>
              {k[0].target.indexOf('top') > 0 && (
                <SortItem {...cfg} item={k.filter((o) => o.name === 'root')} />
              )}
              <SortItem {...cfg} item={k.filter((o) => o.name !== 'root')} />
              {k[0].target.indexOf('bottom') > 0 && (
                <SortItem {...cfg} item={k.filter((o) => o.name === 'root')} />
              )}
            </React.Fragment>
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
