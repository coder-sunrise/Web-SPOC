import Cookies from 'universal-cookie'
import moment from 'moment'
import _ from 'lodash'

import request, { axiosRequest } from './request'
import { convertToQuery } from '@/utils/utils'
import db from './indexedDB'
import {
  dateFormatLong,
  CodeSelect,
  dateFormatLongWithTime,
} from '@/components'
import { UNFIT_TYPE } from '@/utils/constants'

import Medication from '@/pages/Widgets/Orders/Detail/Medication'
import Vaccination from '@/pages/Widgets/Orders/Detail/Vaccination'
import Service from '@/pages/Widgets/Orders/Detail/Service'
import Consumable from '@/pages/Widgets/Orders/Detail/Consumable'
import Package from '@/pages/Widgets/Orders/Detail/Package'
import { calculateAgeFromDOB } from '@/utils/dateUtils'

const status = [
  {
    value: false,
    name: 'Inactive',
    render: () => <span style={{ color: 'red' }}>Inactive</span>,
  },
  {
    value: true,
    name: 'Active',
    render: () => <span style={{ color: 'green' }}>Active</span>,
  },
]

const statusString = [
  { value: 'Inactive', name: 'Inactive', color: 'red' },
  { value: 'Active', name: 'Active', color: 'green' },
]

const isAutoOrder = [
  { value: false, name: 'No' },
  { value: true, name: 'Yes' },
]

const osBalanceStatus = [
  { value: 'all', name: 'All(Yes/No)', color: 'all' },
  { value: 'yes', name: 'Yes', color: 'yes' },
  { value: 'no', name: 'No', color: 'no' },
]

const sessionOptions = [
  { value: 'all', name: 'All Sessions' },
  { value: 'current', name: 'Current Session' },
  { value: 'past', name: 'Past Session' },
]

const smsStatus = [
  {
    name: 'Sent',
    value: 1,
  },
  {
    name: 'Failed',
    value: 2,
  },
]

const messageStatus = [
  {
    name: 'Read',
    value: 'Read',
  },
  {
    name: 'Unread',
    value: 'Unread',
  },
]

const appointmentStatus = [
  {
    name: 'All',
    value: undefined,
  },
  {
    name: 'Draft',
    value: 2,
  },
  {
    name: 'Scheduled',
    value: 1,
  },
  {
    name: 'Rescheduled',
    value: 5,
  },
]
// const paymentMethods = [
//   { name: 'Cash', value: 'cash' },
//   { name: 'Nets', value: 'nets' },
//   { name: 'Credit card', value: 'creditCard' },
//   { name: 'Cheque', value: 'cheque' },
//   { name: 'TT', value: 'tt' },
//   { name: 'Giro', value: 'giro' },
// ]

// const titles = [
//   { name: 'Mr', value: 'Mr' },
//   { name: 'Mrs', value: 'Mrs' },
//   { name: 'Miss', value: 'Miss' },
//   { name: 'Ms', value: 'Ms' },
//   { name: 'Dr', value: 'Dr' },
//   { name: 'Prof', value: 'Prof' },
//   { name: 'Rev', value: 'Rev' },
//   { name: 'Others', value: 'Others' },
// ]

// const finTypes = [
//   { name: 'Fin', value: 'Fin' },
//   { name: 'NRIC', value: 'NRIC' },
//   { name: 'Passport', value: 'Passport' },
// ]

// const drugs = [
//   { name: 'drug01 - drug 1', value: 'drug01' },
//   { name: 'drug02 - drug 2', value: 'drug02' },
//   { name: 'drug03 - drug 3', value: 'drug03' },
//   { name: 'drug04 - drug 4', value: 'drug04' },
// ]

// const consumptionMethods = [
//   { name: 'Take', value: 'take' },
//   { name: 'Apply', value: 'apply' },
//   { name: 'Chew', value: 'chew' },
//   { name: 'Dab', value: 'dab' },
//   { name: 'Dissolve', value: 'dissolve' },
//   { name: 'Drop', value: 'drop' },
//   { name: 'Gargle', value: 'gargle' },
//   { name: 'Inhale', value: 'inhale' },
//   { name: 'Inject', value: 'inject' },
// ]

// const dosage = [
//   { name: '1/4', value: '1/4' },
//   { name: '1/2', value: '1/2' },
//   { name: '3/4', value: '3/4' },
//   { name: '1', value: '1' },
//   { name: '10', value: '10' },
//   { name: '15', value: '15' },
//   { name: '20', value: '20' },
// ]

// const dosageUnits = [
//   { name: 'amount', value: 'amount' },
//   { name: 'amp', value: 'amp' },
//   { name: 'bott', value: 'bott' },
//   { name: 'box', value: 'box' },
//   { name: 'cap/s', value: 'cap/s' },
// ]

// const frequency = [
//   { name: '1 hr after Intercourse', value: '01' },
//   { name: '2 hourly', value: '02' },
//   { name: '2 times a day', value: '03' },
//   { name: '3 hourly', value: '04' },
//   { name: '3 times a day', value: '05' },
// ]

// const periods = [
//   { name: 'Day', value: 'day' },
//   { name: 'Week', value: 'week' },
//   { name: 'Month', value: 'month' },
// ]

// const precautions = [
//   { name: 'Anti Inflamation', value: '01' },
//   { name: 'Avoid alcohol', value: '02' },
//   { name: 'Complete whole course of medicine', value: '03' },
//   { name: 'Do not dilute with water', value: '04' },
// ]

// const packageTypes = [
//   { name: 'Pacakge', value: 'package' },
//   { name: 'Open Package', value: 'openpackage' },
// ]

// const suppliers = [
//   { name: 'Supplier 1', value: '1' },
//   { name: 'Supplier 2', value: '0' },
// ]

// const dispUOMs = [
//   { name: 'Box', value: 'Box' },
//   { name: 'Tube', value: 'Tube' },
// ]

// const SDDDescription = [
//   { name: 'A', value: '1' },
//   { name: 'B', value: '2' },
// ]

// const yesNo = [
//   { name: 'Yes', value: '1' },
//   { name: 'No', value: '0' },
// ]

// const gender = [
//   { name: '', value: '' },
//   { name: 'Female', value: 'Female' },
//   { name: 'Male', value: 'Male' },
//   { name: 'Unknown', value: 'Unknown' },
// ]

// const maritalStatus = [
//   { name: 'Divorced', value: 'Divorced' },
//   { name: 'Married', value: 'Married' },
//   { name: 'Single', value: 'Single' },
//   { name: 'Widowed', value: 'Widowed' },
// ]

// const nationality = [
//   { name: 'Singaporean', value: 'Singaporean' },
//   { name: 'Malaysian', value: 'Malaysian' },
//   { name: 'Indian', value: 'Indian' },
//   { name: 'Other', value: 'Other' },
// ]

// const race = [
//   { name: 'Chinese', value: 'Chinese' },
//   { name: 'Malay', value: 'Malay' },
//   { name: 'Indian', value: 'Indian' },
//   { name: 'Other', value: 'Other' },
// ]

// const religion = [
//   { name: 'Buddhist', value: 'Buddhist' },
//   { name: 'Christian', value: 'Christian' },
//   { name: 'Church of England', value: 'Church of England' },
//   { name: 'Hindu', value: 'Hindu' },
//   { name: 'Islam', value: 'Islam' },
//   { name: 'Javanese', value: 'Javanese' },
//   { name: 'Methodist', value: 'Methodist' },
//   { name: 'Muslim', value: 'Muslim' },
//   { name: 'None', value: 'None' },
//   { name: 'Other', value: 'Other' },
// ]

// const language = [
//   { name: 'Bahasa', value: 'Bahasa' },
//   { name: 'Cantonese', value: 'Cantonese' },
//   { name: 'Chinese', value: 'Chinese' },
//   { name: 'English', value: 'English' },
//   { name: 'Hakka', value: 'Hakka' },
//   { name: 'Hokkien', value: 'Hokkien' },
//   { name: 'Japanese', value: 'Japanese' },
//   { name: 'Malay', value: 'Malay' },
//   { name: 'Mandarin', value: 'Mandarin' },
//   { name: 'Others', value: 'Others' },
//   { name: 'Tamil', value: 'Tamil' },
// ]

// const preferredContactMode = [
//   { name: 'Call (Mobile)', value: 'Call (Mobile)' },
//   { name: 'Email', value: 'Email' },
//   { name: 'Fax', value: 'Fax' },
//   { name: 'SMS', value: 'SMS' },
//   { name: 'Letter', value: 'Letter' },
//   { name: 'Call (Office Num.)', value: 'Call (Office Num.)' },
//   { name: 'Call (Home Num.)', value: 'Call (Home Num.)' },
// ]

// const countries = [
//   { name: 'Afghanistan', value: 'Afghanistan' },
//   { name: 'Åland Islands', value: 'Åland Islands' },
//   { name: 'Albania', value: 'Albania' },
//   { name: 'Algeria', value: 'Algeria' },
//   { name: 'American Samoa', value: 'American Samoa' },
//   { name: 'Andorra', value: 'Andorra' },
//   { name: 'Angola', value: 'Angola' },
//   { name: 'Anguilla', value: 'Anguilla' },
//   { name: 'Antarctica', value: 'Antarctica' },
//   { name: 'Antigua and Barbuda', value: 'Antigua and Barbuda' },
//   { name: 'Argentina', value: 'Argentina' },
//   { name: 'Armenia', value: 'Armenia' },
//   { name: 'Aruba', value: 'Aruba' },
//   { name: 'Australia', value: 'Australia' },
//   { name: 'Austria', value: 'Austria' },
//   { name: 'Azerbaijan', value: 'Azerbaijan' },
//   { name: 'Bahamas', value: 'Bahamas' },
//   { name: 'Bahrain', value: 'Bahrain' },
//   { name: 'Bangladesh', value: 'Bangladesh' },
//   { name: 'Barbados', value: 'Barbados' },
//   { name: 'Belarus', value: 'Belarus' },
//   { name: 'Belgium', value: 'Belgium' },
//   { name: 'Belize', value: 'Belize' },
//   { name: 'Benin', value: 'Benin' },
//   { name: 'Bermuda', value: 'Bermuda' },
//   { name: 'Bhutan', value: 'Bhutan' },
//   {
//     name: 'Bolivia (Plurinational State of)',
//     value: 'Bolivia (Plurinational State of)',
//   },
//   {
//     name: 'Bonaire Sint Eustatius and Saba',
//     value: 'Bonaire Sint Eustatius and Saba',
//   },
//   { name: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina' },
//   { name: 'Botswana', value: 'Botswana' },
//   { name: 'Bouvet Island', value: 'Bouvet Island' },
//   { name: 'Brazil', value: 'Brazil' },
//   {
//     name: 'British Indian Ocean Territory',
//     value: 'British Indian Ocean Territory',
//   },
//   {
//     name: 'United States Minor Outlying Islands',
//     value: 'United States Minor Outlying Islands',
//   },
//   { name: 'Virgin Islands (British)', value: 'Virgin Islands (British)' },
//   { name: 'Virgin Islands (U.S.)', value: 'Virgin Islands (U.S.)' },
//   { name: 'Brunei Darussalam', value: 'Brunei Darussalam' },
//   { name: 'Bulgaria', value: 'Bulgaria' },
//   { name: 'Burkina Faso', value: 'Burkina Faso' },
//   { name: 'Burundi', value: 'Burundi' },
//   { name: 'Cambodia', value: 'Cambodia' },
//   { name: 'Cameroon', value: 'Cameroon' },
//   { name: 'Canada', value: 'Canada' },
//   { name: 'Cabo Verde', value: 'Cabo Verde' },
//   { name: 'Cayman Islands', value: 'Cayman Islands' },
//   { name: 'Central African Republic', value: 'Central African Republic' },
//   { name: 'Chad', value: 'Chad' },
//   { name: 'Chile', value: 'Chile' },
//   { name: 'China', value: 'China' },
//   { name: 'Christmas Island', value: 'Christmas Island' },
//   { name: 'Cocos (Keeling) Islands', value: 'Cocos (Keeling) Islands' },
//   { name: 'Colombia', value: 'Colombia' },
//   { name: 'Comoros', value: 'Comoros' },
//   { name: 'Congo', value: 'Congo' },
//   {
//     name: 'Congo (Democratic Republic of the)',
//     value: 'Congo (Democratic Republic of the)',
//   },
//   { name: 'Cook Islands', value: 'Cook Islands' },
//   { name: 'Costa Rica', value: 'Costa Rica' },
//   { name: 'Croatia', value: 'Croatia' },
//   { name: 'Cuba', value: 'Cuba' },
//   { name: 'Curaçao', value: 'Curaçao' },
//   { name: 'Cyprus', value: 'Cyprus' },
//   { name: 'Czech Republic', value: 'Czech Republic' },
//   { name: 'Denmark', value: 'Denmark' },
//   { name: 'Djibouti', value: 'Djibouti' },
//   { name: 'Dominica', value: 'Dominica' },
//   { name: 'Dominican Republic', value: 'Dominican Republic' },
//   { name: 'Ecuador', value: 'Ecuador' },
//   { name: 'Egypt', value: 'Egypt' },
//   { name: 'El Salvador', value: 'El Salvador' },
//   { name: 'Equatorial Guinea', value: 'Equatorial Guinea' },
//   { name: 'Eritrea', value: 'Eritrea' },
//   { name: 'Estonia', value: 'Estonia' },
//   { name: 'Ethiopia', value: 'Ethiopia' },
//   { name: 'Falkland Islands (Malvinas)', value: 'Falkland Islands (Malvinas)' },
//   { name: 'Faroe Islands', value: 'Faroe Islands' },
//   { name: 'Fiji', value: 'Fiji' },
//   { name: 'Finland', value: 'Finland' },
//   { name: 'France', value: 'France' },
//   { name: 'French Guiana', value: 'French Guiana' },
//   { name: 'French Polynesia', value: 'French Polynesia' },
//   { name: 'French Southern Territories', value: 'French Southern Territories' },
//   { name: 'Gabon', value: 'Gabon' },
//   { name: 'Gambia', value: 'Gambia' },
//   { name: 'Georgia', value: 'Georgia' },
//   { name: 'Germany', value: 'Germany' },
//   { name: 'Ghana', value: 'Ghana' },
//   { name: 'Gibraltar', value: 'Gibraltar' },
//   { name: 'Greece', value: 'Greece' },
//   { name: 'Greenland', value: 'Greenland' },
//   { name: 'Grenada', value: 'Grenada' },
//   { name: 'Guadeloupe', value: 'Guadeloupe' },
//   { name: 'Guam', value: 'Guam' },
//   { name: 'Guatemala', value: 'Guatemala' },
//   { name: 'Guernsey', value: 'Guernsey' },
//   { name: 'Guinea', value: 'Guinea' },
//   { name: 'Guinea-Bissau', value: 'Guinea-Bissau' },
//   { name: 'Guyana', value: 'Guyana' },
//   { name: 'Haiti', value: 'Haiti' },
//   {
//     name: 'Heard Island and McDonald Islands',
//     value: 'Heard Island and McDonald Islands',
//   },
//   { name: 'Holy See', value: 'Holy See' },
//   { name: 'Honduras', value: 'Honduras' },
//   { name: 'Hong Kong', value: 'Hong Kong' },
//   { name: 'Hungary', value: 'Hungary' },
//   { name: 'Iceland', value: 'Iceland' },
//   { name: 'India', value: 'India' },
//   { name: 'Indonesia', value: 'Indonesia' },
//   { name: 'Côte dIvoire', value: 'Côte dIvoire' },
//   { name: 'Iran (Islamic Republic of)', value: 'Iran (Islamic Republic of)' },
//   { name: 'Iraq', value: 'Iraq' },
//   { name: 'Ireland', value: 'Ireland' },
//   { name: 'Isle of Man', value: 'Isle of Man' },
//   { name: 'Israel', value: 'Israel' },
//   { name: 'Italy', value: 'Italy' },
//   { name: 'Jamaica', value: 'Jamaica' },
//   { name: 'Japan', value: 'Japan' },
//   { name: 'Jersey', value: 'Jersey' },
//   { name: 'Jordan', value: 'Jordan' },
//   { name: 'Kazakhstan', value: 'Kazakhstan' },
//   { name: 'Kenya', value: 'Kenya' },
//   { name: 'Kiribati', value: 'Kiribati' },
//   { name: 'Kuwait', value: 'Kuwait' },
//   { name: 'Kyrgyzstan', value: 'Kyrgyzstan' },
//   {
//     name: 'Lao Peoples Democratic Republic',
//     value: 'Lao Peoples Democratic Republic',
//   },
//   { name: 'Latvia', value: 'Latvia' },
//   { name: 'Lebanon', value: 'Lebanon' },
//   { name: 'Lesotho', value: 'Lesotho' },
//   { name: 'Liberia', value: 'Liberia' },
//   { name: 'Libya', value: 'Libya' },
//   { name: 'Liechtenstein', value: 'Liechtenstein' },
//   { name: 'Lithuania', value: 'Lithuania' },
//   { name: 'Luxembourg', value: 'Luxembourg' },
//   { name: 'Macao', value: 'Macao' },
//   {
//     name: 'Macedonia (the former Yugoslav Republic of)',
//     value: 'Macedonia (the former Yugoslav Republic of)',
//   },
//   { name: 'Madagascar', value: 'Madagascar' },
//   { name: 'Malawi', value: 'Malawi' },
//   { name: 'Malaysia', value: 'Malaysia' },
//   { name: 'Maldives', value: 'Maldives' },
//   { name: 'Mali', value: 'Mali' },
//   { name: 'Malta', value: 'Malta' },
//   { name: 'Marshall Islands', value: 'Marshall Islands' },
//   { name: 'Martinique', value: 'Martinique' },
//   { name: 'Mauritania', value: 'Mauritania' },
//   { name: 'Mauritius', value: 'Mauritius' },
//   { name: 'Mayotte', value: 'Mayotte' },
//   { name: 'Mexico', value: 'Mexico' },
//   {
//     name: 'Micronesia (Federated States of)',
//     value: 'Micronesia (Federated States of)',
//   },
//   { name: 'Moldova (Republic of)', value: 'Moldova (Republic of)' },
//   { name: 'Monaco', value: 'Monaco' },
//   { name: 'Mongolia', value: 'Mongolia' },
//   { name: 'Montenegro', value: 'Montenegro' },
//   { name: 'Montserrat', value: 'Montserrat' },
//   { name: 'Morocco', value: 'Morocco' },
//   { name: 'Mozambique', value: 'Mozambique' },
//   { name: 'Myanmar', value: 'Myanmar' },
//   { name: 'Namibia', value: 'Namibia' },
//   { name: 'Nauru', value: 'Nauru' },
//   { name: 'Nepal', value: 'Nepal' },
//   { name: 'Netherlands', value: 'Netherlands' },
//   { name: 'New Caledonia', value: 'New Caledonia' },
//   { name: 'New Zealand', value: 'New Zealand' },
//   { name: 'Nicaragua', value: 'Nicaragua' },
//   { name: 'Niger', value: 'Niger' },
//   { name: 'Nigeria', value: 'Nigeria' },
//   { name: 'Niue', value: 'Niue' },
//   { name: 'Norfolk Island', value: 'Norfolk Island' },
//   {
//     name: 'Korea (Democratic Peoples Republic of)',
//     value: 'Korea (Democratic Peoples Republic of)',
//   },
//   { name: 'Northern Mariana Islands', value: 'Northern Mariana Islands' },
//   { name: 'Norway', value: 'Norway' },
//   { name: 'Oman', value: 'Oman' },
//   { name: 'Pakistan', value: 'Pakistan' },
//   { name: 'Palau', value: 'Palau' },
//   { name: 'Palestine State of', value: 'Palestine State of' },
//   { name: 'Panama', value: 'Panama' },
//   { name: 'Papua New Guinea', value: 'Papua New Guinea' },
//   { name: 'Paraguay', value: 'Paraguay' },
//   { name: 'Peru', value: 'Peru' },
//   { name: 'Philippines', value: 'Philippines' },
//   { name: 'Pitcairn', value: 'Pitcairn' },
//   { name: 'Poland', value: 'Poland' },
//   { name: 'Portugal', value: 'Portugal' },
//   { name: 'Puerto Rico', value: 'Puerto Rico' },
//   { name: 'Qatar', value: 'Qatar' },
//   { name: 'Republic of Kosovo', value: 'Republic of Kosovo' },
//   { name: 'Réunion', value: 'Réunion' },
//   { name: 'Romania', value: 'Romania' },
//   { name: 'Russian Federation', value: 'Russian Federation' },
//   { name: 'Rwanda', value: 'Rwanda' },
//   { name: 'Saint Barthélemy', value: 'Saint Barthélemy' },
//   {
//     name: 'Saint Helena Ascension and Tristan da Cunha',
//     value: 'Saint Helena Ascension and Tristan da Cunha',
//   },
//   { name: 'Saint Kitts and Nevis', value: 'Saint Kitts and Nevis' },
//   { name: 'Saint Lucia', value: 'Saint Lucia' },
//   { name: 'Saint Martin (French part)', value: 'Saint Martin (French part)' },
//   { name: 'Saint Pierre and Miquelon', value: 'Saint Pierre and Miquelon' },
//   {
//     name: 'Saint Vincent and the Grenadines',
//     value: 'Saint Vincent and the Grenadines',
//   },
//   { name: 'Samoa', value: 'Samoa' },
//   { name: 'San Marino', value: 'San Marino' },
//   { name: 'Sao Tome and Principe', value: 'Sao Tome and Principe' },
//   { name: 'Saudi Arabia', value: 'Saudi Arabia' },
//   { name: 'Senegal', value: 'Senegal' },
//   { name: 'Serbia', value: 'Serbia' },
//   { name: 'Seychelles', value: 'Seychelles' },
//   { name: 'Sierra Leone', value: 'Sierra Leone' },
//   { name: 'Singapore', value: 'Singapore' },
//   { name: 'Sint Maarten (Dutch part)', value: 'Sint Maarten (Dutch part)' },
//   { name: 'Slovakia', value: 'Slovakia' },
//   { name: 'Slovenia', value: 'Slovenia' },
//   { name: 'Solomon Islands', value: 'Solomon Islands' },
//   { name: 'Somalia', value: 'Somalia' },
//   { name: 'South Africa', value: 'South Africa' },
//   {
//     name: 'South Georgia and the South Sandwich Islands',
//     value: 'South Georgia and the South Sandwich Islands',
//   },
//   { name: 'Korea (Republic of)', value: 'Korea (Republic of)' },
//   { name: 'South Sudan', value: 'South Sudan' },
//   { name: 'Spain', value: 'Spain' },
//   { name: 'Sri Lanka', value: 'Sri Lanka' },
//   { name: 'Sudan', value: 'Sudan' },
//   { name: 'Suriname', value: 'Suriname' },
//   { name: 'Svalbard and Jan Mayen', value: 'Svalbard and Jan Mayen' },
//   { name: 'Swaziland', value: 'Swaziland' },
//   { name: 'Sweden', value: 'Sweden' },
//   { name: 'Switzerland', value: 'Switzerland' },
//   { name: 'Syrian Arab Republic', value: 'Syrian Arab Republic' },
//   { name: 'Taiwan', value: 'Taiwan' },
//   { name: 'Tajikistan', value: 'Tajikistan' },
//   { name: 'Tanzania United Republic of', value: 'Tanzania United Republic of' },
//   { name: 'Thailand', value: 'Thailand' },
//   { name: 'Timor-Leste', value: 'Timor-Leste' },
//   { name: 'Togo', value: 'Togo' },
//   { name: 'Tokelau', value: 'Tokelau' },
//   { name: 'Tonga', value: 'Tonga' },
//   { name: 'Trinidad and Tobago', value: 'Trinidad and Tobago' },
//   { name: 'Tunisia', value: 'Tunisia' },
//   { name: 'Turkey', value: 'Turkey' },
//   { name: 'Turkmenistan', value: 'Turkmenistan' },
//   { name: 'Turks and Caicos Islands', value: 'Turks and Caicos Islands' },
//   { name: 'Tuvalu', value: 'Tuvalu' },
//   { name: 'Uganda', value: 'Uganda' },
//   { name: 'Ukraine', value: 'Ukraine' },
//   { name: 'United Arab Emirates', value: 'United Arab Emirates' },
//   {
//     name: 'United Kingdom of Great Britain',
//     value: 'United Kingdom of Great Britain',
//   },
//   { name: 'United States of America', value: 'United States of America' },
//   { name: 'Uruguay', value: 'Uruguay' },
//   { name: 'Uzbekistan', value: 'Uzbekistan' },
//   { name: 'Vanuatu', value: 'Vanuatu' },
//   {
//     name: 'Venezuela (Bolivarian Republic of)',
//     value: 'Venezuela (Bolivarian Republic of)',
//   },
//   { name: 'Vietnam', value: 'Vietnam' },
//   { name: 'Wallis and Futuna', value: 'Wallis and Futuna' },
//   { name: 'Western Sahara', value: 'Western Sahara' },
//   { name: 'Yemen', value: 'Yemen' },
//   { name: 'Zambia', value: 'Zambia' },
//   { name: 'Zimbabwe', value: 'Zimbabwe' },
// ]

// const schemes = [
//   { name: 'CHAS Blue', value: 'CHAS Blue' },
//   { name: 'CHAS PG', value: 'CHAS PG' },
//   { name: 'ECHAS BLUE', value: 'ECHAS BLUE' },
//   { name: 'ECHAS ORANGE', value: 'ECHAS ORANGE' },
//   { name: 'ECHAS PA $', value: 'ECHAS PA $' },
//   { name: 'ECHAS PA 100%', value: 'ECHAS PA 100%' },
//   { name: 'ECHAS PG', value: 'ECHAS PG' },
//   { name: 'SIA - 0%', value: 'SIA - 0%' },
//   { name: 'SIA - 30%', value: 'SIA - 30%' },
// ]

const addressTypes = [
  { label: 'Mailing Address', value: '1' },
  { label: 'Primary Address', value: '2' },
]

const currencyRoundingList = [
  {
    name: 'Up',
    value: 'Up',
  },
  {
    name: 'Down',
    value: 'Down',
  },
]

const currencyRoundingToTheClosestList = [
  {
    name: '5 Cents',
    value: '0.05',
  },
  {
    name: '10 Cents',
    value: '0.10',
  },
  {
    name: '50 Cents',
    value: '0.50',
  },
  {
    name: '1 Dollars',
    value: '1',
  },
]

const currenciesList = [
  {
    value: 'Singapore',
    name: 'S$',
  },
  {
    value: 'United States',
    name: '$',
  },
  {
    value: 'Malaysia',
    name: 'RM',
  },
]

const coPayerType = [
  {
    value: 'corporate',
    name: 'Corporate',
  },
  {
    value: 'government',
    name: 'Government',
  },
]

const consultationDocumentTypes = [
  {
    value: '5',
    name: 'Medical Certificate',
    prop: 'corMedicalCertificate',
    getSubject: (r) => {
      return `${moment(r.mcStartDate).format(dateFormatLong)} - ${moment(
        r.mcEndDate,
      ).format(dateFormatLong)} - ${r.mcDays} Day${r.mcDays > 1 ? 's' : ''}`
    },
    convert: (r) => {
      return {
        ...r,
        mcStartEndDate: [
          moment(r.mcStartDate),
          moment(r.mcEndDate),
        ],
      }
    },
    downloadConfig: {
      id: 7,
      key: 'MedicalCertificateId',
      subject: 'Medical Certificate',
      draft: (row) => {
        return {
          MedicalCertificateDetails: [
            {
              ...row,
              unfitType: UNFIT_TYPE[row.unfitTypeFK],
              mcIssueDate: moment(row.mcIssueDate).format(dateFormatLong),
              mcStartDate: moment(row.mcStartDate).format(dateFormatLong),
              mcEndDate: moment(row.mcEndDate).format(dateFormatLong),
            },
          ],
        }
      },
    },
  },
  {
    value: '6',
    name: 'Certificate of Attendance',
    prop: 'corCertificateOfAttendance',
    getSubject: (r) => {
      return `Certificate of Attendance ${r.accompaniedBy}`
    },
    convert: (r) => {
      return {
        ...r,
        issueDate: moment(r.issueDate).format(dateFormatLong),
        // attendanceStartTime: moment(r.attendanceStartTime).format('HH:mm'),
        // attendanceEndTime: moment(r.attendanceEndTime).format('HH:mm'),
      }
    },
    downloadConfig: {
      id: 8,
      key: 'CertificateOfAttendanceId',
      subject: 'Certificate Of Attendance',
      draft: (row) => {
        return {
          CertificateOfAttendanceDetails: [
            {
              ...row,
              issueDate: moment(row.issueDate).format(dateFormatLong),
              attendanceStartTime: moment(row.attendanceStartTime).format(
                'hh:mm A',
              ),
              attendanceEndTime: moment(row.attendanceEndTime).format(
                'hh:mm A',
              ),
            },
          ],
        }
      },
    },
  },
  {
    value: '1',
    name: 'Referral Letter',
    prop: 'corReferralLetter',
    downloadConfig: {
      id: 9,
      key: 'ReferralLetterId',
      subject: 'Referral Letter',
      draft: (row) => {
        return {
          ReferralLetterDetails: [
            {
              ...row,
              referralDate: moment(row.referralDate).format(dateFormatLong),
            },
          ],
        }
      },
    },
  },
  {
    value: '2',
    name: 'Memo',
    prop: 'corMemo',
    downloadConfig: {
      id: 11,
      key: 'memoid',
      subject: 'Memo',
      draft: (row) => {
        return {
          MemoDetails: [
            {
              ...row,
              memoDate: moment(row.memoDate).format(dateFormatLong),
            },
          ],
        }
      },
    },
  },
  {
    value: '3',
    name: 'Vaccination Certificate',
    code: 'Vaccination Cert',
    prop: 'corVaccinationCert',
    downloadKey: 'vaccinationcertificateid',
    downloadConfig: {
      id: 10,
      key: 'vaccinationcertificateid',
      subject: 'Vaccination Certificate',
      draft: (row) => {
        return {
          VaccinationCertificateDetails: [
            {
              ...row,
              certificateDate: moment(row.certificateDate).format(
                dateFormatLong,
              ),
            },
          ],
        }
      },
    },
  },
  {
    value: '4',
    name: 'Others',
    prop: 'corOtherDocuments',
    getSubject: (r) => {
      return r.subject || ''
    },
    downloadKey: 'documentid',
    downloadConfig: {
      id: 12,
      key: 'documentid',
      subject: 'Other Documents',
      draft: (row) => {
        return {
          DocumentDetails: [
            {
              ...row,
              issueDate: moment(row.issueDate).format(dateFormatLong),
            },
          ],
        }
      },
    },
  },
]

const orderTypes = [
  {
    name: 'Medication',
    value: '1',
    prop: 'corPrescriptionItem',
    filter: (r) => !!r.inventoryMedicationFK,
    getSubject: (r) => {
      return r.drugName
    },
    component: (props) => <Medication {...props} />,
  },
  {
    name: 'Vaccination',
    value: '2',
    prop: 'corVaccinationItem',
    getSubject: (r) => r.vaccinationName,
    component: (props) => <Vaccination {...props} />,
  },
  {
    name: 'Service',
    value: '3',
    prop: 'corService',
    getSubject: (r) => r.serviceName,
    component: (props) => <Service {...props} />,
  },
  {
    name: 'Consumable',
    value: '4',
    prop: 'corConsumable',
    getSubject: (r) => r.consumableName,
    component: (props) => <Consumable {...props} />,
  },
  {
    name: 'Open Prescription',
    value: '5',
    prop: 'corPrescriptionItem',
    filter: (r) => !r.inventoryMedicationFK,
    getSubject: (r) => r.drugName,
    component: (props) => <Medication openPrescription {...props} />,
  },
  {
    name: 'Package',
    value: '6',
    component: (props) => <Package {...props} />,
  },
]
const buttonTypes = [
  'RegularButton',
  'IconButton',
  'Fab',
]

export const countryCodes = [
  { name: '+65 Singapore', value: '65' },
  { name: '+60 Malaysia', value: '60' },
  { name: '+62 Indonesia', value: '62' },
  { name: '+63 Philippines', value: '63' },
  { name: '+66 Thailand', value: '66' },
  { name: '+81 Japan', value: '81' },
]

// const localCodes = {}
// export async function getCodes (code) {
//   if (!localCodes[code]) {
//     const r = await request(`/api/CodeTable?ctnames=${code}`)

//     if (r.status === '200') {
//       // console.log(r)
//       localCodes[code] = r.data[code] || []
//     } else {
//       localCodes[code] = []
//     }
//   }
//   // console.log(localCodes[code])
//   return localCodes[code]
// }

const multiplyCodetable = (data, multiplier) => {
  if (multiplier === 1) return data
  let result = [
    ...data,
  ]
  const maxLength = data.length
  for (let i = 1; i <= multiplier; i++) {
    result = [
      ...result,
      ...data.map((item) => ({ ...item, id: maxLength * i + item.id })),
    ]
  }
  return result
}

const defaultParams = {
  pagesize: 99999,
  sorting: [
    { columnName: 'sortOrder', direction: 'asc' },
  ],
  isActive: true,
  excludeInactiveCodes: true,
}

const tenantCodesMap = new Map([
  [
    'doctorprofile',
    {
      ...defaultParams,
      isActive: undefined,
      sorting: [],
    },
  ],
  [
    'clinicianprofile',
    {
      ...defaultParams,
      sorting: [],
    },
  ],
  [
    'ctappointmenttype',
    {
      ...defaultParams,
    },
  ],
  [
    'ctservice',
    {
      ...defaultParams,
      isActive: undefined,
      sorting: [
        { columnName: 'serviceFKNavigation.displayValue', direction: 'asc' },
      ],
    },
  ],
  [
    'inventorymedication',
    {
      ...defaultParams,
      sorting: [
        { columnName: 'displayValue', direction: 'asc' },
      ],
    },
  ],
  [
    'inventoryconsumable',
    {
      ...defaultParams,
      sorting: [
        { columnName: 'displayValue', direction: 'asc' },
      ],
    },
  ],
  [
    'inventoryvaccination',
    {
      ...defaultParams,
      sorting: [
        { columnName: 'displayValue', direction: 'asc' },
      ],
    },
  ],
  [
    'inventorypackage',
    {
      ...defaultParams,
      sorting: [
        { columnName: 'displayValue', direction: 'asc' },
      ],
    },
  ],
  [
    'role',
    {
      ...defaultParams,
      sorting: [],
      isActive: undefined,
    },
  ],
  [
    'ctsupplier',
    {
      ...defaultParams,
    },
  ],
  [
    'ctpaymentmode',
    {
      ...defaultParams,
    },
  ],
  [
    'smstemplate',
    {
      ...defaultParams,
    },
  ],
  [
    'codetable/ctsnomeddiagnosis',
    {
      ...defaultParams,
    },
  ],
  [
    'documenttemplate',
    {
      ...defaultParams,
    },
  ],
  [
    'ctmedicationfrequency',
    {
      ...defaultParams,
    },
  ],
  [
    'ctmedicationdosage',
    {
      ...defaultParams,
    },
  ],
  [
    'copaymentscheme',
    {
      ...defaultParams,
    },
  ],
  [
    'ctcopayer',
    {
      ...defaultParams,
    },
  ],
  [
    'ctmedicationprecaution',
    {
      ...defaultParams,
    },
  ],
])

// always get latest codetable
const skipCache = [
  'doctorprofile',
  'clinicianprofile',
]

const noSortOrderProp = [
  'doctorprofile',
  'clinicianprofile',
  'role',
]

const convertExcludeFields = [
  // 'excludeInactiveCodes',
  'temp',
  'refresh',
]

export const fetchAndSaveCodeTable = async (
  code,
  params,
  refresh = false,
  temp = false,
) => {
  let useGeneral = params === undefined || Object.keys(params).length === 0
  const baseURL = '/api/CodeTable'
  // const generalCodetableURL = `${baseURL}?excludeInactiveCodes=true&ctnames=`
  const searchURL = `${baseURL}/search?excludeInactiveCodes=true&ctname=`

  let url = searchURL

  let criteriaForTenantCodes = defaultParams
  if (tenantCodesMap.has(code.toLowerCase())) {
    url = '/api/'
    useGeneral = false
    criteriaForTenantCodes = tenantCodesMap.get(code.toLowerCase())
  }

  const newParams = {
    ...defaultParams,
    ...params,
  }
  newParams.sorting = noSortOrderProp.includes(code) ? [] : newParams.sorting
  const body = useGeneral
    ? convertToQuery({ ...newParams }, convertExcludeFields)
    : convertToQuery(
        { ...criteriaForTenantCodes, ...params },
        convertExcludeFields,
      )

  const response = await request(`${url}${code}`, {
    method: 'GET',
    body,
  })

  let { status: statusCode, data } = response
  let newData = []
  if (parseInt(statusCode, 10) === 200) {
    newData = [
      ...data.data,
    ]
  }

  if (parseInt(statusCode, 10) === 200) {
    if (skipCache.includes(code)) return newData

    await db.codetable.put({
      code: code.toLowerCase(),
      data: newData,
      updateDate: new Date(), // refresh ? null : new Date(),
      params,
    })
    return newData
  }

  return []
}

export const getAllCodes = async () => {
  const lastLoginDate = localStorage.getItem('_lastLogin')
  const parsedLastLoginDate = moment(lastLoginDate)
  await db.open()
  const ct = await db.codetable.toArray((code) => {
    const results = code.filter((_i) => {
      const { updateDate } = _i
      const parsedUpdateDate =
        updateDate === null ? moment('2001-01-01') : moment(updateDate)
      return parsedUpdateDate.isAfter(parsedLastLoginDate)
    })
    // .map((_i) => ({
    //   code: _i.code,
    //   data: _i.data,
    //   updateDate: _i.updateDate,
    // }))

    const cts = {
      config: {},
    }
    results.forEach((r) => {
      const { code: c, data, ...others } = r
      cts[c.toLowerCase()] = data
      cts.config[c.toLowerCase()] = others
    })
    return cts
  })
  return ct || []
}

export const getCodes = async (payload) => {
  let ctcode
  let params
  let multiply = 1
  let _force = false
  let _temp = false

  const { refresh = false } = payload
  if (typeof payload === 'string') ctcode = payload
  if (typeof payload === 'object') {
    ctcode = payload.code
    params = payload.filter
    multiply = payload.multiplier
    _force = payload.force
    _temp = payload.temp || false
  }

  let result = []

  try {
    if (!ctcode) throw Error('ctcode is undefined / null')

    ctcode = ctcode.toLowerCase()
    await db.open()
    const ct = await db.codetable.get(ctcode)

    // const cookies = new Cookies()
    // const lastLoginDate = cookies.get('_lastLogin')
    const lastLoginDate = localStorage.getItem('_lastLogin')
    const parsedLastLoginDate = moment(lastLoginDate)

    /* not exist in current table, make network call to retrieve data */
    if (ct === undefined || refresh || _force) {
      result = fetchAndSaveCodeTable(ctcode, params, multiply, refresh)
    } else {
      /*  compare updateDate with lastLoginDate
          if updateDate > lastLoginDate, do nothing
          if updateDate is null, always perform network call to get latest copy
          else perform network call and update indexedDB
      */
      const { updateDate, data: existedData } = ct
      const parsedUpdateDate =
        updateDate === null ? moment('2001-01-01') : moment(updateDate)
      // console.log('should update', {
      //   ctcode,
      //   updateDate: parsedUpdateDate.format(),
      //   lastLogin: parsedLastLoginDate.format(),
      // })
      result = parsedUpdateDate.isBefore(parsedLastLoginDate)
        ? fetchAndSaveCodeTable(ctcode, params, multiply)
        : existedData
    }
  } catch (error) {
    console.log({ error })
  }
  return result
}

export const checkShouldRefresh = async (payload) => {
  try {
    const { code, filter } = payload

    await db.open()
    const ct = await db.codetable.get(code.toLowerCase())

    if (ct === undefined) return true

    const { updateDate, params } = ct
    if (!_.isEqual(params, filter)) return true

    return updateDate === null
  } catch (error) {
    console.log({ error })
  }
  return false
}

export const refreshCodetable = async (url) => {
  try {
    const paths = url.split('/')
    const code = paths[2]
    window.g_app._store.dispatch({
      type: 'codetable/refreshCodes',
      payload: { code },
    })
  } catch (error) {
    console.log({ error })
  }
}

export const checkIsCodetableAPI = (url) => {
  try {
    const paths = url.split('/')

    // paths.length >= 3 ? tenantCodes.includes(paths[2].toLowerCase()) : false
    const isTenantCodes =
      paths.length >= 3 ? tenantCodesMap.has(paths[2].toLowerCase()) : false

    const isCodetable = paths.length >= 3 ? paths[2].startsWith('ct') : false
    // console.log({ isTenantCodes, isCodetable })
    return isTenantCodes || isCodetable
  } catch (error) {
    console.log({ error })
  }
  return false
}

export const getTenantCodes = async (tenantCode) => {
  // todo: paging
  const response = await request(`/api/${tenantCode}`, { method: 'GET' })
  const { status: statusCode, data } = response
  if (statusCode === '200' || statusCode === 200) {
    return data
  }
  return {}
}

export const getServices = (data) => {
  // eslint-disable-next-line compat/compat
  const services = _.orderBy(
    Object.values(_.groupBy(data, 'serviceId')).map((o) => {
      return {
        value: o[0].serviceId,
        code: o[0].code,
        name: o[0].displayValue,
        serviceCenters: o.map((m) => {
          return {
            value: m.serviceCenterId,
            name: m.serviceCenter,
          }
        }),
      }
    }),
    [
      'name',
    ],
    [
      'asc',
    ],
  )
  // eslint-disable-next-line compat/compat
  const serviceCenters = _.orderBy(
    Object.values(_.groupBy(data, 'serviceCenterId')).map((o) => {
      return {
        value: o[0].serviceCenterId,
        name: o[0].serviceCenter,
        services: o.map((m) => {
          return {
            value: m.serviceId,
            name: m.displayValue,
          }
        }),
      }
    }),
    [
      'name',
    ],
    [
      'asc',
    ],
  )

  return {
    serviceCenterServices: data,
    services,
    serviceCenters,
  }
}

export const podoOrderType = [
  {
    value: 1,
    name: 'Medication',
    prop: 'purchaseOrderMedicationItem',
    itemFKName: 'inventoryMedicationFK',
    ctName: 'inventorymedication',
    stateName: 'MedicationItemList',
    itemCode: 'inventoryMedicationCode',
    itemName: 'inventoryMedicationName',
  },
  {
    value: 2,
    name: 'Vaccination',
    prop: 'purchaseOrderVaccinationItem',
    itemFKName: 'inventoryVaccinationFK',
    ctName: 'inventoryvaccination',
    stateName: 'VaccinationItemList',
    itemCode: 'inventoryVaccinationCode',
    itemName: 'inventoryVaccinationName',
  },
  {
    value: 3,
    name: 'Consumable',
    prop: 'purchaseOrderConsumableItem',
    itemFKName: 'inventoryConsumableFK',
    ctName: 'inventoryconsumable',
    stateName: 'ConsumableItemList',
    itemCode: 'inventoryConsumableCode',
    itemName: 'inventoryConsumableName',
  },
]

export const InventoryTypes = [
  {
    value: 1,
    name: 'Comsumables',
    prop: 'consumableValueDto',
    itemFKName: 'inventoryConsumableFK',
    ctName: 'inventoryconsumable',
  },
  {
    value: 2,
    name: 'Medications',
    prop: 'medicationValueDto',
    itemFKName: 'inventoryMedicationFK',
    ctName: 'inventorymedication',
  },
  {
    value: 3,
    name: 'Vaccines',
    prop: 'vaccinationValueDto',
    itemFKName: 'inventoryVaccinationFK',
    ctName: 'inventoryvaccination',
  },
  {
    value: 4,
    name: 'Services',
    prop: 'serviceValueDto',
    itemFKName: 'serviceCenterServiceFK',
    ctName: 'ctservice',
  },
  {
    value: 5,
    name: 'Packages',
    prop: 'packageValueDto',
    itemFKName: 'inventoryPackageFK',
    ctName: 'inventorypackage',
  },
]

const tagList = [
  {
    value: 'PatientName',
    text: '<#PatientName#>',
    url: '',
    getter: () => {
      const { patient } = window.g_app._store.getState()
      if (patient && patient.entity) {
        return patient.entity.name
      }
      return 'N.A.'
    },
  },
  {
    value: 'AppointmentDateTime',
    text: '<#AppointmentDateTime#>',
    url: '',
    getter: () => {
      const { visitRegistration = {} } = window.g_app._store.getState()
      const { entity } = visitRegistration
      if (entity && entity.visit && entity.visit.appointmentDatetTime) {
        return moment(entity.visit.appointmentDatetTime).format(
          dateFormatLongWithTime,
        )
      }
      return 'N.A.'
    },
  },
  {
    value: 'Doctor',
    text: '<#Doctor#>',
    url: '',
    getter: () => {
      const { user } = window.g_app._store.getState()
      if (user && user.data && user.data.clinicianProfile) {
        return `${user.data.clinicianProfile.title} ${user.data.clinicianProfile
          .name}`
      }
      return 'N.A.'
    },
  },
  {
    value: 'NewLine',
    text: '<#NewLine#>',
    url: '',
    getter: () => {
      return '<br/>'
    },
  },
  {
    value: 'PatientCallingName',
    text: '<#PatientCallingName#>',
    url: '',
    getter: () => {
      const { patient } = window.g_app._store.getState()
      if (patient && patient.entity) {
        return patient.entity.callingName
      }
      return 'N.A.'
    },
  },
  {
    value: 'LastVisitDate',
    text: '<#LastVisitDate#>',
    url: '',
    getter: () => {
      const { patient } = window.g_app._store.getState()
      if (patient && patient.entity && patient.entity.lastVisitDate) {
        return moment(patient.entity.lastVisitDate).format(
          dateFormatLongWithTime,
        )
      }
      return 'N.A.'
    },
  },
  {
    value: 'PatientInfo',
    text: '<#PatientInfo#>',
    url: '',
    getter: () => {
      const { patient, codetable } = window.g_app._store.getState()
      let result
      if (patient && patient.entity) {
        let patientGender = codetable.ctgender.find(
          (x) => x.id === patient.entity.genderFK,
        )
        let patientAllergy
        for (
          let index = 0;
          index < patient.entity.patientAllergy.length;
          index++
        ) {
          if (patient.entity.patientAllergy[index].type === 'Allergy')
            patientAllergy =
              (patientAllergy ? `${patientAllergy}, ` : '') +
              patient.entity.patientAllergy[index].allergyName
        }
        result = `Patient Name: ${patient.entity.name}`
        result += `<br/>Patient Ref. No.: ${patient.entity.patientReferenceNo}`
        result += `<br/>Patient Acc. No.: ${patient.entity.patientAccountNo}`
        result += `<br/>Gender/Age: ${patientGender.name.substring(
          0,
          1,
        )}/${calculateAgeFromDOB(patient.entity.dob)}`

        result += `<br/>Drug Allergy: ${patientAllergy || 'NA'}`
      }
      return result || 'N.A.'
    },
  },
]

export const getInventoryItem = (
  list,
  value,
  itemFKName,
  rows = [],
  outstandingItem = undefined,
) => {
  let newRows = rows.filter((x) => x.type === value && x.isDeleted === false)
  const groupByFKArray = _(newRows)
    .groupBy((x) => x[itemFKName])
    .map((v, key) => ({
      [itemFKName]: parseInt(key, 10),
      totalCurrentReceivingQty: _.sumBy(v, 'currentReceivingQty'),
    }))
    .value()

  let fullyReceivedArray = []
  if (outstandingItem) {
    fullyReceivedArray = groupByFKArray.filter((o) => {
      const item = outstandingItem.find((i) => i[itemFKName] === o[itemFKName])
      if (
        item &&
        item.orderQuantity - item.quantityReceived ===
          o.totalCurrentReceivingQty
      ) {
        return {
          ...o,
        }
      }
      return null
    })
  }

  newRows = newRows.filter((o) =>
    fullyReceivedArray.find((i) => i[itemFKName] === o[itemFKName]),
  )

  let inventoryItemList = _.differenceBy(list, newRows, itemFKName)

  if (outstandingItem) {
    const filterOutstandingItem = outstandingItem.filter(
      (x) => x.type === value,
    )

    inventoryItemList = _.intersectionBy(
      inventoryItemList,
      filterOutstandingItem,
      itemFKName,
    )
  }

  if (outstandingItem) {
    inventoryItemList = inventoryItemList.map((o) => {
      const { orderQuantity, quantityReceived } = outstandingItem.find(
        (i) => i[itemFKName] === o[itemFKName],
      )
      // const { totalCurrentReceivingQty } = groupByFKArray.find(
      //   (i) => i[itemFKName] === o[itemFKName],
      // )
      const item = groupByFKArray.find((i) => i[itemFKName] === o[itemFKName])
      let remainingQty
      if (item) {
        remainingQty =
          orderQuantity - quantityReceived - item.totalCurrentReceivingQty
      }
      return {
        ...o,
        remainingQty,
      }
    })
  }

  return {
    inventoryItemList,
  }
}

export const getInventoryItemList = (
  list,
  itemFKName = undefined,
  stateName = undefined,
) => {
  let inventoryItemList = list.map((x) => {
    return {
      value: x.id,
      name: x.displayValue,
      code: x.code,
      // uom: prescribingUOM.id,
      uom: x.prescribingUOM ? x.prescribingUOM.name : x.uom.name,
      sellingPrice: x.sellingPrice,
      [itemFKName]: x.id,
      stateName,
      itemFK: x.id,
      isActive: x.isActive,
    }
  })
  return {
    inventoryItemList,
  }
}

export const InvoicePayerType = [
  {
    invoicePayerFK: 1,
    name: 'PATIENT',
    listName: 'patientPaymentTxn',
  },
  // {
  //   invoicePayerFK: 2,
  //   name: 'COPAYER',
  //   listName: 'coPayerPaymentTxn',
  // },
  // {
  //   invoicePayerFK: 3,
  //   name: 'GOVT_COPAYER',
  //   listName: 'govCoPayerPaymentTxn',
  // },
]
export const recurrenceTypes = [
  {
    value: 'daily',
    name: 'Daily',
  },
  {
    value: 'weekly',
    name: 'Weekly',
  },
  {
    value: 'monthly',
    name: 'Monthly',
  },
]

export const inventoryAdjustmentStatus = [
  { value: 1, name: 'Draft' },
  { value: 2, name: 'Finalized' },
  { value: 3, name: 'Discarded' },
]

export const shortcutKeys = [
  { value: 'F1', name: 'F1' },
  { value: 'F2', name: 'F2' },
  { value: 'F3', name: 'F3' },
  { value: 'F4', name: 'F4' },
  { value: 'F5', name: 'F5' },
  { value: 'F6', name: 'F6' },
  { value: 'F7', name: 'F7' },
  { value: 'F8', name: 'F8' },
  { value: 'F9', name: 'F9' },
  { value: 'F10', name: 'F10' },
  { value: 'F11', name: 'F11' },
  { value: 'F12', name: 'F12' },
]

export const roundToPrecision = (x, precision) => {
  const y = +x + (precision === undefined ? 0.5 : precision / 2)
  return y - y % (precision === undefined ? 1 : +precision)
}

module.exports = {
  // paymentMethods,
  // titles,
  // finTypes,
  // drugs,
  // consumptionMethods,
  // dosage,
  // dosageUnits,
  // frequency,
  // periods,
  // precautions,
  // packageTypes,
  // suppliers,
  // dispUOMs,
  // SDDDescription,
  // yesNo,
  // gender,
  getCodes,
  // maritalStatus,
  // nationality,
  // race,
  // religion,
  // language,
  // preferredContactMode,
  // countries,
  // schemes,
  appointmentStatus,
  recurrenceTypes,
  status,
  statusString,
  isAutoOrder,
  addressTypes,
  orderTypes,
  currenciesList,
  currencyRoundingList,
  currencyRoundingToTheClosestList,
  coPayerType,
  messageStatus,
  smsStatus,
  // country,
  sessionOptions,
  consultationDocumentTypes,
  getServices,
  tagList,
  osBalanceStatus,
  buttonTypes,
  inventoryAdjustmentStatus,
  fetchAndSaveCodeTable,
  shortcutKeys,
  roundToPrecision,
  ...module.exports,
}
