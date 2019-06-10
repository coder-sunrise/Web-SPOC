import React, { PureComponent, Suspense } from 'react'
import GridLayout, { Responsive, WidthProvider } from 'react-grid-layout'
import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'
import { getUniqueId } from '@/utils/utils'
import { smallTheme, defaultTheme, largeTheme } from '@/utils/theme'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'

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
  CheckboxGroup,
  ProgressButton,
  Checkbox,
  BaseInput,
  RadioGroup,
  SizeContainer,
  AntdSelect,
} from '@/components'

import { widgets } from '@/utils/widgets'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

// import PatientSearch from '@/pages/PatientDatabase/Search'
// import PatientDetail from '@/pages/PatientDatabase/Detail'
const doctors = [
  { value: 'all', name: 'All' },
  { value: 'bao', name: 'Bao' },
  { value: 'cheah', name: 'Cheah' },
  { value: 'tan', name: 'Tan' },
  { value: 'tan1', name: 'Tan1' },
  { value: 'tan2', name: 'Tan2' },
  { value: 'tan3', name: 'Tan3' },
  { value: 'tan4', name: 'Tan4' },
  { value: 'tan5', name: 'Tan5' },
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
})

const initValues = {
  doctorRemarks: 'Testing multiple lines of input',
  timing2: '08:30',
}
@withFormik({
  mapPropsToValues: () => initValues,
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    dob: Yup.date().required(),
    patientAccountNo: Yup.string().required(),
    genderFk: Yup.string().required(),
    doctorRemarks: Yup.string().required(),
    contact: Yup.object().shape({
      contactAddress: Yup.array().of(
        Yup.object().shape({
          line1: Yup.string().required(),
          postcode: Yup.number().required(),
          countryFk: Yup.string().required(),
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
    const { classes, ...resetProps } = this.props

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
    console.log(this.props)
    const testComponents = (
      <GridContainer>
        <GridItem sm={3}>
          <FastField
            name='name'
            render={(args) => <TextField label='Name' {...args} />}
          />
        </GridItem>
        <GridItem sm={3}>
          <FastField
            name='genderFk'
            render={(args) => (
              <CodeSelect label='Salutation' code='Salutation' {...args} />
            )}
          />
        </GridItem>
        <GridItem sm={3}>
          <FastField
            name='dob'
            render={(args) => <DatePicker label='DOB' code='dob' {...args} />}
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
      </GridContainer>
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
        <BaseInput label='BaseInput' {...testConfig} />
        <FastField
          name='doctorRemarks'
          render={(args) => (
            <TextField
              label='Remark'
              multiline
              rowsMax={4}
              {...testConfig}
              {...args}
            />
          )}
        />
        <SizeContainer size='lg'>{testComponents}</SizeContainer>

        {testComponents}
        <SizeContainer size='sm'>{testComponents}</SizeContainer>

        <RadioGroup
          label='Ttest'
          defaultValue='1'
          options={[
            {
              value: '1',
              label: 'Mailing Address',
            },
            {
              value: '2',
              label: 'Primary Address',
            },
          ]}
        />
        <FastField
          name='rd0'
          render={(args) => (
            <RadioGroup
              label=' '
              simple
              defaultValue='1'
              options={[
                {
                  value: '1',
                  label: 'Mailing Address',
                },
                {
                  value: '2',
                  label: 'Primary Address',
                },
              ]}
              {...args}
            />
          )}
        />
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
