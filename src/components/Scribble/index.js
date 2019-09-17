import React from 'react'
import { Paper, withStyles, Typography, Slider, List } from '@material-ui/core'

import { CompactPicker } from 'react-color'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import MoreVert from '@material-ui/icons/MoreVert'
import ColorLens from '@material-ui/icons/ColorLens'
import Pen from '@material-ui/icons/Create'
import InsertPhoto from '@material-ui/icons/InsertPhoto'
import Title from '@material-ui/icons/Title'
import Dropzone from 'react-dropzone'
import UndoIcon from '@material-ui/icons/Undo'
import RedoIcon from '@material-ui/icons/Redo'
import DeleteIcon from '@material-ui/icons/Delete'
import Save from '@material-ui/icons/SaveAlt'
import Erase from '@material-ui/icons/HowToVote'
import Remove from '@material-ui/icons/Remove'
import Backspace from '@material-ui/icons/ArrowBack'
import Rectangle from '@material-ui/icons/CropLandscape'
import Circle from '@material-ui/icons/PanoramaFishEye'
import Move from '@material-ui/icons/OpenWith'
import Select from '@material-ui/icons/PanTool'
import Visibility from '@material-ui/icons/Visibility'
import InVisibility from '@material-ui/icons/VisibilityOff'
import { connect } from 'dva'
import { Radio } from 'antd'
import Yup from '@/utils/yup'
import {
  GridContainer,
  GridItem,
  Popover,
  Switch,
  SketchField,
  Tools,
  Tooltip,
  TextField,
  ProgressButton,
  Button,
  withFormikExtend,
  FastField,
} from '@/components'






const styles = () => ({
  container: {
    border: '1px solid #0d3349',
    backgroundColor: '#ffffff',
  },
  dropArea: {
    width: '100%',
    height: '90px',
    border: '2px dashed rgb(102, 102, 102)',
    borderStyle: 'dashed',
    borderRadius: '5px',
    textAlign: 'center',
    paddingTop: '30px',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  actionDiv: {
    float: 'right',
    textAlign: 'center',
    marginTop: '5px',
  },
  layout: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
  },
  gridItem: {
    position: 'relative',
  },
  scribbleSubject: {
    width: 250,
    display: 'flex',
    float: 'left',
    paddingRight: 10,
  },
  radioButtonPadding: {
    paddingTop: 5,
  },
  templateImage: {
    maxHeight: 130,
    overflow: 'auto',
    alignItems: 'center',
  },
  imageOption: {
    padding: 20,
  },
  rightButton: {
    display: 'flex',
    float: 'right',
    padding: 2,
  },
  sketchArea: {
    paddingTop: 30,
  },
})



let temp = null
@withFormikExtend({
  // displayName: 'purchaseOrder',
  // mapPropsToValues: ({ purchaseOrder }) => {
  //   return purchaseOrder.entity || purchaseOrder.default
  // },
  mapPropsToValues: ({ scriblenotes }) =>
 {return scriblenotes.entity === '' ? "" : scriblenotes.entity},
  validationSchema: Yup.object().shape({
    subject: Yup.string()
      .required()
      .max(20, 'Subject should not exceed 20 characters'),
  }),
  handleSubmit: (values, { props }) => {
    console.log(values)
    const { dispatch, scriblenotes } = props

    props.addScribble(values.subject, temp)
    props.toggleScribbleModal()
    // dispatch({
    //   type: 'clinicalnotes/updateState',
    //   payload: {
    //     ...clinicalnotes,
    //     notes: {
    //       notesArray: [
    //         ...clinicalnotes.notes.notesArray,
    //         { subject: values.subject, lineData: temp },
    //       ],
    //     },
    //   },
    // })

    // // console.log('restValues')
    // console.log('restValues', values)
    // const { effectiveDates, ...restValues } = values
    // const { dispatch, history, onConfirm, medicationDetail } = props
    // console.log('medicationDetail', medicationDetail)
    // const payload = {
    //   ...restValues,
    //   effectiveStartDate: effectiveDates[0],
    //   effectiveEndDate: effectiveDates[1],
    // }
    // dispatch({
    //   type: 'medicationDetail/upsert',
    //   payload,
    // }).then((r) => {
    //   if (r) {
    //     if (onConfirm) onConfirm()
    //     dispatch({
    //       type: 'medicationDetail/query',
    //     })
    //     history.push('/inventory/master')
    //   }
    // })
  },
})

@connect(({ clinicalnotes }) => ({
  clinicalnotes,
}))
class Scribble extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tool: Tools.Pencil,
      lineWidth: 10,
      lineColor: 'black',
      backgroundColor: 'transparent',
      toolsVisible: false,
      colorVisible: false,
      imageVisible: false,
      text: 'a text, cool!',
      fillColor: '#68CCCA',
      fillWithColor: false,
      fillWithBackgroundColor: false,
      canUndo: false,
      canRedo: false,
      canClear: false,
      sketchHeight: 770,
      sketchWidth: window.width,
      hideEnable: false,
      disableAddImage: false,
      indexCount: 1,
      exampleImage:
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgACgAJ/AAD//gAQTGF2YzU1LjE4LjEwMgD/2wBDAAgKCgsKCw0NDQ0NDRAPEBAQEBAQEBAQEBASEhIVFRUSEhIQEBISFBQVFRcXFxUVFRUXFxkZGR4eHBwjIyQrKzP/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsBAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKCxAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/wAARCAHgA1QDASIAAhIAAxIA/9oADAMBAAIRAxEAPwDyOnUU6u4DyBBTxSCn0xksTCnigCngUxkslgBTwKUCngUyiWSxAKkApQKkApjRLZDY0CnYqQLUgWmUJszbIsU7FTbadtpF2HczuQ4pdtT7aXbSKsXcxuQYpdtT7aXbUl2NbmVyDbRirG2jbUl2NLmVyvilxU+2l21Bdja5lcr4o21Y20baguxrcyuV8UYqxtpNtQXY2uZXIMUYqfbRtqCza5lcr4oxVjbRtqSja5lcr4oxU+2jbUlG9zK5XxRirG2jbUlG9zK5XxRip9tG2pKN7mVyvijFT7aNtSUb3MrlfFGKsbaTbUlG6ZmmV8UYqxtpNtSUdCZkmV8UYqxtpNtSUdCZmmV8UmKsbaTbSKOlMzTK+KTFWNtG2kM6UzNMrYoxVjbSbaBnUiIsr4puKsbaTbTGdURRK+KTFWMU3FMpHVEIkGKbip8UmKaLSOmJUUQYpMVNikxQkaJGqRpFEOKMVLikxSSNEi0jRIixSYqbFJipsa2GkapEWKTFS4oxUWNbCSNkiLFJipcUYqbGtiUjZIixRipMUYrOxtYhI2SIsUYqXFJis7GtiLG1iPFJipcUYrOxtYzsbWIsUYqXFJis7GtjOxtYjxRipMUYrOxrYzsbWIsUYqXFGKzsa2MrG1iLFGKkxRisrG1jOxtYjxRipMUYrKxtYysbWIsUYqXFGKysbWMbG1iLFGKkxRisbG1jKxtYixRipcUYrGxtymNjaxDijFS4oxWFjexjY2sQ4pMVNikxXPY35TCxtykOKTFTYpMVzWNnE57G3KQ4puKnxTcVzNGzRzNGrRDTcVLim4rkaNWjlaNWiKm1LimVyNGjRytFtEdNqSm1zMtnOymhlNp9NrBlMxZTG02n02sWUzFjY2ilorIozKNGnikFPFcAHxLExRThQKeKoZDExQKeBQBUgFMaIZLFAqQCgCpQKpFIhsiTACpQtOAqdVpotIhsykyMLUoWpglTBKaRokJs55SKwWn7atCOn+XSsaWLbOdyKm2l21c8uneXUWLNrnNzFLbS7au+XRsqbFHRc5+YpbaXbVzZS7KmxR0XOfmKW2jbV3ZRsqbFHTc5+YpbaNtXdlJsqbFHRc5+Yp7aNtXNlGypsWdNzDmKe2k21d2UbKixZ03OfmKW2jbVzZRsqLFnTc5+Yp7aTbV3ZSbKixZ1XOfmKe2jbVzZRsqLFnTcw5ilto21c2UbKixZ03MOYp7aTbV3ZSbKixdjquc6kU9tJtq7spNlZ2NLHUmYKRT20m2ruyk2VmaWOtMwUintpNtXNlGyoLsdaZgpFLbSbau7KTZUFWOxMwUiltpNtXdlJsqS7HamYRkUttJtq7spNlSUd8WYxkUttN21d2UmyhFHoQM4Mo7aTbVzZTSlUi0j0YDpFLbTcVcK0zbTSNUjtgjanEq4puKtbabtoSN1E1ijojErYpMVY20m2oSN1EEjpjEr4pMVY20bahI3USFE6VEr4pMVY20m2skjpUTNROlRIMUmKsbaTbWNjo5TJROlRIMUmKsbaNtY2OnlMVE6lEr4oxU+2jbWHKdPKYcp08hBikxVjbSbaw5To5TDlOrlIMUYqfbRtrDlOnlOflOrlIMUmKsbaNtc/KdPKc/KdPKV8UYqfbRtrn5Tp5Tn5Tq5SDFGKn20baw5To5Tn5Tp5CDFGKn20ba5+U6eU5+U6eQr4oxVjbRtrn5Tp5Tn5Tq5CvijFWNtG2uflOjlOblOrkK+KTFWNtG2uflOnlOXlOrkK+KMVY20ba5uU6eU5eU6uQrYpMVZ20ba5eU6eU5OU6+Qq4pMVa20m2uRxOrlOJxOtwKmKbire2mFa4HE65QOBxOqUCoRTCKslajIrzZI3nE86SN5xK5FMIqYimEV58kayR58kayRDTalNMrjaLkjjZciOm0+m1zMpnOymMptPptYMpmDGxtFLRWRRmM0xT6aKeK84Z8IxMcKeKQVIKY0QxMcBUoFNAqUCqRSM2SxwFTqKaBVhRVoaMZMiTHKtW0SmotaEaVrFFowmznqyGrHVlYq73SPDX2mJZ7lmjRuURcBmH94kg4B7DGa6UeGdOH/AD2/77/+xpnmVcXJTahay011uYyme/hsppVKMZ1nPmkua0XZJPbo9TyMRU/yq9b/AOEa0/8A6bf99/8A2NL/AMI3p/8A02/77/8Asa9Q8f65V/u/d/wT5lzPrv7Ewf8A09/8D/8AtTyXyqPKr1r/AIRvT/8Apt/33/8AY0v/AAjmn/8ATb/vv/7GvYPH+uVf7v3f8E+P5z7D+xMH/wBPf/A//tTyXyqPKr1r/hHNP/6bf99//Y0f8I5p/wD02/77/wDsa9g8f65V/u/d/wAE+P5z7D+xMH/09/8AA/8A7U8l8qjyq9a/4RzT/wDpt/33/wDY0n/COaf/ANNv++//ALGvYPH+uVf7v3f8E+P5z7D+xMH/ANPf/A//ALU8m8qjyq9Z/wCEb0//AKbf99//AGNH/CN6f/02/wC+/wD7GvYPH+uVf7v3f8E+Q5z6/wDsXB/9Pf8AwNf/ACJ5N5VJ5Vetf8I3p/8A02/77/8AsaP+Eb0//pt/33/9jXsHj/XKv937v+CfI859f/YuE/6e/wDgf/2p5L5VHlV61/wjen/9Nv8Avv8A+xo/4RvT/wDpt/33/wDY17B431yr/d+7/gnyPOfXf2LhP+nv/gf/AADyXyqTyq9b/wCEb0//AKbf99//AGNH/CN6f/02/wC+/wD7GvZPH+uVf7v3f8E+T5z63+xsJ/09/wDA/wDgHknlUeVXrf8Awjen/wDTb/vv/wCxo/4RvT/+m3/ff/2NeweP9bq/3fu/4J8nzn1n9jYT/p7/AOBf8A8j8qjyq9b/AOEb0/8A6bf99/8A2NH/AAjen/8ATb/vv/7GvYPH+uVf7v3f8E+V5z6v+x8J/wBPf/Av+AeSeVR5Vet/8I1p/wD02/77/wDsaP8AhGtP/wCm3/ff/wBjXsHj/XKv937v+CfLc59T/Y+F/wCnv/gX/API/Ko8qvXP+Ea0/wD6bf8Aff8A9jR/wjWn/wDTb/vv/wCxr2Dx/rlX+793/BPmOc+o/sjC/wDTz/wL/gHkflUnlV67/wAI1p3/AE2/77/+xo/4RrTv+m3/AH3/APY17B431yr/AHfu/wCCfM859P8A2Thf+nn/AIF/wDyLyqTyq9e/4RrTv+m3/ff/ANjSf8I1p3/Tb/vv/wCxr2jxvrlX+793/BPm1M+l/srDf9PP/Av+AeReVSeVXr3/AAjOnf8ATb/vv/7Gj/hGdO/6bf8Aff8A9jXsnjfXKv8Ad+7/AIJ88pn0X9l4b/p5/wCBf8A8g8qjyq9f/wCEZ07/AKbf99//AGNH/CM6d/02/wC+/wD7GvZPG+uVf7v3f8E8FTPf/szD/wDTz/wL/gHj/lUnlV7D/wAIzp3/AE2/77/+xpP+EY07/pt/33/9jXtHi/XKv937v+CeKpnuf2dQ/v8A/gX/AADx7yqTyq9i/wCEY07/AKbf99//AGNH/CMad/02/wC+/wD7GvaPF+uVf7v3f8E8mMz2PqFBfz/+Bf8AAPHPKpPKr2T/AIRfTf8Apv8A9/P/ALGk/wCEX03/AKb/APfz/wCxr2zxPrlX+793/BOGMz0Vg6S/m+//AIB415VJ5Vezf8Itpv8A03/7+f8A2NJ/wi2m/wDTf/v5/wDY17h4n12t/d+7/gkU5HRHDwjtzfeeMeVUZir2v/hFtN/6b/8Afz/7Gmf8Irphz/r/APv5/wDY19DFHgrH11/J93/BPSw+plTm6e34niJjqIpXuB8I6Wf+fj/v4P8A4mm/8IfpX/Tx/wB/B/8AE19TGJ82s0xK/wCff/gP/BPo6UDyY4+tHbk/8B/4J4dspuyvcv8AhDtJ/wCnj/v6P/iaT/hDtJ/6eP8Av6P/AImvrFA+W/tfFf8ATv8A8B/4J9NCmfPrNMSv+ff/AID/AME8M2UmyvdP+EN0n/p5/wC/o/8AiaT/AIQ3Sf8Ap5/7+j/4mvr1A+S/tjF/9Ov/AAH/AIJ9TGmfM/2vil/z7/8AAf8Agnheyk2V7r/whmk/9PP/AH9H/wATR/whmk/9PP8A39H/AMTX2KifH/21i/8Ap1/4B/8AbH1qpnyv9s4v/p1/4B/wTwrZSbK91/4QzSP+nn/v6P8A4ij/AIQzSP8Ap5/7+j/4ivs+U+N/tvGf9Ov/AAD/AO2Pr1TPkf7bxn/Tr/wD/wC2PCtlJsr3b/hC9I/6ef8Av6P/AIij/hC9I/6ef+/o/wDiK+15T4v+28Z/06/8A/8Atj7JUz4/+3MZ/wBOv/AP/tjwnZSbK93/AOEL0j/p5/7+j/4ij/hC9I/6ef8Av6P/AIivtuU+K/tzGf8ATr/wD/7Y+zVM+N/t3G/9Ov8AwD/7Y8I2UbK93/4QvSP+nn/v6P8A4ik/4QvSP+nn/v6P/iK+35T4j+3Mb/06/wDAP/tj7X2Z8V/buN/6df8AgH/2x4Rso2V7x/whekf9PP8A39H/AMRSf8IXpH/Tz/39H/xFfccp8P8A25jf+nX/AIB/9sfb+zPiP7dxv/Tr/wAA/wDtjwjZRsr3f/hC9I/6ef8Av6P/AIil/wCEL0j/AKef+/o/+Ir7rlPhf7cxv/Tr/wAA/wDtj7n2Z8N/buN/6df+Af8A2x4Nso2V7z/whekf9PP/AH9H/wARR/whekf9PP8A39H/AMTX3fKfCf25jf8Ap1/4B/8AbH3Xsz4X+3sb/wBOv/AP/tjwbZRsr3n/AIQvSP8Ap5/7+j/4mj/hC9I/6ef+/o/+Jr7zlPg/7cxv/Tr/AMA/+2PvPZnwf9u43/p1/wCAf/bHg2yjZXvP/CF6R/08/wDf0f8AxFH/AAhekf8ATz/39H/xNfecqPg/7cxv/Tr/AMA/+2PveQ+C/t3G/wDTr/wD/wC2PBtlGyvef+EL0j/p5/7+j/4mj/hC9I/6ef8Av6P/AImvvbI+C/tzG/8ATr/wD/7Y++5D4H+3cb/06/8AAP8A7Y8G2UbK95/4QvSP+nn/AL+j/wCJo/4QzSP+nn/v6P8A4mvvrI+B/tzG/wDTr/wD/wC2Pv8AkR8B/buN/wCnX/gH/wBseDbKNle8/wDCGaR/08/9/R/8TR/whmkf9PP/AH9H/wATX31kfAf25jP+nX/gH/2x+gcqPz/+3cb/ANOv/AP/ALY8G2UbK95/4QzSP+nn/v6P/iaP+EM0j/p5/wC/o/8Aia+/0PgP7bxn/Tr/AMA/+2P0DlR+f/27jf8Ap1/4B/8AbHg2yjy695/4QzSP+nn/AL+j/wCJpf8AhDNI/wCnj/v6P/ia+/0PgP7bxn/Tr/wD/wC2P0DlR+f/ANu43/p1/wCAf/bHgvl0eXXvX/CGaR/08f8Af0f/ABNH/CGaR/08f9/R/wDE19/ofAf23jP+nX/gH/2x+gcqPz/+3cb/ANOv/AP/ALY8E8uk8uvfP+EM0j/p4/7+j/4mj/hDNI/6eP8Av6P/AImvv7I+A/tvGf8ATr/wD/7Y/QOVH5//AG7jf+nX/gH/ANseA+XUZjr6B/4QzSP+nj/v6P8A4mqs3gfTZAwjkuIjgbW3K4z7gqMj8RX3rgfCxz3Fp3apNduVq/zufeypnwsM+xid2qUl25Wr/O54Cy1XIrqNW0qfSrpreYDI+ZWH3XQ9GH9R2Nc8y19bUiaKpGvShVjtOKkvn0+R9TVhY25416UKsPhnFSXz6fIokVGRVkioSK8uaNaiPJmjSaIDTDUpphrz5IuSOCSLkiKm0802uRlSOVjYymVJTa52UzBjYyilorIZmM1BTxTRUgrzUM/P2JjhUgpoqQVSGjNiY8VMBTBUwFWhoykTIlUVZUVCoq2grRDic8yZlmMVqwpkiqEYrXgHI+orZAefWZnWZ72qhVVRwAAB9AKzLrVLazl8uTfuwG+VcjB/GtUdBXnuv/8AH7/2zT+teBCnKrKytfV6nRhP43yZ93iMTSwdGNSpzcvux91Xeq9Ty88/3Bf46f5M6H+37H/pr/3x/wDXpP8AhILH/pr/AN8f/XrzgtUJej6nV/u/f/wD2Cv7dwX/AE9/8A/+2PhEj03/AISGw/6a/wDfH/16T/hIbD/pr/3x/wDXrzHfTN9eN9Tq/wB37/8AgHsn3f8AbmC/6e/+Af8A2x8SonqP/CQ2H/TX/vj/AOvSf8JFYf8ATX/vj/69eW+ZSeZXj/U6v937/wDgHsH2/wDbmD/6e/8AgH/2x8Vynqf/AAkVh/01/wC+P/sqP+EisP8Apt/3x/8AZV5X5lJ5leP9Tq/3fv8A+Aewfbf23g/+nv8A4B/9sfF8p6r/AMJFp/8A02/74/8AsqP+Ej0//pt/3x/9lXlPmUeZXj/U6v8Ad+//AIB7B9p/beD/AOnv/gH/ANsfG8p6r/wken/9Nv8Avj/69H/CR6f/ANNv++P/ALKvKfMo8yvG+p1f7v3/APAPZPsv7awf/T3/AMA/+2PjuU9W/wCEj0//AKbf98f/AGVH/CR6f/02/wC+P/sq8o8yk8yvH+p1f7v3/wDAPYPsv7awn/T3/wAA/wDtj4/lPWP+Ej0//pt/3x/9lR/wken/APTb/vj/AOyryfzKTzK8b6nV/u/f/wAA9k+w/tnCf9Pf/AP/ALY+R5D1j/hJNP8A+m3/AHx/9lR/wkmn/wDTb/vj/wCyryfzKTzK8b6nV/u/f/wD2T6/+2cJ/wBPf/AP/tj5LkPWf+Ek0/8A6bf98f8A2VH/AAkmn/8ATb/vj/7KvJvMpPMrxvqdX+79/wDwD2T63+2MJ/09/wDAP+CfJ8h61/wkmn/9Nv8Avj/7Kj/hJNP/AOm3/fH/ANlXkvmUeZXjfU6v937/APgHsn1v9sYT/p7/AOA/8E+U5D1r/hJNP/6bf98f/ZUf8JJp/wD02/74/wDsq8k8yjzK8f6nV/u/f/wD2D6z+18L/wBPP/Af+CfLch63/wAJJp//AE2/74/+ypP+El07/pt/3x/9lXknmUeZXjfU6v8Ad+//AIB7J9V/a2F/6ef+A/8ABPl1A9b/AOEl07/pt/3x/wDZUf8ACS6d/wBNv++P/sq8k8yk8yvG+p1f7v3/APAPaPqf7Ww3/Tz/AMB/4J8yoHrn/CS6d/02/wC+P/sqP+El07/pt/3x/wDZV5F5lHmV4v1Or/d+/wD4B7R9P/amG/6ef+A/8E+cUD13/hJdO/6bf98f/ZUf8JNp3/Tb/v3/APZV5D5lJ5teL9Tq/wB37/8AgHtH0n9p4f8A6ef+A/8ABPn1A9e/4SbTv+m3/fH/ANlR/wAJNp3/AE2/79//AGVeQ+bSebXjfU6v937/APgHtH0X9o4f+/8A+A/8E8JQPX/+Em07/pt/37/+yo/4SfTv+m3/AH7/APsq8f8ANpPNrxfqdX+79/8AwD2j3/r9B/z/APgP/BPHjA9g/wCEn03/AKbf9+//ALKj/hKNN/6bf9+//sq8e82m+bXi/U63937/APgHtntrGUn/ADfd/wAE82MD2L/hKNN/6bf9+/8A7Kj/AISnTf8Apt/37/8Asq8c8ym+bXi/Uq3937/+Ae4ewsRCW3N93/BOanE9l/4SnTf+m3/fv/7Ko/8AhKtMGf8AX/8Afv8A+yrxzzajMteMsBXf8n3/APAPeiz1acHU2/E2w+h7KfFulj/nv/37/wDsqb/wl+lf9PH/AH7/APsq8WMlRF68ZZXiX/z7/wDAv+AfSxkdEcBWltyf+Bf8A9WlM9t/4TDSf+nj/v1/9lSf8JjpP/Tx/wB+v/sq8Q303fXzv9kYp/8APv8A8C/4B9UpHnrK8S/+ff8A4F/wD6CFQ9w/4TLSf+nj/v1/9lR/wmWk/wDTx/36/wDsq8O303fXy/8AY+L/AOnX/gf/AAD61SPD/sjFP/n1/wCBf8A+mjUPc/8AhMtJ/wCnj/v1/wDZUn/CZ6R/08f9+v8A7KvDN9G+vk/7Fxn/AE6/8D/4B9ipHzf9jYv/AKdf+B/8A+qVQ9z/AOEz0j/p4/79f/ZUf8JnpH/Tx/36/wDsq8L30m+vj/7Exn/Tr/wP/gH2akfLf2JjP+nX/gf/AAD65VD3X/hM9I/6ef8Av1/9lR/wmekf9PP/AH6/+yrwrfSb6+N/sTGf9Ov/AAP/AIB9pzHyf9h43/p1/wCB/wDAPsVUPdf+Ez0j/p5/79f/AGVH/CZ6R/08/wDfr/7KvCt9G+vi/wCw8b/06/8AA/8AgH2/MfHf2Fjf+nX/AIH/AMA+0VQ91/4TPSP+nj/v1/8AZUf8JppH/Tx/36/+yrwnfRur4j+w8b/06/8AA/8AgH3PMfGf2Fjf+nX/AIH/AMA+29oe7f8ACaaR/wBPH/fr/wCyo/4TPSP+nj/v1/8AZV4TvpN1fDf2Hjf+nX/gf/APuuY+J/sLG/8ATr/wP/gH3HtD3f8A4TPSP+nj/v1/9lR/wmekf9PH/fr/AOyrwjdRur4X+w8b/wBOv/A/+Afd8x8P/YWN/wCnX/gf/APuuc94/wCEz0j/AKeP+/X/ANlR/wAJnpH/AE8f9+v/ALKvB91G+vhP7Dxv/Tr/AMD/AOAfe8x8L/YWN/6df+B/8A+85z3j/hM9I/6eP+/X/wBlR/wmekf9PH/fr/7KvB99G+vgv7Exv/Tr/wAD/wCAfe3Pg/7Cxv8A06/8D/4B97znvH/CZ6R/08f9+v8A7Kj/AITPSP8Ap4/79f8A2VeD76N9fBf2Jjf+nX/gf/APvro+C/sLG/8ATr/wP/gH3/Mj3j/hM9I/6eP+/X/2VH/CZ6R/08f9+v8A7KvB99G+vgf7Exv/AE6/8D/4B9/ofAf2Fjf+nX/gf/AP0DmR7x/wmekf9PH/AH6/+yo/4TPSP+nj/v1/9lXhG+jfXwH9iY3/AKdf+B/8A+/0Pz7+wsb/ANOv/A/+AfoV0e8f8JlpH/Tx/wB+v/sqP+Ey0n/p4/79f/ZV4Pvpd9fAf2JjP+nX/gf/AAD7+yPz3+w8b/06/wDA/wDgH6Foe7/8JlpP/Tx/36/+yo/4TLSf+nj/AL9f/ZV4RvpfMr8//sTGf9Ov/A/+AfoHKfnv9h43/p1/4H/wD9Dsj3b/AITLSf8Ap4/79f8A2VL/AMJjpP8A08f9+v8A7KvCfMpfMr8//sXGf9Ov/A/+AfoHKfnn9h43/p1/4H/wD9D5T3X/AITHSf8Ap4/79f8A2VL/AMJhpP8A08f9+v8A7KvC/Mp3mV+f/wBi4z/p3/4H/wAA++cT87/sTG/9Ov8AwP8A4B+hcp7n/wAJfpX/AE8f9+//ALKl/wCEu0r/AKeP+/f/ANlXhwepQ9fAf2NjP+nf/gf/AAD7txPzz+xMZ/06/wDA/wDgH37ie3f8Jbpf/Tf/AL9//ZV09tcR3cEc8edki7lyMHHuK+clavetC/5BVn/1yH9a/OMTga+FipVOWzdlZ31+4+hzxfuKf/Xz/wBtZ+aYnAV8JFSqclm7K0r62v2Po89X7in/ANfP/bWcH4/jXFi+Pm/fLn2+Q4rxxxXtPj3/AFdj/vT/AMkrxl69LKtcupeXOv8AyZhk/wDyL6frP/0pnoZVrltHyc1/5Mx5R/yLqfrP/wBKZQYVCastUBrSoi6gVEXURXNRmpjUZrzZFzPOkVMiNMqQ0yuOQ5HHIqQym0+m1zsbOdjYyilorIZkM1RTxTRUgrzBo/O2JjhUopgqUVSGjNiZIKnWohU61aGjGRMiZatoKrLVtK2iETmmTMuxitiDqPqKyo614Oo+orUDzaxNY93HQV514g/4/f8Atmn9a9FHQV5z4h/4/f8Atmn9a8fCfxvkwwn8b5M+rzv/AHGP+On+THnf+4x/x0/yZyrGq5NSPVZjXsAfFRRcBS1RlqYTUZNAGiRokSbqTdUJNNzQAkjVIm3Um6oM03dQBNjWxY3Um6q+6k3UCIsbWLG+k31X3Um6mBnym1izvpN9Vt1JuoAz5TaxZ30b6q7qTdQIz5Taxa30m+q26k3UxGfKbWLW+k31W3Um6mIz5Taxa30m+q26k3UyTPlNrFrfRvqrupN1USZ8pvYtb6TfVXdRuqiTPlNrFrfSb6q7qN1USQomyRa30m+qu6k3VVySFE3SLW+k31V3Ubqq5JKibpFnfRvqrupN1VcklRN0i1vpN9Vd1JuqrkhGJskWd9JvqrupN1WSXGJrFFnfSb6rbqburQlG8EaQLO+mF6r7qbmtkyUd1IUCctTN1Q5pua6UzNM9SnIygybdTd1RZpua6lIxTPTjI54sl3Um6os0ma61IxTPRjI5osl3UbqhzSZrqUjBM71I50ybdSbqizSZrrUjnudykcykTbqN1Q5pM11qRzpnapHMmTbqN1Q5pM11cxhc7VI5kybdRuqHNGa6uY57nXzHPcm3UbqhzRmunmMLnXzHPcm3Um6oc0ZrpuYXOrmOe5Nuo3VDmjNdFzC51cxz3Jt1G6oc0ZrouY3OrmOe5Nuo3VDmjNdFzG51cxz3Jt1LuqDNLmt7mNzq5jnuTbqM1DmjNb3MrnVzHPcmzS5qHNGa3uZXOrmMLk2aXNQ5pc1vcxudPMYJkuaXNQ5p2a6LmVzqUjBMmzS5qHNOzW5mmdaZimThqnVqqA1Kpqmiuhs0C2NFDX0BoP8AyCbL/rkP6189oa+hNB/5BNl/1xH9a+Tz3+BT/wCvn/trHn38Cn/18/8AbWfJ5/8AwKf/AF8/9tY+IP4FL/r5/wC2s4zx5/q7H/em/kleMvXs3jv/AFdj9Zv5JXjb16GT/wC4U/Wf/pTDJv8AcKfrP/0pnfk//Iup+s//AEphk3/Iup+s/wD0plFqrmrTVXNdNQdQ1qjqkBqI1MaiNedMczzpjmRGmGpDTDXHIcjjkOQymU+m1zsbOdjY2iiisRmQzWFSCmCpBXloaPzhiY8VKKjFTCqQ0ZMTJBVhahFTrWiBGEgkTrVtKrLVtK2iETkmKZejrXg6j6ismOtaDqPqK0A8ysFY91HQV5x4i/4/v+2af1r0cdBXnHiL/j+/7Zp/WvHwn8b5MMJ/G+TPrc7/ANxj/jp/kwzr/cY/46f5M5B6qMasvVRq9gD4+A4EZNRk0pNRE0AdCKQE0zNITTM0gLSKQ7NNzTc03NADSLQ/NJmo80maBBYsfmkzUeaTNMkVi7EmaTNR5pM0yRWNLEmaTNR5pM0xCsXYlzSZqLNGaZIrF2Jc0maizSZqiRWLsS5ozUWaTNMQrF2Jc0ZqHNGaZIrGliXNJmos0maokSRokTZpM1FmkzVEiSNEiXNG6oc0maokEjRImzSZqLNJmqJBI0SJc0maizSZqhDSNEiXNJmos0maokqKNEiXNJmos0mask0ii4kmaTNR5pua0JNojiS5puajzSZrVEo6oiiPzSZqPNJmtUyUdkWTEfmkzTM0ma2TITOyLM4sfmkzTM0ma3TM0zrTM0x+aTNMzRmt0zNM6kzNMfmkzTM0ZrdMzudSZkmPzRmo80Zre5nc6UzJMfmjNMzSZra5nc6UzJMkzRmo80Zra5nc6EzJMfmjNMzRmtrmdzouZJj80ZpmaM1tczub3Mrj80ZqPNGa2uZXN7mdyTNGajzS1vcyubXM7j80ZpmaK2uZ3Nrmdx+aXNR5ozW1zO5vcyuSZozTKM1tczub3M0yTNGaZS1vczubpmaY/NLmo6WtrkJmyZCZJmlzUdOrVMlG6ZCJM06o6cK2RKOhMiJKKlFQCpRXQhROyJMC/HX0PoH/ACCLL/riv9a+do6+iNA/5BFl/wBcV/rXy+f/AMCn/wBfP/bWPP8A+BT/AOvn/trPmOIf4FL/AK+f+2sfEP8AApf9fP8A21nHeO/9XY/Wb+SV409ey+O/9XY/Wb+SV429d2Tf7hT9Z/8ApTDJv9wp+s//AEpndk3/ACL6frP/ANKYZN/yL6frP/0plJqgNWGqua66g6htVHUITURqY1Ea86Y5nnTHMiNMNSGmVxyHI5JDkR02n0yudjZzMbG0UUViMyGa4qQUwVIK8pAfmjBkgqUVGKlFWhoyYmSip1qEVOtWhowkKRYWraVVWrSVsgRyzFMvx1rQ9R9RWTHWtD1H1FWB5lUKp7oOgrzfxF/x/f8AbJP616QOgrzfxH/x/f8AbJP614+E/jfJhhP43yZ9dnX+4x/x0/yYZ1/uMf8AHT/JnHPVNqtvVNq9gD5GA4EJqE1IaiNIDpiVEYaYTSmo6ANEUgpuaDTKQikUh2abmkptIQ0Uhc0mabSZpiGUh2aTNNpKBAUOzSZpuaSgQxjs0mabmkpiGUPzSZpmaTNAgKQ/NJmm0maYgLH5pM0zNFMQIodmjNMzSZpiGikPzSZpmaTNMQ0Uh+aM0zNJmmIpIpD80maZmkzTEUikPzSZpmaTNMC0Uh+aTNMzSZpiLRSH5pM0zNJmqEaIpD80maZmkzViNYjQ/NJmmZpKsRvEEOzSZptJWhJ0REh2aTNJSVqiToRKHUlNpK0RKOlMhDqKbSVqSdCZKHUU2krVMg3TIQ7NFNorUk3TIQ6kpKStbkG6ZCHUU2itbkGyZCHUU2itbkGyZCHUU2itLkm1yB1FNorS5JrcgdRTaK0INiB1FNorW5BrcgdS02itSDW5A6lplLWtyDZEIfRTaK2IRqmSh9LTKWtkSjZEofTqZS1siUbIlElOqOnitkJHREmJKKlFQipRXTEUTsgKBdjr6K0D/kEWX/XFf6186R19F6B/yCLL/riv9a+az/8AgU/+vn/trHxB/Ap/9fP/AG1nzvEP8Cl/18/9tYcRfwKX/Xz/ANtZxvjv/V2P1m/kleOPXsfjv/V2P1m/kleOPXbk3+4U/Wf/AKUwyb/cKfrP/wBKZ25N/wAi+n6z/wDSmGTf8i+n6z/9KZTaoDVhqrmu2oFQ6KgVCE1EamNRGvPmOZ58xzIjTKkNMrjkORxyHIjNNp5plczGznYMbRS0VkMyGa4qQVGKlFeSB+ZMGPFTCohUoq0CMpCZMKnWoBVha0QIwkKRYWrSVVWraVsgRyzFMvR1qw9R9RWVHWrD1H1FWB5tUKp7oOgrzbxH/wAf3/bJP616SOgrzbxH/wAf3/bJP614+E/jfJhhP43yZ9dnX+4x/wAdP8mGdf7jH/HT/JnGvVNquPVJq9gD5KmOmQGoTUpqE0gOqI4kZphpxqM0gNkNCU2im1IFoaCm0U2kIoYUlJSUCKQ0FJRTaBFDFpKSkoAYxaSkpKBDKQ6kzTaKAGMWkpKSgQ0ULmim0UxDQ0LSUlJTEUNC0ZptJTEUhodSZptJTEWhodmkzSUlMRSKQuaSkpKoRaGh2abmkpKYGiGh1JTaSqEaIaHUlNoqhGqGhaSkpKsRshIWkpKSrEboSFpKSirEboSFpKSitCTdEoWkpKK0JN0ShaKbRWgjZEoWikpK0JNkSh1FNorQk2RKFopKK0JNUShaKSitCTUlC0UlFaEmqJFopKKsRoIWikorQk0JHUU2lqxGghaWm0tWI0JQtLTaWtCUaISFpabS1ohGiEh1LTaWtUSjVEodTqbS1shI2QkPp4plPFboSOiIokgqYVAKmWumIROyAoFyOvozw/8A8giy/wCuK/1r5zjr6M8P/wDIIsv+uK/1r5ziD+BT/wCvn/trDiD+BT/6+f8AtrPn+Iv93pf9fP8A21hxF/u9L/r5/wC2s43x3/q7H6zfySvHHr2Px3/q7H6zfySvHHrtyb/cKfrP/wBKYZN/uFP1n/6Uztyb/kX0/Wf/AKUwyX/kX0/Wf/pTKjVAanaoDXdUCodNQKhCaiNSmozXnzHM8+Y5kRplSGozXJIJHJIJDDTafTK52DOdgxtFFFZAZgbAqQUwVIK8kD8xYmSCpRUQqUVaGjJiZMKnWoRU61ogRhIJFhatJVVatJWyBHJMJl6OtaHqPqKyo61Yeo+oqgPNqhVPcx0FebeI/wDj+/7ZJ/WvSR0FebeI/wDj+/7ZJ/WvHwn8b5MMJ/G+TPrs6/3GP+On+TDOv9xj/jp/kzjJKpNV2SqTV7AHydMKZXaoTUrVCaQHZEIkZqM081GakDZDQ2m0pphqQNENCUlFNpCKQ0FNpabQIoYUlFNoEUgFpKSkoEUNC0lJSUAUhi0lJSUAMYtJRSUCGMKKSkpiKQxaSkpKYikNC0lJRTEWhoKSikpiKQ0FFJSUxFoaFpKSkpgWhoWkpKSmI0QIWkpKKoDRDQUUlJVCNUCFpKSkqhGqBC0lFJViNkJC0lJRViNkJC0lJRViNkJC0lJRViNkJC0UlJViNUJC0UlFWI1QkLRSUVoSaISFpKKKsRqiUFFJS1oSaoSClpKK0JNBIWikoqxFoQtFJRViNBC0tNpa0JLQhaWm0tWBohC0tNpasRoJC0tJS1ohI0QkLS02lrRCRogQ+nUynVshI1QkPp4qOnit4hE6IiiSiplqAVMtdMAgdkAgXI6+jfD/APyCLH/riv8AWvnKOvo3w/8A8gix/wCuK/1r53iD+BS/6+f+2sOIP4FL/r5/7azwOIv93pf9fP8A21hxF/u9L/r5/wC2s43x3/q7H6zfySvHHr2Px3/q7H6zfySvHHrtyb/cafrP/wBKYZN/uNP1n/6UztyX/kX0/Wf/AKUwyX/kX0/Wf/pTKjVAasNVc13TCZ01B1CI1EalNRGuCY5nnzCZGaYaeaYa5JBI5ZBIZTKfTa52DOdgxtFFFZDMwNgVIKYKkFeQgR+XsGSCpRUQqUVaBGLBkwqdagFTrWiBHPIJFhatpVVatJWyBHLMUy9HWrD1H1FZUdasPUfUVQHm1QqnuY6CvNvEf/H9/wBsk/rXpI6CvNvEf/H9/wBsk/rXj4T+N8mGE/jfJn1+df7jH/HT/JhnX+4x/wAdP8mcXJVJquyVSavYA+TpjpldqgNTNUJpAdkQiRGozTzUZqRG6BDaZTjTKkDRDQlNpabSAtAgptLTaQihhTaWkoEUMSkopKAKQIKSikoEUMKSikoApAgpKKSgChoKSikoEUAtJRSUxFoaCkopKYikNBSUUlMRaBBSUUlMDRAgpKKSgDRAhaSkpKYGiBC0lJRTEaIEFFJSVQGqBC0lFJVCNUCCikoqgNUJBRSUlUI2QkLSUUlWI1QIWikoqxGqEgoooqxGqEgopKKsRqhIWikoqxGiEhaKSirA0QIWikoqhFoELRSUVYjRCQtFJS1YFiClpKKoDRCFopKKoC0AtLSUVYi0JDqKSlq0I0QkLS02lrRCRohIdS02nVqhI1QkLTqbTq1QI1QIfTxUdPFbxCJ0RFElFTLUIqZa6oCgdlMKZcjr6M8P/wDIHsf+uK/1r5yjr6N8P/8AIHsf+uK/1r57iD+BS/6+f+2sfEH8Cl/18/8AbWeDxF/u9L/r5/7aw4i/3el/18/9tZx3jv8A1dj9Zv5JXjj17H47/wBXY/Wb+SV449dmTf7jT9Z/+lMMm/3Cn6z/APSmduS/8i+n6z/9KYZL/wAi+n6z/wDS2VWqA1O1QGu6YTOqoFQhNRGpTUZrhmEzgmEyM1GakNRmuSQ5HLIJDaZT6Ya5mORzsGNooorIDIZsipBUYqQV5CBH5awZIKmFRCpRVoEZMTJhU61AKnWtECMJBIsLVpaqrVpK2QI5JhMvR1qw9R9RWVHWrD1H1FUB5tUKp7mOgrzbxH/x/f8AbJP616SOgrzXxH/x/f8AbJP614+E/jfJhhP43yZ9fnX+4x/x0/yYZ1/uMf8AHT/JnGSVRar0lUWr2APlKYUyu1QGpmqE0gOyIRIjUZqQ1EahgboaGmmU40ypA0QISm0pptSBaGhKSlptICgQlJS02kBYCUlLSUCLQISkopKAKAKSlptAi0AUlFFAFIaEoopKAKQISkpaSgC0NCUlLSUAUhoKSikoAtAgpKKSgDRAgpKKSmItDQUlFJTAtDQUUUlMDRAgpKKSmBogQUUUlMDVAgpKKKoRogQUlFFWI1QkFFJRVAaoEFFFJVAaIELRSUVYjRCQUUUVQGqEgopKWrEaIEFFFFWI0QkFFFFWI0EhaKSirEaCQtFJRViNEJC0tJRVgWAtFJS1Qi0JBS0lFaCNEIWlpKWrEaISFpaSlrRCRogQtLSUtaIEaISFp1Np1aoEaoEPFPFMp4reIROiIRJBUy1CKmWuqAQOymKmXI6+jfD/APyB7H/riv8AWvnKOvo3w/8A8gex/wCuK/1r5/iD+BS/6+f+2sOIP4FL/r5/7azwuIv93pf9fP8A21hxF/u9L/r5/wC2s47x3/q7H6z/AMkrxx69j8d/6ux+s/8AJK8ceuzJv9wp+s//AEphk3+4U/Wf/pTO3Jf+RfT9Z/8ApTDJf+RfT9Z/+lMqtUBqdqgNd8wmdVQKhCajNSGozXBMczgmEyM0ynmmGuSQSOWQSGU006mmudgznYMZRS0VmBmBsipBUYqQV46BH5awZIKlFRCphVoEYsGSip1qAVOtaIaMJBIsLVparLVla1QI5JhMvR1qw9R9RWVHWrD1H1FUB5tUKp7mOgrzXxH/AMf3/bJP616UOgrzXxH/AMf3/bJP614+E/jfJhhP43yZ9fnX+4x/x0/yYZ1/uMf8dP8AJnGSVRarslUmr2APlKYUys1QGpzUBpAdsQiRGozUhqM1DBm6BDDTKeaZUiNENDaaadTaQFoENpKWm0gLQISm06m0gKGJSUtJSApDQlJS0lAFAJSUUlIChhSUUlAFIEFJRSUAWgQUlFJQIsEFJRSUAWCCkopKYjRAgpKKSmBaBBSUUUAaIEJRRSUxGiBBSUUlMDRAgpKWkpgaIEFJRSVQjRAgoopKoDVCQtJRRVCNUCCkooqgNECCikoqgNECCiiiqA0QIKKKKsRohIKKKSqA0QIWikoqxGiEhaKKKsRogQUtJRViLQkLRSUtWI0EgpaSirAtALRRRVAWgQtFFFWItAhaKKKsC0CFpaSlq0CLQIWnU2nVogRogQtOptOrRAjVAh4p4qMVIK6IhE3iESQVMtQiplrqgEDsphTLkdfRvh//AJA9j/1xX+tfOUdfRvh//kD2P/XFf618/wAQfwKX/Xz/ANtYcQfwKX/Xz/21nh8Rf7vS/wCvn/trDiL/AHel/wBfP/bWcd47/wBXY/Wf+SV449ex+O/9XY/Wb+SV449dmTf7hT9Z/wDpTDJv9wp+s/8A0pnZkv8AyL6frP8A9KYZL/yL6frP/wBKZVaoDU7VAa75hM6qgVCE1GalNRGuGYTOCY5kZplPNMNckgkckhyGU006mmudjkc7BjaKKKyAzA2RUgqMVIK8dAj8sYMlFSiohUoq0CMWDJhU61AKnWtUCOeQSLC1aWqq1aWtUCOWYTLsdasPUfUVlR1qw9R9RVAebVCqe5joK818R/8AH9/2yT+telDoK818R/8AH9/2yT+tePhP43yYYT+N8mfYZ1/uUf8AHT/JhnX+5R/x0/yZxclUmq7JVJq9gD5OmFMrGoDU7VAaQHbEIkRqM1IajNQwZugRGabTjTagDVAhtMp1NpAWgQlNp1NpAWgQlNpaSkBYISm0tJSAtAhKSlpKQFAJSUtJQBYCUlLSUAUhoSkpaSkBSBCUlLSUAWMSkpaSgC0CEpKWkoAtAhKSikoA0QIKSlpKYFoaEoopKALQIKSikpgaIEFJS0lMDRAgpKKKYGiBBSUUVQjRAgpKKKoDVCQUlFFUBqhIKKSiqEaoSCiiirEaIEFFFFWBogQUUUVQjRCQUUUVYGiBBRRRVAWgQtFJS1QFoEFFFFUBaAWikpasRYBS0lLViLQkFLSUtWCNEJBS0lLVgi0CFpaSlq0CNECFpaSlq0CNEJDqdTadWqBGqBDhTxTBUgroiEToiESQVMtQiplrqgEDsphTLkdfRvh//kD2P/XFf6184x19HeH/APkD2P8A1xX+tfP8QfwKX/Xz/wBtYcQfwKX/AF8/9tZ4fEX+70v+vn/trDiL/d6X/Xz/ANtZx3jv/V2P1n/kleOPXsfjv/V2P1m/kleOPXZk3+4U/Wf/AKUwyb/cKfrP/wBKZ2ZL/wAi+n6z/wDSmGS/8i+n6z/9LZVaoDU7VAa75hM6qgVCI1EalNRGuGYTOGYTGGo6kNRmuWQSOWQSGU00+mGueQSOdgxtFFFZDMwNkVIKYKkFeMgR+VsGSCpRUQqUVaBGTBkwqdagFTrWqBHPIJFhatLVVatLWqBHLMJl6OtSHqPqKy461Ieo+oqgPNqhVPcx0Fea+I/+P7/tkn9a9KHQV5r4j/4/v+2Sf1rx8J/G+TDCfxvkz6/Ov9xj/jp/kwzr/cY/46f5M4uSqTVdkqk1ewB8pTCmVmqA1OagNIDtiESI1GakNRmoYM3QIjNNpxptQBqgQym06m0gLQIbSU6m0gLQIbSUtJSAtAhtJS0lIC0CEpKWkpAUAlJRRQBYCUlLTaBFoEJSUtJQBSGgptOptAFgJRRSUAWgQlJS0lAFoEJSUtJQBogQlFFJQBogQUlLSUwLQISkpaSmBogQlFFJTA0QIKKKSmBogQUlLSUwNECCiikqgNECCiikpgaIEFFFFUBogQUUUVQGiBBRRRVAaIEFFFFUBaBBRRRViNECCiiirAtAgoooqgLQIKWkpaoC0CClpKWqAsApaSlqgKQIKWkpatAi0CClpKWrQItAhaWkpapAjRAhaWkpa0QItAh1OptOFaoEaoEOFPFMFPFdERROiIRJRUy1CKmWuuAQOymFMtx19HeH/wDkD2P/AFxX+tfOMdfR3h//AJA9j/1xX+tfP8QfwKX/AF8/9tYcQfwKX/Xz/wBtZ4fEX+70v+vn/trDiL/d6X/Xz/21nHeO/wDV2P1n/kleOPXsfjv/AFdj9Zv5JXjj12ZN/uFP1n/6Uwyb/cKfrP8A9KZ2ZL/yL6frP/0phkv/ACL6frP/ANLZVaoDU7VAa75hM6qgVCI1EalNRGuGYTOGQTGGozUhqM1yyCRyyCQ2mU+mVzsJHOwY2iiiswMwNoVIKjFSCvGQ0flbBkgqUVEKlFUhoxYMmFTrUAqda0QIwkEiwtWlqqtWlrVAjlmEy9HWpD1H1FZcdakPUfUVQHm1QqnuY6CvNfEf/H9/2yT+telDoK818R/8f3/bJP614+E/jfJhhP43yZ9fnX+4x/x0/wAmGdf7lH/HT/JnFyVSarslUmr2APlKYUys1QGp2qA0gO2IRIjUZqQ1GahgzdAiM02nGm1AGqBDKbTqbSAtAhtJTqbSAtAhtJS0lIC0CG0lLSUgLQISkpaSkBQDaKKKALASm06m0gLQCUlLSUAWgQlJS0lAFoEJSUtJQBaBCUlLSUAWgQlJS0lAGiBCUlLSUAaIEJRRSUwLQIKSlpKYGiBCUlLSUAaIEFJS0lUBogQUlLSUwNECCkpaSqA0QIKSlpKYGiBBRRRVAaIEFFFJVAaIEFLSUtUBogQlLSUVQFoELRRRVAaISCiiirA0QIKKKKoC0CClpKWqAtAgpaSlqgKAKWkpaoC0CClpKWrQItAgpaSlqwRaBC0tJS1SBGiBC0tJS1ogRaBDqcKbThWqBGqBDhTxTBTxW8QidEQiSiplqEVMtdcAgdlMKZbjr6O8P/8AIHsf+uK/1r5xjr6O8P8A/IHsf+uK/wBa+f4g/gUv+vn/ALaw4g/gUv8Ar5/7azw+Iv8Ad6X/AF8/9tYcRf7vS/6+f+2s47x3/q7H6zfySvHHr2Px3/q7H6z/AMkrxx67Mm/3Gn6z/wDSmGTf7jT9Z/8ApTOzJf8AkX0/Wf8A6UwyX/kX0/Wf/pTKrVAanaoDXfMJnVUCoRGozUhqM1wzCZwyCZGajNSGozXLIJHLIJDabTqZXPIJHOwY2iiiswMxm0KkFRipBXjIEflTBkgqUVEKlFaISMWDJhU61AKnWtUCMJBIsLVpaqrVpa1QI5ZhMvR1qQ9R9RWXHWpD1H1FUB5tUKp7mOgrzXxH/wAf3/bJP616UOgrzXxH/wAf3/bJP614+E/jfJhhP43yZ9fnX+4x/wAdP8mGdf7jH/HT/JnFyVSarslUmr2APlKYUysagNTmoDSA7YhEiNRmpDUZqGDN0CIzTacabUAaoEMptOptIC0CG0lOptIC0CG0lLSUgLBDaSlpKQFoEJSUtJSAoBtFFFAFgJTadTaBFoEJSUtJQBaBCUlLSUAWCEpKWkoAtAhKSlpKALQISkpaSgDRAhKSlpKANECEooopgWgQlJS0lAzRAhKSlpKANECCkpaSqA0QIKSlpKYGiBBSUtJTGaIEFJS0lMDRAgoooqgNECCiikqgNECCiloqgLQISiiiqA0QIWiiiqA0QIKKKKsC0CCiiiqAtAgpaSlqgLQIKWkpaoCgClpKWqAtAFLSUtWgLQIKWkpasEWgQtLSUtUgRogQtLSUtaIEWgQ6nU2nCtUCNUCHCnimCnit4hE6IhElFTLUIqZa64BA7KYUy3HX0d4f/wCQPY/9cV/rXzjHX0d4f/5A9j/1xX+tfP8AEH8Cl/18/wDbWHEH8Cl/18/9tZ4fEX+70v8Ar5/7aw4i/wB3pf8AXz/21nHeO/8AV2P1n/kleOPXsfjv/V2P1m/kleOPXZk3+40/Wf8A6Uwyb/cKfrP/ANKZ2ZL/AMi+n6z/APSmGS/8i+n6z/8AS2VWqA1O1QGu+YTOqoFQiNRmpDURrhmEzhmEhhqM1IajNcsgkcsgkNptOptc8gkc7BjKKKKzAgRtCpBUYqQV4yBH5WwZIKlFRCpRVoEYsbJhU61AKnWtUCOeQSLC1aWqq1aWtUCOWYTL0dakPUfUVlx1qQ9R9RVAebVCqe5joK818R/8f3/bJP616UOgrzXxH/x/f9sk/rXj4T+N8mGE/jfJn1+df7jH/HT/ACYZ1/uMf8dP8mcXJVJquyVSavYA+UphTKzVAanNQGkB2xCJEajNSGozUMGboERmm0402oA1QIZTadTaQFoEJTadTaQFoENpKWkpAWgG0lLSUgLQISkpaSkBQCUlLSUAWAlNp1JQBaBDaSnUlIC0JCU2nU2gDQBKSlooAtAhtJTqSgC0CG0lLSUAaIEJSUtFAGiBCUlLSUwLQISkpaSmBogQlJS0UwNECEpKWkpgaIEFJS0UwNECEpKWkqgNECCkpaKYGiBCUUUVQGiBBRRRVAaIEFFFFUBogQlLRRVAWgQUUUVQzRAgoooqgLQIKKKKoC0CClpKWqAtAgpaSlqgKAKWkpaoC0CClpKWrQItAgpaSlq0BaBC0tJS1SBGiBC0tJS1ogRaBDqdTaWtUCNUCHinimCnit4hE6IhElFTLUIqZa64BA7KYUy3HX0d4f8A+QPY/wDXFf6184x19HeH/wDkD2P/AFxX+tfP8QfwKX/Xz/21hxB/Apf9fP8A21nh8Rf7vS/6+f8AtrDiL/d6X/Xz/wBtZx3jv/V2P1n/AJJXjj17H47/ANXY/Wb+SV449dmTf7hT9Z/+lMMm/wBwp+s//SmdmS/8i+n6z/8AS2GS/wDIvp+s/wD0tlVqgNTtUBrvmEzqqBUIjURqU1Ea4ZhM4ZBIYajNSGo65ZBI5ZBIbTKfTK55AznYMbRRRWYGYGyKkFRipBXjIEflbGyUVKKiFSirQIxYMmFTrUAqda1QI55BIsLVpaqrVpa1QI5ZhMvR1qQ9R9RWVHWrD1H1FUB5tUKp7mOgrzXxH/x/f9sk/rXpQ6CvNfEf/H9/2yT+tePhP43yYYT+N8mfX51/uMf8dP8AJhnX+4x/x0/yZxclUmq9JVFq9gD5SmFMrGoDU5qA0gO2IRIjUZqQ1GahgzdAiM02nmmVAGqBDKbT6ZSAtAhKbTqbSAtAhtJTqbSAtAJTadSUgLQIbSUtJSAoBKSlpKALASkpaSgC0JCUlLSUgLQISkpaSgDQSEpKWkoA0QISkpaSgC0CG0lOpKANECEpKWkpgaISEpKWkoA0QISkp1JTA0QISkpaSmBogQlFLSUwNECEooopgaIEJRS0lUBohoSilpKYy0CEopaSmBohoKKKKoC0CCiiirA0QIKKKKYy0CCiiiqA0QIKKKKoC0CClooqgLQIKKKKoC0CClooqgLAKWkpaoCkCClpKWrQFoEFLSUtWgLQIWlpKWqQ0aIELS0lLVoEWgQ6lpKdWqBGqBDhTxTBTxW8QidEQiSiplqEVMtdcAgdlMKZbjr6O8P/APIHsf8Ariv9a+cY6+jvD/8AyB7H/riv9a+f4g/gUv8Ar5/7aw4g/gUv+vn/ALazw+Iv93pf9fP/AG1hxF/u9L/r5/7azjvHf+rsfrN/JK8cevY/Hf8Aq7H6zfySvHHrsyb/AHCn6z/9KYZN/uFP1n/6UzsyX/kX0/Wf/pbDJf8AkX0/Wf8A6Wyq1QGp2qA13zCZ1VAqERqI1KaiNcMwmcMgmMNRmpDUZrlkEjlkEhtMNPplc7CRzsGNooorMRmBsipBUYqQV46BH5YwZKKlFQipRVoEYsGTiplqAVOtaoEc8hyLK1aWqi1bWtUCOSYTLsdasPUfUVlR1qw9R9RVAebVCqe5joK818R/8f3/AGyT+telDoK818R/8f3/AGyT+tePhP43yYYT+N8mfX51/uMf8dP8mGdf7jH/AB0/yZxklUWq9JVFq9gD5SmFMrNUBqdqhNIDtiESE1GakNRmoYM3QIYaZTzTKgZqgQ2m06mmpAtAhtNp1JSAtAhtNp1JSAsQ2kpaSkBoISkpaSgCwEptOpKQFiG0UtJQBaBDaSnUlAFoENpKdSUhloENpKdSUgLQDaSnUlAzRAhtJTqSgDRCQ2ilpKANECEpKWigZogQ2kp1JQBogQlJS0lMDRAhKSnUlMZogQlJS0UwNENCUlOpKYzRAhKKWkpgaIEJRS0VQGiBCUUUVQGiBCUUtFUBaGhKKWiqAtAhKKWiqAtDQlLRRVDLQIKKKKYykNBS0UUxlDCiiiqAoBaKKKoC0CFoooqgRSGgpaKKsC0CFpaSlq0CLQIWlpKdVoaNECFp1Np1aIEaIaHCnimCpBXREIm8QiSCplqEVMtdUAgdlMKZbjr6O8P/APIHsf8Ariv9a+cY6+jvD/8AyB7H/riv9a+f4g/gUv8Ar5/7aw4g/gUv+vn/ALazw+Iv93pf9fP/AG1hxF/u9L/r5/7azjvHf+rsfrN/JK8cevY/Hf8Aq7H6zfySvHHrsyb/AHCn6z/9KYZN/uFP1n/6UzsyX/kX0/Wf/pbDJv8AkX0/Wf8A6Wyq1QGp2qA13zCZ1VAqEJqM1IajNcMwmcEwmRmmGnmmGuSQSOWQSGU006mmsJCkYMGNooorMDMRsCpRUQqQV46BH5awZKKlFRCpRVoEYsGTCp1qAVOtaIEYSCRYWrS1VWrS1sgRyTCZejrVh6j6isqOtWHqPqKoDzaoVT3MdBXm3iP/AI/v+2Sf1r0kdBXm3iP/AI/v+2Sf1rx8J/G+TDCfxvkz6/Ov9xj/AI6f5Medf7jH/HT/ACZxclUWq9JVFq9gD5OmFMrNUJqdqgNIDsiESI1EalNRmoYM6EJEZptPNMqQNUCGGm0+m1IGiEhtNp1JSA0QhtNp1JSAsBtJTqbSGWgQlNp1JSAsQlNp1JSGWCG0UtJSAtCQlJS0lAFoEJSU6m0AaCQlJS0lAGiEhKSnUlAGiBDaSnUlAGiBDaSnUlAzRCQ2kp1JQBqhISkpaKYGqBDaSnUlMDRAhKSlopgaIaG0UtJTGaIEJRS0lMZogQlFLRTA0Q0NopaKoDRAhKKWkqgLQ0FFFFUBaGhKKWiqAtAhKKWiqGWhoKKKKYykMKKKKYFIaCiloqhlIaCiiimMoAoopaYykMKKKWqQFIAoopaoZaGhaKKWqQIpDQtLSUtaIEWgQtOptOrRDRqgQ+nimU8VvEIm8RxJBUy1CKmWuqAQOumFMuR19G+H/wDkD2P/AFxX+tfOUdfRvh//AJA9j/1xX+tfP8QfwKX/AF8/9tYcQfwKX/Xz/wBtZ4fEX+70v+vn/trFxF/u9L/r5/7azjvHf+rsfrN/JK8cevY/Hf8Aq7H6z/ySvHHrsyb/AHCn6z/9KYZN/uFP1n/6UztyX/kX0/Wf/pbDJv8AkX0/Wf8A6Wyq1QGp2qua7phM6qgVCI1GakNRmuGYTOCYTIzTDTzTDXLIJHLIJDKaadTK55AznYMSikorMDMDZFSCohUgrx0CPy1jZKKmFQipRVoEYsGTip1quKnWtECOeQSLK1aSqq1aStkCOSYTL0dasPUfUVlR1qw9R9RVAebVCqe5joK828R/8f3/AGyT+tekjoK828R/8f3/AGyT+tePhP43yYYT+N8mfX51/uMf8dP8mGdf7jH/AB0/yZxclUmq9JVFq9gD5SmKmVmqE1O1QGkB2xFEiNRGpTUZqGM6EJEdNp9MqANkJDabTqbSA0QkNptPptSM0ENpKdTakZoIbSU6kpAWgQ2kp1JSGWIbSU6kpAWCG0lOpKALQhtFLSUhlgJSU6kpDNEJDaSnUlIZohIbSU6kpDNECG0lOpKANECG0lOooA0QIZSU+m0wNECG0U6koGaIENpKdSUDNUCG0U6kpjNUCG0lOooGaIaG0lOpKYzRAhKSnUlMZohoSilopjNECEpKWimMtDQlFLRTGWhoSilopjLQ0JRS0UxlIaEopaKYykNCUUtFMZSGJRS0UxlDEpaKKYygQUUUtMZQwoopaoChoKWkpaoZSGgpaKWqQ0UhoKWilq0CLQIWnU2nVoho0Q0Op4plPFbRHE3iESQVMtRCplrpgEDsphTLcdfRvh//AJA9j/1xX+tfOUdfRvh//kD2P/XFf618/wAQfwKX/Xz/ANtYcQfwKX/Xz/21ng8Rf7vS/wCvn/trHxF/u9L/AK+f+2s47x3/AKux+s38krxx69j8d/6ux+s38krxx67Mm/3Cn6z/APSmGTf7hT9Z/wDpTOzJv+RfT9Z/+lsMm/5F9P1n/wClMqNUBqdqgNd0wmdVQVQiNRmpDURrhmEzhmKYw1HUhqOuSQSOaQpDaYafTKwYmYMGNooorMDMRsCpBUQqQV46A/L2DJRUwqEVKK0QkYsGTip1quKnWtUCMJBIsrVtKqLVpK2QI5JhMvx1qw9R9RWVHWrD1H1FUB5lUKp7mOgrzbxH/wAf3/bJP616SOgrzbxH/wAf3/bJP614+E/jfJhhP43yZ9fnX+4x/wAdP8mGdf7jH/HT/JnGSVSarslUmr2APk6YUys1Qmp2qE0gOyIokJqM1KajNSB0ISI6YakptSBshIjptPpKkZohIZTafTakZoJDabT6SpGWCGUlPpKkZaEMpKfSUgNBDKKdSUAWIbSU6kpDLENpKdRSGaCQykp9JSGaISGUU6kpAaoSG0lOpKBmiEhtJTqSkM1QkNpKfSUAaoSGUlPpKBmqBDKSn0lAzVCQ2m0+kpgbIENpKdRTGaoENpKdSUxmqBDaKdSUxmqGhtFLRTGaIaG0UtFMZaGhtFOpKYy0NCUUtFMZaKQlJTqSmMpDQlFLRTGUhoSilopjKQ0JS0UUxlIYlFLRTGUMKKWimMaGJRS0UxlDCloopjKQ0FLRRTQykAUtFLVIaKQ0FLRS1aGi0NC06m06tECNECHU8Uynit4hE3iOJIKmWoRUy10wCB10wgW46+jfD/8AyB7H/riv9a+c46+jPD//ACB7H/riv9a+d4g/gUv+vn/trDiD+BS/6+f+2s8DiL/d6X/Xz/21hxF/u9L/AK+f+2s47x3/AKux+s/8krxx69j8ef6ux+s38krxx67cm/3Cn6z/APSmGTf7hT9Z/wDpTO3Jv+RfT9Z/+lMMm/5F9P1n/wClMqNUBqdqgNd0wqHTUCoRGojUhqM1wTCZwTCZGaYaeaYa5ZCkcsgkMptOplYMTOdgxKSiiswMwNgVIKiFSCvIQI/MGDJRUwqEVKKtAjFgycVOtVxU61qhI55DkWlq0lVFq0lbIEccwmX461oeo+orJjrWh6j6irA82qFU9zHQV5t4j/4/v+2Sf1r0kdBXm/iP/j+/7ZJ/WvHwn8b5MMJ/G+TPrs6/3GP+On+TDOv9xj/jp/kzjJKpNV16ptXsAfJ0xUysahNTmoTSA7IiiQmozUpphpAdCEiKm1JTakDVCRHTafSVIzQRHSU+kqRmiEhlNp9JUjNBDKSn0lSMsQykp9JSGaIkZRTqKQGghlJT6SkM0JQykp+KSkM0QkNpKfSUhmiEhlJT6TFIZohIZSU+jFIZqhIjop+KSkM1QkMpKfSUDNUJDKSn0mKANkJDKSn0lMDZCQykp9JTGboSGUlPpKYzZAhtJT6SmM2Q0MpKfSUxmqGhtJTqKYzRDQ2kp1FNFGiGhtFOpKCi0NDaKdRTGWikNopaKCikNCUUtFMZSKQlJTqKYxoaG0U6imMZSEopaKChooSilooKGMSilooKGUFFLRQUNDCilopjQygpaKKoY0Ugp1JTqpDRSGgp1JTqtDRohoWnim08VsgRrEcR4qYVCKmFdERxOqA4FuOvo3w//wAgex/64r/WvnKOvo3w/wD8gix/64r/AFr5ziD+BS/6+f8AtrDiD+BS/wCvn/trPn+Iv93pf9fP/bWHEX+70v8Ar5/7azjfHn+rsfrN/JK8cevY/Hn+rsfrN/JK8ceu3Jv9wp+s/wD0phk3+4U/Wf8A6Uztyb/kX0/Wf/pTDJv+RfT9Z/8ApbKjVAanaq5rtqBUOmoKoRGozUhqI1wzFM4JhMYajNPNMNcshSOWQpDaZTjTawYmYMGNooorMDMRrCpBUQqQV5IkfmbBkwqUVCKlFaISMWNk4qdarirC1qgRzSHIsrVtKprVtK2QI45hM0I61Yeo+orJjrWh6j6irA8yqFY90HQV5v4i/wCP7/tkn9a9IHQV5v4i/wCP7/tmn9a8fCfxvkwwn8b5M+uzr/cY/wCOn+TDOv8AcY/46f5M416ptV16ptXsAfJQFArGoTVg1EaQHZEmJAajqY0wigDoRKIjTKlpuKkZsiUR02pMUmKgZqiURUmKkxSYqRmpJFSVJikxSGaCI8UlSYpMVIzQkjoqTFJikM0JI6SpMUmKkZoiSOipMUmKQzUkjxSYqTFGKQzQlEeKTFSYpMUhmqJRHikxUuKTFIZqiURYoxUmKTFIZsiUR4pMVJikxSGbIlEeKTFS4pMUhm6JRFikxUuKTFAzdEoixSYqXFNxQM6EJEeKTFSYpMUxm6CJHikqTFJimM3QRI6SpMUmKZSNkVEjpKkxSUFGqKQykp9JTKNEUkMop9JQWWikhlFPpKCrFopIbSU+koLsUikhtFOopF2Gi0htFOopF2GikhtFLRSLsBaQ2inUUiwRdhtLS0UirAVYbS0tFBQFiUUtLSLAobS0tFBQFCUU6igqwIsSlpaWhFoCkJS0UtNFIpFIKdSU6qRSKRSFp4ptPq0UjSJURwqYVEKlFbRHE6YDgW46+jPD/wDyCLL/AK4r/WvnSOvovw//AMgiy/64r/Wvm+IP4FP/AK+f+2sOIP4FP/r5/wC2s+d4i/3el/18/wDbWHEX8Cl/19/9tZxvjz/V2P1n/kleNvXsnjz/AFdj9Z/5JXjb125N/uFP1n/6Uwyb/cKfrP8A9KZ25N/yL6frP/0thk3/ACL6frP/ANKZUaoDU7VAa7agqh0VBVCE1GakNRGuGYpnBMJjDUdPNMrlkKRyyFIaaZTqbWDEzBiY2iikrMCBGsKkFRCpBXkoSPzVgyYVKKhFSitECMWNk4qdarip1rRAjmkORaWraVTWraVuhROOY5mhHWvD1H1FY8da8HUfUVoB5dYKx7qOgrzjxF/x/f8AbNP616OOgrzjxF/x/f8AbNP614+E/jfJhhP43yZ9bnX+4x/x0/yYZ3/uMf8AHT/JnHPVRquvVRhXsAfIQFArGoiKsEVERSGdaJRARTMVORTMUgN0SmQYpuKnxTcUAbIhMhxTcVNikxSGbEXIcUmKmxTcVIzZMi5DikxU2KTFSUa3IuQ4oxUuKMVBRrci5DikxU2KTFSUa3IuQ4oxU2KTFSM2uZ3IcUmKnxSYqSja5nchxSYqbFGKko2TIuQYoxU2KMVJRsmQmQYpMVPikxUlGyZCZDikxU2KMVJRumQmQYpMVPikxUlG6ZCZBikxU+KTFIZ0IhMgxSYqfFJikUdKITIMUmKnxSYpFHVEiJBikxU2KTFAzriTEgxSYqbFJimikdURxIcU3FTYpMUy0joiXFEOKTFS4pMU0WkapGkURYpMVLikxQkWkWkaJEeKTFSYoxSsaJFJGiRHikxUmKMUkjRIaRokR4pMVJijFKxpYEjVIjxRin4oxU2NLCSNEiPFGKkxRipsaWEkapEeKMVJikxU2NLEpGlhmKMU/FGKmxpYmxrYZijFPxRipsaWJsaWGYoxT8UYqLGlibGlhmKMU/FGKmxpYmxpYZilp2KXFTY0sTY0sMop+KMVNjSwkjSw2lp2KMUrF2JSNLDaWnYpcUkaWBItIbTqXFLQikCLSCnUU6qRSLRaQoqUUwVIK1iOJtAqBbjr6K0D/kEWX/XFf6187x19EaB/yCLL/riv9a+Yz/8AgU/+vn/trDP/AOBT/wCvn/trPmuIf4FL/r5/7axcQ/wKX/Xz/wBtZxvjz/V2P1n/AJJXjb17J48/1dj9Z/5JXjT13ZN/uFP1n/6Uwyb/AHCn6z/9KZ3ZN/yLqfrP/wBKYsm/5F1P1n/6Uyo1QGp2qua7Kgqh0VBVCI1GakNRGuCYpnBMUyM0ynmmGuWQpHLIUhlNp1NrBiZixMbRRRUCIEagqQVEKkFeUgPzdjZKKlFQipRVoEYsbJxVhaqip1rRAjmkORbWraVSWraVvEUTjmOZpR1rwdR9RWLHWxB1H1FageVWHWPeB0Fec+If+P3/ALZp/WvRh0FedeIP+P3/ALZp/WvHwn8b5MMJ/G+TPq87/wBxj/jp/kxZ3/uMf8dP8mcg9VWFXWFVyK9gD46BMWVSKjIqyVphWgDqTITKpFNxVnbTdtIZ0JmaZWxTcVa203bSGb3MrlbFJirO2k20hm9zK5WxSYqzto20hnRcxuVcUm2rW2k20hnRcxuVdtJtq1tpNtIZ0XMblbbSbatbKTbSGdFzG5V20batbKTZUlHRcx5irto21a20mypKOi5jzFXbRtq1so21JR0XMeYqbaNtWtlGypKOm5ipFTbRtq1spNlSUdKZipFXbSbat7KTZUF2OpMxUiptpNtW9lJsqC7HUmYqRV203bVvZRsqSjsTMVIp7aTbVvZSbKko7EzGMiptpNtW9lJspFHdFmUWU9tJtq3spuyhFHoQM4MqYpuKt7aYVpotI9GAUyrim4qyVpu2qSNEjtgjWCK2KTFWNtN20JGyRrFG8YkGKTFT7aTFJI2USoo3jEgxSYqfFJtqEjdREkdCiQ4pMVNijFZpG6iQkdCiQ4pMVNijFZ2N1EhI6FEhxSYqbbRisrG/KZJHQokOKMVNikxWVjo5TJI6FEixRipcUbaxsb8pkkdHKQ4oxU2KMVlY3sY2OjlIcUYqXFGKysbWMbHRykWKMVLijFZWN7GNjo5SLFGKlxRisrG1jGxvykWKMVNijFZ2NbGVjflIsUYqXFGKixrYzsbcpFilxUuKMVnY1sZ2N+UjxRipMUuKixrYySN+UjxS4qTFGKixrYzSNkhuKdinYpcUkjRISRqkIKkFJipVFCGyolbIsx19DaB/yCLL/riv9a+e0FfQugf8giy/64j+tfK5/wDwKf8A18/9tYs+/gU/+vn/ALaz5XiH+BS/6+f+2sXEH8Cl/wBfP/bWcX48/wBXY/Wf+SV429eyePf9XY/Wf+SV4y9ehk/+4U/Wf/pTDJ/+RfT9Z/8ApTO7J/8AkXU/Wf8A6Uwyf/kXU/Wf/pTKrVXNTtVc11VCahtVJqEZqI081Ga4ZkzOGZMxhphpxphrmkKRzSFIbTaWm1gxMxYmJRRSVAiBGoKeKiFSCvLQj87Y2SipRUAqUVohIxY2Tip1qsKmBrVCRzyHItqatoaoqatKa3iSjjmXM04zWxAeR9RWFGa1oG5H1FbgeRWRpWR9BDoK881//j9/7Zp/WvQx0H0rm9R0iS9uPNWVEG0Lggnpn0ryMJ/G+TMaNRUp8zV90fSZ5/uC/wAdP8mduPwksbhlSjJQd4Su02tF5HnLLUJWu4/4RuX/AJ7x/wDfLf403/hGpf8AnvH/AN8t/jXvHn/XY/yP70fnUWfS/wCr1b/n/T/8BkcKUpuyu7/4RmX/AJ7x/wDfLf40f8IzL/z8R/8AfLf416B5/wBdj/JL70fPqR9F/YFb/n/T/wDAZHBbKbsrvv8AhGJf+fiP/vlv8aT/AIRiX/n4j/75b/GvQPP+ux/kl96PA5j6D+wK3/P+n/4DI4HZSeXXf/8ACMS/8/Ef/fLf40n/AAi8v/PxH/3y3+Negef9dj/JL70eDzHvf2DW/wCf9P8A8BkcB5dHl13/APwi8v8Az8R/98t/jR/wi8v/AD8R/wDfLf416B5/12P8j+9Hh8x7v9g1v+f9P/wGR5/5dJ5degf8IvL/AM/Ef/fLf40f8IvL/wA/Ef8A3y3+Negef9dj/I/vR4nMe5/YVb/n/T/8BkefeXR5deg/8ItL/wA/Ef8A3y3+NH/CLS/8/Ef/AHw3+Negef8AXY/yP70eJzHuf2FW/wCf9P8A8Bkee+XR5deg/wDCLS/8/Ef/AHw3+NH/AAi0v/PxH/3w3+Negef9dj/JL70eLzHt/wBh1f8An9T/APAZHnvl0eXXoX/CLS/8/Ef/AHw3+NH/AAi03/PxH/3w3+Negef9dj/JL70eNzHs/wBh1f8An9T/APAZHnvl0nl16H/wi0v/AD8R/wDfDf40n/CKzf8APxH/AN8N/jXoHn/XY/yP70eRzHsf2JV/5/Q/8Bkee+XSeXXof/CKy/8APxH/AN8N/jR/wisv/PxH/wB8N/jXoHn/AF2P8j+9Hkc57H9i1f8An9D/AMBkeeeXR5deh/8ACKzf8/Ef/fDf40f8IrN/z8R/98N/jXoHn/XY/wAj+9Hlc56/9i1f+f0P/AZHnfl0eXXon/CKzf8APxH/AN8N/jSf8IrN/wA/Ef8A3w3+Negef9dj/I/vR5Smet/Y1X/n9D7pHnfl0eXXon/CKzf8/Ef/AHw3+NH/AAik3/PxH/3w3+Neied9dj/I/vR5imep/Y9X/n9D7medeXR5dei/8IpN/wA/Ef8A3w3+NJ/wik3/AD8R/wDfDf416J5312P8kvvR56mel/ZNX/n7D7medeXSeXXo3/CKTf8APxH/AN8N/jR/wik3/PxH/wB8N/jXpHm/XY/yS+9HCpnorKqn/P2H3M848uk8uvR/+ETm/wCfiP8A74b/ABo/4ROb/n4i/wC+G/xr0jzfrsf5H96ORTO5ZZU/5+Q+5nm/l0nl16R/wic3/PzF/wB8N/jR/wAIlN/z8xf98N/jXpHnfXo/yS+9HPGZ1rLqi/5eR+5nm3l03y69K/4RKb/n5i/74b/Gk/4RGb/n5i/74b/GvSPN+vR/kl96FGRusFNfbj9zPNfLpvl16X/wiE3/AD8xf98N/jR/wiE3/PzF/wB8N/jXpnm/X4/yS+9G9ORUMPKP2l+J5l5dRmOvUP8AhD5v+fmL/vhv8ajPg6c/8vUX/fDf417EUeZHMYL/AJdy+9Hr0NTOjP2e6ueWlKjKV6ifBdwf+XqH/vhv8aZ/whNx/wA/cP8A3w3+Ne7GJ5Szamv+XU/vR79OBywzCnH/AJdy+9Hl2yk2V6h/whFx/wA/cP8A3w/+NJ/wg9z/AM/cP/fD/wCNe4onjrOaS/5cz/8AAonswgcCzakv+XU/vR5dtpNteo/8INc/8/cP/ft/8aT/AIQa5/5/If8Av2/+Ne8oni/23S/58z/8CiexGmeYs5pL/lzP/wACieXbaTZXqP8Awg1z/wA/kP8A37f/ABo/4QW5/wCfyH/v2/8AjXvKJ4f9uUv+fM//AAKJ7SgeSs7o/wDPif8A4FE8t20ba9R/4QW5/wCfyH/v2/8AjR/wgtz/AM/kP/ft/wDGvfUTwv7epf8APip/4FE9tQPG/t2j/wA+Kn/gUTy3bRtr1L/hBbn/AJ/If+/b/wCNH/CCXP8Az+Q/9+3/AMa+g5TwP7fpf8+J/wDgUT3VA8X+36P/AD4qf+BRPLNtG2vUv+EEuf8An8h/79v/AI0f8IJc/wDP5D/37f8Axr6HlPn/AO36X/Pif/gUT3VA8P8A1go/8+Kn/gUTy3bSba9T/wCEEuf+fyH/AL9v/jR/wglz/wA/kP8A37f/ABr6LlPnv9YKX/Pif/gUT3+Q8H/WGj/0D1P/AAKJ5Zto216n/wAIJc/8/kP/AH7f/Gj/AIQS5/5/If8Av2/+NfR8p85/rBS/58T/APAon0PIfP8A+sNL/nxU/wDAonlm2jbXqf8Awglz/wA/kP8A37f/ABo/4QS5/wCfyH/v2/8AjX0nKfN/6wU/+fFT/wACifRch87/AKxUv+fFT/wKJ5Xto216p/wglz/z+Q/9+3/xo/4QS4/5/If+/b/419NynzP+sFP/AJ8VP/Aon0nIfN/6xUv+fFT/AMCieV7aNteqf8IJcf8AP5D/AN+3/wAaP+EEuP8An8h/79v/AI19PynzH+sFP/nxU/8AAon0vIfN/wCsVL/nxU/8CieV7aNteqf8IJcf8/kP/ft/8aP+EEuP+fyH/v2/+NfUcp8v/rBT/wCfFT/wKJ9NyHzP+sVL/nxU/wDAonle2jbXqv8Awglx/wA/kP8A37f/ABo/4QS4/wCfyH/v2/8AjX1PKfK/6wU/+fFT/wACifUch8t/rFS/58VP/AonlW2l216p/wAIJcf8/kP/AH7f/Gj/AIQW4/5/If8Av2/+NfV2PlP9YKf/AD4qf+BRPquU+V/1ipf8+Kn/AIFE8r20ba9V/wCEFuP+fyH/AL9v/jR/wgtx/wA/kP8A37f/ABr6yyPk/wDWCn/z4n/4FE+r5T5T/WGl/wA+Kn/gUTyvbRtr1T/hBbj/AJ+4f+/b/wCNH/CC3H/P3D/37f8Axr6zQ+T/ALfp/wDPmp/4FE+ssj5P/WGl/wA+Kn/gUTyzZRsr1T/hBbj/AJ+4f+/b/wCNH/CDXH/P3D/37f8Axr6y6Pkv7fp/8+Z/+BRPrdD5H/WGl/z4qf8AgUTy3ZTtleo/8INcf8/cP/ft/wDGl/4Qe4/5+4f+/b/419ZzHyX9v0/+fNT/AMCifXXPkP8AWCl/z4qf+BRPLwlSha9M/wCEHuP+fuH/AL4f/Gl/4Qi4/wCfuH/vh/8AGvqmz5T+3qf/AD5n/wCBRPrWz5H/AFgpf8+Kn/gUTzpRXv8AoP8AyCbL/rkP61w//CFXH/P3D/3w3+Nei6datZWcFuzBzEgUsBgH860z3+BT/wCvn/trPIx+YwxlOMFTlDllzXbT6NdDTP8A/d6f/Xz/ANtZ4+YZlDG04wjTlDllzXbT6NdDzzx9/q7D/en/AJJXjL17H8QD8lgPef8AkleMua+nyj/kX0/Wf/pTFlWmXUvWf/pTPp8o/wCRbS9Z/wDpTJyrTLaXrP8A9LZXaq5qVjUBroqMzqM0qEVGMNRGnmozXHMmRxyJkNNMpxplc8iZHPIUhKZTqbWTEzJiYlJRSVAiBGmKeKiFPFeYI/P2NkwqQVCKeK0QkYspk4NTA1WFTA1ohI55FMtKasKapg1OprZEo5JI0kjRRq0o3rFVquI9dKIizzKsbm80e1aP4gtpoEiuZBFKgC7m4VwOh3dAfUH8K6b7dZ/8/Nv/AN/U/wDiq+fElq0steRVoTjN2i2r3TSue4fR4THUKlGHPUhCSSUlKSjquuvRnxk4HvX220/5+YP+/if40fbbT/n4g/7+J/jXhYlp/m1897Op/JL7mfQn331vDf8AP+j/AOBx/wAz86dM9x+22n/PxB/38T/Gj7baf8/EH/fxP8a8P82l82vnvZ1P5Jfcz6E/RfreG/5/0f8AwOP+Z+cezPb/ALbaf8/EH/fxP8aPttp/z8Qf9/E/xrxDzaPNr572dT+SX3M+hP0f63hv+f8AR/8AA4/5n5xyHt/220/5+IP+/if40fbbT/n4g/7+J/jXiPm0nm1897Op/JL7mfQn6P8AWsN/z/o/+Bx/zPznkPb/ALbaf8/EH/fxP8aPttp/z8Qf9/E/xrxDzKPMr572dT+SX3M+hP0b61hv+f8AS/8AA4/5n5zyHt/220/5+IP+/if40fbbT/n4g/7+J/jXiHm0ebXz3s6n8kvuZ9Cfo31rDf8AP+l/4HH/ADPzrkPb/ttp/wA/EH/fxP8AGj7baf8APxB/38T/ABrxDzKTzK+e9nU/kl9zPoT9G+tYb/n9S/8AA4/5n53yHuH220/5+IP+/if40fbbT/n4g/7+J/jXh/mUeZXz3s6n8kvuZ9Cfon1rD/8AP6l/4HH/ADPzzkPcPttp/wA/EH/fxP8AGj7baf8APxB/38T/ABrw7zKPMr572dT+SX3M+hP0P61h/wDn9S/8Dj/mfnvIe4/bbT/n4g/7+J/jR9ttP+fmD/v4n+NeHeZR5lfPezqfyS+5n0J+hfWsP/z+pf8Agcf8z8/5D3H7baf8/MH/AH8T/Gj7baf8/MH/AH8T/GvDfMo8yvnvZ1P5Jfcz6E/QPrOH/wCf1L/wOP8AmfA8h7l9ttP+fmD/AL+J/jR9ttP+fmD/AL+J/jXhvmUeZXz3s6n8kvuZ9EfffWcP/wA/qX/gcf8AM+D5D3L7baf8/MH/AH8T/Gj7baf8/MH/AH8T/GvDPMo82vnfZ1P5Jfcz6I+9+s4f/n9S/wDA4/5nwige5/bbT/n5g/7+J/jR9ttP+fmD/v4n+NeGebSebXzvs6n8kvuZ9Efd/WaH/P6l/wCBx/zPh1A90+3Wf/PzB/39T/Gj7dZ/8/MH/fxP8a8L82k82vnfZ1P5Jfcz6I+4+sUP+ftP/wADj/mfFKB7r9us/wDn5g/7+p/jR9us/wDn5g/7+p/jXhPm0ebXzvs6n8kvuZ9EfbfWKH/P2n/4FH/M+OUD3b7dZ/8APzb/APf1P8aPt1n/AM/Nv/39T/GvCPNpPNr532dT+SX3M+jPsfb0f+ftP/wJf5nyage8fbrP/n5t/wDv6n+NH26z/wCfm3/7+p/jXg3m0nm1857Op/JL7mfRn1vtqX/PyH/gS/zPmYwPevt1n/z82/8A39T/AOKpPt1n/wA/Nv8A9/U/+KrwXzab5tfOeyqfyS+5n0h9P7Wn/PD/AMCR4MIHvn2+z/5+bf8A7+p/8VR9vsv+fq3/AO/qf/FV4F5tN82vm/ZVP5J/+As+mR9Bzwf2o/ejzqcD3/7fZf8AP1b/APf1P/iqZ/aFl/z9W/U/8tU/+KrwEy1E0lfN+xq/8+5/+Av/ACPqos9aKctk36anRhtD6D/tGw/5+7b/AL/R/wDxVH9pWH/P3a/9/o//AIqvnUvURevlvq9f/n1U/wDAZf5H20ZEKjVf/Luf/gL/AMj6SlUPo7+0tP8A+fy1/wC/0f8A8VR/aWn/APP5a/8Af6P/AOKr5u3U3dXxf1av/wA+av8A4BL/ACPvFM+d+r1/+fVT/wAAl/kfZQqH0n/aen/8/lr/AN/o/wD4qj+09P8A+fy1/wC/0f8A8VXzVupN1fB/VsR/z5q/+AS/yP0JTPjvq2I/581f/AJf5H3cah9Lf2np/wDz+Wv/AH+j/wDiqT+09P8A+fy1/wC/0f8A8VXzTupN1fn31XEf8+av/gEv8j9FUz4X6riP+fNX/wAAl/kfoCqH0v8A2np//P5a/wDf6P8A+Ko/tPT/APn8tf8Av9H/APFV8z7qN1fnX1XE/wDPir/4BL/I/SOc/P8A6rif+fFX/wAAl/kfoqqH0x/aen/8/lr/AN/o/wD4qj+09P8A+fy1/wC/0f8A8VXzNuo3V+b/AFXE/wDPir/4BL/I/S+c/OvqmJ/58Vv/AAXL/I/SVUPpn+09P/5/LX/v9H/8VR/aen/8/lr/AN/o/wD4qvmXdRur80+q4n/nxW/8Al/kfpvOfm/1TE/8+K3/AILl/kfpaqH01/aen/8AP5a/9/o//iqP7T0//n8tf+/0f/xVfMm6jdX5l9VxP/Pit/4BL/I/TuY/NPqmJ/58Vv8AwXL/ACP072h9N/2np/8Az+Wv/f6P/wCKo/tPT/8An8tf+/0f/wAVXzJuo3V+Y/VcT/z4q/8AgEv8j9P5j8x+qYn/AJ8Vv/Bcv8j9Q9ofTf8Aaen/APP5a/8Af6P/AOKo/tPT/wDn8tf+/wBH/wDFV8ybqTfX5h9VxP8Az4rf+AS/yP1DmR+X/VMT/wA+K3/guX+R+o859Of2np//AD+Wv/f6P/4qj+09P/5/LX/v9H/8VXzHvo31+X/VcT/z4q/+AS/yP1G6Py76pif+fFb/AMFy/wAj9S5z6c/tPT/+fy1/7/R//FUf2np//P5a/wDf6P8A+Kr5j30b6/LvquJ/58Vv/AJf5H6ldH5b9UxP/Pit/wCC5f5H6nzI+nP7T0//AJ/LX/v9H/8AFUf2np//AD+Wv/f6P/4qvmPfRvr8t+q4n/nxV/8AAJf5H6lofln1TE/8+K3/AILl/kfqnMj6c/tPT/8An8tf+/0f/wAVR/aen/8AP5a/9/o//iq+Y99G+vy36rif+fFX/wAAl/kfqeh+V/VMT/z4rf8AguX+R+q3R9Of2np//P5a/wDf6P8A+Ko/tPT/APn8tf8Av9H/APFV8x76N9fln1XE/wDPir/4BL/I/U9D8q+qYn/nxW/8Fy/yP1W6Ppz+09P/AOfy1/7/AEf/AMVR/aen/wDP5a/9/o//AIqvmPfR5lfln1XE/wDPir/4BL/I/U7I/KvqmJ/58Vv/AAXL/I/Vro+nP7T0/wD5/LX/AL/R/wDxVH9p6f8A8/lr/wB/o/8A4qvmPzKPMr8s+q4n/nzV/wDAJf5H6nZH5T9UxP8Az4rf+C5f5H6tofTv9p6f/wA/lr/3+j/+Ko/tPT/+fy1/7/R//FV8xeZR5lfln1XE/wDPir/4BL/I/U7I/KfqmJ/58Vv/AAXL/I/VtD6d/tPT/wDn8tf+/wBH/wDFUn9p6f8A8/lr/wB/o/8A4qvmLzKPMr8s+q4n/nxV/wDAJf5H6nZH5T9UxP8Az4rf+C5f5H6tofTv9p6f/wA/lr/3+j/+Ko/tPT/+fy1/7/R//FV8w+ZTfMr8s+q4n/nxW/8AAJf5H6noflP1TE/8+K3/AILl/kfq10fUH9qad/z+2n/f+P8A+KqvPrmlW6F3vbbA7LIrsfoqEsfyr5kL1GXr8ujg8VJpKhVu/wC5Jfi1Y/UHKx+VxwWLk0lQrXf9ySX3tWR+oSqHU+JNb/tm88xAUhiBSFT97Gcl29C3p2AFcaxpWaq5NefRpfVsNSo78kbN+e7/ABKqSPOpUvq2GpUd+SNn67v8QqyuNJqEmnE1ETXHUZlNnHNmU2IajNONRmueTIkznkyZMQ02lptZMlmLJYlMpabWbJZmxMKKSipESI0BTxUdOFeaI+DZTJRUgqGng1YjFlMmBqUGoBUgNaISMGUywDUwNVQalBrRCRzyRbRcBqdWqiDUoatkyEcckatGir1OJKzQ1SBq6EzNM4ZROho0xJT/ADKzQ9P31sRc4XA6XE0fMpfMrP30u+rJucnKdPKaHmUvmVn76XfVCucvKdPKX/Mo8yqO+jfVE3OblOnlL3mUeZVHfRuqibnPynTyl7zKPMqjuo3VRNzn5TosXfMo8yqW6jdVE3MOU6LF3zKN9Ut1JuqibmHKdNi95lJ5lUt1G6qJuYcp0WLvmUeZVLdSbqom5hynTYu+ZR5lUt1G6qJMOU6LF3zKTzKp7qTdVE3MeU6LF3zKPMqlupN1UTcy5TosXfMo8yqW6jdVEXMVE6Ei55lHmVS3Um6tLmdzNROhIu+ZSeZVPdSbqu5BmonQkXfMpPMqlupN1XckhROhIu+ZSeZVLdSbqu5AoxN0i55lJ5lU91JuqySoxNoot76bvqpupN1aEo3gjSCLW+mF6rbqbureLIR30tBQJy9M3VBupu6uqLMkz1qcjCDJ91N3VBmkzXYpHOmerGZyxZPupN1V80ma7VI50z04zORSLG6k3VBmkzXYpHMmeipnKpE+6jdVfNGa7FI5kzvUzlUifdRuqvmjNdnMc3MdymcqkT7qN1V80Zrr5jm5jtUzlUifdRuqDNJmuvmObmO3nOXmLG6jdVfNGa6uY5uY7Oc5eYn3Ubqr5ozXXzHNzHZznLzFjdRuqvmjNdXMc3MdnOcvMT7qN1QZpM11cxzcx185y8xY3Ubqr5ozXVzHNzHZznJzFjdRuqvmjNdXMc3MdnOcvMWN1G6q+aTNdPMc/MdfOcvMWd1JuqvmjNdPMc3MdfOcnMWN1G6q+aM108xzcx185y8xY3Um6q+aM108xzcx185x8xY3Um6q+aTNdPMcvMdfOcfMWN1N3VBupM10ORyOR1OZxuRMWphaos0zNbSmcjkbSmcjkPLVGTTSaYTRORhJhORhJgTUZoJpprKTM5MzkzKTENNoptZyZDM5MhiU2lptZslmbJYlNpabUMlkMTCikoqREiL9OqOnV5wHxLGSin1EKfVCMmUyUU8GoRT81YjFlMnBqQGq4NPBrRCMWimWQakBqsDTwa0RJg0W0Wg1SBqqA08NWtyDnaNGi3up26qu6nbq1uQc9jWxa3U7dVXdS7q0uRcwsa2LW6l3VV3Uu6tLkGNjWxZ3Uu6q26jdWhBlY1sWd1G6q+6jdV3IMrGtixuo3VX3Ubqu5BnY1sWN1G6q+6jdV3IM7Gtixuo3VX3UZqyDOxrYsbqTdUG6k3VdyDOxrYsbqN1V91G6rIM7GtixupN1QZpM1ZBFjWxY3Ubqr5o3VZBFjWxPuo3VXzRuqyCbGlifdRuqDdSZqySUjVIn3UbqgzSbqokSRokT7qTdUG6jNUSCRokT7qTdUGaTNUSCRokT7qTdUGaTNWSUkaJE+6k3VDmm5qyS4ouJPupu6oc0ma0JN4jiTbqbmos0ma1RJ1QFEkzTc1HmkzWyZCZ2RZESTNJmos0ma2TITOyLM0yTNGaizRmt0zJM7EzJMkzSZqPNJmui5lc60zFMlzSZqPNJmui5jc6kzJMkzRmo80ma6LmVzpTMUyXNJmo80ma3uZXOpMwTJc0ZqLNGa3uY3Om5jckzRmos0Zre5jc6bmFyXNJmo80ZrouY3Oi5jckzRmo80ma3uY3Oi5jclzRmos0Zre5jc6LmFyTNGajzSZre5hc6LmNyXNGaizRmt7mNze5jclzRmos0Zre5jc3uYXJM0ZqLNGa25jG5vcxuS5pM1HmkzW1zG5tcxuS5pM1HmkzW3MYXNuYwuS5pM1HmkzW3MYXNrmFyTNJmo80ma0cjBs1bMLj803NMzTc1bZi2W2Ytjs03NJmm5obMmwbMmwzTaKbUtmbZLZDYU2im1LZDIZLCm0UlSyWQyWFNopKlksliYUUlFIkRJ//Z',
    }
  }

  handleToolsVisibleChange = (toolsVisible) => {
    this.setState({ toolsVisible })
  }

  handleColorVisibleChange = (colorVisible) => {
    this.setState({ colorVisible })
  }

  handleInsertImageVisibleChange = (imageVisible) => {
    this.setState({ imageVisible })
  }

  _removeSelected = () => {
    this._sketch.removeSelected()
  }

  _undo = () => {
    this._sketch.undo()
    this.setState({
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    })
  }

  _redo = () => {
    this._sketch.redo()
    this.setState({
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    })
  }

  _hideDrawing = () => {
    const { hideEnable } = this.state

    const newHideEnable = !hideEnable

    if (newHideEnable) {
      this.setState({
        canUndo: false,
        canRedo: false,
        canClear: false,
        hideEnable: !hideEnable,
      })
    } else {
      this.setState({
        canUndo: this._sketch.canUndo(),
        canRedo: this._sketch.canRedo(),
        canClear: true,
        hideEnable: !hideEnable,
      })
    }
    this._sketch.hideDrawing(newHideEnable)
  }

  _clear = () => {
    this._sketch.clear()
    this._sketch.setBackgroundFromDataUrl('')
    this.setState({
      backgroundColor: 'transparent',
      fillWithBackgroundColor: false,
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
      canClear: false,
    })
  }

  _test = () => {
    this._sketch.test()
  }

  testPassValue = () => {
    let value = this._sketch.getValue()
    console.log(value)
    return value
  }

  _download = () => {
    this._sketch.downloadImage()
  }

  _onSketchChange = () => {
    let prev = this.state.canUndo
    let now = this._sketch.canUndo()
    if (prev !== now) {
      this.setState({
        canUndo: now,
        canClear: true,
        hideEnable: false,
      })
      this._sketch.hideDrawing(false)
    }
  }

  _selectTool = (event) => {
    this.setState({
      tool: event.target.value,
      // enableRemoveSelected: event.target.value === Tools.Select,
      // enableCopyPaste: event.target.value === Tools.Select,
    })
  }

  _addText = () => this._sketch.addText(this.state.text, this.state.lineColor)

  _performSetTextAndReset = () => {
    this.setState({
      tool: 'select',
    })
    this._addText()
  }

  _onBackgroundImageDrop = (accepted) => {
    let { indexCount } = this.state

    if (accepted && accepted.length > 0) {
      let sketch = this._sketch
      let reader = new FileReader()
      reader.addEventListener(
        'load',
        () => sketch.setBackgroundFromDataUrl(reader.result),
        false,
      )

      // let newIndexCount = indexCount + 1

      // this.setState({
      //   indexCount: newIndexCount,
      // })
      reader.readAsDataURL(accepted[0])
    }
  }

  _setTemplate = () => {
    this._sketch.setTemplate(this.state.exampleImage)
  }

  componentDidMount () {
    if (this.props.scribbleData !== '') {
      this._sketch.initializeData(this.props.scribbleData.lineData)
    }
  }

  render () {
    const {
      classes,
      toggleScribbleModal,
      handleSubmit,
      scriblenotes,
    } = this.props
    return (
      <div className={classes.layout}>
        <GridContainer>
          <GridItem xs={12} md={12} gutter={0} className={classes.gridItem}>
            <div className={classes.scribbleSubject}>
              <FastField
                name='subject'
                render={(args) => {
                  return <TextField label='Scribble Subject' {...args} />
                }}
              />
            </div>
            <ToggleButtonGroup
              // size='small'
              // value={alignment}
              exclusive
              onChange={(e) => {
                if (e.target.value === 'select') {
                  this.setState({
                    tool: e.target.value,
                  })
                } else if (e.target.value === 'eraser') {
                  this.setState({
                    tool: e.target.value,
                  })
                  this._removeSelected()
                }
              }}
              value={this.state.tool}
              outline='none'
            >
              <Tooltip title='Select'>
                <ToggleButton
                  key={1}
                  value={Tools.Select}
                  onClick={() => {
                    this.setState({
                      tool: 'select',
                    })
                  }}
                >
                  <Select />
                </ToggleButton>
              </Tooltip>
              <Popover
                icon={null}
                content={
                  <div>
                    <div>
                      <Typography>Please select Canvas Tool</Typography>
                      <br />
                      <Radio.Group
                        // defaultValue={Tools.Pencil}
                        value={this.state.tool}
                        buttonStyle='solid'
                        onChange={(e) => {
                          this.setState({
                            tool: e.target.value,
                          })
                        }}
                      >
                        <Tooltip title='Select'>
                          <React.Fragment>
                            <Radio.Button
                              value={Tools.Select}
                              className={classes.radioButtonPadding}
                            >
                              <Select />
                            </Radio.Button>
                          </React.Fragment>
                        </Tooltip>

                        <Tooltip title='Pencil'>
                          <Radio.Button
                            value={Tools.Pencil}
                            className={classes.radioButtonPadding}
                          >
                            <Pen />
                          </Radio.Button>
                        </Tooltip>

                        <Radio.Button
                          value={Tools.Line}
                          className={classes.radioButtonPadding}
                        >
                          <Remove />
                        </Radio.Button>
                        <Radio.Button
                          value={Tools.Arrow}
                          className={classes.radioButtonPadding}
                        >
                          <Backspace />
                        </Radio.Button>
                        <Radio.Button
                          value={Tools.Rectangle}
                          className={classes.radioButtonPadding}
                        >
                          <Rectangle />
                        </Radio.Button>
                        <Radio.Button
                          value={Tools.Circle}
                          className={classes.radioButtonPadding}
                        >
                          <Circle />
                        </Radio.Button>
                        <Radio.Button
                          value={Tools.Pan}
                          className={classes.radioButtonPadding}
                        >
                          <Move />
                        </Radio.Button>
                      </Radio.Group>
                    </div>

                    <br />
                    <div>
                      <Typography>Line Weight</Typography>
                      <Slider
                        // ValueLabelComponent={ValueLabelComponent}
                        step={1}
                        min={0}
                        max={50}
                        aria-labelledby='slider'
                        value={this.state.lineWidth}
                        onChange={(e, v) => this.setState({ lineWidth: v })}
                      />
                    </div>
                  </div>
                }
                title='Select Tools'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.toolsVisible}
                onVisibleChange={this.handleToolsVisibleChange}
              >
                <Tooltip title='Colors'>
                  <ToggleButton key={2} type='primary'>
                    <MoreVert />
                  </ToggleButton>
                </Tooltip>
              </Popover>

              <Popover
                icon={null}
                content={
                  <div>
                    <Typography>Line Color</Typography>
                    <CompactPicker
                      id='lineColor'
                      color={this.state.lineColor}
                      onChange={(color) =>
                        this.setState({ lineColor: color.hex })}
                    />

                    <br />
                    <br />

                    <Typography>Fill Color</Typography>
                    <CompactPicker
                      color={this.state.fillColor}
                      onChange={(color) =>
                        this.setState({ fillColor: color.hex })}
                    />

                    <br />
                    <br />
                    <Typography>Fill Enable</Typography>
                    <Switch
                      value={this.state.fillWithColor}
                      onChange={() =>
                        this.setState((preState) => ({
                          fillWithColor: !preState.fillWithColor,
                        }))}
                    />
                  </div>
                }
                title='Colors'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.colorVisible}
                onVisibleChange={this.handleColorVisibleChange}
              >
                <Tooltip title='Colors'>
                  <ToggleButton key={3}>
                    <ColorLens />
                  </ToggleButton>
                </Tooltip>
              </Popover>

              <Popover
                icon={null}
                content={
                  <div>
                    <Paper className={classes.templateImage}>
                      <List>
                        <div className={classes.imageOption}>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 1
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 2
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 3
                          </Button>
                        </div>
                        <div className={classes.imageOption}>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 1
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 2
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 3
                          </Button>
                        </div>
                        <div className={classes.imageOption}>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 1
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 2
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 3
                          </Button>
                        </div>
                        <div className={classes.imageOption}>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 1
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 2
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 3
                          </Button>
                        </div>
                      </List>
                    </Paper>

                    <br />

                    <div>
                      <Dropzone
                        onDrop={this._onBackgroundImageDrop}
                        accept='image/*'
                        multiple={false}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div {...getRootProps()} style={styles.dropArea}>
                              <input {...getInputProps()} />
                              <p className={classes.dropArea}>
                                Drag and drop some files here, or click to
                                select files
                              </p>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </div>
                  </div>
                }
                title='Select Image'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.imageVisible}
                onVisibleChange={this.handleInsertImageVisibleChange}
              >
                <Tooltip title='Insert Image'>
                  <ToggleButton key={4}>
                    <InsertPhoto />
                  </ToggleButton>
                </Tooltip>
              </Popover>
              <Tooltip title='Add Text'>
                <ToggleButton
                  key={5}
                  id='select'
                  type='primary'
                  onClick={this._performSetTextAndReset}
                >
                  <Title />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Erase'>
                <ToggleButton
                  key={7}
                  value={Tools.Eraser}
                  onClick={() => {
                    this.setState({
                      tool: 'eraser',
                    })
                  }}
                >
                  <Erase />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Save'>
                <ToggleButton key={6} onClick={this._download}>
                  <Save />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Undo'>
                <ToggleButton
                  key={7}
                  color='primary'
                  disabled={!this.state.canUndo}
                  onClick={this._undo}
                >
                  <UndoIcon
                    color={this.state.canUndo ? 'primary' : 'disabled'}
                  />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Redo'>
                <ToggleButton
                  key={8}
                  color='primary'
                  disabled={!this.state.canRedo}
                  onClick={this._redo}
                >
                  <RedoIcon
                    color={this.state.canRedo ? 'primary' : 'disabled'}
                  />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Remove All'>
                <ToggleButton
                  key={9}
                  color='primary'
                  disabled={!this.state.canClear}
                  onClick={this._clear}
                >
                  <DeleteIcon
                    color={this.state.canClear ? 'primary' : 'disabled'}
                  />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Hide'>
                <ToggleButton
                  key={10}
                  checked={this.state.hideEnable}
                  onClick={this._hideDrawing}
                >
                  {this.state.hideEnable ? (
                    <InVisibility color='disabled' />
                  ) : (
                    <Visibility color='primary' />
                  )}
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <div className={classes.rightButton}>
              <div className={classes.actionDiv}>
                <ProgressButton
                  onClick={() => {
                    temp = this._sketch.getValue()
                    handleSubmit()
                  }}
                />
                <Button color='danger' onClick={toggleScribbleModal}>
                  Cancel
                </Button>
              </div>
            </div>
            <div className={classes.sketchArea}>
              <SketchField
                name='sketch'
                ref={(c) => {
                  this._sketch = c
                }}
                lineWidth={this.state.lineWidth}
                lineColor={this.state.lineColor}
                className={classes.container}
                tool={this.state.tool}
                fillColor={
                  this.state.fillWithColor ? (
                    this.state.fillColor
                  ) : (
                    'transparent'
                  )
                }
                backgroundColor={
                  this.state.fillWithBackgroundColor ? (
                    this.state.backgroundColor
                  ) : (
                    'transparent'
                  )
                }
                onChange={this._onSketchChange}
                forceValue
                height={this.state.sketchHeight}
                width={this.state.sketchWidth}
              />
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Scribble)
