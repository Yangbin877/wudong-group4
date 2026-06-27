import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, Space, Tag, Popconfirm, message } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { getElectronicTicketList, deleteElectronicTicket } from '../api';

export default function ElectronicTicketList() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const statusMap: Record<number, { color: string; text: string }> = {
    0: { color: 'blue', text: '未使用' },
    1: { color: 'green', text: '已核销' },
    2: { color: 'red', text: '已过期' },
    3: { color: 'default', text: '已退款' },
  };

  const fetchData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await getElectronicTicketList({ page: p, pageSize: 20 });
      setList(res.data.list || []);
      setTotal(res.data.total || 0);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(page); }, [page]);

  const onDelete = async (id: number) => {
    await deleteElectronicTicket(id);
    message.success('删除成功');
    fetchData(page);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '订单号', dataIndex: 'orderNo', width: 150 },
    { title: '二维码', dataIndex: 'qrCode', width: 200, ellipsis: true },
    { title: '票种', width: 100, render: (_: any, r: any) => r.ticketType?.name || '-' },
    { title: '路线', width: 130, render: (_: any, r: any) => r.routePackage?.name || '-', ellipsis: true },
    { title: '价格', dataIndex: 'price', width: 80, render: (v: number) => `¥${v}` },
    { title: '有效期', width: 160, render: (_: any, r: any) => `${r.validStart || '-'} ~ ${r.validEnd || '-'}` },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (v: number) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text}</Tag>,
    },
    {
      title: '操作', width: 80,
      render: (_: any, record: any) => (
        <Popconfirm title="确定删除?" onConfirm={() => onDelete(record.id)}>
          <Button icon={<DeleteOutlined />} size="small" danger />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Input placeholder="搜索电子票" prefix={<SearchOutlined />} style={{ width: 240 }} />
          <Button type="primary">搜索</Button>
        </Space>
      </div>
      <Table rowKey="id" columns={columns} dataSource={list} loading={loading}
        pagination={{ current: page, total, pageSize: 20, showTotal: (t) => `共 ${t} 条`, onChange: (p) => setPage(p) }} />
    </div>
  );
}
