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
import { InformationList } from './InformationList';
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
          <InformationList {...props}/>
        </Space>
      </CardContainer>
    )
  }
}

const copayerDetailTabs = (props) => [
  {
    id: 0,
    name: <span>Details</span>,
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
  console.log('index', props);
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
      code: Yup.string().max(20, 'Copayer Code should not exceed 20 characters'),
      displayValue: Yup.string().required().max(200, 'Copayer Name should not exceed 200 characters'),
      coPayerTypeFK: Yup.number().required(),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
      creditInformation: Yup.string().max(300, 'Credit Information should not exceed 300 characters'),
      remark: Yup.string().max(200, 'Remarks should not exceed 200 characters'),
      website: Yup.string().max(100, 'Website should not exceed 100 characters'),
      address: Yup.object().shape({
        postcode: Yup.string().max(10, 'Postcode should not exceed 10 characters'),
        blockNo: Yup.string().max(500, 'Block No should not exceed 500 characters'),
        unitNo: Yup.string().max(500, 'Unit No should not exceed 500 characters'),
        street: Yup.string().max(500, 'Street should not exceed 500 characters'),
        buildingName: Yup.string().max(500, 'Building Name should not exceed 500 characters'),
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