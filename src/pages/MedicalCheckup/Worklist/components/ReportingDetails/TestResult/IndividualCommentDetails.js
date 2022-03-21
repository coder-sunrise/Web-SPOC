import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import _ from 'lodash'
import { Button } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import { getUniqueId } from '@/utils/utils'
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
  FieldArray,
  Field,
  notification,
} from '@/components'
import { List, ListItem, ListItemText, withStyles } from '@material-ui/core'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'

const styles = theme => ({
  listRoot: {
    width: '100%',
  },
  listItemRoot: {
    padding: 4,
    fontSize: '0.85em',
  },
  listItemText: {
    width: '100%',
    marginLeft: 2,
    fontSize: '0.8rem',
  },
  rootPanel: {
    position: 'relative',
    border: '1px solid #CCCCCC',
    backgroundColor: 'white',
    width: 610,
  },
})

@connect(({ medicalCheckupReportingDetails, user }) => ({
  medicalCheckupReportingDetails,
  user,
}))
@withFormikExtend({
  mapPropsToValues: ({ medicalCheckupReportingDetails }) => {
    return medicalCheckupReportingDetails.individualCommentEntity || {}
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props }) => {
    const {
      medicalCheckupReportingDetails,
      dispatch,
      onConfirm,
      saveComment = () => {},
    } = props
    const {
      medicalCheckupIndividualComment,
      medicalCheckupSummaryComment,
      medicalCheckupWorkitemDoctor,
      medicalCheckupReport,
      ...resetValue
    } = medicalCheckupReportingDetails.entity
    let newComents = values.medicalCheckupIndividualComment.filter(
      item => item.id || !item.isDeletd,
    )
    let index = 0
    newComents.forEach(item => {
      if (
        item.originalJapaneseComment !== item.japaneseComment ||
        item.originalEnglishComment !== item.englishComment
      ) {
        item.isCustomized = true
      }
      if (!item.isDeleted) {
        item.sequence = index
        index = index + 1
      }
    })
    const newValue = {
      ...resetValue,
      medicalCheckupIndividualComment: newComents,
    }
    dispatch({
      type: 'medicalCheckupReportingDetails/upsert',
      payload: { ...newValue },
    }).then(r => {
      if (r) {
        saveComment()
      }
    })
  },
  enableReinitialize: true,
  displayName: 'IndividualCommentDetails',
})
class IndividualCommentDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { selectedItem: {}, searchValue: undefined }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.medicalCheckupReportingDetails.isNeedToClearIndividualComment
    ) {
      const { dispatch } = this.props
      this.setState({
        selectedItem: {},
        searchValue: undefined,
        englishComment: undefined,
        originalEnglishComment: undefined,
        japaneseComment: undefined,
        originalJapaneseComment: undefined,
      })
      dispatch({
        type: 'medicalCheckupReportingDetails/updateState',
        payload: {
          isNeedToClearIndividualComment: false,
        },
      })
    }
  }

  generateComment = () => {
    const { setFieldValue } = this.props
    const { selectedItem } = this.state
    const keys = Object.keys(selectedItem)
    let englishComment
    let japaneseComment
    keys.forEach(key => {
      const selectGroupItems = selectedItem[key] || []
      const strEnglish = selectGroupItems
        .map(
          item =>
            item.translationData
              .find(l => l.language === 'EN')
              ?.list?.find(l => (l.key = 'displayValue'))?.value,
        )
        .join(' ')
      englishComment = `${
        englishComment ? `${englishComment} ` : ''
      }${strEnglish}`

      const strJapanese = selectGroupItems
        .map(
          item =>
            item.translationData
              .find(l => l.language === 'JP')
              ?.list?.find(l => (l.key = 'displayValue'))?.value,
        )
        .join(' ')
      japaneseComment = `${
        japaneseComment ? `${japaneseComment} ` : ''
      }${strJapanese}`
    })

    this.setState({
      englishComment: englishComment,
      originalEnglishComment: englishComment,
      japaneseComment: japaneseComment,
      originalJapaneseComment: japaneseComment,
    })
  }

  onCategoryChange = (group, item) => {
    this.setState(
      preState => {
        let selectGroupItems = preState.selectedItem[group.groupNo] || []
        let selectItem = selectGroupItems.find(i => i.id === item.id)
        if (selectItem) {
          selectGroupItems = selectGroupItems.filter(i => i.id !== item.id)
        } else {
          selectGroupItems = [...selectGroupItems, { ...item }]
        }
        return {
          ...preState,
          selectedItem: {
            ...preState.selectedItem,
            [group.groupNo]: [...selectGroupItems],
          },
        }
      },
      () => {
        document.activeElement.blur()
        this.generateComment()
      },
    )
  }

  getSelection = group => {
    const { selectedItem, searchValue = '' } = this.state
    const {
      selectedLanguage,
      commentGroupList = [],
      isModifyCommentEnable,
    } = this.props
    const listItems = group.list.filter(
      item =>
        item.displayValue.toUpperCase().indexOf(searchValue.toUpperCase()) >= 0,
    )
    if (!listItems.length)
      return (
        <div
          style={{
            width: 100,
            textAlign: 'center',
            color: '#cccccc',
            paddingTop: 8,
          }}
        >
          No data
        </div>
      )
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
        {listItems.map(item => {
          const showValue = item.translationData
            .find(l => l.language === selectedLanguage)
            ?.list?.find(l => (l.key = 'displayValue'))?.value

          const isSelected = selectedItem[group.groupNo]?.find(
            i => i.id === item.id,
          )

          let isNextGroupSelect
          for (
            let index = group.groupNo;
            index < commentGroupList.length;
            index++
          ) {
            if ((selectedItem[commentGroupList[index].groupNo] || []).length) {
              isNextGroupSelect = true
              break
            }
          }

          return (
            <ListItem
              alignItems='flex-start'
              classes={{
                root: this.props.classes.listItemRoot,
              }}
              selected={isSelected}
              divider
              disableGutters
              button
              disabled={!isModifyCommentEnable || isNextGroupSelect}
              onClick={() => this.onCategoryChange(group, item)}
            >
              <Tooltip title={showValue}>
                <div className={this.props.classes.listItemText}>
                  {showValue}
                </div>
              </Tooltip>
            </ListItem>
          )
        })}
      </List>
    )
  }

  insertComment = () => {
    const { values, setFieldValue, user } = this.props
    const { medicalCheckupIndividualComment, selectExaminationItemId } = values

    const {
      originalJapaneseComment,
      japaneseComment,
      originalEnglishComment,
      englishComment,
    } = this.state

    if (
      (!hasValue(japaneseComment) || !japaneseComment.trim().length) &&
      (!hasValue(englishComment) || !englishComment.trim().length)
    ) {
      notification.warning({
        message: 'Please input comment.',
      })
      return
    }

    setFieldValue('medicalCheckupIndividualComment', [
      ...medicalCheckupIndividualComment,
      {
        uid: getUniqueId(),
        examinationItemFK: selectExaminationItemId,
        originalJapaneseComment,
        japaneseComment,
        originalEnglishComment,
        englishComment,
        commentDate: moment(),
        commentByUserFK: user.data.clinicianProfile.userProfile.id,
      },
    ])

    this.setState({
      selectedItem: {},
      searchValue: undefined,
      englishComment: undefined,
      originalEnglishComment: undefined,
      japaneseComment: undefined,
      originalJapaneseComment: undefined,
    })
  }

  onDiscard = () => {
    const { clearEditComment } = this.props
    clearEditComment()
  }

  updateComment = i => {
    const { form } = this.ArrayHelpers
    const { setFieldValue } = form
    setFieldValue(`medicalCheckupIndividualComment[${i}].isVerified`, false)
  }

  render() {
    const {
      values,
      commentGroupList = [],
      height,
      selectedLanguage,
      handleSubmit,
      setFieldValue,
      classes,
      isModifyCommentEnable,
      isModifyOthersCommentEnable,
      user,
    } = this.props
    const { englishComment, japaneseComment, searchValue } = this.state
    const { medicalCheckupIndividualComment = [] } = values
    const categoryListHeight = height - 263
    const isAnyChange = !_.isEmpty(
      window.dirtyForms['IndividualCommentDetails'],
    )
    return (
      <div className={classes.rootPanel}>
        <div style={{ padding: '0px 8px 8px 8px' }}>
          <TextField
            inputProps={{ placeholder: 'Enter Keywords' }}
            onChange={e => {
              this.setState({ searchValue: e.target.value })
            }}
            value={searchValue}
            disabled={!isModifyCommentEnable}
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
                  borderTop: '1px solid #CCCCCC',
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
          <TextField
            inputProps={{ placeholder: 'Enter Comment' }}
            onChange={e => {
              if (selectedLanguage === 'EN') {
                this.setState({ englishComment: e.target.value })
              } else {
                this.setState({ japaneseComment: e.target.value })
              }
            }}
            value={selectedLanguage === 'EN' ? englishComment : japaneseComment}
            disabled={!isModifyCommentEnable}
          />
          {isModifyCommentEnable && (
            <Button
              size='small'
              type='primary'
              style={{ position: 'absolute', right: 4, top: 4 }}
              onClick={this.insertComment}
              icon={<PlusOutlined />}
            ></Button>
          )}
        </div>
        <div style={{ height: 90, overflow: 'auto' }}>
          <FieldArray
            name='medicalCheckupIndividualComment'
            render={arrayHelpers => {
              this.ArrayHelpers = arrayHelpers
              const activeRows = medicalCheckupIndividualComment.filter(
                val => !val.isDeleted,
              )
              return activeRows.map((val, index) => {
                const i = medicalCheckupIndividualComment.findIndex(
                  item => val.uid === item.uid,
                )
                const displayFieldName = `medicalCheckupIndividualComment[${i}].${
                  selectedLanguage === 'EN'
                    ? 'englishComment'
                    : 'japaneseComment'
                }`

                let isModifyEnable
                if (
                  val.commentByUserFK ===
                  user.data.clinicianProfile.userProfile.id
                ) {
                  isModifyEnable = isModifyCommentEnable
                } else {
                  isModifyEnable = isModifyOthersCommentEnable
                }

                return (
                  <div key={i}>
                    <div
                      style={{
                        position: 'relative',
                        paddingLeft: 8,
                        paddingRight: 30,
                        paddingLeft: 24,
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: 8,
                          bottom: 0,
                        }}
                      >
                        {index + 1}
                      </div>
                      <Field
                        name={displayFieldName}
                        render={args => {
                          return (
                            <TextField
                              {...args}
                              onChange={() => this.updateComment(i)}
                              disabled={!isModifyEnable}
                            />
                          )
                        }}
                      />
                      {isModifyEnable && (
                        <IconButton
                          style={{
                            color: 'red',
                            position: 'absolute',
                            right: 0,
                            top: 0,
                          }}
                          onClick={() =>
                            setFieldValue(
                              `medicalCheckupIndividualComment[${i}].isDeleted`,
                              true,
                            )
                          }
                        >
                          <MinusCircleOutlined />
                        </IconButton>
                      )}
                    </div>
                  </div>
                )
              })
            }}
          />
        </div>
        <div style={{ textAlign: 'right', margin: 8 }}>
          <Button size='small' type='danger' onClick={this.onDiscard}>
            Discard
          </Button>
          <Button
            size='small'
            type='primary'
            style={{ marginLeft: 10 }}
            onClick={handleSubmit}
            disabled={!isAnyChange}
          >
            Save Comment
          </Button>
        </div>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(IndividualCommentDetails)
