import React from 'react'

import _ from 'lodash'
import moment from 'moment'

import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import Delete from '@material-ui/icons/Delete'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Tooth from '../Tooth'
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

const getCellConfig = (subAry) => {
  return subAry.reduce((a, b) => {
    return {
      ...a,
      ...b,
    }
  })
}
const SortItem = ({
  dispatch,
  item,
  data,
  classes,
  index,
  selected,
  theme,
}) => {
  const ary = item
  // console.log(item)
  const valueGroups = _.groupBy(ary, 'key')
  const SortList = SortableContainer(List)
  const items = Object.values(
    _.orderBy(valueGroups, (o) => o[0].timestamp),
  ).map((o, i) => o[0].key) // Object.keys(valueGroups).map((o) => Number(o))
  // console.log(valueGroups, items)
  const onSortEnd = ({ newIndex, oldIndex }) => {
    // console.log(newIndex, oldIndex)
    if (newIndex === oldIndex) return
    let currentItems = ary.filter((o) => o.key === items[oldIndex])
    const existItems = ary.filter((o) => o.key === items[newIndex])
    currentItems = currentItems.map((o) => ({
      ...o,
      timestamp:
        newIndex > oldIndex
          ? _.maxBy(existItems, (n) => {
              return n.timestamp
            }).timestamp + 1
          : _.minBy(existItems, (n) => {
              return n.timestamp
            }).timestamp - 1,
    }))
    // console.log(currentItems, existItems)
    ary
      .filter(
        (o) =>
          o.key !== currentItems[0].key &&
          o.timestamp < currentItems[0].timestamp,
      )
      .map((o) => {
        o.timestamp -= 1
      })
    ary
      .filter(
        (o) =>
          o.key !== currentItems[0].key &&
          o.timestamp > currentItems[0].timestamp,
      )
      .map((o) => {
        o.timestamp += 1
      })

    // dispatch({
    //   type: 'dentalChartComponent/updateState',
    //   payload: {
    //     data: [
    //       ...data.filter(
    //         (o) =>
    //           (o.toothNo === Number(index) && o.key !== items[oldIndex]) ||
    //           o.toothNo !== Number(index),
    //       ),
    //       ...currentItems,
    //     ],
    //   },
    // })

    dispatch({
      type: 'dentalChartComponent/sortItems',
      payload: {
        currentItems,
        index,
        oldIndex,
        items,
      },
    })
  }
  return (
    <SortList
      // lockToContainerEdges
      key={index}
      lockAxis='y'
      distance={10}
      onSortEnd={onSortEnd}
      helperClass={classes.sortableContainer}
      classes={{
        padding: classes.toothJournal,
      }}
    >
      {items.map((j) => {
        const subAry = valueGroups[j]
        const v = subAry[0]
        if (v.action.method !== 3) v.info = subAry.map((o) => o.name).join(',')
        if (!subAry.find((o) => o.subTarget.indexOf('center') >= 0)) {
          subAry.push({
            subTarget: 'centerfull',
            action: {
              fill: 'white',
              symbol: '',
            },
          })
        }
        const { action = {}, subTarget, key } = v
        const SortableListItem = SortableElement(ListItem)
        const idx = items.indexOf(key)
        // console.log(idx)
        return (
          <SortableListItem
            key={key}
            classes={{
              root: classes.toothJournalItem,
              secondaryAction: classes.toothJournalItemSecondaryAction,
            }}
            button
            onClick={() => {
              dispatch({
                type: 'dentalChartComponent/updateState',
                payload: {
                  selected:
                    selected &&
                    v.toothNo === selected.toothNo &&
                    v.key === selected.key
                      ? undefined
                      : v,
                },
              })
            }}
            index={idx}
            selected={
              selected &&
              v.toothNo === selected.toothNo &&
              v.key === selected.key
            }
          >
            <ListItemIcon
              classes={{
                root: classes.toothIcon,
              }}
            >
              <Tooth
                width={20}
                height={20}
                paddingLeft={1}
                paddingTop={1}
                zoom={1 / 6}
                image={action.image}
                action={action}
                fill={getCellConfig(
                  subAry.map((o) => ({
                    [o.subTarget.replace('cell_', '')]: o.action
                      .chartMethodColorBlock,
                  })),
                )}
                symbol={getCellConfig(
                  subAry.map((o) => ({
                    [o.subTarget.replace('cell_', '')]: o.action
                      .chartMethodText,
                  })),
                )}
                target={v}
                // name={row.text}
              />
            </ListItemIcon>
            <ListItemText
              classes={{
                root: classes.toothJournalItemText,
              }}
              primary={
                <GridContainer gutter={0}>
                  <GridItem xs={11}>
                    <div
                      style={{
                        padding: theme.spacing(0.5, 0, 0.5, 1),
                      }}
                    >
                      #{v.toothNo}.&nbsp;
                      {moment(v.timestamp).format(dateFormatLong)} -&nbsp;
                      {action.displayValue}
                      {v.info && ` (${v.info})`.replace('(tooth)', '')}
                    </div>
                  </GridItem>
                  <GridItem
                    xs={1}
                    style={{
                      paddingTop: 2,
                    }}
                  >
                    {!v.action.dentalTreatmentFK && (
                      <Tooltip title='Delete'>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation()
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
                    )}
                  </GridItem>
                </GridContainer>
              }
            />
          </SortableListItem>
        )
      })}
    </SortList>
  )
}

// export default SortItem
export default React.memo(
  SortItem,
  ({ item, selected }, { item: itemNext, selected: selectedNext }) => {
    // console.log(item, itemNext, _.isEqual(item, itemNext))
    return _.isEqual(item, itemNext) && _.isEqual(selected, selectedNext)
  },
)
