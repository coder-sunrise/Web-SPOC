import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Search, Add, GridOn } from '@material-ui/icons'
import { withStyles, Tooltip } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { getAppendUrl } from '@/utils/utils'
import { status } from '@/utils/codes'

import {
  CommonModal,
  GridContainer,
  GridItem,
  Select,
  Button,
  TextField,
  NumberField,
  Checkbox,
  CodeSelect,
} from '@/components'

const styles = (theme) => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    // paddingTop: '13px',
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
    right: 14,
  },
})

@withFormik({
  mapPropsToValues: () => {},
})
class FilterBar extends PureComponent {
  render () {
    const { classes, theme, dispatch, scheme } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={4}>
            <FastField
              name='schemeName'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'finance.scheme.search.name',
                    })}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>

          <GridItem xs={6} md={4}>
            <FastField
              name='schemeNameType'
              render={(args) => {
                return (
                  <CodeSelect
                    label={formatMessage({
                      id: 'finance.scheme.search.type',
                    })}
                    code='Gender'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='schemeCategory'
              render={(args) => {
                return (
                  <CodeSelect
                    label={formatMessage({
                      id: 'finance.scheme.search.category',
                    })}
                    code='Gender'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='Co-Pyaer Name'
              render={(args) => {
                return (
                  <CodeSelect
                    label={formatMessage({
                      id: 'finance.scheme.search.cpname',
                    })}
                    code='Gender'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='Co-Pyaer Type'
              render={(args) => {
                return (
                  <CodeSelect
                    label={formatMessage({
                      id: 'finance.scheme.search.cptype',
                    })}
                    code='Gender'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='Status'
              render={(args) => {
                return (
                  <CodeSelect
                    label={formatMessage({
                      id: 'finance.scheme.search.status',
                    })}
                    code='Gender'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <div className={classes.filterBtn}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'scheme/query',
                  })
                }}
              >
                <Search />
                <FormattedMessage id='form.search' />
              </Button>

              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  this.props.history.push('/inventory/master/scheme')
                }}
              >
                <Add />
                Add New
              </Button>

              {/* <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'scheme/updateState',
                    payload: {
                      showBatchEditModal: true,
                    },
                  })
                }}
              >
                <GridOn />
                Batch Edit
              </Button> */}
            </div>
          </GridItem>
        </GridContainer>
        {/* <CommonModal
          open={scheme.showBatchEditModal}
          title='Batch Edit'
          bodyNoPadding
          onClose={() => {
            dispatch({
              type: 'scheme/updateState',
              payload: {
                showBatchEditModal: false,
              },
            })
          }}
          // onConfirm={this.toggleModal}
          fullScreen
          showFooter={false}
        >
          <ExcelGrid />
        </CommonModal> */}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FilterBar)
