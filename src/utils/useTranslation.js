import { useState, useEffect } from "react";
import _ from "lodash";

function useTranslation (valuesPara = [], defaultLang) {
  const [value, setVal] = useState({});
  const [values, setValues] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(defaultLang);
  const getValue = (lang) => {
    const displayLanguage = lang ?? currentLanguage;
    const langValues = values.filter((v) => v.language === displayLanguage);

    if (!langValues || langValues.length === 0) return "";

    const obj = {};

    langValues[0].list.forEach((field) => (obj[field.key] = field.value));

    return obj;
  };

  useEffect(() => {
    setValues(_.cloneDeep(valuesPara));
    setCurrentLanguage(defaultLang);
  }, []);

  useEffect(() => setVal(getValue()), [values, currentLanguage]);

  const setValue = (fieldName, value, lang = null) => {
    const newValues = _.cloneDeep(values);
    const currentLanguage = lang ?? defaultLang;

    let langValues = newValues.filter((v) => v.language === currentLanguage);

    if (!langValues || langValues.length === 0) {
      newValues.push({ language: currentLanguage, list: [] });

      langValues = newValues.filter((v) => v.language === currentLanguage);
    }

    let item = langValues[0].list.filter((v) => v.key === fieldName);

    if (!item || item.length === 0) {
      item = [];
      item.push({ key: fieldName });
      langValues[0].list.push(item[0]);
    }

    item[0].value = value;

    setValues(newValues);
    console.log("newval", newValues);
    return newValues;
  };

  const changeLang = (lang) => {
    setCurrentLanguage(lang);
  };

  //const getValue = (fieldName, value, lang) => {};

  return [value, getValue, setValue, changeLang, values];
}

export default useTranslation;
