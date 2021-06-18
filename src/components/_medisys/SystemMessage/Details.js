import React from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import $ from 'jquery'
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
  },
})

@connect(({ systemMessage }) => ({ systemMessage }))
class SystemMessageDetail extends React.Component {
  state = {}

  constructor (props) {
    super(props)
    this.container = React.createRef()
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
    // simulation click to close system info popup
    $(this.container.current).click()
  }

  render () {
    const { footer, classes, systemMessage: { entity = {} } } = this.props
    const { contents = 'System message has not found.' } = entity
    return (
      <GridContainer>
        <GridItem >
          <div
            ref={this.container}
            dangerouslySetInnerHTML={{ __html: contents }}
          />
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
