import React, { PureComponent, Suspense } from 'react'
import GridLayout, { Responsive, WidthProvider } from 'react-grid-layout'
import Loadable from 'react-loadable'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import numeral from 'numeral'
import Search from '@material-ui/icons/Search'
import AttachMoney from '@material-ui/icons/AttachMoney'

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
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import WarningIcon from '@material-ui/icons/Warning'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import FilterList from '@material-ui/icons/FilterList'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import AmountSummary from '@/pages/Shared/AmountSummary'
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
  ButtonSelect,
  OutlinedTextField,
  CommonTableGrid,
} from '@/components'

import { widgets } from '@/utils/widgets'
import Yup from '@/utils/yup'
import { smallTheme, defaultTheme, largeTheme } from '@/utils/theme'

const styles = theme => ({
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

const rowData = []

for (let index = 0; index < 100; index++) {
  rowData.push({
    id: index,
    ProductCategoryName: `ProductCategoryName${index}`,
  })
}

const initValues = {
  doctorRemarks: 'Testing multiple lines of input',
  timing2: '08:30',
  numberField: 123,
  doctor: ['bao'],
}
@withFormik({
  mapPropsToValues: () => initValues,
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    dob: Yup.date().required(),
    patientAccountNo: Yup.string().required(),
    genderFK: Yup.string().required(),
    doctorRemarks: Yup.string().required(),
    doctor: Yup.array()
      .of(Yup.string().required())
      .required(),
    doctorRadio: Yup.string().required(),
    isPersist: Yup.boolean().required(),
    fromto: Yup.array()
      .of(Yup.date())
      .required()
      .min(2),
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
  submitForm: v => {
    console.log(v)
  },
  displayName: 'ControlTest',
})
class ControlTest extends PureComponent {
  constructor(props) {
    super(props)
    this.container = React.createRef()

    const title = 'Simple Title'
    const options = {
      body: 'Simple piece of body text.\nSecond line of body text :)',
    }
    // registration.showNotification(title, options)

    //   navigator.serviceWorker.getRegistration().then((reg) => {
    //     console.log(reg)
    //     let options = {
    //       body: 'Here is a notification body!',
    //       icon: 'images/example.png',
    //       vibrate: [
    //         100,
    //         50,
    //         100,
    //       ],
    //       data: {
    //         dateOfArrival: Date.now(),
    //         primaryKey: 1,
    //       },
    //       actions: [
    //         {
    //           action: 'explore',
    //           title: 'Explore this new world',
    //           icon: 'images/checkmark.png',
    //         },
    //         {
    //           action: 'close',
    //           title: 'Close notification',
    //           icon: 'images/xmark.png',
    //         },
    //       ],
    //     }
    //     reg.showNotification('Hello world!', options)
    //   })
  }

  state = {
    val: undefined,
  }

  // componentDidUpdate (prevProps, prevState, snapshot) {
  //   console.log(this.props, prevProps)

  //   console.log(deepDiffMapper.map(this.props, prevProps, true))
  // }

  componentDidMount() {
    // create an instance
  }

  generateConfig = cfg => {
    const { classes, ...resetProps } = this.props
    const { elevation } = this.state
    return {
      elevation: 0,
      className: classes.paper,
      onMouseOver: e => {
        elevation[cfg.id] = 3
        this.setState({ elevation })
      },
      onMouseOut: e => {
        elevation[cfg.id] = 0
        this.setState({ elevation })
      },
    }
  }

  // UNSAFE_componentWillReceiveProps (nextProps) {
  //   console.log(nextProps, this.props)
  // }

  render() {
    const { props, state } = this
    const { classes, theme, ...resetProps } = this.props
    console.log(Notification, Notification.permission)
    const testConfig = {
      onFocus: e => {
        console.log(1)
        console.log(e)
      },
      onChange: e => {
        console.log(2)

        console.log(e)
      },
      onBlur: e => {
        console.log(3)

        console.log(e)
      },
      inputProps: {
        onChange: e => {
          console.log(4)

          console.log(e)
        },
        onBlur: e => {
          console.log(5)

          console.log(e)
        },
        onFocus: e => {
          console.log(6)

          console.log(e)
        },
      },
    }
    const testComponents = (
      <div style={{ marginBottom: theme.spacing(5) }}>
        <CommonTableGrid
          rows={rowData}
          TableProps={{
            height: 300,
          }}
          columns={[
            { name: 'id', title: 'Id', getCellValue: row => row.id },
            {
              name: 'ProductCategoryName',
              title: 'Category',
              getCellValue: row => row.ProductCategoryName,
            },
            {
              name: 'StoreName',
              title: 'Store',
              getCellValue: row => row.StoreName,
            },
            {
              name: 'ProductName',
              title: 'Product',
              getCellValue: row => row.ProductName,
            },
            {
              name: 'SalesAmount',
              title: 'Amount',
              getCellValue: row => row.SalesAmount,
            },
          ]}
        />
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
        {/* <GridContainer>
          <GridItem xs={0} md={8} />
          <GridItem xs={12} md={4}>
            <AmountSummary
              rows={[
                {
                  id: 1,
                  totalAfterItemAdjustment: 100,
                },
              ]}
            />
          </GridItem>
        </GridContainer> */}
        <div>
          <Button
            onClick={() => {
              console.log(initValues)
              props.resetForm(initValues)
              // notification.error({
              //   // icon: WarningIcon,
              //   icon: null,
              //   duration: 0,
              //   placement: 'bottomRight',
              //   message: 'Notification Title',
              //   // description:
              //   //   'test test testtest d sd sd d test test test testtest d sd sd d testtest test testtest d sd sd d testtest test testtest d sd sd d testtest test testtest d sd sd d testtest test testtest d sd sd d test',
              // })
            }}
          >
            Reset
          </Button>
          <ProgressButton onClick={props.handleSubmit} />
        </div>
        <SizeContainer size='lg'>{testComponents}</SizeContainer>
        {testComponents}
        <SizeContainer size='sm'>{testComponents}</SizeContainer>

        <div>
          <Button
            onClick={() => {
              console.log(initValues)
              props.resetForm(initValues)
              // notification.error({
              //   // icon: WarningIcon,
              //   icon: null,
              //   duration: 0,
              //   placement: 'bottomRight',
              //   message: 'Notification Title',
              //   // description:
              //   //   'test test testtest d sd sd d test test test testtest d sd sd d testtest test testtest d sd sd d testtest test testtest d sd sd d testtest test testtest d sd sd d testtest test testtest d sd sd d test',
              // })
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
