import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/core'
import classnames from 'classnames'
// custom component
import { GridContainer, GridItem, TextField } from '@/components'
import { FrequecyTypes } from './variables'
import { primaryColor } from '@/assets/jss'

const styles = () => ({
  container: {
    textAlign: 'center',
    marginLeft: '2px',
    marginRight: '2px',
    width: 70,
    minWidth: 'auto',
    cursor: 'pointer',
    border: 0,
    borderRadius: '4px',
    color: primaryColor,
  },
})

const FilterBar = (props) => {
  const {
    setFilterName,
    setFrequecyType,
    frequecyType,
    classes,
    type,
    selectItemCount,
  } = props
  return (
    <Fragment>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4} lg={4}>
          <TextField
            autoFocus
            label={type === '1' ? 'Medication Name' : 'Vaccination Name'}
            onChange={(e) => {
              setFilterName(e.target.value)
            }}
          />
        </GridItem>
        <GridItem xs={9} sm={9} md={6} lg={6} alignItems='center' container>
          <Fragment>
            {'Visits in past:'}
            {FrequecyTypes.map((o) => {
              return (
                <div
                  className={classnames(classes.container)}
                  style={{
                    background: frequecyType === o.id ? '#CCCCCC' : 'white',
                  }}
                  onClick={() => {
                    setFrequecyType(o.id === frequecyType ? undefined : o.id)
                  }}
                >
                  {o.label}
                </div>
              )
            })}
          </Fragment>
        </GridItem>
        <GridItem
          xs={3}
          sm={3}
          md={2}
          lg={2}
          justify='flex-end'
          alignItems='center'
          container
        >
          <span>
            <span style={{ color: 'red' }}>{selectItemCount}</span>{' '}
            {selectItemCount > 1 ? 'item(s)' : 'item'} selected
          </span>
        </GridItem>
      </GridContainer>
    </Fragment>
  )
}
export default withStyles(styles, { name: 'FilterBar' })(FilterBar)
