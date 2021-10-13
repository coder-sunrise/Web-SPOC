import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  GridContainer, GridItem, Space, Button, IconButton,
  Checkbox, TextField, FastField, Field, Tooltip
} from '@/components';
import { Table, Radio, Input, Form, Popconfirm, Typography } from 'antd';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Save from '@material-ui/icons/Save';
import Cancel from '@material-ui/icons/Cancel';
import Print from '@material-ui/icons/Print';
import styles from './ContactPersonList.less';

const EditableCell = ({ editing, editingKey, required, dataIndex, title, inputType, record, index, children, ...restProps}) => {
  let cell = (
    <div className="editable-cell-value-wrap">
      {children}
    </div>
  );

  if (editing === true) {
    cell = (
      <Form.Item
        name={dataIndex}
        style={{ margin: 0, }}
        rules={[
          {
            required: required,
            // message: `${title} is required!`,
            message: 'This is a required field'
          },
        ]}
      >
        <input type='text' class='ant-input'/>
      </Form.Item>
    );
  }
  
  if (editingKey !== '' && title === 'Default') {
    cell = <span></span>
  }

  return (
    <td {...restProps}>
      {cell}
    </td>
  )
};

export const ContactPersonList = (props) => {
  const { dispatch, values } = props;
  const { contactPersons } = values;

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  
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
    setEditingKey(record.key);
  };

  const cancel = async (record) => {
    try {
      if (record.recordStatus === 'Adding') {
        setEditingKey('');
        deleteExisting(record);
      } else {
        const row = await form.validateFields();
        setEditingKey('');
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
  })

  const contactPersonColumns = [
    {
      title: 'Name', width: 250,
      dataIndex: 'name', key: 'name',
      editable: true, inputType: 'text', required: true,
    },
    {
      title: 'Contact Number', width: 125,
      dataIndex: 'mobileNumber', key: 'mobileNumber',
      align: 'center',
      editable: true, inputType: 'text',
    },
    {
      title: 'Office Number', width: 125,
      dataIndex: 'workNumber', key: 'workNumber',
      align: 'center',
      editable: true, inputType: 'text',
    },
    {
      title: 'Fax Number', width: 125,
      dataIndex: 'faxNumber', key: 'faxNumber',
      align: 'center',
      editable: true, inputType: 'text',
    },
    {
      title: 'Email Address', width: 200,
      dataIndex: 'emailAddress', key: 'emailAddress',
      editable: true, inputType: 'text',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks', key: 'remarks',
      editable: true, inputType: 'text',
    },
    {
      title: 'Default', width: 80,
      dataIndex: 'isDefault', key: 'isDefault',
      align: 'center',
      editable: true, inputType: 'radio',
      render: (_, record) => (
          <Radio
            checked={record.isDefault}
            onChange={(e) => {setDefault(e, record)}}
          />
      ),
    },
    {
      title: 'Action', width: 100,
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);
        if (editable) {
          return (
            <React.Fragment>
              <Tooltip title='Confirm Changes' placement='bottom'>
                <IconButton color='primary' onClick={() => save(record.key)} style={{marginRight: 5,}}>
                  <Save />
                </IconButton>
              </Tooltip>
              
              <Tooltip title='Confirm Changes' placement='bottom'>
                <IconButton onClick={() => cancel(record)}>
                  <Cancel style={{color: '#a52a2a' }}/>
                </IconButton>
              </Tooltip>
            </React.Fragment>
          );
        }

        if (editingKey === '') {
          return (
            <React.Fragment>
              <IconButton color='primary' onClick={() => edit(record)} style={{marginRight: 5,}}><Edit /></IconButton>
              <IconButton onClick={() => deleteExisting(record)}><Delete style={{color: '#a52a2a' }}/></IconButton>
            </React.Fragment>
          );
        }
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
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        required: col.required,
        editing: isEditing(record),
        editingKey: editingKey,
        inputType: col.inputType,
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
          components={components}
          columns={columns} 
          dataSource={filteredData}
          rowClassName={styles.editableRow}
          pagination={{position: ['none', 'none']}}
        />
      </Form>

      <GridContainer>
        <GridItem md={3}>
          <Button link color='primary' disabled={editingKey !== ''} onClick={addNew}>
            <Add/>
            New Contact Person
          </Button>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  );
}
