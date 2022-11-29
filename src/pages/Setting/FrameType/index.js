import React, { PureComponent} from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = theme => ({
    ...basicStyle(theme),
  })
@connect(({settingFrameType, global})=>({
    settingFrameType,
    global,
    mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingFrameType' })

class FrameType extends PureComponent {
    
    render(){
        return(
            <CardContainer>
                <Filter></Filter>
                <Grid></Grid>
                <Detail></Detail>
            </CardContainer>
        )
    }
}
export default withStyles(styles,{withTheme:true})(FrameType)