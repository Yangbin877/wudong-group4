import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Select, Space, DatePicker, InputNumber, message } from 'antd';
import { SearchOutlined, SaveOutlined } from '@ant-design/icons';
import { getTicketTypeList, getTicketInventoryList, batchUpdateInventory } from '../api';
import dayjs from 'dayjs';

export default function InventoryManage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [selTicketType, setSelTicketType] = useState<number | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [editMap, setEditMap] = useState<Record<number, number>>({});

  const fetchData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params: any = { page: p, pageSize: 20 };
      if (selTicketType) params.ticketTypeId = selTicketType;
      if (dateRange) {
        params.dateFrom = dateRange[0];
        params.dateTo = dateRange[1];
      }
      const res = await getTicketInventoryList(params);
      setList(res.data.list || []);
      setTotal(res.data.total || 0);
    } finally { setLoading(false); }
  }, [selTicketType, dateRange]);

  useEffect(() => { fetchData(page); }, [page]);

  useEffect(() => {
    getTicketTypeList({ page: 1, pageSize: 200 }).then(res => {
      setTicketTypes(res.data.list || []);
    });
  }, []);

  const onSearch = () => { setPage(1); fetchData(1); };

  const onSave = async () => {
    const items = Object.entries(editMap).map(([id, stock]) => {
      const item = list.find((i: any) => i.id === Number(id));
      return { ticketTypeId: item?.ticketTypeId, date: item?.inventoryDate, stock };
    });
    if (items.length === 0) { message.warning('无修改'); return; }
    await batchUpdateInventory(items);
    message.success('批量更新成功');
    setEditMap({});
    fetchData(page);
  };

  const setStock = (id: number, val: number) => {
    setEditMap(prev => ({ ...prev, [id]: val }));
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '票种', width: 150, render: (_: any, r: any) => r.ticketType?.name || '-' },
    { title: '日期', dataIndex: 'inventoryDate', width: 120, render: (v: string) => dayjs(v).format('YYYY-MM-DD') },
    { title: '总库存', dataIndex: 'stock', width: 100 },
    { title: '已售', dataIndex: 'sold', width: 80 },
    {
      title: '可售库存', width: 120,
      render: (_: any, record: any) => (
        <InputNumber
          min={0}
          size="small"
          value={editMap[record.id] ?? record.stock}
          onChange={(v) => setStock(record.id, v || 0)}
          style={{ width: 80 }}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Select
            placeholder="选择票种"
            allowClear
            style={{ width: 200 }}
            value={selTicketType}
            onChange={(v) => setSelTicketType(v)}
            options={ticketTypes.map((t: any) => ({ label: t.name, value: t.id }))}
          />
          <DatePicker.RangePicker
            onChange={(dates: any, dateStrings: [string, string]) => {
              setDateRange(dateStrings[0] && dateStrings[1] ? dateStrings : null);
            }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>查询</Button>
        </Space>
        <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>保存修改</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={list} loading={loading}
        pagination={{ current: page, total, pageSize: 20, showTotal: (t) => `共 ${t} 条`, onChange: (p) => setPage(p) }} />
    </div>
  );
}
