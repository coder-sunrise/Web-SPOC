import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  GridContainer, GridItem, Button,
  Checkbox, TextField, FastField, Field, Tooltip
} from '@/components';
import { Table, Radio, Input, Form, Popconfirm, Typography, Space } from 'antd';
import { 
  ExclamationCircleOutlined, PlusOutlined,
  CloseCircleFilled, SaveFilled, DeleteFilled, EditFilled
} from '@ant-design/icons';
import Print from '@material-ui/icons/Print';
import styles from './ContactPersonList.less';

const EditableCell = ({ col, editing, editingKey, record, index, children, onErrorStatusChanged, ...restProps}) => {
  let cell = (
    <React.Fragment>
      {children}
    </React.Fragment>
  );

  //=============== Non-editing / non-editable cell (e.g. Action Column) ===============//
  if (!col) { return (<td {...restProps}>{cell}</td>); }
  if (!editing) {
    if (col.inputType && col.inputType === 'text') {
      cell = (
        <Tooltip title={record[col.dataIndex]} placement='bottom'>
          <span className={styles.cellNonWrapableText} style={{width: col.width - 20}}>{record[col.dataIndex]}</span>
        </Tooltip>
      )
    }

    return (<td {...restProps}>{cell}</td>);
  }

  //=============== Editable cell - No validation (isDefault) ===============//
  if (col.key === 'isDefault') {
    cell = <React.Fragment>{children}</React.Fragment>;
    return (<td {...restProps}>{cell}</td>);
  }

  //=============== Editable cell ===============//
  //===== State =====//
  const [validationError, setValidationError] = useState({hasError:false, errorMsg: ''});
  const [initialized, setInitialized] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (col.key === 'name') {
      inputRef.current.focus();
    }
  }, [initialized])

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      validateField(record[col.dataIndex]);
    }
  });

  //===== Events =====//
  const onFieldChanged = (e) => {
    validateField(e.target.value);
  }

  const validateField = (fieldValue) => {
    if (!col.editableRules || col.editableRules.length <= 0) return;

    let error = {hasError:false, errorMsg: ''};
    for (let i = 0; i < col.editableRules.length; i++){
      let editableRule = col.editableRules[i];

      if (editableRule.required && fieldValue === '') {
        error = {hasError:true, errorMsg: editableRule.message};
        break;
      }

      if (editableRule.max && fieldValue.length > editableRule.max) {
        error = {hasError:true, errorMsg: editableRule.message};
        break;
      }

      if (editableRule.type && editableRule.type === 'email' && fieldValue !== '') {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

        if (!pattern.test(fieldValue)) {
          error = {hasError:true, errorMsg: editableRule.message};
          break;
        }
      }
    }
    
    if (error.hasError != validationError.hasError && error.errorMsg != validationError.errorMsg) {
      if (onErrorStatusChanged) {
        onErrorStatusChanged(col.dataIndex, error);
      }

      setValidationError(error);
    }
  }

  //===== Styles =====//
  let inputContainerStyle = {
    display: 'flex',
    width: '100%'
  }
  let inputBoxStyle = {
    borderStyle: 'none none solid none',
    borderRadius: 0,
    outline: 'none',
    boxShadow: 'none',
  }

  //===== Component (Error Icon) =====//
  let errorIcon = undefined;
  if (validationError && validationError.hasError) {
    let errorIconStyle = {
      color: 'red',
      minWidth: 18,
      marginTop: 10,
      marginLeft: 4,
    }

    errorIcon = (
      <Tooltip title={validationError.errorMsg} placement='bottom' >
        <ExclamationCircleOutlined style={errorIconStyle}/>
      </Tooltip>
    )
    
    inputBoxStyle = {
      ...inputBoxStyle,
      borderColor: 'red',
    }
  }

  //===== Component (Main) =====//
  cell = (
    <React.Fragment>
      <div style={inputContainerStyle}>
        <Form.Item name={col.dataIndex} style={{margin: 0, width: '100%'}}>
          <Input 
            key={col.dataIndex}
            style={inputBoxStyle}
            onChange={onFieldChanged} 
            autoComplete='off'
            ref={inputRef}
            
            //=== Cannot use Ant Design Component default suffix feature, 
            //=== redrawing with suffix will cause control lost focus.
            //=== Manual refocus does not help as the cursor will refresh to the last character
            // suffix={errorIcon}
          />
        </Form.Item>
        {errorIcon}
      </div>
    </React.Fragment>
  );

  return <td {...restProps}>{cell}</td>
};

export const ContactPersonList = (props) => {
  const { dispatch, values } = props;
  const { onEditingListControl } = props;
  const { contactPersons } = values;

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [editingHasError, setEditingHasError] = useState(false);
  const [editingErrorFields, setEditingErrorFields] = useState([]);
  
  //--- Initialize contact person list state ---//
  const [data, setData]  = useState([]);
  useEffect(() => {
    setData(contactPersons);
  }, [contactPersons]);

  let filteredData = [];
  if (data && data.length > 0) {
    filteredData = data.filter(function(x) { return x.isDeleted !== true; });
  }

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({...record});
    setEditingHasError(false);
    setEditingKey(record.key);

    if (onEditingListControl) {
      onEditingListControl('Contact Person', true);
    }
  };

  const cancel = async (record) => {
    try {
      setEditingHasError(false);
      if (record.recordStatus === 'Adding') {
        setEditingKey('');
        deleteExisting(record);
      } else {
        setEditingKey('');
      }

      if (onEditingListControl) {
        onEditingListControl('Contact Person', false);
      }
    } catch (errInfo) {
      console.log('Validation Failed:', errInfo);
    }
  };

  const save = async (recordKey) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => recordKey === item.key);
      
      if (index > -1) {
        const contactPerson = newData[index];

        if (contactPerson.isNewRecord === true) {
          contactPerson.recordStatus = "New";
        }

        newData.splice(index, 1, {...contactPerson, ...row});
        setData(newData);
        setEditingKey('');
        
        props.setFieldValue('contactPersons', newData);

        if (onEditingListControl) {
          onEditingListControl('Contact Person', false);
        }
      }
    } catch (errInfo) {
      console.log('Validation Failed:', errInfo);
    }
  };

  const addNew = () => {
    let isDefault = true;
    let nextKey = 0;
    if (data && data.length > 0){
      nextKey = data[data.length - 1].key + 1;
      isDefault = false;
    }
    
    let newContact = {
      key: nextKey,
      name: '',
      mobileNumber: '', workNumber: '', faxNumber: '',
      emailAddress: '', remarks: '',
      isDefault: isDefault, isDeleted: false,
      isNewRecord: true, recordStatus: 'Adding',
    };

    edit(newContact);

    let newContacts = [...data, newContact];
    props.setFieldValue('contactPersons', newContacts);
  };

  const deleteExisting = (record) => {
    if (record.isNewRecord === true) {
      const newData = data.filter(function(x) { return x.key !== record.key; });
      setData(newData);
        
      props.setFieldValue('contactPersons', newData);
    } else {
      const newData = [...data];
      const index = newData.findIndex((item) => record.key === item.key);
      
      if (index > -1) {
        const contactPerson = newData[index];
        record.isDeleted = true;

        newData.splice(index, 1, {...contactPerson, ...record});
        setData(newData);
        
        props.setFieldValue('contactPersons', newData);
      }
    }
  }; 

  const setDefault = (e, record) => {
    try {
      const newData = [...data];
      const index = newData.findIndex((item) => record.key === item.key);
      const currentDefaultIndex = newData.findIndex((item) => item.isDefault === true);

      if (index !== currentDefaultIndex) {
        const newDefaultRecord = newData[index];
        const existingDefaultRecord = newData[currentDefaultIndex];

        newDefaultRecord.isDefault = true;
        newData.splice(index, 1, {...newDefaultRecord});

        if (existingDefaultRecord) {
          existingDefaultRecord.isDefault = false;
          newData.splice(currentDefaultIndex, 1, {...existingDefaultRecord})
        }

        props.setFieldValue('contactPersons', newData);
      }
    } catch (errInfo) {
      console.log('Set default failed', errInfo);
    }
  }

  const onEditingErrorStatusChanged = (fieldName, errorInfo) => {
    let newErrorList = [];
    
    if (errorInfo.hasError) {
      newErrorList = editingErrorFields.concat(fieldName);
    } else {
      if (editingErrorFields && editingErrorFields.length > 0) {
        newErrorList = editingErrorFields.filter(function(x) { return x !== fieldName; });
      }
    }
    
    setEditingErrorFields(newErrorList);
    if (newErrorList && newErrorList.length > 0) {
      setEditingHasError(true);
    } else {
      setEditingHasError(false);
    }
  };

  useEffect(() => {
    if (data && data.length > 0 && editingKey === '') {
      const records = data.filter(function(x) { return x.isDeleted === false; });

      if (records && records.length > 0) {
        const defaultRecord = records.filter(function(x) { return x.isDefault; });

        if (defaultRecord === undefined || defaultRecord === null || defaultRecord.length <= 0) {
          setDefault(undefined, records[0]);
        }
      }
    }
  });

  const contactPersonColumns = [
    {
      title: 'Contact Person Name', width: 250,
      dataIndex: 'name', key: 'name',
      editable: true, inputType: 'text',
      editableRules: [
        { required: true, message: 'This is a required field' },
        { max:200, message: 'Contact Person Name should not exceed 200 characters' }
      ],
    },
    {
      title: 'Contact No.', width: 125,
      dataIndex: 'mobileNumber', key: 'mobileNumber',
      align: 'center',
      editable: true, inputType: 'text',
      editableRules: [
        { max:50, message: 'Contact No. should not exceed 50 characters' }
      ],
    },
    {
      title: 'Office No.', width: 125,
      dataIndex: 'workNumber', key: 'workNumber',
      align: 'center',
      editable: true, inputType: 'text',
      editableRules: [
        { max:50, message: 'Office No. should not exceed 50 characters' }
      ]
    },
    {
      title: 'Fax No.', width: 125,
      dataIndex: 'faxNumber', key: 'faxNumber',
      align: 'center',
      editable: true, inputType: 'text',
      editableRules: [
        { max:50, message: 'Fax No. should not exceed 50 characters' }
      ]
    },
    {
      title: 'Email', width: 200,
      dataIndex: 'emailAddress', key: 'emailAddress',
      editable: true, inputType: 'text',
      editableRules: [
        { type: 'email', message: 'Please enter valid Email address'}
      ]
    },
    {
      title: 'Contact Remarks',
      dataIndex: 'remarks', key: 'remarks',
      editable: true, inputType: 'text',
    },
    {
      title: 'Default', width: 80,
      dataIndex: 'isDefault', key: 'isDefault',
      align: 'center',
      editable: true, inputType: 'radio',
      render: (_, record) => {
        let disableButton = false;
        const rowEditable = isEditing(record);
        if (editingKey !== '' && !rowEditable) {
          disableButton = true;
        }

        return (
          <Radio 
            disabled={disableButton}
            checked={record.isDefault}
            onChange={(e) => {setDefault(e, record)}}
          />
        )
      },
    },
    {
      title: 'Action', width: 100,
      align: 'center',
      render: (_, record) => {
        const actionIconStyle = {
          fontSize: 16,
          marginLeft: 4,
          marginRight: 4,
          marginTop: 4,
        }

        const alertActionIconStyle = {
          ...actionIconStyle,
          color: '#a52a2a',
        }

        //=== Not Editing ===//
        if (editingKey === '') {
          return (
            <React.Fragment>
              <Typography.Link color='primary' onClick={() => edit(record)}><EditFilled style={actionIconStyle}/></Typography.Link>
              <Typography.Link>
                <Popconfirm 
                  title='Sure to delete?'
                  cancelText='No'
                  okText='Yes'
                  onConfirm={() => deleteExisting(record)}
                >
                  <DeleteFilled style={alertActionIconStyle}/>
                </Popconfirm>
              </Typography.Link>
            </React.Fragment>
          );
        }

        const editable = isEditing(record);
        if (!editable) {
          return (
            <React.Fragment>
              <Typography.Link disabled><EditFilled style={actionIconStyle} /></Typography.Link>
              <Typography.Link disabled><DeleteFilled style={actionIconStyle} /></Typography.Link>
            </React.Fragment>
          );
        }

        //=== Editing ===//
        useEffect(() => {
          
        }, [editingHasError])

        return (
          <React.Fragment>
            {
              editingHasError? (
                <Typography.Link color='primary' disabled onClick={() => save(record.key)}>
                  <SaveFilled style={actionIconStyle} />
                </Typography.Link>
              ) : (
                <Tooltip title='Confirm Changes' placement='bottom'>
                  <Typography.Link color='primary' onClick={() => save(record.key)}>
                    <SaveFilled style={actionIconStyle} />
                  </Typography.Link>
                </Tooltip>
              )
            }

            <Tooltip title='Cancel' placement='bottom'>
              <Typography.Link>
                <Popconfirm 
                  title='Sure to cancel?'
                  cancelText='No'
                  okText='Yes'
                  onConfirm={() => cancel(record)}
                >
                  <CloseCircleFilled style={alertActionIconStyle}/>
                </Popconfirm>
              </Typography.Link>
            </Tooltip>
          </React.Fragment>
        );
      }
    }
  ];

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const columns = contactPersonColumns.map((col) => {
    if (!col.editable) { return col; }

    return {
      ...col,
      onCell: (record) => ({
        record,
        col: col,
        editing: isEditing(record),
        editingKey: editingKey,
        onErrorStatusChanged: onEditingErrorStatusChanged
      }),
    };
  });

  return (
    <React.Fragment>
      {/* Contact Person List */}
      {/* <GridItem style={{marginTop:50}}>
        <h4 style={{fontWeight:500}}>Contact Person</h4>
      </GridItem> */}
      
      <Form form={form} component={false}>
        <Table 
          className={styles.editableTable}
          rowClassName={(record) => isEditing(record) ? styles.editingRow : styles.editableRow}
          components={components}
          columns={columns} 
          dataSource={filteredData}
          pagination={{position: ['none', 'none']}}
        />
      </Form>

      <div style={{padding: 10}}>
        <Typography.Link 
          color='primary' 
          disabled={editingKey !== ''} 
          onClick={addNew}
        >
          <PlusOutlined style={{marginRight: 6}}/>
          New Contact Person
        </Typography.Link>
      </div>
    </React.Fragment>
  );
}