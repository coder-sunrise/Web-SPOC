import React, { Component } from 'react'
import { CardContainer, Tabs } from '@/components'
import { formatMessage } from 'umi/locale'
import { PurchaseReceiveDetailOption } from '../variables'

function callback (key) {
  //console.log(key)
}

class index extends Component {
  render () {
    return (
      <CardContainer hideHeader>
        <Tabs
          defaultActiveKey='0'
          onChange={callback}
          options={PurchaseReceiveDetailOption}
        />
      </CardContainer>
    )
  }
}
export default index
