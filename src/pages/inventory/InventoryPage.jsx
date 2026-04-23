import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryAPI } from '../../services/api';
import { PageHeader, Card, Table, Modal, FormField, Select, EmptyState } from '../../components/ui';
import { Plus, Package, AlertTriangle, Loader2, ShoppingCart, TrendingUp, IndianRupee, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['supplement', 'equipment', 'merchandise', 'sportswear', 'accessories', 'other'];
const CATEGORY_ICONS = { supplement: '💊', equipment: '🏋️', merchandise: '👕', sportswear: '👟', accessories: '🎒', other: '📦' };

const emptyForm = { name: '', category: 'supplement', brand: '', description: '', currentStock: 0, minimumStock: 5, purchasePrice: '', sellingPrice: '', gstRate: 18, unit: 'piece' };

export default function InventoryPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [sellModal, setSellModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [sellForm, setSellForm] = useState({ quantity: 1, paymentMethod: 'cash' });
  const [filterCat, setFilterCat] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const { data, isLoading } = useQuery({
    queryKey: ['inventory', filterCat, lowStockOnly],
    queryFn: () => inventoryAPI.getAll({ category: filterCat || undefined, lowStock: lowStockOnly || undefined })
  });

  const openAdd = () => { setEditId(null); setForm(emptyForm); setModal(true); };
  const openEdit = (item) => { setEditId(item._id); setForm({ ...item }); setModal(true); };
  const openSell = (item) => { setSelectedItem(item); setSellForm({ quantity: 1, paymentMethod: 'cash' }); setSellModal(true); };

  const mutation = useMutation({
    mutationFn: (d) => editId ? inventoryAPI.update(editId, d) : inventoryAPI.create(d),
    onSuccess: () => { toast.success(editId ? 'Item updated!' : 'Item added!'); setModal(false); qc.invalidateQueries(['inventory']); }
  });

  const sellMutation = useMutation({
    mutationFn: ({ id, data }) => inventoryAPI.sell(id, data),
    onSuccess: (res) => { toast.success(res.message || 'Sale recorded!'); setSellModal(false); qc.invalidateQueries(['inventory']); }
  });

  const items = data?.data || [];
  const lowStockItems = items.filter(i => i.currentStock <= i.minimumStock);
  const totalValue = items.reduce((a, i) => a + (i.currentStock * i.purchasePrice), 0);
  const totalRevenue = items.reduce((a, i) => a + (i.totalRevenue || 0), 0);

  const columns = [
    {
      key: 'name', title: 'Item',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-card flex items-center justify-center text-lg flex-shrink-0">
            {CATEGORY_ICONS[row.category] || '📦'}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{v}</p>
            <p className="text-xs text-gray-500">{row.brand || row.category?.replace(/_/g, ' ')}</p>
          </div>
        </div>
      )
    },
    {
      key: 'currentStock', title: 'Stock',
      render: (v, row) => (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${v <= row.minimumStock ? 'text-red-400' : v <= row.minimumStock * 2 ? 'text-amber-400' : 'text-white'}`}>
            {v} {row.unit}s
          </span>
          {v <= row.minimumStock && <AlertTriangle size={13} className="text-red-400" />}
          {v === 0 && <span className="badge badge-red text-[10px]">Out</span>}
        </div>
      )
    },
    {
      key: 'purchasePrice', title: 'Buy / Sell',
      render: (v, row) => (
        <div>
          <p className="text-xs text-gray-500">₹{v?.toLocaleString('en-IN')}</p>
          <p className="text-sm font-semibold text-emerald-400">₹{row.sellingPrice?.toLocaleString('en-IN')}</p>
        </div>
      )
    },
    {
      key: 'totalSold', title: 'Sold',
      render: (v) => <span className="text-sm text-gray-300">{v || 0}</span>
    },
    {
      key: 'totalRevenue', title: 'Revenue',
      render: (v) => <span className="text-sm text-primary font-medium">₹{(v || 0).toLocaleString('en-IN')}</span>
    },
    {
      key: '_id', title: 'Actions',
      render: (v, row) => (
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); openSell(row); }} disabled={row.currentStock === 0}
            className="btn-ghost text-xs py-1 px-2 text-emerald-400 hover:text-emerald-300 disabled:opacity-30">
            <ShoppingCart size={13} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="btn-ghost text-xs py-1 px-2">
            <Edit size={13} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Inventory"
        subtitle="Supplements, equipment & merchandise"
        actions={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} />Add Item
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Package size={18} className="text-blue-400" />
          </div>
          <div><p className="text-xl font-bold text-white">{items.length}</p><p className="text-xs text-gray-400">Total Items</p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div><p className="text-xl font-bold text-red-400">{lowStockItems.length}</p><p className="text-xs text-gray-400">Low Stock</p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <IndianRupee size={18} className="text-amber-400" />
          </div>
          <div><p className="text-xl font-bold text-white">₹{(totalValue / 1000).toFixed(1)}K</p><p className="text-xs text-gray-400">Stock Value</p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <div><p className="text-xl font-bold text-emerald-400">₹{(totalRevenue / 1000).toFixed(1)}K</p><p className="text-xs text-gray-400">Total Revenue</p></div>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-400 mb-2">⚠️ Low stock alert for {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''}</p>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(item => (
              <span key={item._id} className="text-xs bg-surface-card border border-amber-500/20 rounded-lg px-2 py-1 text-amber-300">
                {item.name} — {item.currentStock} left
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <Card noPadding>
        <div className="p-4 border-b border-surface-border flex items-center gap-3 flex-wrap">
          <div className="flex gap-1 bg-surface-card/50 p-1 rounded-xl border border-surface-border">
            <button onClick={() => setFilterCat('')} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${!filterCat ? 'bg-primary text-white' : 'text-gray-400'}`}>All</button>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${filterCat === c ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}>
                {CATEGORY_ICONS[c]} {c.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 ml-auto cursor-pointer">
            <input type="checkbox" checked={lowStockOnly} onChange={e => setLowStockOnly(e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm text-gray-400">Low stock only</span>
          </label>
        </div>

        {items.length === 0 && !isLoading ? (
          <EmptyState
            icon={Package}
            title="No inventory items"
            description="Start by adding supplements, merchandise, or equipment"
            action={<button onClick={openAdd} className="btn-primary flex items-center gap-2 mx-auto"><Plus size={14} />Add First Item</button>}
          />
        ) : (
          <Table columns={columns} data={items} loading={isLoading} emptyMessage="No items found" />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editId ? 'Edit Item' : 'Add Inventory Item'}
        size="lg"
        footer={
          <>
            <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending} className="btn-primary flex items-center gap-2">
              {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
              {editId ? 'Update' : 'Add Item'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormField label="Item Name" required>
              <input required value={form.name} onChange={e => up('name', e.target.value)} className="input" placeholder="e.g. Whey Protein 1kg" />
            </FormField>
          </div>
          <FormField label="Category">
            <Select value={form.category} onChange={v => up('category', v)}
              options={CATEGORIES.map(c => ({ value: c, label: `${CATEGORY_ICONS[c]} ${c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}` }))} />
          </FormField>
          <FormField label="Brand">
            <input value={form.brand} onChange={e => up('brand', e.target.value)} className="input" placeholder="MuscleBlaze, ON, etc." />
          </FormField>
          <FormField label="Purchase Price (₹)" required>
            <input type="number" required min={0} value={form.purchasePrice} onChange={e => up('purchasePrice', parseFloat(e.target.value))} className="input" placeholder="500" />
          </FormField>
          <FormField label="Selling Price (₹)" required>
            <input type="number" required min={0} value={form.sellingPrice} onChange={e => up('sellingPrice', parseFloat(e.target.value))} className="input" placeholder="699" />
          </FormField>
          <FormField label="Current Stock">
            <input type="number" min={0} value={form.currentStock} onChange={e => up('currentStock', parseInt(e.target.value))} className="input" />
          </FormField>
          <FormField label="Minimum Stock Alert">
            <input type="number" min={0} value={form.minimumStock} onChange={e => up('minimumStock', parseInt(e.target.value))} className="input" />
          </FormField>
          <FormField label="Unit" hint="piece, kg, box, bottle">
            <input value={form.unit} onChange={e => up('unit', e.target.value)} className="input" placeholder="piece" />
          </FormField>
          <FormField label="GST Rate (%)">
            <input type="number" min={0} max={28} value={form.gstRate} onChange={e => up('gstRate', parseFloat(e.target.value))} className="input" />
          </FormField>
          <div className="col-span-2">
            <FormField label="Description">
              <textarea rows={2} value={form.description} onChange={e => up('description', e.target.value)} className="input resize-none" placeholder="Optional description..." />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* Sell Modal */}
      <Modal
        open={sellModal}
        onClose={() => setSellModal(false)}
        title={`Sell — ${selectedItem?.name}`}
        size="sm"
        footer={
          <>
            <button onClick={() => setSellModal(false)} className="btn-secondary">Cancel</button>
            <button
              onClick={() => sellMutation.mutate({ id: selectedItem?._id, data: sellForm })}
              disabled={sellMutation.isPending || sellForm.quantity > selectedItem?.currentStock}
              className="btn-primary flex items-center gap-2"
            >
              {sellMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
              Sell
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Item preview */}
          <div className="flex items-center justify-between p-4 bg-surface-card/50 rounded-xl border border-surface-border">
            <div>
              <p className="text-sm font-semibold text-white">{selectedItem?.name}</p>
              <p className="text-xs text-gray-400">{selectedItem?.currentStock} {selectedItem?.unit}s available</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-400">₹{selectedItem?.sellingPrice?.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500">per {selectedItem?.unit}</p>
            </div>
          </div>

          <FormField label="Quantity">
            <input
              type="number" min={1} max={selectedItem?.currentStock}
              value={sellForm.quantity}
              onChange={e => setSellForm(f => ({ ...f, quantity: parseInt(e.target.value) }))}
              className="input"
            />
          </FormField>

          <FormField label="Payment Method">
            <Select value={sellForm.paymentMethod} onChange={v => setSellForm(f => ({ ...f, paymentMethod: v }))}
              options={[{ value: 'cash', label: '💵 Cash' }, { value: 'upi', label: '📱 UPI' }, { value: 'card', label: '💳 Card' }]} />
          </FormField>

          {sellForm.quantity > 0 && selectedItem && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold text-primary mt-1">₹{(selectedItem.sellingPrice * sellForm.quantity).toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
