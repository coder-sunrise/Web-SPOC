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
} from '@/components'
import Tooth from '../Tooth'

const Diagnosis = ({
  dispatch,
  theme,
  index,
  classes,
  style,
  onChange,
  mode,
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

  const getCellConfig = (subAry) => {
    return subAry.reduce((a, b) => {
      // console.log(a, b)
      return {
        ...a,
        ...b,
      }
    })
  }

  return (
    <div>
      <div
        style={{
          height: global.mainDivHeight - 115 - (selected ? 135 : 0),
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <h4>Tooth Journal</h4>
        {Object.keys(groups).map((k) => {
          const ary = groups[k]

          const valueGroups = _.groupBy(_.orderBy(ary, 'timestamp'), 'value')
          const SortList = SortableContainer(List)
          const items = Object.keys(valueGroups)
          const onSortEnd = ({ newIndex, oldIndex }) => {
            if (newIndex === oldIndex) return
            let currentItems = ary.filter((o) => o.value === items[oldIndex])
            const existItems = ary.filter((o) => o.value === items[newIndex])
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
            ary
              .filter(
                (o) =>
                  o.value !== currentItems[0].value &&
                  o.timestamp < currentItems[0].timestamp,
              )
              .map((o) => {
                o.timestamp -= 1
              })
            ary
              .filter(
                (o) =>
                  o.value !== currentItems[0].value &&
                  o.timestamp > currentItems[0].timestamp,
              )
              .map((o) => {
                o.timestamp += 1
              })

            dispatch({
              type: 'dentalChartComponent/updateState',
              payload: {
                data: [
                  ...data.filter(
                    (o) =>
                      (o.toothIndex === Number(k) &&
                        o.value !== items[oldIndex]) ||
                      o.toothIndex !== Number(k),
                  ),
                  ...currentItems,
                ],
              },
            })
          }
          return (
            <SortList
              // lockToContainerEdges
              lockAxis='y'
              distance={10}
              onSortEnd={onSortEnd}
              helperClass={classes.sortableContainer}
              classes={{
                padding: classes.toothJournal,
              }}
            >
              {items.map((j) => {
                // console.log(j, valueGroups[j])
                const subAry = valueGroups[j]
                const v = subAry[0]
                v.info = subAry.map((o) => o.name).join(',')
                // console.log(subAry)
                if (!subAry.find((o) => o.subTarget.indexOf('center') >= 0)) {
                  subAry.push({
                    subTarget: 'centerfull',
                    action: {
                      fill: 'white',
                      symbol: '',
                    },
                  })
                }
                // console.log(
                //   subAry,
                //   getCellConfig(
                //     subAry.map((o) => ({
                //       [o.subTarget.replace('cell_', '')]: o.action.fill,
                //     })),
                //   ),
                // )
                const { action = {}, subTarget, value } = v

                const SortableListItem = SortableElement(ListItem)
                // console.log(items, v)
                const idx = items.indexOf(value)

                return (
                  <SortableListItem
                    classes={{
                      root: classes.toothJournalItem,
                      secondaryAction: classes.toothJournalItemSecondaryAction,
                    }}
                    button
                    // selected={selectedIndex === 0}
                    onClick={(event) => setSelected(selected ? undefined : v)}
                    index={idx}
                    selected={v === selected}
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
                        image={action.attachments}
                        action={action}
                        fill={getCellConfig(
                          subAry.map((o) => ({
                            [o.subTarget.replace('cell_', '')]: o.action.fill,
                          })),
                        )}
                        symbol={getCellConfig(
                          subAry.map((o) => ({
                            [o.subTarget.replace('cell_', '')]: o.action.symbol,
                          })),
                        )}
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
                              #{v.toothIndex}.&nbsp;
                              {moment(v.timestamp).format(dateFormatLong)}{' '}
                              -&nbsp;
                              {action.text}
                              {v.info && ` (${v.info})`}
                            </div>
                          </GridItem>
                          <GridItem
                            xs={1}
                            style={{
                              paddingTop: 2,
                            }}
                          >
                            <Tooltip title='Delete'>
                              <IconButton
                                onClick={() => {
                                  dispatch({
                                    type:
                                      'dentalChartComponent/toggleMultiSelect',
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
                          </GridItem>
                        </GridContainer>
                      }
                    />
                  </SortableListItem>
                )
              })}
            </SortList>
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
          rows={3}
          onChange={(v) => {
            dispatch({
              type: 'dentalChartComponent/toggleSelect',
              payload: {
                ...selected,
              },
            })
            console.log(selected, v)
          }}
        />
      )}
    </div>
  )
}

export default Diagnosis
