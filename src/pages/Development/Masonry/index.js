import React from 'react'
import * as umi from 'umi'
import { Form, Input, ProForm, withFormikExtend } from '@medisys/component'
import { connect } from 'dva'
import { compose } from 'redux'
import Cmpt from '@/pages/Widgets/MedicalHistory'
import { createFromIconfontCN } from '@ant-design/icons'
import defaultSettings from '../../../defaultSettings'

console.log(defaultSettings.iconfontUrl)
let IconFont = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl,
})
const Masonry = () => {
  return (
    <div>
      <IconFont type='icon-medicinebox-fill' />
    </div>
  )
}
export default compose()(Masonry)
// connect(({ schemeDetail, codetable }) => ({
//   schemeDetail,
//   codetable,
// })),
// withFormikExtend({
//   displayName: 'FinanceSchemeDetail',
// }),
