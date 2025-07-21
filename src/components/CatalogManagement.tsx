import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, ArrowLeft, Save, X, DollarSign, Hash, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadImage, validateImageFile } from '../utils/imageUpload';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';

interface Vendor {
  id: string;
  shop_name: string;
  location: string;
  owner_name: string;
  phone: string;
  category: string;
}

interface CatalogItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  image_url?: string;
  vendor_id: string;
  vendor_name: string;
  created_at: string;
}

interface CatalogManagementProps {
  vendor: Vendor;
  onBack: () => void;
}

const CatalogManagement: React.FC<CatalogManagementProps> = ({ vendor, onBack }) => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: 'kg',
    description: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const units = ['kg', 'gram', 'piece', 'liter', 'ml', 'dozen', 'packet'];

  useEffect(() => {
    fetchItems();
  }, [vendor.id]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('catalog_items')
        .select('*')
        .eq('vendor_id', vendor.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load catalog items');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please fill in all required fields with valid values');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = currentImageUrl;
      
      // Upload new image if selected
      if (selectedImage) {
        try {
          console.log('Uploading catalog item image...');
          imageUrl = await uploadImage(selectedImage, 'catalog_items');
          console.log('Catalog item image uploaded:', imageUrl);
        } catch (error: any) {
          console.error('Image upload failed:', error);
          toast.error(error.message);
          setLoading(false);
          return;
        }
      }

      const itemData = {
        name: formData.name,
        price: parseFloat(formData.price),
        unit: formData.unit,
        description: formData.description,
        ...(imageUrl && { image_url: imageUrl }),
        vendor_id: vendor.id,
        vendor_name: vendor.shop_name,
      };

      if (editingItem) {
        console.log('Updating catalog item:', itemData);
        const { error } = await supabase
          .from('catalog_items')
          .update(itemData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        toast.success('Item updated successfully!');
      } else {
        console.log('Creating new catalog item:', { ...itemData, created_at: new Date().toISOString() });
        const { error } = await supabase
          .from('catalog_items')
          .insert([{
          ...itemData,
          created_at: new Date().toISOString()
        }]);
        
        if (error) throw error;
        toast.success('Item added successfully!');
      }

      setFormData({ name: '', price: '', unit: 'kg', description: '' });
      setSelectedImage(null);
      setCurrentImageUrl(null);
      setShowForm(false);
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(`Failed to save item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      unit: item.unit,
      description: item.description,
    });
    setSelectedImage(null);
    setCurrentImageUrl(item.image_url || null);
    setShowForm(true);
  };

  const handleDelete = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const { error } = await supabase
          .from('catalog_items')
          .delete()
          .eq('id', itemId);
        
        if (error) throw error;
        toast.success('Item deleted successfully!');
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', unit: 'kg', description: '' });
    setSelectedImage(null);
    setCurrentImageUrl(null);
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={onBack}
                className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-3 flex-1 sm:flex-none">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-white text-lg sm:text-2xl font-bold">{vendor.shop_name} - Catalog</h1>
                  <p className="text-white/70 text-sm">{vendor.location} • {vendor.category}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus size={20} />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 w-full max-w-md border border-white/20 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl font-bold">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Image Upload */}
                <ImageUpload
                  onImageSelect={setSelectedImage}
                  currentImage={currentImageUrl}
                  onImageRemove={() => {
                    setCurrentImageUrl(null);
                    setSelectedImage(null);
                  }}
                  onImageRemove={() => setCurrentImageUrl(null)}
                  label="Item Image"
                />

                <div className="relative">
                  <label className="block text-white text-sm font-medium mb-2">Item Name</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Fresh Tomatoes"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-white text-sm font-medium mb-2">Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-white text-sm font-medium mb-2">Unit</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                        required
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit} className="bg-gray-800 text-white">
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-white text-sm font-medium mb-2">Description</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-white/60" size={20} />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Item description (optional)"
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>{editingItem ? 'Update Item' : 'Add Item'}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {loading && !showForm ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
            <p className="text-white/70">Loading catalog items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-12 text-center border border-white/20">
            <Package className="mx-auto text-white/60 mb-4" size={64} />
            <h3 className="text-white text-2xl font-semibold mb-2">No Items Yet</h3>
            <p className="text-white/70 mb-6">Start building your catalog by adding your first item.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center space-x-2 mx-auto text-sm sm:text-base"
            >
              <Plus size={20} />
              <span>Add First Item</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  {item.image_url && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-white text-base sm:text-lg font-bold mb-1">{item.name}</h3>
                    <p className="text-white/60 text-xs sm:text-sm mb-1">{item.vendor_name}</p>
                    <p className="text-emerald-400 text-lg sm:text-xl font-semibold">
                      ₹{item.price.toFixed(2)} / {item.unit}
                    </p>
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 p-1.5 sm:p-2 rounded-lg transition-all duration-300 border border-blue-500/30"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 p-1.5 sm:p-2 rounded-lg transition-all duration-300 border border-red-500/30"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                {item.description && (
                  <p className="text-white/70 text-sm mb-4">{item.description}</p>
                )}
                
                <div className="text-white/60 text-xs">
                  Added {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogManagement;