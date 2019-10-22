import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { FormattedMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import {
  CodeSelect,
  GridContainer,
  GridItem,
  Button,
  ProgressButton,
  DateRangePicker,
} from '@/components'
// medisys components

const styles = (theme) => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
  tansactionCheck: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    right: 0,
  },
})

@withFormik({
  mapPropsToValues: () => {
    return {
      roomBlockGroupFK: [],
    }
  },
  handleSubmit: () => {},
})
class Filter extends PureComponent {
  render () {
    const { classes, values } = this.props

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='roomBlockGroupFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Room'
                    code='ctRoom'
                    mode='multiple'
                    // allValue={-99}
                    maxTagCount={values.roomBlockGroupFK.length > 1 ? 0 : 1}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='dates'
              render={(args) => {
                return (
                  <DateRangePicker
                    label='Start Date'
                    label2='End Date'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='roomBlockRecurrenceFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Recurrence Type'
                    code='LTRecurrencePattern'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          {/* <GridItem xs={6} md={3}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingRoomBlock/query',
                    payload: this.props.values,
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingRoomBlock/updateState',
                    payload: {
                      entity: undefined,
                    },
                  })
                  this.props.toggleModal()
                }}
              >
                Add New
              </Button>
            </div>
          </GridItem> */}
        </GridContainer>

        <GridContainer>
          <GridItem xs={6} md={4}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  const {
                    dates,
                    roomBlockRecurrenceFK,
                    roomBlockGroupFK,
                  } = this.props.values

                  let stringRoomBlockGroupFK = Number(roomBlockGroupFK)
                  let type = 'RoomBlockGroupFkNavigation.RoomFK'
                  if (roomBlockGroupFK.length > 1) {
                    type = 'in_RoomBlockGroupFkNavigation.RoomFK'
                    stringRoomBlockGroupFK = roomBlockGroupFK.join('|')
                  }

                  this.props
                    .dispatch({
                      type: 'roomBlock/query',
                      payload: {
                        [type]:
                          stringRoomBlockGroupFK === 0
                            ? undefined
                            : stringRoomBlockGroupFK,

                        'RoomBlockGroupFkNavigation.RoomBlockRecurrenceFkNavigation.RecurrencePatternFK': roomBlockRecurrenceFK,
                        lgteql_startDateTime: dates ? dates[0] : undefined,
                        lsteql_endDateTime: dates ? dates[1] : undefined,
                      },
                    })
                    .then(() => {
                      this.props.dispatch({
                        type: 'roomBlock/updateState',
                        payload: {
                          filter: undefined,
                        },
                      })
                    })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.toggleModal()
                  // this.props.dispatch({
                  //   type: 'roomBlock/reset',
                  // })
                }}
              >
                Add New
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'RoomBlockSetting' })(Filter)
