import React from 'react'
import * as umi from 'umi'
import { Form, Input, ProForm, withFormikExtend } from '@medisys/component'
import { connect } from 'dva'
import { compose } from 'redux'
import Cmpt from '@/pages/Widgets/MedicalHistory'

const Masonry = () => {
  return (
    <div>
      <Cmpt />
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
