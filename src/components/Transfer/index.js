import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AddCircle from '@material-ui/icons/AddCircle'
import RemoveCircle from '@material-ui/icons/RemoveCircle'

import {
  Button,
  GridContainer,
  GridItem,
  Card,
  CardBody,
  TextField,
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
}) => {
  const [
    addedList,
    setAddedList,
  ] = useState(items || [])

  const [
    removedList,
    setRemovedList,
  ] = useState([])

  const [
    searchField,
    setSearchField,
  ] = useState('')

  useEffect(
    () => {
      setAddedList(items || [])
    },
    [
      items,
    ],
  )

  useEffect(
    () => {
      if (addedItems) {
        const filter = addedList.filter((x) =>
          addedItems.find(
            (y) => x.medicationPrecautionFK === y.medicationPrecautionFK,
          ),
        )
        initAddedItems(filter)
      }
    },
    [
      addedItems,
    ],
  )

  const initAddedItems = (items) => {
    setRemovedList(items)

    const tempList = addedList.filter(
      (x) =>
        !items.find(
          (y) => x.medicationPrecautionFK === y.medicationPrecautionFK,
        ),
    )

    setAddedList(tempList)
  }

  const addClick = (index) => () => {
    const tempList = [
      ...removedList,
      ...addedList.slice(index, index + 1),
    ]
    setRemovedList(tempList)
    if (setFieldValue && fieldName) {
      setFieldValue(fieldName, tempList)
    }

    setAddedList([
      ...addedList.slice(0, index),
      ...addedList.slice(index + 1, addedList.length),
    ])
  }

  const removeClick = (index) => () => {
    setAddedList([
      ...addedList,
      ...removedList.slice(index, index + 1),
    ])
    const tempList = [
      ...removedList.slice(0, index),
      ...removedList.slice(index + 1, removedList.length),
    ]
    setRemovedList(tempList)
    if (setFieldValue && fieldName) {
      setFieldValue(fieldName, tempList)
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
      <GridItem xs={6}>
        <GridContainer>
          <GridItem xs={12}>
            <TextField
              label='Search'
              onChange={(event) => setSearchField(event.target.value)}
              value={searchField}
            />{' '}
          </GridItem>
          <GridItem xs={12}>
            <Card>
              <CardBody>
                <List dense className={classes.list}>
                  {addedList.map((item, index) => (
                    <ListItem
                      key={item.id}
                      disabled={limit && limit === removedList.length}
                      button
                      onClick={addClick(index)}
                    >
                      <ListItemText primary={`${item.value}`} />
                      <ListItemSecondaryAction>
                        <Button
                          size='sm'
                          onClick={addClick(index)}
                          justIcon
                          round
                          disabled={limit && limit === removedList.length}
                          color='primary'
                        >
                          <AddCircle />
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
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
                        key={item.id}
                        button
                        onClick={removeClick(index)}
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
                            onClick={removeClick(index)}
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
