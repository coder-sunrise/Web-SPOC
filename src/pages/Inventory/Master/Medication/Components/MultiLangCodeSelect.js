import React from 'react'
import { CodeSelect } from '@/components'

const MultiLangCodeSelect = ({
  code,
  language,
  labelField,
  isMultiLanguage,
  ...restProps
}) => {
  const formatCodes = codes => {
    const tempFormattedCodes = []
    codes.forEach(current => {
      const formattedCode = {
        displayValue: isMultiLanguage
          ? current.displayValue
          : current[labelField],
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
        formattedCode[labelField] = isMultiLanguage
          ? current.displayValue
          : current[labelField]
      }
      tempFormattedCodes.push(formattedCode)
    })

    return tempFormattedCodes
  }

  return (
    <CodeSelect
      formatCodes={formatCodes}
      code={code}
      labelField={isMultiLanguage ? 'displayValue' + language : labelField}
      {...restProps}
    />
  )
}

export default MultiLangCodeSelect
