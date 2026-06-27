import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, Space, Modal, Form, InputNumber, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getScenicSpotList, createScenicSpot, updateScenicSpot, deleteScenicSpot } from '../api';

export default function ScenicManage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchData = useCallback(async (p: number, kw: string) => {
    setLoading(true);
    try {
      const res = await getScenicSpotList({ page: p, pageSize: 20, keyword: kw });
      setList(res.data.list || []);
      setTotal(res.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(page, keyword); }, [page]);

  const onSearch = () => { setPage(1); fetchData(1, keyword); };

  const onAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalOpen(true);
  };

  const onEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const onDelete = async (id: number) => {
    await deleteScenicSpot(id);
    message.success('删除成功');
    fetchData(page, keyword);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (values.images) {
      values.images = values.images.split(',').map((s: string) => s.trim());
    }
    if (editingId) {
      await updateScenicSpot(editingId, values);
      message.success('更新成功');
    } else {
      await createScenicSpot(values);
      message.success('创建成功');
    }
    setModalOpen(false);
    fetchData(page, keyword);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name', width: 180 },
    { title: '地址', dataIndex: 'location', width: 200, ellipsis: true },
    { title: '评分', dataIndex: 'rating', width: 80 },
    {
      title: '操作', width: 180,
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除?" onConfirm={() => onDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索景区"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={onSearch}
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
          />
          <Button type="primary" onClick={onSearch}>搜索</Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增景区</Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={{
          current: page,
          total,
          pageSize: 20,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p) => setPage(p),
        }}
      />
      <Modal
        title={editingId ? '编辑景区' : '新增景区'}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="location" label="地址">
            <Input />
          </Form.Item>
          <Form.Item name="openTime" label="开放时间">
            <Input placeholder="08:00-18:00" />
          </Form.Item>
          <Form.Item name="rating" label="评分">
            <InputNumber min={0} max={5} step={0.1} />
          </Form.Item>
          <Form.Item name="tips" label="游玩贴士">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="images" label="图片URL（逗号分隔）">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
