import React from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import { FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
// formik
import { withFormik, FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
// common component
import {
  Button,
  CardContainer,
  CommonTableGrid,
  GridContainer,
  GridItem,
  ProgressButton,
  Select,
  TextField,
  Tooltip,
  withSettingBase,
} from '@/components'

const styles = (theme) => ({
  verticalSpacing: {
    marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(1),
  },
})

// @withSettingBase({ modelName: 'settingUserProfile' })
// @withFormik({
//   mapPropsToValues: () => ({
//     status: true,
//   }),
// })
@connect(({ systemMessage }) => ({ systemMessage }))
class SystemMessageDetail extends React.Component {
  state = {
    // gridConfig: {
    //   ...UserProfileTableConfig,
    //   columnExtensions: [
    //     ...UserProfileTableConfig.columnExtensions,
    //     {
    //       columnName: 'action',
    //       width: 90,
    //       align: 'center',
    //       render: (row) => this.Cell(row),
    //     },
    //   ],
    // },
  }

  componentDidMount = () => {
    const { dispatch, systemMessage: { entity } } = this.props
    if (entity) {
      if (!entity.isRead) {
        dispatch({
          type: 'systemMessage/read',
          payload: {
            id: entity.id,
          },
        })
      } else {
        dispatch({
          type: 'systemMessage/queryOne',
          payload: {
            id: entity.id,
          },
        })
      }
    }
  }

  render () {
    const { footer, classes, systemMessage: { entity } } = this.props
    const { contents } = entity
    return (
      <GridContainer>
        <GridItem>
          <React.Fragment>
            <div dangerouslySetInnerHTML={{ __html: contents }} />
          </React.Fragment>
        </GridItem>
        <GridContainer className={classes.verticalSpacing}>
          <GridItem md={12}>
            <div>
              {footer &&
                footer({
                  onConfirm: null,
                })}
            </div>
          </GridItem>
        </GridContainer>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { name: 'SystemMessageDetail' })(
  SystemMessageDetail,
)
