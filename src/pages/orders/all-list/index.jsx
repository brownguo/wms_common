import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Tag} from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryRule, updateRule, addRule, removeRule } from './service';

const hanldeButtonLoading = async fields =>{
    alert('dialog');
};

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    await addRule({
      desc: fields.desc,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async fields => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map(row => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const state = {
    loading: false,
    iconLoading: false,
  };
  const columns = [
    {
      title: '订单ID',
      dataIndex: 'order_id',
    },
    {
      title: '姓名',
      dataIndex: 'username',
    },
    {
      title: '手机号',
      dataIndex: 'mobile_phone',
    },
    {
      title: '金额',
      dataIndex: 'callNo',
      sorter: true,
      renderText: val => `${val} 万`,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '已下单',
          status: 'Default',
        },
        1: {
          text: '未审核',
          status: 'Processing',
        },
        2: {
          text: '已审核',
          status: 'Success',
        },
        3: {
          text: '订单作废',
          status: 'Error',
        },
      },
    },
    {
      title: '下单时间',
      dataIndex: 'createdAt',
      hideInSearch: true,
      valueType:'dateTime'
    },
    {
      title: '审核时间',
      dataIndex: 'updatedAt',
      hideInSearch: true,
      valueType:'dateTime'
    },
    {
      title: '根据时间段搜索',
      dataIndex: 'search_id',
      hideInTable:true,
      valueType:'dateRange'
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
            type="primary"
          >
            配置
          </Button>
          <Divider type="vertical" />
          <Button shape="round" type="dashed" danger="true">订阅警报</Button>
        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="订单列表"
        actionRef={actionRef}
        rowKey="key"
        searchText="Halo!"
        resetText="点错了，从来"
        toolBarRender={(action, { selectedRows }) => [
          <Button loading={state.iconLoading} icon={<PlusOutlined />} type="primary" onClick={() => handleModalVisible(true)}>
            下单
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="approval">批量审批</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={(selectedRowKeys, selectedRows) => (
          <div>
            已选择{' '}
            <a
              style={{
                fontWeight: 600,
              }}
            >
              {selectedRowKeys.length}
            </a>{' '}
            单&nbsp;&nbsp;
            <span>
              金额总计 {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} 万
            </span>
          </div>
        )}
        request={params => queryRule(params)}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);
          await hanldeButtonLoading();
          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);

            if (success) {
              handleModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
