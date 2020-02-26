import React, { useState, useEffect, useMemo } from 'react'
import _ from 'lodash'
import Search from '@material-ui/icons/Search'
import {
  withStyles,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core'

import Tooth from '../Tooth'

import { TextField, Accordion } from '@/components'

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
  dentalChartComponent,
  ...props
}) => {
  const { ctchartmethod = [], cttreatment = [] } = codetable
  const [
    search,
    setSearch,
  ] = useState()
  const [
    treatments,
    setTreatments,
  ] = useState([])
  const [
    expanded,
    setExpanded,
  ] = useState([])
  const [
    expandedItems,
    setExpandedItems,
  ] = useState([])
  const [
    selected,
    setSelected,
  ] = useState([])
  useEffect(
    () => {
      // console.log(cttreatment)
      let treeItems = Object.values(
        _.groupBy(
          cttreatment.filter(
            (o) =>
              !o.isDisplayInDiagnosis &&
              (!search ||
                o.displayValue.toUpperCase().indexOf(search.toUpperCase()) >=
                  0),
          ),
          'treatmentCategoryFK',
        ),
      ).map((o) => {
        return {
          code: o[0].treatmentCategory.code,
          text: o[0].treatmentCategory.displayValue,
          subItems: o.map((m) => {
            const action =
              ctchartmethod.find((n) => n.id === m.chartMethodFK) || {}
            return {
              id: m.id,
              text: m.displayValue,
              chartMethodFK: m.chartMethodFK,
              action,
            }
          }),
        }
      })
      if (search && expanded.length > 0) {
        treeItems = treeItems.reduce((a, b) => {
          if (
            expandedItems.length === 0 ||
            expandedItems.find((o) => o.code === b.code)
          ) {
            return a.concat(b)
          }
          return a
        }, [])
      }

      setTreatments(treeItems)
      if (search) {
        setExpanded(treeItems.map((o, i) => i))
      } else {
        setExpanded([])
        setExpandedItems([])
      }
    },
    [
      cttreatment,
      search,
    ],
  )

  const { action = {} } = dentalChartComponent
  useEffect(
    () => {
      setSelected(action.dentalTreatmentFK)
    },
    [
      action,
    ],
  )
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
          preventDefaultKeyDownEvent
        />
        <Accordion
          activedKeys={expanded}
          onChange={(event, p, isExpand) => {
            const idx = expanded.indexOf(p.key)
            if (idx >= 0 && !isExpand) {
              expanded.splice(idx, 1)
              setExpandedItems(
                expandedItems.filter((o) => o.code !== p.prop.code),
              )
              setExpanded(expanded)
            } else if (idx < 0 && isExpand) {
              expanded.push(p.key)
              setExpanded(expanded)
              expandedItems.push(p.prop)
              setExpandedItems(expandedItems)
            }
          }}
          mode='multiple'
          // mode={this.state.searchText.length > 0 ? 'multiple' : 'default'}
          collapses={treatments.map((item) => {
            return {
              title: item.text,
              code: item.code,
              content: (
                <List style={{ width: '100%' }}>
                  {item.subItems.map((o) => {
                    return (
                      <ListItem
                        key={o.id}
                        button
                        className={classes.treatmentListItem}
                        selected={selected === o.id}
                        onClick={() => {
                          dispatch({
                            type: 'dentalChartComponent/updateState',
                            payload: {
                              mode: 'treatment',
                              action: {
                                ...o.action,
                                dentalTreatmentFK: o.id,
                              },
                            },
                          })

                          dispatch({
                            type: 'orders/updateState',
                            payload: {
                              type: '7',
                            },
                          })
                          setSelected(o.id)
                        }}
                      >
                        <ListItemIcon>
                          <div
                            style={{ position: 'absolute', top: 3, left: 15 }}
                          >
                            {!_.isEmpty(o.action) && (
                              <Tooth
                                width={24}
                                height={24}
                                zoom={1 / 7}
                                image={o.action.image}
                                action={o.action}
                                fill={{
                                  left:
                                    o.action.chartMethodColorBlock || 'white',
                                  right:
                                    o.action.chartMethodColorBlock || 'white',
                                  top:
                                    o.action.chartMethodColorBlock || 'white',
                                  bottom:
                                    o.action.chartMethodColorBlock || 'white',
                                  centerfull:
                                    o.action.chartMethodColorBlock || 'white',
                                }}
                                symbol={{
                                  left: o.action.chartMethodText,
                                  right: o.action.chartMethodText,
                                  top: o.action.chartMethodText,
                                  bottom: o.action.chartMethodText,
                                  centerfull: o.action.chartMethodText,
                                }}
                              />
                            )}
                          </div>
                        </ListItemIcon>
                        <ListItemText primary={o.text} />
                      </ListItem>
                    )
                  })}
                </List>
              ),
            }
          })}
        />
      </div>
    </div>
  )
}

export default React.memo(
  Treatment,
  (
    { codetable, dentalChartComponent },
    {
      codetable: codetableNext,
      dentalChartComponent: dentalChartComponentNext,
    },
  ) => {
    return (
      codetable.cttreatment === codetableNext.cttreatment &&
      codetable.ctchartmethod === codetableNext.ctchartmethod &&
      dentalChartComponent.action === dentalChartComponentNext.action
    )
  },
)
