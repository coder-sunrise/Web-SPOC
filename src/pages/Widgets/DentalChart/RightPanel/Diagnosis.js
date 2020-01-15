import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import Delete from '@material-ui/icons/Delete'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import moment from 'moment'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
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
  codetable,
  global,
  ...props
}) => {
  const { data = [] } = dentalChartComponent
  const groups = _.groupBy(data, 'toothNo')
  const [
    selected,
    setSelected,
  ] = useState()

  const getCellConfig = (subAry) => {
    return subAry.reduce((a, b) => {
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
          // height: global.mainDivHeight - 115 - (selected ? 135 : 0),
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <h4>Tooth Journal</h4>
        {Object.keys(groups).map((k) => {
          const ary = groups[k]

          const valueGroups = _.groupBy(ary, 'id')
          const SortList = SortableContainer(List)
          const items = Object.values(
            _.orderBy(valueGroups, (o) => o[0].timestamp),
          ).map((o) => o[0].id) // Object.keys(valueGroups).map((o) => Number(o))

          const onSortEnd = ({ newIndex, oldIndex }) => {
            if (newIndex === oldIndex) return
            let currentItems = ary.filter((o) => o.id === items[oldIndex])
            const existItems = ary.filter((o) => o.id === items[newIndex])
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
                  o.id !== currentItems[0].id &&
                  o.timestamp < currentItems[0].timestamp,
              )
              .map((o) => {
                o.timestamp -= 1
              })
            ary
              .filter(
                (o) =>
                  o.id !== currentItems[0].id &&
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
                      (o.toothNo === Number(k) && o.id !== items[oldIndex]) ||
                      o.toothNo !== Number(k),
                  ),
                  ...currentItems,
                ],
              },
            })
          }
          return (
            <SortList
              // lockToContainerEdges
              key={k}
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
                if (v.action.method !== 3)
                  v.info = subAry.map((o) => o.name).join(',')
                if (!subAry.find((o) => o.subTarget.indexOf('center') >= 0)) {
                  subAry.push({
                    subTarget: 'centerfull',
                    action: {
                      fill: 'white',
                      symbol: '',
                    },
                  })
                }
                const { action = {}, subTarget, id } = v
                const SortableListItem = SortableElement(ListItem)
                const idx = items.indexOf(id)

                return (
                  <SortableListItem
                    key={id}
                    classes={{
                      root: classes.toothJournalItem,
                      secondaryAction: classes.toothJournalItemSecondaryAction,
                    }}
                    button
                    onClick={() => {
                      setSelected(
                        selected &&
                        v.toothNo === selected.toothNo &&
                        v.id === selected.id
                          ? undefined
                          : v,
                      )
                    }}
                    index={idx}
                    selected={
                      selected &&
                      v.toothNo === selected.toothNo &&
                      v.id === selected.id
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
                              {moment(v.timestamp).format(dateFormatLong)}{' '}
                              -&nbsp;
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
