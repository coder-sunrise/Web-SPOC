import localforage from 'localforage'
import moment from 'moment'
import request from './request'

localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'SEMR2Web',
  storeName: 'Codetable',
})

const _dateFormat = 'DD-MM-YYYY HH:mm:ss'

const paymentMethods = [
  { name: 'Cash', value: 'cash' },
  { name: 'Nets', value: 'nets' },
  { name: 'Credit card', value: 'creditCard' },
  { name: 'Cheque', value: 'cheque' },
  { name: 'TT', value: 'tt' },
  { name: 'Giro', value: 'giro' },
]

const titles = [
  { name: 'Mr', value: 'Mr' },
  { name: 'Mrs', value: 'Mrs' },
  { name: 'Miss', value: 'Miss' },
  { name: 'Ms', value: 'Ms' },
  { name: 'Dr', value: 'Dr' },
  { name: 'Prof', value: 'Prof' },
  { name: 'Rev', value: 'Rev' },
  { name: 'Others', value: 'Others' },
]

const finTypes = [
  { name: 'Fin', value: 'Fin' },
  { name: 'NRIC', value: 'NRIC' },
  { name: 'Passport', value: 'Passport' },
]

const status = [
  { name: 'Active', value: '1' },
  { name: 'Inactive', value: '0' },
  { name: 'Unknown', value: '2' },
]

const drugs = [
  { name: 'drug01 - drug 1', value: 'drug01' },
  { name: 'drug02 - drug 2', value: 'drug02' },
  { name: 'drug03 - drug 3', value: 'drug03' },
  { name: 'drug04 - drug 4', value: 'drug04' },
]

const consumptionMethods = [
  { name: 'Take', value: 'take' },
  { name: 'Apply', value: 'apply' },
  { name: 'Chew', value: 'chew' },
  { name: 'Dab', value: 'dab' },
  { name: 'Dissolve', value: 'dissolve' },
  { name: 'Drop', value: 'drop' },
  { name: 'Gargle', value: 'gargle' },
  { name: 'Inhale', value: 'inhale' },
  { name: 'Inject', value: 'inject' },
]

const dosage = [
  { name: '1/4', value: '1/4' },
  { name: '1/2', value: '1/2' },
  { name: '3/4', value: '3/4' },
  { name: '1', value: '1' },
  { name: '10', value: '10' },
  { name: '15', value: '15' },
  { name: '20', value: '20' },
]

const dosageUnits = [
  { name: 'amount', value: 'amount' },
  { name: 'amp', value: 'amp' },
  { name: 'bott', value: 'bott' },
  { name: 'box', value: 'box' },
  { name: 'cap/s', value: 'cap/s' },
]

const frequency = [
  { name: '1 hr after Intercourse', value: '01' },
  { name: '2 hourly', value: '02' },
  { name: '2 times a day', value: '03' },
  { name: '3 hourly', value: '04' },
  { name: '3 times a day', value: '05' },
]

const periods = [
  { name: 'Day', value: 'day' },
  { name: 'Week', value: 'week' },
  { name: 'Month', value: 'month' },
]

const precautions = [
  { name: 'Anti Inflamation', value: '01' },
  { name: 'Avoid alcohol', value: '02' },
  { name: 'Complete whole course of medicine', value: '03' },
  { name: 'Do not dilute with water', value: '04' },
]

const packageTypes = [
  { name: 'Pacakge', value: 'package' },
  { name: 'Open Package', value: 'openpackage' },
]

const suppliers = [
  { name: 'Supplier 1', value: '1' },
  { name: 'Supplier 2', value: '0' },
]

const dispUOMs = [
  { name: 'Box', value: 'Box' },
  { name: 'Tube', value: 'Tube' },
]

const yesNo = [
  { name: 'Yes', value: '1' },
  { name: 'No', value: '0' },
]

const gender = [
  { name: '', value: '' },
  { name: 'Female', value: 'Female' },
  { name: 'Male', value: 'Male' },
  { name: 'Unknown', value: 'Unknown' },
]

const maritalStatus = [
  { name: 'Divorced', value: 'Divorced' },
  { name: 'Married', value: 'Married' },
  { name: 'Single', value: 'Single' },
  { name: 'Widowed', value: 'Widowed' },
]

const nationality = [
  { name: 'Singaporean', value: 'Singaporean' },
  { name: 'Malaysian', value: 'Malaysian' },
  { name: 'Indian', value: 'Indian' },
  { name: 'Other', value: 'Other' },
]

const race = [
  { name: 'Chinese', value: 'Chinese' },
  { name: 'Malay', value: 'Malay' },
  { name: 'Indian', value: 'Indian' },
  { name: 'Other', value: 'Other' },
]

const religion = [
  { name: 'Buddhist', value: 'Buddhist' },
  { name: 'Christian', value: 'Christian' },
  { name: 'Church of England', value: 'Church of England' },
  { name: 'Hindu', value: 'Hindu' },
  { name: 'Islam', value: 'Islam' },
  { name: 'Javanese', value: 'Javanese' },
  { name: 'Methodist', value: 'Methodist' },
  { name: 'Muslim', value: 'Muslim' },
  { name: 'None', value: 'None' },
  { name: 'Other', value: 'Other' },
]

const language = [
  { name: 'Bahasa', value: 'Bahasa' },
  { name: 'Cantonese', value: 'Cantonese' },
  { name: 'Chinese', value: 'Chinese' },
  { name: 'English', value: 'English' },
  { name: 'Hakka', value: 'Hakka' },
  { name: 'Hokkien', value: 'Hokkien' },
  { name: 'Japanese', value: 'Japanese' },
  { name: 'Malay', value: 'Malay' },
  { name: 'Mandarin', value: 'Mandarin' },
  { name: 'Others', value: 'Others' },
  { name: 'Tamil', value: 'Tamil' },
]

const preferredContactMode = [
  { name: 'Call (Mobile)', value: 'Call (Mobile)' },
  { name: 'Email', value: 'Email' },
  { name: 'Fax', value: 'Fax' },
  { name: 'SMS', value: 'SMS' },
  { name: 'Letter', value: 'Letter' },
  { name: 'Call (Office Num.)', value: 'Call (Office Num.)' },
  { name: 'Call (Home Num.)', value: 'Call (Home Num.)' },
]

const countries = [
  { name: 'Afghanistan', value: 'Afghanistan' },
  { name: 'Åland Islands', value: 'Åland Islands' },
  { name: 'Albania', value: 'Albania' },
  { name: 'Algeria', value: 'Algeria' },
  { name: 'American Samoa', value: 'American Samoa' },
  { name: 'Andorra', value: 'Andorra' },
  { name: 'Angola', value: 'Angola' },
  { name: 'Anguilla', value: 'Anguilla' },
  { name: 'Antarctica', value: 'Antarctica' },
  { name: 'Antigua and Barbuda', value: 'Antigua and Barbuda' },
  { name: 'Argentina', value: 'Argentina' },
  { name: 'Armenia', value: 'Armenia' },
  { name: 'Aruba', value: 'Aruba' },
  { name: 'Australia', value: 'Australia' },
  { name: 'Austria', value: 'Austria' },
  { name: 'Azerbaijan', value: 'Azerbaijan' },
  { name: 'Bahamas', value: 'Bahamas' },
  { name: 'Bahrain', value: 'Bahrain' },
  { name: 'Bangladesh', value: 'Bangladesh' },
  { name: 'Barbados', value: 'Barbados' },
  { name: 'Belarus', value: 'Belarus' },
  { name: 'Belgium', value: 'Belgium' },
  { name: 'Belize', value: 'Belize' },
  { name: 'Benin', value: 'Benin' },
  { name: 'Bermuda', value: 'Bermuda' },
  { name: 'Bhutan', value: 'Bhutan' },
  {
    name: 'Bolivia (Plurinational State of)',
    value: 'Bolivia (Plurinational State of)',
  },
  {
    name: 'Bonaire Sint Eustatius and Saba',
    value: 'Bonaire Sint Eustatius and Saba',
  },
  { name: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina' },
  { name: 'Botswana', value: 'Botswana' },
  { name: 'Bouvet Island', value: 'Bouvet Island' },
  { name: 'Brazil', value: 'Brazil' },
  {
    name: 'British Indian Ocean Territory',
    value: 'British Indian Ocean Territory',
  },
  {
    name: 'United States Minor Outlying Islands',
    value: 'United States Minor Outlying Islands',
  },
  { name: 'Virgin Islands (British)', value: 'Virgin Islands (British)' },
  { name: 'Virgin Islands (U.S.)', value: 'Virgin Islands (U.S.)' },
  { name: 'Brunei Darussalam', value: 'Brunei Darussalam' },
  { name: 'Bulgaria', value: 'Bulgaria' },
  { name: 'Burkina Faso', value: 'Burkina Faso' },
  { name: 'Burundi', value: 'Burundi' },
  { name: 'Cambodia', value: 'Cambodia' },
  { name: 'Cameroon', value: 'Cameroon' },
  { name: 'Canada', value: 'Canada' },
  { name: 'Cabo Verde', value: 'Cabo Verde' },
  { name: 'Cayman Islands', value: 'Cayman Islands' },
  { name: 'Central African Republic', value: 'Central African Republic' },
  { name: 'Chad', value: 'Chad' },
  { name: 'Chile', value: 'Chile' },
  { name: 'China', value: 'China' },
  { name: 'Christmas Island', value: 'Christmas Island' },
  { name: 'Cocos (Keeling) Islands', value: 'Cocos (Keeling) Islands' },
  { name: 'Colombia', value: 'Colombia' },
  { name: 'Comoros', value: 'Comoros' },
  { name: 'Congo', value: 'Congo' },
  {
    name: 'Congo (Democratic Republic of the)',
    value: 'Congo (Democratic Republic of the)',
  },
  { name: 'Cook Islands', value: 'Cook Islands' },
  { name: 'Costa Rica', value: 'Costa Rica' },
  { name: 'Croatia', value: 'Croatia' },
  { name: 'Cuba', value: 'Cuba' },
  { name: 'Curaçao', value: 'Curaçao' },
  { name: 'Cyprus', value: 'Cyprus' },
  { name: 'Czech Republic', value: 'Czech Republic' },
  { name: 'Denmark', value: 'Denmark' },
  { name: 'Djibouti', value: 'Djibouti' },
  { name: 'Dominica', value: 'Dominica' },
  { name: 'Dominican Republic', value: 'Dominican Republic' },
  { name: 'Ecuador', value: 'Ecuador' },
  { name: 'Egypt', value: 'Egypt' },
  { name: 'El Salvador', value: 'El Salvador' },
  { name: 'Equatorial Guinea', value: 'Equatorial Guinea' },
  { name: 'Eritrea', value: 'Eritrea' },
  { name: 'Estonia', value: 'Estonia' },
  { name: 'Ethiopia', value: 'Ethiopia' },
  { name: 'Falkland Islands (Malvinas)', value: 'Falkland Islands (Malvinas)' },
  { name: 'Faroe Islands', value: 'Faroe Islands' },
  { name: 'Fiji', value: 'Fiji' },
  { name: 'Finland', value: 'Finland' },
  { name: 'France', value: 'France' },
  { name: 'French Guiana', value: 'French Guiana' },
  { name: 'French Polynesia', value: 'French Polynesia' },
  { name: 'French Southern Territories', value: 'French Southern Territories' },
  { name: 'Gabon', value: 'Gabon' },
  { name: 'Gambia', value: 'Gambia' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Germany', value: 'Germany' },
  { name: 'Ghana', value: 'Ghana' },
  { name: 'Gibraltar', value: 'Gibraltar' },
  { name: 'Greece', value: 'Greece' },
  { name: 'Greenland', value: 'Greenland' },
  { name: 'Grenada', value: 'Grenada' },
  { name: 'Guadeloupe', value: 'Guadeloupe' },
  { name: 'Guam', value: 'Guam' },
  { name: 'Guatemala', value: 'Guatemala' },
  { name: 'Guernsey', value: 'Guernsey' },
  { name: 'Guinea', value: 'Guinea' },
  { name: 'Guinea-Bissau', value: 'Guinea-Bissau' },
  { name: 'Guyana', value: 'Guyana' },
  { name: 'Haiti', value: 'Haiti' },
  {
    name: 'Heard Island and McDonald Islands',
    value: 'Heard Island and McDonald Islands',
  },
  { name: 'Holy See', value: 'Holy See' },
  { name: 'Honduras', value: 'Honduras' },
  { name: 'Hong Kong', value: 'Hong Kong' },
  { name: 'Hungary', value: 'Hungary' },
  { name: 'Iceland', value: 'Iceland' },
  { name: 'India', value: 'India' },
  { name: 'Indonesia', value: 'Indonesia' },
  { name: 'Côte dIvoire', value: 'Côte dIvoire' },
  { name: 'Iran (Islamic Republic of)', value: 'Iran (Islamic Republic of)' },
  { name: 'Iraq', value: 'Iraq' },
  { name: 'Ireland', value: 'Ireland' },
  { name: 'Isle of Man', value: 'Isle of Man' },
  { name: 'Israel', value: 'Israel' },
  { name: 'Italy', value: 'Italy' },
  { name: 'Jamaica', value: 'Jamaica' },
  { name: 'Japan', value: 'Japan' },
  { name: 'Jersey', value: 'Jersey' },
  { name: 'Jordan', value: 'Jordan' },
  { name: 'Kazakhstan', value: 'Kazakhstan' },
  { name: 'Kenya', value: 'Kenya' },
  { name: 'Kiribati', value: 'Kiribati' },
  { name: 'Kuwait', value: 'Kuwait' },
  { name: 'Kyrgyzstan', value: 'Kyrgyzstan' },
  {
    name: 'Lao Peoples Democratic Republic',
    value: 'Lao Peoples Democratic Republic',
  },
  { name: 'Latvia', value: 'Latvia' },
  { name: 'Lebanon', value: 'Lebanon' },
  { name: 'Lesotho', value: 'Lesotho' },
  { name: 'Liberia', value: 'Liberia' },
  { name: 'Libya', value: 'Libya' },
  { name: 'Liechtenstein', value: 'Liechtenstein' },
  { name: 'Lithuania', value: 'Lithuania' },
  { name: 'Luxembourg', value: 'Luxembourg' },
  { name: 'Macao', value: 'Macao' },
  {
    name: 'Macedonia (the former Yugoslav Republic of)',
    value: 'Macedonia (the former Yugoslav Republic of)',
  },
  { name: 'Madagascar', value: 'Madagascar' },
  { name: 'Malawi', value: 'Malawi' },
  { name: 'Malaysia', value: 'Malaysia' },
  { name: 'Maldives', value: 'Maldives' },
  { name: 'Mali', value: 'Mali' },
  { name: 'Malta', value: 'Malta' },
  { name: 'Marshall Islands', value: 'Marshall Islands' },
  { name: 'Martinique', value: 'Martinique' },
  { name: 'Mauritania', value: 'Mauritania' },
  { name: 'Mauritius', value: 'Mauritius' },
  { name: 'Mayotte', value: 'Mayotte' },
  { name: 'Mexico', value: 'Mexico' },
  {
    name: 'Micronesia (Federated States of)',
    value: 'Micronesia (Federated States of)',
  },
  { name: 'Moldova (Republic of)', value: 'Moldova (Republic of)' },
  { name: 'Monaco', value: 'Monaco' },
  { name: 'Mongolia', value: 'Mongolia' },
  { name: 'Montenegro', value: 'Montenegro' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Morocco', value: 'Morocco' },
  { name: 'Mozambique', value: 'Mozambique' },
  { name: 'Myanmar', value: 'Myanmar' },
  { name: 'Namibia', value: 'Namibia' },
  { name: 'Nauru', value: 'Nauru' },
  { name: 'Nepal', value: 'Nepal' },
  { name: 'Netherlands', value: 'Netherlands' },
  { name: 'New Caledonia', value: 'New Caledonia' },
  { name: 'New Zealand', value: 'New Zealand' },
  { name: 'Nicaragua', value: 'Nicaragua' },
  { name: 'Niger', value: 'Niger' },
  { name: 'Nigeria', value: 'Nigeria' },
  { name: 'Niue', value: 'Niue' },
  { name: 'Norfolk Island', value: 'Norfolk Island' },
  {
    name: 'Korea (Democratic Peoples Republic of)',
    value: 'Korea (Democratic Peoples Republic of)',
  },
  { name: 'Northern Mariana Islands', value: 'Northern Mariana Islands' },
  { name: 'Norway', value: 'Norway' },
  { name: 'Oman', value: 'Oman' },
  { name: 'Pakistan', value: 'Pakistan' },
  { name: 'Palau', value: 'Palau' },
  { name: 'Palestine State of', value: 'Palestine State of' },
  { name: 'Panama', value: 'Panama' },
  { name: 'Papua New Guinea', value: 'Papua New Guinea' },
  { name: 'Paraguay', value: 'Paraguay' },
  { name: 'Peru', value: 'Peru' },
  { name: 'Philippines', value: 'Philippines' },
  { name: 'Pitcairn', value: 'Pitcairn' },
  { name: 'Poland', value: 'Poland' },
  { name: 'Portugal', value: 'Portugal' },
  { name: 'Puerto Rico', value: 'Puerto Rico' },
  { name: 'Qatar', value: 'Qatar' },
  { name: 'Republic of Kosovo', value: 'Republic of Kosovo' },
  { name: 'Réunion', value: 'Réunion' },
  { name: 'Romania', value: 'Romania' },
  { name: 'Russian Federation', value: 'Russian Federation' },
  { name: 'Rwanda', value: 'Rwanda' },
  { name: 'Saint Barthélemy', value: 'Saint Barthélemy' },
  {
    name: 'Saint Helena Ascension and Tristan da Cunha',
    value: 'Saint Helena Ascension and Tristan da Cunha',
  },
  { name: 'Saint Kitts and Nevis', value: 'Saint Kitts and Nevis' },
  { name: 'Saint Lucia', value: 'Saint Lucia' },
  { name: 'Saint Martin (French part)', value: 'Saint Martin (French part)' },
  { name: 'Saint Pierre and Miquelon', value: 'Saint Pierre and Miquelon' },
  {
    name: 'Saint Vincent and the Grenadines',
    value: 'Saint Vincent and the Grenadines',
  },
  { name: 'Samoa', value: 'Samoa' },
  { name: 'San Marino', value: 'San Marino' },
  { name: 'Sao Tome and Principe', value: 'Sao Tome and Principe' },
  { name: 'Saudi Arabia', value: 'Saudi Arabia' },
  { name: 'Senegal', value: 'Senegal' },
  { name: 'Serbia', value: 'Serbia' },
  { name: 'Seychelles', value: 'Seychelles' },
  { name: 'Sierra Leone', value: 'Sierra Leone' },
  { name: 'Singapore', value: 'Singapore' },
  { name: 'Sint Maarten (Dutch part)', value: 'Sint Maarten (Dutch part)' },
  { name: 'Slovakia', value: 'Slovakia' },
  { name: 'Slovenia', value: 'Slovenia' },
  { name: 'Solomon Islands', value: 'Solomon Islands' },
  { name: 'Somalia', value: 'Somalia' },
  { name: 'South Africa', value: 'South Africa' },
  {
    name: 'South Georgia and the South Sandwich Islands',
    value: 'South Georgia and the South Sandwich Islands',
  },
  { name: 'Korea (Republic of)', value: 'Korea (Republic of)' },
  { name: 'South Sudan', value: 'South Sudan' },
  { name: 'Spain', value: 'Spain' },
  { name: 'Sri Lanka', value: 'Sri Lanka' },
  { name: 'Sudan', value: 'Sudan' },
  { name: 'Suriname', value: 'Suriname' },
  { name: 'Svalbard and Jan Mayen', value: 'Svalbard and Jan Mayen' },
  { name: 'Swaziland', value: 'Swaziland' },
  { name: 'Sweden', value: 'Sweden' },
  { name: 'Switzerland', value: 'Switzerland' },
  { name: 'Syrian Arab Republic', value: 'Syrian Arab Republic' },
  { name: 'Taiwan', value: 'Taiwan' },
  { name: 'Tajikistan', value: 'Tajikistan' },
  { name: 'Tanzania United Republic of', value: 'Tanzania United Republic of' },
  { name: 'Thailand', value: 'Thailand' },
  { name: 'Timor-Leste', value: 'Timor-Leste' },
  { name: 'Togo', value: 'Togo' },
  { name: 'Tokelau', value: 'Tokelau' },
  { name: 'Tonga', value: 'Tonga' },
  { name: 'Trinidad and Tobago', value: 'Trinidad and Tobago' },
  { name: 'Tunisia', value: 'Tunisia' },
  { name: 'Turkey', value: 'Turkey' },
  { name: 'Turkmenistan', value: 'Turkmenistan' },
  { name: 'Turks and Caicos Islands', value: 'Turks and Caicos Islands' },
  { name: 'Tuvalu', value: 'Tuvalu' },
  { name: 'Uganda', value: 'Uganda' },
  { name: 'Ukraine', value: 'Ukraine' },
  { name: 'United Arab Emirates', value: 'United Arab Emirates' },
  {
    name: 'United Kingdom of Great Britain',
    value: 'United Kingdom of Great Britain',
  },
  { name: 'United States of America', value: 'United States of America' },
  { name: 'Uruguay', value: 'Uruguay' },
  { name: 'Uzbekistan', value: 'Uzbekistan' },
  { name: 'Vanuatu', value: 'Vanuatu' },
  {
    name: 'Venezuela (Bolivarian Republic of)',
    value: 'Venezuela (Bolivarian Republic of)',
  },
  { name: 'Vietnam', value: 'Vietnam' },
  { name: 'Wallis and Futuna', value: 'Wallis and Futuna' },
  { name: 'Western Sahara', value: 'Western Sahara' },
  { name: 'Yemen', value: 'Yemen' },
  { name: 'Zambia', value: 'Zambia' },
  { name: 'Zimbabwe', value: 'Zimbabwe' },
]

const schemes = [
  { name: 'CHAS Blue', value: 'CHAS Blue' },
  { name: 'CHAS PG', value: 'CHAS PG' },
  { name: 'ECHAS BLUE', value: 'ECHAS BLUE' },
  { name: 'ECHAS ORANGE', value: 'ECHAS ORANGE' },
  { name: 'ECHAS PA $', value: 'ECHAS PA $' },
  { name: 'ECHAS PA 100%', value: 'ECHAS PA 100%' },
  { name: 'ECHAS PG', value: 'ECHAS PG' },
  { name: 'SIA - 0%', value: 'SIA - 0%' },
  { name: 'SIA - 30%', value: 'SIA - 30%' },
]

const addressTypes = [
  { label: 'Mailing Address', value: '1' },
  { label: 'Primary Address', value: '2' },
]
const localCodes = {}

const existInLocal = async (CTName) => {
  const keys = await localforage.keys().then((key) => key)
  return keys.includes(CTName)
}

/**
 * save codetable to IndexedDB , returning a promise.
 *
 * @param  {string} CTName   The codetable name, as key in IndexedDB
 * @param  {object} ctValue  The codetable value { value: [ ], timestamp: ''}
 * @return {bool} isSavedSuccess A boolean flag indicating save success or not
 */
const saveCodetable = async (CTName, codetableValue) => {
  let success = false
  const exist = await existInLocal(CTName)
  // TODO: compare timestamp

  if (!exist) {
    // not exist then save
    success = await localforage
      .setItem(CTName, codetableValue)
      .then(() => {
        return true
      })
      .catch((error) => {
        console.log('Save codetable error', error)
        return false
      })
  }
  return success
}

export async function getCodes (code) {
  // check with IndexedDB,
  // if exist no need to make request call
  const exist = await existInLocal(code)
  if (exist) {
    const returnVal = await localforage
      .getItem(code)
      .then((item) => {
        if (item.value) return item.value
        return item
      })
      .catch((error) => {
        console.log(`retrieve item error: ${error}`)
      })

    return returnVal
  }

  console.log(`${code} not exist, making Codetable request call`)

  const response = await request(`/api/CodeTable?ctnames=${code}`)
  if (response && response.status === '200') {
    // save to IndexedDB
    const codetable = {
      value: response.data[code],
      timestamp: moment().format(_dateFormat),
    }
    const saveSuccess = await saveCodetable(code, codetable)
    return saveSuccess ? response.data[code] : []
  }
  return []

  // if (!localCodes[code]) {
  //   const r = await request(`/api/CodeTable?ctnames=${code}`)
  //   if (r.status === '200') {
  //     // console.log(r)
  //     localCodes[code] = r.data[code] || []
  //   } else {
  //     localCodes[code] = []
  //   }
  // }
  // return localCodes[code]
}

module.exports = {
  paymentMethods,
  titles,
  finTypes,
  status,
  drugs,
  consumptionMethods,
  dosage,
  dosageUnits,
  frequency,
  periods,
  precautions,
  packageTypes,
  suppliers,
  dispUOMs,
  yesNo,
  gender,
  getCodes,
  maritalStatus,
  nationality,
  race,
  religion,
  language,
  preferredContactMode,
  countries,
  schemes,
  addressTypes,
  ...module.exports,
}
