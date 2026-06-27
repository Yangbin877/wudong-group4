import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, Space, Modal, Form, InputNumber, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getTicketTypeList, createTicketType, updateTicketType, deleteTicketType, getScenicSpotList } from '../api';

export default function TicketTypeManage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [scenicSpots, setScenicSpots] = useState<any[]>([]);
  const [form] = Form.useForm();

  const fetchData = useCallback(async (p: number, kw: string) => {
    setLoading(true);
    try {
      const res = await getTicketTypeList({ page: p, pageSize: 20, keyword: kw });
      setList(res.data.list || []);
      setTotal(res.data.total || 0);
    } finally { setLoading(false); }
  }, []);

  const loadSpots = async () => {
    const res = await getScenicSpotList({ page: 1, pageSize: 200 });
    setScenicSpots(res.data.list || []);
  };

  useEffect(() => { fetchData(page, keyword); }, [page]);

  const onSearch = () => { setPage(1); fetchData(1, keyword); };

  const onAdd = async () => {
    setEditingId(null);
    form.resetFields();
    await loadSpots();
    setModalOpen(true);
  };

  const onEdit = async (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    await loadSpots();
    setModalOpen(true);
  };

  const onDelete = async (id: number) => {
    await deleteTicketType(id);
    message.success('删除成功');
    fetchData(page, keyword);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (editingId) {
      await updateTicketType(editingId, values);
      message.success('更新成功');
    } else {
      await createTicketType(values);
      message.success('创建成功');
    }
    setModalOpen(false);
    fetchData(page, keyword);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name', width: 150 },
    { title: '所属景区', width: 150, render: (_: any, r: any) => r.scenicSpot?.name || '-' },
    { title: '价格', dataIndex: 'price', width: 100, render: (v: number) => `¥${v}` },
    { title: '有效期(天)', dataIndex: 'validityDays', width: 100 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v: number) => v === 1 ? '在售' : '下架' },
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
          <Input placeholder="搜索票种" value={keyword} onChange={(e) => setKeyword(e.target.value)} onPressEnter={onSearch} prefix={<SearchOutlined />} style={{ width: 240 }} />
          <Button type="primary" onClick={onSearch}>搜索</Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增票种</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={list} loading={loading}
        pagination={{ current: page, total, pageSize: 20, showTotal: (t) => `共 ${t} 条`, onChange: (p) => setPage(p) }} />
      <Modal title={editingId ? '编辑票种' : '新增票种'} open={modalOpen} onOk={handleOk} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="scenicSpotId" label="所属景区" rules={[{ required: true }]}>
            <Select options={scenicSpots.map((s: any) => ({ label: s.name, value: s.id }))} />
          </Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true }]}><InputNumber min={0} step={0.01} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="validityDays" label="有效期天数" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="status" label="状态"><Select options={[{ label: '在售', value: 1 }, { label: '下架', value: 0 }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
