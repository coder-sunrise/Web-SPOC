import React from 'react'
import { CodeSelect } from '@/components'

const MultiLangCodeSelect = ({ code, language, ...restProps }) => {
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

  return (
    <CodeSelect
      formatCodes={formatCodes}
      code={code}
      labelField={'displayValue' + language}
      {...restProps}
    />
  )
}

export default MultiLangCodeSelect
