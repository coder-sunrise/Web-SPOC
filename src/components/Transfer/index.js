import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import { AddCircle, RemoveCircle } from '@material-ui/icons'
import {
  Button,
  GridContainer,
  GridItem,
  Card,
  CardBody,
  TextField,
} from '@/components'

const styles = (theme) => ({
  list: {
    width: '100%',
    overflow: 'auto',
    height: '200px',
  },
})

class Transfer extends React.Component {
  constructor(props) {
    super(props)
    const { items } = props
    this.state = {
      addedList: items || [],
      removedList: [],
      searchField: '',
    }
  }

  addClick = (index) => () => {
    const { removedList, addedList } = this.state
    this.setState({
      removedList: [
        ...removedList,
        ...addedList.slice(index, index + 1),
      ],
      addedList: [
        ...addedList.slice(0, index),
        ...addedList.slice(index + 1, addedList.length),
      ],
    })
  }

  removeClick = (index) => () => {
    const { removedList, addedList } = this.state
    this.setState({
      addedList: [
        ...addedList,
        ...removedList.slice(index, index + 1),
      ],
      removedList: [
        ...removedList.slice(0, index),
        ...removedList.slice(index + 1, removedList.length),
      ],
    })
  }

  removeAll = () => {
    const { removedList, addedList } = this.state
    this.setState({
      removedList: [],
      addedList: [
        ...addedList,
        ...removedList,
      ],
    })
  }

  onChange = (event) => {
    this.setState({
      searchField: event.target.value,
    })
  }

  render() {
    const { classes,type } = this.props
    const { addedList, removedList } = this.state

    return (
      <GridContainer>
        <GridItem xs={6}>
          <TextField
            label='Search'
            onChange={this.onChange}
            value={this.state.searchField}
          />
          <Card>
            <CardBody>
              <List dense className={classes.list}>
                {addedList.map((value, index) => (
                  <ListItem key={index} button onClick={this.addClick(index)}>
                    <ListItemText primary={`${value}`} />
                    <ListItemSecondaryAction>
                      <Button
                        size='sm'
                        onClick={this.addClick(index)}
                        justIcon
                        round
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
        <GridItem xs={6}>
          <Button
            color='primary'
            onClick={this.removeAll}
            size='sm'
            style={{
              marginTop: '27px',
            }}
          >
            Remove All
          </Button>
          {removedList.length > 0 && (
            <Card>
              <CardBody>
                <List dense className={classes.list}>
                  {removedList.map((value, index) => (
                    <ListItem
                      key={value}
                      button
                      onClick={this.removeClick(index)}
                    >
                      {`${type}` === 'Setting' && <ListItemText primary={'Precaution ' + `${index + 1}`} />}
                      <ListItemText primary={value} />
                      <ListItemSecondaryAction>
                        <Button
                          size='sm'
                          onClick={this.removeClick(index)}
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
    )
  }
}

Transfer.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
}

export default withStyles(styles)(Transfer)
