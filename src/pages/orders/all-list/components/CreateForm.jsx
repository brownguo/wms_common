import React from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

const CreateForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleAdd(fieldsValue);
  };

  return (
    <Modal
      destroyOnClose
      title="新建订单"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="姓名"
          name="username"
        >
          <Input placeholder="请输入" />
        </FormItem>

        <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="手机号"
            name="mobile_number"
        >
          <Input placeholder="请输入" />
        </FormItem>

        <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="金额"
            name="money"
        >
          <Input placeholder="请输入" />
        </FormItem>

        <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="地址"
            name="address"
        >
          <Input.TextArea />
        </FormItem>

        <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="备注"
            name="desc"
        >
          <Input.TextArea />
        </FormItem>

      </Form>
    </Modal>
  );
};

export default CreateForm;
