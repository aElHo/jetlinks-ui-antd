import React, {useEffect} from 'react';
import Form from 'antd/es/form';
import {FormComponentProps} from 'antd/lib/form';
import {Input, message, Modal, Spin} from 'antd';
import apis from '@/services';

interface Props extends FormComponentProps {
  close: Function;
  reload: Function;
  data: any;
}

const Save: React.FC<Props> = props => {
  const {
    form: {getFieldDecorator},
    form,
  } = props;
  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;

      preservation(fileValue);
    });
  };

  const preservation = (item: any) => {
    if (props.data.id) {
      apis.ctwingCmp.save(props.data.id, item)
        .then((response: any) => {
          if (response.status === 200) {
            message.success('保存成功');
            props.close();
            props.reload()
          }
        })
        .catch(() => {
        });
    } else {
      apis.ctwingCmp.saveData(item)
        .then((response: any) => {
          if (response.status === 200) {
            message.success('创建成功');
            props.close();
            props.reload()
          }
        })
        .catch(() => {
        });
    }
  };

  useEffect(() => {}, []);

  return (
    <Modal
      title={`${props.data.id ? '编辑' : '新增'}`}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        submitData();
      }}
      onCancel={() => props.close()}
    >
      <Spin spinning={false}>
        <Form labelCol={{span: 4}} wrapperCol={{span: 20}}>
          <Form.Item key="name" label="名称">
            {getFieldDecorator('name', {
              rules: [
                {required: true, message: '请输入设备名称'},
                {max: 200, message: '设备名称不超过200个字符'}
              ],
              initialValue: props.data.name,
            })(<Input placeholder="请输入设备名称"/>)}
          </Form.Item>
          <Form.Item key="passWord" label="密码">
            {getFieldDecorator('passWord', {
              rules: [
                {required: true, message: '请输入密码'}
              ],
              initialValue: props.data.passWord,
            })(<Input placeholder="请输入密码"/>)}
          </Form.Item>
          <Form.Item key="userId" label="用户id">
            {getFieldDecorator('userId', {
              rules: [
                {required: true, message: '请输入用户id'}
              ],
              initialValue: props.data.userId,
            })(<Input placeholder="请输入用户id"/>)}
          </Form.Item>
          <Form.Item key="secretKey" label="secretKey">
            {getFieldDecorator('secretKey', {
              rules: [
                {required: true, message: '请输入secretKey'}
              ],
              initialValue: props.data.secretKey,
            })(<Input placeholder="请输入secretKey"/>)}
          </Form.Item>
          <Form.Item key="explain" label="说明">
            {getFieldDecorator('explain', {
              initialValue: props.data.explain,
              rules: [{max: 200, message: '最多输入200个字符'}],
            })(<Input.TextArea rows={4} placeholder="请输入说明"/>)}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Form.create<Props>()(Save);
