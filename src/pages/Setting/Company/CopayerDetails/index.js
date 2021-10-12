import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { navigateDirtyCheck } from '@/utils/utils';
import { 
  withFormikExtend,
  FastField, Field,
  Tabs, CardContainer,
  Button, ProgressButton,
} from '@/components';
import { General } from './General';
import { ContactPersonList } from './ContactPersonList';
import { Space } from 'antd';
import Yup from '@/utils/yup';

const styles = () => ({
  actionDiv: { 
    textAlign: 'center',
  },
});  

const getTabContent = (tabName, props) => {
  const { height } = props;
  if (tabName === 'General') {
    return (
      <CardContainer 
        hideHeader
        style={{
          height,
          overflowX: 'hidden',
        }}
      >
        <Space direction="vertical">
          <General {...props}/>
          <ContactPersonList {...props}/>
        </Space>
      </CardContainer>
    )
  }
}

const copayerDetailTabs = (props) => [
  {
    id: 0,
    name: <span>General</span>,
    content: getTabContent('General', props)
  }
]

const Detail = (props) =>
{
  const { classes, theme } = props;
  const { copayerDetail, clinicSettings } = props;
  const { handleSubmit } = props;
  const compProps = {
    height: `calc(100vh - ${183 + theme.spacing(1)}px)`,
    ...props
  };

  const spacingSize = theme.spacing(1);

  return (
    <React.Fragment>
      <Tabs style={{ marginTop: theme.spacing(1) }} defaultActiveKey='0' options={copayerDetailTabs(compProps)}/>
      <div style={{textAlign: 'center'}}>
        <Button
          authority='none'
          color='danger'
          onClick={navigateDirtyCheck({redirectUrl: '/finance/copayer',})}
        >
          Close
        </Button>
        <ProgressButton
          submitKey='schemeDetail/submit'
          onClick={handleSubmit}
        />
      </div>
    </React.Fragment>
  );
}

export default compose(
  withStyles(styles, { withTheme: true}),
  connect(({ copayerDetail, clinicSettings, global }) => ({
    copayerDetail, clinicSettings,
    // mainDivHeight: global.mainDivHeight,
  })),
  withFormikExtend({
    // authority: [
    //   'copayer.copayerDetail',
    //   'copayer.newcopayer',
    // ],
    displayName: 'copayerDetails',
    enableReinitialize: true,
    mapPropsToValues: ({ copayerDetail }) => {
      return copayerDetail.entity ? copayerDetail.entity : copayerDetail.default;
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().required(),
      displayValue: Yup.string().required(),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
      address: Yup.object().shape({
        countryFK: Yup.number().required(),
      }),
    }),
    handleSubmit: (values, { props }) => {
      const { dispatch, history } = props;
      const { effectiveDates, ...restValues } = values;

      const actionPayload = {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
        companyTypeFK: 1,
        companyTypeName: 'copayer',
      }

      dispatch({
        type: 'copayerDetail/upsert',
        payload: { ...actionPayload }
      }).then (result => {
        if (result !== false) {
          history.push('/finance/copayer');
        }
      });
    }
  })
)(Detail);