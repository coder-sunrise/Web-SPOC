import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import { status } from '@/utils/codes'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  ProgressButton,
  Select,
} from '@/components'
import AntdCascader from '@/components/Antd/AntdCascader'

@withFormikExtend({
  mapPropsToValues: ({ settingCaseType }) => ({
    ...(settingCaseType.filter || {}),
    isActive: true,
  }),
  handleSubmit: () => {},
  displayName: 'CaseTypeFilter',
})
class Filter extends PureComponent {
  render() {
    const { classes } = this.props
    const options = [
      {
        value: '111',
        label: 'Zhejiang',
      },
      {
        value: '222',
        label: 'Clinical Notes',
        children: [
          {
            value: '1',
            label: 'Hangzhou',
          },
          {
            value: '2',
            label: 'Hangzhou',
          },
          {
            value: '3',
            label: 'Hangzhou',
          },
          {
            value: '4',
            label: 'Hangzhou',
          },
          {
            value: '5',
            label: 'Hangzhou',
          },
          {
            value: '6',
            label: 'Hangzhou',
          },
        ],
      },
      {
        value: '777',
        label: 'Forms',
      },
      {
        value: '888',
        label: 'Notes',
      },
      {
        value: '999',
        label: 'Diagnosis',
      },
    ]
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='codeDisplayValue'
              render={args => {
                return <TextField label='Code / Display Value' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='isActive1'
              render={args => {
                return (
                  <AntdCascader
                    label='Test'
                    options={options}
                    multiple
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='isActive'
              render={args => {
                return <Select label='Status' options={status} {...args} />
              }}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={<Search />}
                onClick={() => {
                  const { codeDisplayValue, isActive } = this.props.values
                  console.log(this.props.values)
                  // this.props.dispatch({
                  //   type: 'settingCaseType/query',
                  //   payload: {
                  //     isActive,
                  //     group: [
                  //       {
                  //         code: codeDisplayValue,
                  //         displayValue: codeDisplayValue,
                  //         combineCondition: 'or',
                  //       },
                  //     ],
                  //   },
                  // })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingCaseType/updateState',
                    payload: {
                      entity: undefined,
                    },
                  })
                  this.props.toggleModal()
                }}
              >
                <Add />
                Add New
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Filter
