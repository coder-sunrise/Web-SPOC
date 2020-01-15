import React, { useState, useEffect, useMemo } from 'react'
import _ from 'lodash'
import Search from '@material-ui/icons/Search'

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
  global,
  codetable,
  ...props
}) => {
  const { ctchartmethod = [] } = codetable
  const [
    search,
    setSearch,
  ] = useState()
  const [
    treatments,
    setTreatments,
  ] = useState([])
  useEffect(() => {
    const { cttreatment = [] } = codetable
    // console.log(list)
    const treeItems = Object.values(
      _.groupBy(
        cttreatment.filter((o) => !o.isDisplayInDiagnosis),
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
  }, [])

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
              const action = ctchartmethod.find(
                (o) => o.id === item.chartMethodFK,
              )
              dispatch({
                type: 'dentalChartComponent/updateState',
                payload: {
                  mode: 'treatment',
                  action: {
                    ...action,
                    dentalTreatmentFK: item.id,
                  },
                },
              })

              dispatch({
                type: 'orders/updateState',
                payload: {
                  type: '7',
                },
              })
            }
          }}
        />
      </div>
    </div>
  )
}

export default React.memo(
  Treatment,
  ({ codetable }, { codetable: codetableNext }) => {
    return codetable.cttreatment === codetableNext.cttreatment
  },
)
