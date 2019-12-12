import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AddCircle from '@material-ui/icons/AddCircle'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
import Search from '@material-ui/icons/Search'

import {
  Button,
  GridContainer,
  GridItem,
  Card,
  CardBody,
  TextField,
  ProgressButton,
} from '@/components'

const styles = () => ({
  list: {
    width: '100%',
    overflow: 'auto',
    height: '200px',
  },
})

const Transfer = ({
  items,
  addedItems,
  classes,
  label,
  limitTitle,
  limit,
  setFieldValue,
  fieldName,
  searchLabel,
}) => {
  if (!items || items.length === 0) return null

  const initAddList = items.filter(
    (x) =>
      !addedItems.find(
        (y) => x.medicationPrecautionFK === y.medicationPrecautionFK,
      ),
  )

  const [
    addedList,
    setAddedList,
  ] = useState(initAddList || [])

  const [
    removedList,
    setRemovedList,
  ] = useState(addedItems || [])

  const [
    searchField,
    setSearchField,
  ] = useState('')

  const [
    search,
    setSearch,
  ] = useState('')

  const getUnusedItem = () => {
    const unusedItem = _.differenceWith(items, removedList, _.isEqual)
    return unusedItem
  }

  useEffect(
    () => {
      const getUnusedItemList = getUnusedItem()
      if (search !== '') {
        const filteredList = getUnusedItemList.filter((o) => {
          return o.value.toLowerCase().indexOf(search) >= 0
        })
        setAddedList(filteredList)
      } else {
        setAddedList(getUnusedItemList)
      }
    },
    [
      search,
    ],
  )

  const addClick = (fk) => () => {
    const removedItem = items.find((o) => o.medicationPrecautionFK === fk)
    const tempList = [
      ...removedList,
      removedItem,
    ]
    setRemovedList(tempList)
    if (setFieldValue && fieldName) {
      setFieldValue(fieldName, tempList)
    }
    setAddedList(addedList.filter((o) => o.medicationPrecautionFK !== fk))

    // setAddedList([
    //   ...addedList.slice(0, index),
    //   ...addedList.slice(index + 1, addedList.length),
    // ])
  }

  const removeClick = (fk) => () => {
    const addedItem = items.find((o) => o.medicationPrecautionFK === fk)

    setAddedList([
      ...addedList,
      addedItem,
    ])
    // const tempList = [
    //   ...removedList.slice(0, index),
    //   ...removedList.slice(index + 1, removedList.length),
    // ]
    const currentRemovedList = removedList.filter(
      (o) => o.medicationPrecautionFK !== fk,
    )
    setRemovedList(currentRemovedList)
    if (setFieldValue && fieldName) {
      setFieldValue(fieldName, currentRemovedList)
    }
  }

  const removeAll = () => {
    setRemovedList([])
    if (setFieldValue && fieldName) {
      setFieldValue(fieldName, [])
    }
    setAddedList([
      ...addedList,
      ...removedList,
    ])
  }
  return (
    <GridContainer>
      <GridItem xs={6} style={{ paddingLeft: 0 }}>
        <GridContainer>
          <GridItem xs={10}>
            <TextField
              label={searchLabel || 'Search'}
              value={searchField}
              onChange={(event) => {
                setSearchField(event.target.value)
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <Button
              variant='contained'
              color='primary'
              icon={<Search />}
              onClick={() => {
                setSearch(searchField)
              }}
            >
              Search
            </Button>
          </GridItem>
          <GridItem xs={12}>
            <Card>
              <CardBody>
                <List dense className={classes.list}>
                  {addedList.map((item) => {
                    return (
                      <ListItem
                        key={item.medicationPrecautionFK}
                        disabled={limit && limit === removedList.length}
                        button
                        onClick={addClick(item.medicationPrecautionFK)}
                      >
                        <ListItemText primary={`${item.value}`} />
                        <ListItemSecondaryAction>
                          <Button
                            size='sm'
                            onClick={addClick(item.medicationPrecautionFK)}
                            justIcon
                            round
                            disabled={limit && limit === removedList.length}
                            color='primary'
                          >
                            <AddCircle />
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )
                  })}
                </List>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={6}>
        <GridContainer>
          <GridItem xs={9}>
            <h6
              style={{
                marginTop: '27px ',
              }}
            >
              {limitTitle}
            </h6>
          </GridItem>
          <GridItem xs={3}>
            <Button
              color='primary'
              onClick={removeAll}
              size='sm'
              style={{
                marginTop: '27px',
                float: 'right',
              }}
            >
              Remove All
            </Button>
          </GridItem>
          <GridItem xs={12}>
            {removedList.length > 0 && (
              <Card>
                <CardBody>
                  <List dense className={classes.list}>
                    {removedList.map((item, index) => (
                      <ListItem
                        key={item.medicationPrecautionFK}
                        button
                        onClick={removeClick(item.medicationPrecautionFK)}
                      >
                        {label && (
                          <ListItemIcon style={{ paddingRight: '20px' }}>
                            {`${label} ${index + 1}`}
                          </ListItemIcon>
                        )}
                        <ListItemText primary={item.value} />
                        <ListItemSecondaryAction>
                          <Button
                            size='sm'
                            onClick={removeClick(item.medicationPrecautionFK)}
                            justIcon
                            round
                            color='primary'
                          >
                            <RemoveCircle />
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Card>
            )}
          </GridItem>
        </GridContainer>
      </GridItem>
    </GridContainer>
  )
}

Transfer.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
}

export default withStyles(styles)(Transfer)
