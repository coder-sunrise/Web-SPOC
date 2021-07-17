import React, { useContext, useEffect, useState, createContext } from 'react'
import { useSelector } from 'dva'

const DetailsContext = createContext(null)

export const DetailsContextProvider = props => {
  const { settings } = useSelector(state => state.clinicSettings)
  const context = { isMultilanguage: false }
  const [currentLanguage = 'EN', setCurrentLanguage] = useState()
  const [languageLabel, setLanguageLabel] = useState()
  const [isMultiLanguage = false, setIsMultiLanguage] = useState()
  const [primaryPrintoutLanguage, setPrimaryPrintoutLanguage] = useState()
  const [secondaryPrintoutLanguage, setSecondaryPrintoutLanguage] = useState()

  useEffect(() => {
    const internalIsMultiLang =
      settings.primaryPrintoutLanguage && settings.secondaryPrintoutLanguage
        ? true
        : false
    const internalCurrentLang = settings.primaryPrintoutLanguage ?? 'EN'

    setIsMultiLanguage(internalIsMultiLang)
    setCurrentLanguage(internalCurrentLang)
    setPrimaryPrintoutLanguage(settings.primaryPrintoutLanguage)
    setSecondaryPrintoutLanguage(settings.secondaryPrintoutLanguage)
  }, [settings])

  useEffect(() => {
    setLanguageLabel(isMultiLanguage ? `(${currentLanguage})` : '')
  }, [currentLanguage])

  return (
    // this is the provider providing state
    <DetailsContext.Provider
      value={{
        isMultiLanguage,
        primaryPrintoutLanguage,
        secondaryPrintoutLanguage,
        currentLanguage,
        setCurrentLanguage,
        languageLabel,
      }}
    >
      {props.children}
    </DetailsContext.Provider>
  )
}

export default DetailsContext
