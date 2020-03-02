import React, { useState, useEffect, useRef } from 'react'
import _ from 'lodash'
import $ from 'jquery'

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
  const { data = [], selected, lastClicked } = dentalChartComponent

  // console.log(data)
  const myRef = useRef(null)
  const groups = Object.values(_.groupBy(data, 'toothNo'))

  useEffect(
    () => {
      const target = $(`div[uid='${lastClicked}']`).parent()
      if (myRef.current && target.length > 0) {
        const v = $(myRef.current).scrollTop() + target.position().top
        $(myRef.current).animate(
          {
            scrollTop: v,
          },
          0,
        )
      }
    },
    [
      selected,
    ],
  )
  return (
    <div>
      <div
        ref={myRef}
        style={{
          // height: selected ? 300 : 'auto',
          height: '50vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
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

          return (
            <React.Fragment>
              {k.find((o) => o.target.indexOf('top') > 0) && (
                <SortItem {...cfg} item={k.filter((o) => o.name === 'root')} />
              )}
              <SortItem {...cfg} item={k.filter((o) => o.name !== 'root')} />
              {k.find((o) => o.target.indexOf('bottom') > 0) && (
                <SortItem {...cfg} item={k.filter((o) => o.name === 'root')} />
              )}
            </React.Fragment>
          )
        })}
      </div>
      {selected && (
        <OutlinedTextField
          // autoFocus
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

// export default React.memo(
//   Diagnosis,
//   (
//     { dentalChartComponent },
//     { dentalChartComponent: dentalChartComponentNext },
//   ) => {
//     console.log(dentalChartComponent, dentalChartComponent)
//     return _.isEqual(
//       dentalChartComponent.selected,
//       dentalChartComponentNext.selected,
//     )
//   },
// )
export default Diagnosis
