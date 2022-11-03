import React, { useEffect } from 'react'
import { CardContainer, CommonModal } from '@/components'
import { connect } from 'dva'
import $ from 'jquery'
import Filter from './Filter'
import Detail from './Detail'
import Grid from './Grid'

let _connect = connect(({ global, settingGradingChart }) => ({
  mainDivHeight: global?.mainDivHeight,
  settingGradingChart,
}))

let GradingChart = props => {
  let { mainDivHeight, settingGradingChart, dispatch } = props

  useEffect(() => {
    dispatch({
      type: 'settingGradingChart/query',
      payload: {
        isActive: true,
      },
    })
  }, [])

  let toggleModal = () => {
    dispatch({
      type: 'settingGradingChart/updateState',
      payload: {
        showModal: !settingGradingChart.showModal,
      },
    })
  }

  let height = mainDivHeight - 120 - ($('.gradingChartFilterBar').height() || 0)
  if (height < 300) height = 300
  return (
    <div>
      <CardContainer hideHeader>
        <div className='gradingChartFilterBar'>
          <Filter {...props} />
        </div>
        <Grid height={height} {...props} />
        <CommonModal
          open={settingGradingChart.showModal}
          title={
            settingGradingChart.entity
              ? 'Edit Grading Chart (Anterior Eye Examination) '
              : 'Add Grading Chart (Anterior Eye Examination) '
          }
          observe='gradingChartDetail'
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
export default _connect(GradingChart)
