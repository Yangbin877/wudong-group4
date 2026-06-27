import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, Space, Modal, Form, InputNumber, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getRoutePackageList, getRoutePackageDetail, createRoutePackage, updateRoutePackage, deleteRoutePackage,
} from '../api';

export default function RoutePackageManage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [form] = Form.useForm();

  const fetchData = useCallback(async (p: number, kw: string) => {
    setLoading(true);
    try {
      const res = await getRoutePackageList({ page: p, pageSize: 20, keyword: kw });
      setList(res.data.list || []);
      setTotal(res.data.total || 0);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(page, keyword); }, [page]);

  const onSearch = () => { setPage(1); fetchData(1, keyword); };

  const onAdd = () => {
    setEditingId(null);
    form.resetFields();
    setItineraries([{ dayNo: 1, title: '', description: '', meals: '', accommodation: '' }]);
    setModalOpen(true);
  };

  const onEdit = async (record: any) => {
    setEditingId(record.id);
    const res = await getRoutePackageDetail(record.id);
    const detail = res.data || {};
    form.setFieldsValue({ name: detail.name, description: detail.description, coverImage: detail.coverImage, price: detail.price, days: detail.days, tags: (detail.tags || []).join(','), status: detail.status });
    setItineraries((detail.itineraries || []).length > 0 ? detail.itineraries : [{ dayNo: 1, title: '', description: '', meals: '', accommodation: '' }]);
    setModalOpen(true);
  };

  const onDelete = async (id: number) => {
    await deleteRoutePackage(id);
    message.success('删除成功');
    fetchData(page, keyword);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const body: any = {
      ...values,
      tags: values.tags ? values.tags.split(',').map((s: string) => s.trim()) : [],
      itineraries,
    };
    if (editingId) {
      await updateRoutePackage(editingId, body);
      message.success('更新成功');
    } else {
      await createRoutePackage(body);
      message.success('创建成功');
    }
    setModalOpen(false);
    fetchData(page, keyword);
  };

  const addItinerary = () => setItineraries([...itineraries, { dayNo: itineraries.length + 1, title: '', description: '', meals: '', accommodation: '' }]);

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name', width: 200, ellipsis: true },
    { title: '价格', dataIndex: 'price', width: 100, render: (v: number) => `¥${v}` },
    { title: '天数', dataIndex: 'days', width: 80 },
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
          <Input placeholder="搜索路线" value={keyword} onChange={(e) => setKeyword(e.target.value)} onPressEnter={onSearch} prefix={<SearchOutlined />} style={{ width: 240 }} />
          <Button type="primary" onClick={onSearch}>搜索</Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增路线</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={list} loading={loading}
        pagination={{ current: page, total, pageSize: 20, showTotal: (t) => `共 ${t} 条`, onChange: (p) => setPage(p) }} />
      <Modal title={editingId ? '编辑路线套餐' : '新增路线套餐'} open={modalOpen} onOk={handleOk} onCancel={() => setModalOpen(false)} width={720} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="套餐名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={2} /></Form.Item>
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item name="price" label="价格" rules={[{ required: true }]}><InputNumber min={0} step={0.01} /></Form.Item>
            <Form.Item name="days" label="天数" rules={[{ required: true }]}><InputNumber min={1} /></Form.Item>
            <Form.Item name="status" label="状态"><Select options={[{ label: '在售', value: 1 }, { label: '下架', value: 0 }]} style={{ width: 100 }} /></Form.Item>
          </Space>
          <Form.Item name="tags" label="标签（逗号分隔）"><Input placeholder="苗寨,两日游,含住宿" /></Form.Item>
        </Form>
        <h4 style={{ margin: '12px 0' }}>每日行程</h4>
        {itineraries.map((it, idx) => (
          <div key={idx} style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: 12, marginBottom: 12 }}>
            <Space style={{ display: 'flex' }} align="start">
              <Input addonBefore="Day" value={it.dayNo} onChange={(e) => {
                const copy = [...itineraries]; copy[idx].dayNo = Number(e.target.value); setItineraries(copy);
              }} style={{ width: 80 }} />
              <Input placeholder="标题" value={it.title} onChange={(e) => {
                const copy = [...itineraries]; copy[idx].title = e.target.value; setItineraries(copy);
              }} style={{ width: 200 }} />
            </Space>
            <Input.TextArea rows={2} placeholder="详细描述" value={it.description} onChange={(e) => {
              const copy = [...itineraries]; copy[idx].description = e.target.value; setItineraries(copy);
            }} style={{ marginTop: 8 }} />
            <Space style={{ marginTop: 8 }}>
              <Input placeholder="餐饮" value={it.meals} onChange={(e) => {
                const copy = [...itineraries]; copy[idx].meals = e.target.value; setItineraries(copy);
              }} />
              <Input placeholder="住宿" value={it.accommodation} onChange={(e) => {
                const copy = [...itineraries]; copy[idx].accommodation = e.target.value; setItineraries(copy);
              }} />
            </Space>
          </div>
        ))}
        <Button onClick={addItinerary} style={{ marginTop: 8 }}>+ 添加行程</Button>
      </Modal>
    </div>
  );
}
