import React, { PureComponent, Suspense } from 'react'
import GridLayout, { Responsive, WidthProvider } from 'react-grid-layout'
import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'
import { deepDiffMapper } from '@/utils/cdrss'
import { smallTheme, defaultTheme, largeTheme } from '@/utils/theme'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'
import numeral from 'numeral'
import Search from '@material-ui/icons/Search'

import {
  FormControl,
  InputLabel,
  Input,
  Paper,
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
  IconButton,
  Menu,
  MenuItem,
  Popper,
  Fade,
  Divider,
  ClickAwayListener,
} from '@material-ui/core'
import MoreVert from '@material-ui/icons/MoreVert'

import {
  CardContainer,
  TextField,
  CodeSelect,
  Button,
  CommonHeader,
  CommonModal,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  notification,
  Select,
  DatePicker,
  DateRangePicker,
  CheckboxGroup,
  ProgressButton,
  Checkbox,
  BaseInput,
  RadioGroup,
  SizeContainer,
  AntdSelect,
  TimePicker,
  NumberInput,
  Switch,
} from '@/components'

import { widgets } from '@/utils/widgets'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

console.log(deepDiffMapper)
// import PatientSearch from '@/pages/PatientDatabase/Search'
// import PatientDetail from '@/pages/PatientDatabase/Detail'
const doctors = [
  { value: 'all', name: 'All' },
  { value: 'bao', name: 'Bao' },
  { value: 'cheah', name: 'Cheah' },
  // { value: 'tan', name: 'Tan' },
  // { value: 'tan1', name: 'Tan1' },
  // { value: 'tan2', name: 'Tan2' },
  // { value: 'tan3', name: 'Tan3' },
  // { value: 'tan4', name: 'Tan4' },
  // { value: 'tan5', name: 'Tan5' },
]

const ResponsiveGridLayout = WidthProvider(Responsive)
// let layout = {
//   lg: [
//     { i: 'a', x: 0, y: 0, w: 12, h: 6, static: true }, // static: true
//     { i: 'b', x: 0, y: 0, w: 6, h: 2 }, // minW: 2, maxW: 4
//     { i: 'c', x: 6, y: 0, w: 6, h: 2 },
//   ],
// }
const styles = (theme) => ({
  ...basicStyle(theme),
  container: {
    width: '100%',
  },
  item: {
    width: 100,
    border: '1px solid #ccc',
  },
  paper: {
    '&> div': {
      overflow: 'auto',
      height: '100%',
    },
    // padding: 10,
  },
  moreWidgetsBtn: {
    position: 'absolute',
    right: -13,
    top: 0,
  },
  labelClass: {
    label: {
      minWidth: 100,
    },
  },
})

const initValues = {
  doctorRemarks: 'Testing multiple lines of input',
  timing2: '08:30',
  doctor: [
    'bao',
  ],
}
@withFormik({
  mapPropsToValues: () => initValues,
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    dob: Yup.date().required(),
    patientAccountNo: Yup.string().required(),
    genderFK: Yup.string().required(),
    doctorRemarks: Yup.string().required(),
    doctor: Yup.array().of(Yup.string().required()).required(),
    doctorRadio: Yup.string().required(),
    isPersist: Yup.boolean().required(),
    fromto: Yup.array().of(Yup.date().min(2)).required().required(),
    numberField: Yup.number().required(),
    contact: Yup.object().shape({
      contactAddress: Yup.array().of(
        Yup.object().shape({
          line1: Yup.string().required(),
          postcode: Yup.number().required(),
          countryFK: Yup.string().required(),
        }),
      ),
    }),
  }),
  submitForm: (v) => {
    console.log(v)
  },
  displayName: 'ControlTest',
})
class ControlTest extends PureComponent {
  constructor (props) {
    super(props)
    this.container = React.createRef()
  }

  state = {}

  // componentDidUpdate (prevProps, prevState, snapshot) {
  //   console.log(this.props, prevProps)

  //   console.log(deepDiffMapper.map(this.props, prevProps, true))
  // }

  componentDidMount () {
    // create an instance
  }

  generateConfig = (cfg) => {
    const { classes, ...resetProps } = this.props
    const { elevation } = this.state
    return {
      elevation: 0,
      className: classes.paper,
      onMouseOver: (e) => {
        elevation[cfg.id] = 3
        this.setState({ elevation })
      },
      onMouseOut: (e) => {
        elevation[cfg.id] = 0
        this.setState({ elevation })
      },
    }
  }

  // componentWillReceiveProps (nextProps) {
  //   console.log(nextProps, this.props)
  // }

  render () {
    const { props, state } = this
    const { classes, theme, ...resetProps } = this.props
    console.log(this.props)
    const testConfig = {
      onFocus: (e) => {
        console.log(1)
        console.log(e)
      },
      onChange: (e) => {
        console.log(2)

        console.log(e)
      },
      onBlur: (e) => {
        console.log(3)

        console.log(e)
      },
      inputProps: {
        onChange: (e) => {
          console.log(4)

          console.log(e)
        },
        onBlur: (e) => {
          console.log(5)

          console.log(e)
        },
        onFocus: (e) => {
          console.log(6)

          console.log(e)
        },
      },
    }
    const testComponents = (
      <div style={{ marginBottom: theme.spacing(5) }}>
        <GridContainer>
          <GridItem sm={3}>
            <FastField
              name='name'
              render={(args) => (
                <TextField prefix={<Search />} label='Name' {...args} />
              )}
            />
          </GridItem>
          <GridItem sm={6}>
            <FastField
              name='name'
              render={(args) => {
                return (
                  <TextField
                    prefix={<Search />}
                    label='Multiline Name'
                    multiline
                    rowsMax={6}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='genderFK'
              render={(args) => (
                <CodeSelect label='Salutation' code='Salutation' {...args} />
              )}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='dob'
              render={(args) => <DatePicker label='DOB' {...args} />}
            />
          </GridItem>
          <GridItem sm={6}>
            <FastField
              name='fromto'
              render={(args) => (
                <DateRangePicker label='From' label2='To' {...args} />
              )}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='time'
              render={(args) => <TimePicker label='Time' {...args} />}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='name'
              render={(args) => (
                <TextField prefix={<Search />} label='Name' {...args} />
              )}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='isPersist'
              render={(args) => {
                return (
                  <Checkbox
                    label='Persist'
                    inputLabel='Input Persist'
                    labelPlacement='end'
                    prefix='External Prescription'
                    mode='default'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='doctor'
              render={(args) => (
                <CheckboxGroup
                  label='Filter by Doctor'
                  // vertical
                  // simple
                  // value={}
                  // value={{ tan1: true }}
                  textField='name'
                  options={doctors}
                  noUnderline
                  onChange={(e) => {
                    // console.log(e)
                    // dispatch({
                    //   type: 'consultation/updateState',
                    //   payload: {
                    //     selectedWidgets: e.target.value,
                    //   },
                    // })
                  }}
                  // labelClass={}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='doctorRadio'
              render={(args) => (
                <RadioGroup
                  label='Filter by Doctor'
                  // vertical
                  // simple
                  // value={}
                  // value={{ tan1: true }}
                  textField='name'
                  options={doctors}
                  onChange={(e) => {
                    // console.log(e)
                    // dispatch({
                    //   type: 'consultation/updateState',
                    //   payload: {
                    //     selectedWidgets: e.target.value,
                    //   },
                    // })
                  }}
                  // labelClass={}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='numberField'
              render={(args) => (
                <TextField
                  prefix='External Prescription'
                  label='Text Input'
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='doctor'
              render={(args) => (
                <Select
                  label='Filter by Doctor'
                  mode='multiple'
                  options={doctors}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='doctorsingle'
              render={(args) => (
                <Select
                  label='Filter by Doctor (Single)'
                  options={doctors}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='numberField'
              render={(args) => (
                <NumberInput
                  prefix='External Prescription'
                  label='Number Input'
                  step={0.5}
                  currency
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='numberField'
              render={(args) => (
                <TextField
                  prefix='External Prescription'
                  label='Text Input'
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem sm={3}>
            <FastField
              name='switch'
              render={(args) => {
                return <Switch label='Switch' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <Divider />
      </div>
    )
    return (
      <CardContainer
        // hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
        title={this.title}
      >
        <SizeContainer size='lg'>{testComponents}</SizeContainer>
        {testComponents}
        <SizeContainer size='sm'>{testComponents}</SizeContainer>

        <div>
          <Button
            onClick={() => {
              console.log(initValues)
              props.resetForm(initValues)
            }}
          >
            Reset
          </Button>
          <ProgressButton onClick={props.handleSubmit} />
        </div>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ControlTest)
