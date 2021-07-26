import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'dva'
import { List } from 'antd'
import Delete from '@material-ui/icons/Delete'
import { Button, Tooltip } from '@/components'

const formatCodes = codes => {
  const tempFormattedCodes = []
  codes.forEach(current => {
    const formattedCode = {
      displayValue: current.displayValue,
      id: current.id,
    }
    if (current.translationData)
      current.translationData.forEach(translation => {
        const fieldName = 'displayValue' + translation.language
        const langDisplayValue = translation.list.find(
          field => field.key === 'displayValue',
        )?.value

        formattedCode[fieldName] = langDisplayValue
      })
    else {
      formattedCode['displayValue'] = current.displayValue
    }
    tempFormattedCodes.push(formattedCode)
  })

  return tempFormattedCodes
}

const MultiLangCodeList = ({
  data = [],
  language,
  label,
  codeset,
  onChange,
}) => {
  const codetable = useSelector(s => s.codetable)
  const [codeList, setCodeList] = useState([])
  const [currentCodesetList, setCurrentCodesetList] = useState([])
  const codesetName = codeset.toLowerCase()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: codesetName },
    }).then(result => {
      if (result) {
        setCurrentCodesetList(formatCodes(result))
      }
    })
  }, [codeset])

  const removeItemFromList = id => {
    const newList = [...codeList.filter(c => c.id !== id)]
    setCodeList(newList)
    if (onChange) onChange(newList.map(item => item.id))
  }

  useEffect(() => {
    if (data) {
      setCodeList(
        currentCodesetList
          ? currentCodesetList.filter(c => data.includes(c.id))
          : [],
      )
    }
  }, [currentCodesetList, data])

  return (
    <List
      bordered
      split={false}
      locale={{
        emptyText: <span></span>,
      }}
      style={{ height: 200, overflow: 'auto' }}
      dataSource={codeList}
      renderItem={(item, i) => {
        return (
          <div style={{ padding: 10, display: 'flex' }}>
            <span
              style={{ marginRight: 15, fontWeight: 200, flex: '0 0 auto' }}
            >
              {`${label} ${i + 1}`}
            </span>
            <span style={{ flexGrow: 1 }}>
              {item['displayValue' + language]}
            </span>
            <span>
              <Tooltip title={`Remove ${label.toLowerCase()}`}>
                <Button
                  className='noPadding'
                  color='danger'
                  size='sm'
                  id={item.id}
                  justIcon
                  rounded
                  onClick={() => removeItemFromList(item.id)}
                >
                  <Delete />
                </Button>
              </Tooltip>
            </span>
          </div>
        )
      }}
    ></List>
  )
}

export default MultiLangCodeList
