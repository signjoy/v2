import { supabase } from '../lib/supabase';

export const uploadImage = async (file: File, folder: string): Promise<string> => {
  try {
    // Validate file first
    validateImageFile(file);
    
    // Create a unique filename
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${cleanFileName}`;
    const filePath = `${folder}/${filename}`;
    
    console.log('Starting image upload:', filename);
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file);
    
    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    console.log('Image uploaded successfully:', data.path);
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    console.log('Public URL obtained:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const validateImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Please select a valid image file (JPEG, PNG, or WebP)');
  }
  
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 5MB');
  }
  
  return true;
};