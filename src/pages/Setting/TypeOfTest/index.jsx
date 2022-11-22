import React, { useEffect } from 'react'
import { CardContainer, CommonModal } from '@/components'
import { connect } from 'dva'
import $ from 'jquery'
import Filter from './Filter'
import Detail from './Detail'
import Grid from './Grid'

let _connect = connect(({ global, settingTypeOfTest }) => ({
  mainDivHeight: global?.mainDivHeight,
  settingTypeOfTest,
}))

let TypeOfTest = props => {
  let { mainDivHeight, settingTypeOfTest, dispatch } = props

  useEffect(() => {
    dispatch({
      type: 'settingTypeOfTest/query',
      payload: {
        isActive: true,
      },
    })
  }, [])

  let toggleModal = () => {
    dispatch({
      type: 'settingTypeOfTest/updateState',
      payload: {
        showModal: !settingTypeOfTest.showModal,
      },
    })
  }

  let height = mainDivHeight - 120 - ($('.TypeOfTestFilterBar').height() || 0)
  if (height < 300) height = 300
  return (
    <div>
      <CardContainer hideHeader>
        <div className='TypeOfTestFilterBar'>
          <Filter {...props} />
        </div>
        <Grid height={height} {...props} />
        <CommonModal
          open={settingTypeOfTest.showModal}
          title={
            settingTypeOfTest.entity
              ? 'Edit Type Of Test (Investigative Tests)'
              : 'Add Type Of Test (Investigative Tests)'
          }
          maxWidth='md'
          bodyNoPadding
          onClose={toggleModal}
          onConfirm={toggleModal}
        >
          <Detail toggleModal={toggleModal} {...props} />
        </CommonModal>
      </CardContainer>
    </div>
  )
}
export default _connect(TypeOfTest)
