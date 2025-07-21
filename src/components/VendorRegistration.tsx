import React, { useState } from 'react';
import { Store, MapPin, User, Phone, Tag, Plus, LogOut, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { uploadImage, validateImageFile } from '../utils/imageUpload';
import ImageUpload from './ImageUpload';
import VendorList from './VendorList';
import CatalogManagement from './CatalogManagement';

interface Vendor {
  id: string;
  shopName: string;
  location: string;
  ownerName: string;
  phone: string;
  category: string;
  imageUrl?: string;
}

const VendorRegistration: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'registration' | 'vendorList' | 'catalog'>('registration');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    shopName: '',
    location: '',
    ownerName: '',
    phone: '',
    category: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Grocery', 
    'Vegetables', 
    'Chicken', 
    'Mutton', 
    'Fish',
    'Sweet House',
    'Milk Shop'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      
      // Upload image if selected
      if (selectedImage) {
        try {
          console.log('Uploading vendor image...');
          imageUrl = await uploadImage(selectedImage, 'vendors');
          console.log('Vendor image uploaded:', imageUrl);
        } catch (error: any) {
          console.error('Image upload failed:', error);
          toast.error(error.message);
          setLoading(false);
          return;
        }
      }

      const vendorData = {
        shop_name: formData.shopName,
        location: formData.location,
        owner_name: formData.ownerName,
        phone: formData.phone,
        category: formData.category,
        ...(imageUrl && { image_url: imageUrl }),
        created_at: new Date().toISOString()
      };

      console.log('Saving vendor data:', vendorData);
      const { error } = await supabase
        .from('vendors')
        .insert([vendorData]);
      
      if (error) throw error;
      
      toast.success('Vendor registered successfully!');
      setFormData({
        shopName: '',
        location: '',
        ownerName: '',
        phone: '',
        category: '',
      });
      setSelectedImage(null);
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast.error(`Failed to register vendor: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setCurrentView('catalog');
  };

  const handleBackToVendorList = () => {
    setSelectedVendor(null);
    setCurrentView('vendorList');
  };

  const handleBackToDashboard = () => {
    setCurrentView('registration');
  };

  // Render different views based on current state
  if (currentView === 'vendorList') {
    return (
      <VendorList 
        onSelectVendor={handleSelectVendor}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'catalog' && selectedVendor) {
    return (
      <CatalogManagement 
        vendor={selectedVendor}
        onBack={handleBackToVendorList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:h-16 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <Store className="text-white" size={24} />
              </div>
              <div className="flex-1 sm:flex-none">
                <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
                <p className="text-white/70 text-sm">Vendor Management System</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="text-left sm:text-right order-2 sm:order-1">
                <p className="text-white text-sm font-medium">My Account</p>
                <p className="text-white/70 text-xs">{user?.email}</p>
              </div>
              <div className="flex items-center space-x-2 order-1 sm:order-2">
                <button
                  onClick={() => setCurrentView('vendorList')}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base"
                >
                  <Package size={18} />
                  <span className="hidden sm:inline">Manage Catalogs</span>
                  <span className="sm:hidden">Catalogs</span>
                </button>
                <button
                  onClick={logout}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 p-2 rounded-lg transition-all duration-300 border border-red-500/30"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-white" size={32} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Register New Vendor</h2>
            <p className="text-white/70">Add a new vendor to the system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Image Upload */}
            <ImageUpload
              onImageSelect={setSelectedImage}
              currentImage={null}
              label="Shop/Owner Photo"
              className="md:col-span-2"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Shop Name */}
            <div className="relative">
              <label className="block text-white text-sm font-medium mb-2">
                Shop Name
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder="e.g., Daily Fresh"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="relative">
              <label className="block text-white text-sm font-medium mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Kukatpally"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Owner Name */}
            <div className="relative">
              <label className="block text-white text-sm font-medium mb-2">
                Owner Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="e.g., Kiran"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="relative">
              <label className="block text-white text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., 9876543210"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="relative md:col-span-2">
              <label className="block text-white text-sm font-medium mb-2">
                Category
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  required
                >
                  <option value="" className="bg-gray-800 text-white">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800 text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Register Vendor</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default VendorRegistration;