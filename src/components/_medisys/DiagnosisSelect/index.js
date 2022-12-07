import React, { useState } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import _ from 'lodash'
import AttachMoney from '@material-ui/icons/AttachMoney'
import FilterList from '@material-ui/icons/FilterList'
import StarBorder from '@material-ui/icons/StarBorder'
import Star from '@material-ui/icons/Star'
import { Select, ButtonSelect, Tooltip } from '@/components'
import { queryList } from '@/services/common'

const styles = theme => ({
  money: {
    width: 16,
    height: 16,
    top: 3,
    position: 'relative',
    color: 'green',
  },
})

const filterOptions = []


const DiagnosisSelect = ({
  dispatch,
  theme,
  classes,
  style,
  label,
  onDataSouceChange,
  filterStyle = { position: 'absolute', bottom: 8, right: 0 },
  clinicSettings,
  from = 'report',
  selectDiagnosisCode,
  favouriteDiagnosis,
  handelSaveDiagnosisAsFavourite,
  currentSelectCategory,
  ...props
}) => {
  let selectProps = props
  const initMaxTagCount =
    props.field && props.field.value && props.field.value.length === 1 ? 1 : 0
  const [maxTagCount, setMaxTagCount] = useState(
    props.maxTagCount !== undefined ? props.maxTagCount : initMaxTagCount,
  )
  if (
    props.maxTagCount === undefined &&
    props.mode &&
    props.mode === 'multiple'
  ) {
    selectProps = { ...props, maxTagCount }
  }

  const [ctDiagnosis, setCtDiagnosis] = useState([])

  const [diagnosisFilter, setDiagnosisFilter] = useState(
    filterOptions.map(o => o.value),
  )

  const onDiagnosisSearch = async v => {
    const search = {
      props:
        'id,displayvalue,code,complication,iCD10AMFK,iCD10AMDiagnosisCode,iCD10AMDiagnosisName',
      sorting: [{ columnName: 'displayvalue', direction: 'asc' }],
      pagesize: 30,
    }

    let categoryFilter = []
    let isOrderByFavourite = false
    if (from === 'Consultaion') {
      categoryFilter = currentSelectCategory
      isOrderByFavourite = true
    }

    search.apiCriteria = {
      searchValue: v || undefined,
      diagnosisCategories:
        categoryFilter.length === 0 ? undefined : categoryFilter.join(),
      id: typeof v === 'string' ? undefined : Number(v),
      isOrderByFavourite,
    }

    const response = await queryList('/api/codetable/ctsnomeddiagnosis', search)
    if (response && response.data) {
      setCtDiagnosis(response.data.data)

      dispatch({
        type: 'codetable/updateState',
        payload: {
          'codetable/ctsnomeddiagnosis': response.data.data,
        },
      })
    }
    return response
  }
  const selected = ctDiagnosis.find(
    diagnosis => diagnosis.id === props.field.value,
  )

  return (
    <div style={{ position: 'relative' }}>
      <Select
        label={label || 'Diagnosis'}
        options={ctDiagnosis}
        valueField='id'
        labelField='displayvalue'
        handleFilter={(input, opt) => true}
        renderDropdown={option => {
          const { code } = option
          return (
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  width: '100%',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {option.displayvalue}
              </div>
              {from === 'Consultaion' && (
                <div
                  style={{ marginLeft: 'auto', marginRight: -5, height: 20 }}
                >
                  {favouriteDiagnosis.find(d => d === code) ? (
                    <Star
                      style={{
                        color: '#FFCC00',
                        width: 20,
                        height: 20,
                      }}
                    />
                  ) : (
                    <div style={{ width: 20 }} />
                  )}
                </div>
              )}
            </div>
          )
        }}
        query={onDiagnosisSearch}
        onDataSouceChange={data => {
          setCtDiagnosis(data)
          if (onDataSouceChange) onDataSouceChange(data)
        }}
        onChange={(values, opts) => {
          if (
            props.maxTagCount === undefined &&
            props.mode &&
            props.mode === 'multiple'
          ) {
            setMaxTagCount(values && values.length === 1 ? 1 : 0)
          }
          if (props.onChange) {
            props.onChange(values, opts)
          }
        }}
        {...selectProps}
      />
      {from === 'Consultaion' && selectDiagnosisCode && (
        <div style={{ ...filterStyle, height: 28, bottom: 0 }}>
          {favouriteDiagnosis.find(d => d === selectDiagnosisCode) ? (
            <Tooltip title='Click to remove favourite'>
              <Star
                style={{
                  color: '#FFCC00',
                  width: 28,
                  height: 28,
                  cursor: 'hand',
                }}
                onClick={handelSaveDiagnosisAsFavourite}
              />
            </Tooltip>
          ) : (
            <Tooltip title='Click to add to favourite'>
              <StarBorder
                style={{ color: 'gray', width: 28, height: 28, cursor: 'hand' }}
                onClick={handelSaveDiagnosisAsFavourite}
              />
            </Tooltip>
          )}
        </div>
      )}
    </div>
  )
}

const Connected = connect(({ clinicSettings }) => ({
  clinicSettings: clinicSettings.settings,
}))(DiagnosisSelect)

export default withStyles(styles, { withTheme: true })(Connected)
