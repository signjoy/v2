import React, { useState, useEffect } from 'react';
import { Store, Package, Plus, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Vendor {
  id: string;
  shop_name: string;
  location: string;
  owner_name: string;
  phone: string;
  category: string;
  image_url?: string;
  created_at: string;
}

interface VendorListProps {
  onSelectVendor: (vendor: Vendor) => void;
  onBackToDashboard: () => void;
}

const VendorList: React.FC<VendorListProps> = ({ onSelectVendor, onBackToDashboard }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'All', 
    'Grocery', 
    'Vegetables', 
    'Chicken', 
    'Mutton', 
    'Fish',
    'Sweet House',
    'Milk Shop'
  ];

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white/70">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
                <Package className="text-white" size={24} />
              </div>
              <div className="flex-1 sm:flex-none">
                <h1 className="text-white text-xl sm:text-2xl font-bold">Vendor Catalog Management</h1>
                <p className="text-white/70 text-sm">Select a vendor to manage their catalog items</p>
              </div>
            </div>
            <button
              onClick={onBackToDashboard}
              className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 text-sm sm:text-base w-full sm:w-auto"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vendors..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All' ? '' : category} className="bg-gray-800 text-white">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vendors Grid */}
        {filteredVendors.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 text-center border border-white/20">
            <Store className="mx-auto text-white/60 mb-4" size={48} />
            <h3 className="text-white text-xl font-semibold mb-2">No Vendors Found</h3>
            <p className="text-white/70">
              {vendors.length === 0 ? 'No vendors registered yet.' : 'No vendors match your search criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
                onClick={() => onSelectVendor(vendor)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    {vendor.image_url ? (
                      <img 
                        src={vendor.image_url} 
                        alt={vendor.shop_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-gradient-to-r from-purple-500 to-blue-600 w-full h-full flex items-center justify-center">
                        <Store className="text-white" size={24} />
                      </div>
                    )}
                  </div>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {vendor.category}
                  </span>
                </div>
                
                <h3 className="text-white text-lg sm:text-xl font-bold mb-2">{vendor.shop_name}</h3>
                <p className="text-white/70 mb-1 text-sm sm:text-base">📍 {vendor.location}</p>
                <p className="text-white/70 mb-1 text-sm sm:text-base">👤 {vendor.owner_name}</p>
                <p className="text-white/70 mb-4 text-sm sm:text-base">📞 {vendor.phone}</p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                  <span className="text-white/60 text-sm">
                    Added {new Date(vendor.created_at).toLocaleDateString()}
                  </span>
                  <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg group-hover:from-purple-600 group-hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start">
                    <Package size={16} />
                    <span>Manage Items</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorList;