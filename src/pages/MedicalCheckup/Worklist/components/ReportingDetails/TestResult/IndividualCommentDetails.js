import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import _ from 'lodash'
import {
  CodeSelect,
  GridContainer,
  GridItem,
  MultipleTextField,
  IconButton,
  withFormikExtend,
  FastField,
  TextField,
  Tooltip,
} from '@/components'
import { Button } from 'antd'
import { connect } from 'dva'
import { List, ListItem, ListItemText, withStyles } from '@material-ui/core'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const styles = theme => ({
  listRoot: {
    width: '100%',
  },
  listItemRoot: {
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: '0.85em',
  },
})

@connect(({ medicalCheckupReportingDetails }) => ({
  medicalCheckupReportingDetails,
}))
@withFormikExtend({
  mapPropsToValues: ({ medicalCheckupReportingDetails }) => {
    return medicalCheckupReportingDetails.individualCommentEntity || {}
  },
  validationSchema: Yup.object().shape({
    comment: Yup.string().required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch, onConfirm } = props
  },
  enableReinitialize: true,
  displayName: 'IndividualCommentDetails',
})
class IndividualCommentDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { selectedItem: {}, searchValue: undefined }
  }
  generateComment = () => {
    const { setFieldValue } = this.props
    const { selectedItem } = this.state
    const keys = Object.keys(selectedItem)
    setFieldValue(
      'tempComment',
      keys.map(key => selectedItem[key].displayValue).join(' '),
    )
  }

  getSelection = group => {
    const { selectedItem, searchValue = '' } = this.state
    return (
      <List
        style={{
          width: 100,
        }}
        component='nav'
        classes={{
          root: this.props.classes.listRoot,
        }}
        disablePadding
        onClick={() => {}}
      >
        {group.list
          .filter(
            item =>
              item.displayValue
                .toUpperCase()
                .indexOf(searchValue.toUpperCase()) >= 0,
          )
          .map(item => {
            return (
              <ListItem
                alignItems='flex-start'
                classes={{
                  root: this.props.classes.listItemRoot,
                }}
                selected={selectedItem[group.groupNo]?.id === item.id}
                divider
                disableGutters
                button
                onClick={() => {
                  this.setState(
                    {
                      selectedItem: {
                        ...selectedItem,
                        [group.groupNo]: { ...item },
                      },
                    },
                    this.generateComment,
                  )
                }}
              >
                <Tooltip title={item.displayValue}>
                  <div
                    style={{
                      width: '100%',
                      marginLeft: 2,
                      fontSize: '0.8rem',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.displayValue}
                  </div>
                </Tooltip>
              </ListItem>
            )
          })}
      </List>
    )
  }

  insertComment = () => {
    const { values, setFieldValue } = this.props
    const { editIndividualComment, tempComment } = values
    if (
      tempComment === null ||
      tempComment === undefined ||
      !tempComment.trim().length
    ) {
      return
    }
    setFieldValue('editIndividualComment', [
      ...editIndividualComment,
      { id: 6, comment: tempComment },
    ])

    this.setState({ selectedItem: {} })
    setFieldValue('tempComment', undefined)
  }
  render() {
    const { values, commentGroupList = [], height } = this.props
    const { editIndividualComment = [] } = values
    const categoryListHeight = height - 260
    return (
      <div
        style={{
          position: 'relative',
          border: '1px solid #CCCCCC',
          backgroundColor: 'white',
        }}
      >
        <div style={{ padding: '0px 8px 8px 8px' }}>
          <TextField
            inputProps={{ placeholder: 'Enter Keyworks' }}
            onChange={e => {
              this.setState({ searchValue: e.target.value })
            }}
          />
        </div>
        <div style={{ width: commentGroupList.length ? 'auto' : '400px' }}>
          {commentGroupList.map(group => {
            return (
              <div
                style={{
                  display: 'inline-block',
                  overflow: 'auto',
                  height: categoryListHeight,
                  borderLeft: '1px solid #CCCCCC',
                  borderBottom: '1px solid #CCCCCC',
                }}
              >
                {this.getSelection(group)}
              </div>
            )
          })}
        </div>
        <div style={{ padding: '4px 35px 4px 8px', position: 'relative' }}>
          <FastField
            name='tempComment'
            render={args => (
              <TextField
                inputProps={{ placeholder: 'Enter Comment' }}
                {...args}
              />
            )}
          />
          <Button
            size='small'
            type='primary'
            style={{ position: 'absolute', right: 4, top: 4 }}
            onClick={this.insertComment}
            icon={<PlusOutlined />}
          ></Button>
        </div>
        <div style={{ height: 90, overflow: 'auto' }}>
          {editIndividualComment.map(item => {
            return (
              <div
                style={{
                  position: 'relative',
                  paddingLeft: 8,
                  paddingRight: 30,
                }}
              >
                <TextField value={item.comment} />
                <IconButton
                  style={{
                    color: 'red',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                  }}
                >
                  <MinusCircleOutlined />
                </IconButton>
              </div>
            )
          })}
        </div>
        <Button
          size='small'
          type='primary'
          style={{ margin: 8 }}
          onClick={e => {
            const { handleSubmit } = this.props
            if (handleSubmit) handleSubmit()
          }}
        >
          Save Comment
        </Button>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(IndividualCommentDetails)
