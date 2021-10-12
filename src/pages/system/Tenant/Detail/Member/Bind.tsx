import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service } from '@/pages/system/Tenant';
import { message, Space } from 'antd';
import { useParams } from 'umi';
import TenantModel from '@/pages/system/Tenant/model';
import { observer } from '@formily/react';
import { useRef } from 'react';

interface Props {
  reload: () => void;
}

const Bind = observer((props: Props) => {
  const param = useParams<{ id: string }>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<UserItem>[] = [
    {
      dataIndex: 'name',
      title: '姓名',
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      dataIndex: 'username',
      title: '用户名',
      search: {
        transform: (value) => ({ username$LIKE: value }),
      },
    },
  ];

  const handleBind = () => {
    service.handleUser(param.id, TenantModel.bindUsers, 'bind').subscribe({
      next: () => message.success('操作成功'),
      error: () => message.error('操作失败'),
      complete: () => {
        TenantModel.bindUsers = [];
        actionRef.current?.reload();
        props.reload();
      },
    });
  };

  return (
    <ProTable
      actionRef={actionRef}
      columns={columns}
      rowKey="id"
      pagination={{
        pageSize: 5,
      }}
      tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
        <Space size={24}>
          <span>
            已选 {selectedRowKeys.length} 项
            <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
              取消选择
            </a>
          </span>
        </Space>
      )}
      tableAlertOptionRender={() => (
        <Space size={16}>
          <a onClick={handleBind}>批量绑定</a>
        </Space>
      )}
      rowSelection={{
        selectedRowKeys: TenantModel.bindUsers.map((item) => item.userId),
        onChange: (selectedRowKeys, selectedRows) => {
          TenantModel.bindUsers = selectedRows.map((item) => ({
            name: item.name,
            userId: item.id,
          }));
        },
      }}
      request={(params) => service.queryUser(params)}
      defaultParams={{
        'id$tenant-user$not': param.id,
      }}
    />
  );
});
export default Bind;
