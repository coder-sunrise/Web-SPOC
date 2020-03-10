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

const DiagnosisSub = ({
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
  const [
    shapes,
    setShapes,
  ] = useState([])
  const [
    height,
    setHeight,
  ] = useState([])
  // console.log(data)
  const myRef = useRef(null)
  const groups = Object.values(_.groupBy(data, 'toothNo'))

  useEffect(() => {
    // console.log(
    //   $(myRef.current).closest('.journalContainer'),
    //   $(myRef.current).closest('.journalContainer').height(),
    // )
    const containerHeight = $(myRef.current)
      .closest('.journalContainer')
      .height()
    if (containerHeight) {
      setHeight(containerHeight - 77)
    }
  }, [])

  useEffect(
    () => {
      if (!selected || window._tempDisableEvent) return
      // console.log(`${selected.id}${selected.target}`)
      const target = $(`div[uid='${selected.id}${selected.target}']`).parent()
      if (myRef.current && target.length > 0) {
        const v = $(myRef.current).scrollTop() + target.position().top
        // console.log($(myRef.current).scrollTop(), target.position().top)

        $(myRef.current).animate(
          {
            scrollTop: v,
          },
          0,
        )
      }
      setShapes(
        selected
          ? data.filter(
              (o) => o.toothNo === selected.toothNo && o.id === selected.id,
            )
          : [],
      )
    },
    [
      selected,
    ],
  )

  return (
    <div
      ref={myRef}
      style={{
        height: selected ? height - 120 : height,
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
  )
}

export default React.memo(
  DiagnosisSub,
  (
    { dentalChartComponent },
    { dentalChartComponent: dentalChartComponentNext },
  ) => {
    // console.log(dentalChartComponent, dentalChartComponent)
    return _.isEqual(dentalChartComponent.data, dentalChartComponentNext.data)
  },
)
// export default DiagnosisSub
