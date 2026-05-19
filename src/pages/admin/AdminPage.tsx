import { useState, useEffect } from 'react';
import { supabase } from "../../supabase";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { Product, Category, CATEGORIES } from '../../types';
import { Plus, Edit2, Trash2, X, LogOut, Package } from 'lucide-react';

const AdminPage = () => {
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
  name: '',
  nameAr: '',
  description: '',
  descriptionAr: '',
  category: 'heavy-machinery',
  price: '',
  image: '',
  images: [] as string[],
  video: '', // 🔥 جديد
  specifications: '',
  specificationsAr: '',
  origin: ''
});
  const fetchProducts = async () => {
  const { data, error } = await supabase
  .from('products')
  .select(`
  id,
  name,
  namear,
  description,
  descriptionar,
  category,
  price,
  image,
  images,  -- 👈 اضف دي
  specifications,
  specificationsar,
  origin
`)
  .order('id', { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setProducts(data || []);
};

useEffect(() => {
  fetchProducts();

  const channel = supabase
    .channel('products-live-admin')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products',
      },
      () => {
        fetchProducts();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  // Use useEffect for navigation to avoid calling navigate during render
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show nothing while checking auth (prevents flash)
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openModal = (product?: Product) => {
  if (product) {
    setEditingProduct(product);

    setFormData({
      name: product.name || '',
      nameAr: product.namear || '',
      description: product.description || '',
      descriptionAr: product.descriptionar || '',
      category: product.category || 'heavy-machinery',
      price: product.price || '',
      image: product.image || '',
      images: product.images || [],        // 🔥 كان ناقص
      video: product.video || '',          // 🔥 كان ناقص
      specifications: product.specifications || '',
      specificationsAr: product.specificationsar || '',
      origin: product.origin || ''
    });

  } else {
    setEditingProduct(null);

    setFormData({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      category: 'heavy-machinery',
      price: '',
      image: '',
      images: [],      // 🔥 مهم
      video: '',       // 🔥 مهم
      specifications: '',
      specificationsAr: '',
      origin: ''
    });
  }

  setIsModalOpen(true);
};

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log(formData);

 if (editingProduct) {

  const { error } = await supabase
    .from('products')
    .update({
  name: formData.name,
  namear: formData.nameAr,
  description: formData.description,
  descriptionar: formData.descriptionAr,
  category: formData.category,
  price: formData.price,
  image: formData.image,
  images: formData.images, // 👈 اضف السطر ده
  video: formData.video,
  specifications: formData.specifications,
  specificationsar: formData.specificationsAr,
  origin: formData.origin
})
    .eq('id', editingProduct.id);

  if (error) {
    console.log(error);
    return;
  }

} else {

  const { error } = await supabase
    .from('products')
    .insert([{
  name: formData.name,
  namear: formData.nameAr,
  description: formData.description,
  descriptionar: formData.descriptionAr,
  category: formData.category,
  price: formData.price,
  image: formData.image,
  images: formData.images, // 👈 اضف السطر ده
  video: formData.video,
  specifications: formData.specifications,
  specificationsar: formData.specificationsAr,
  origin: formData.origin
}]);

  if (error) {
    console.log(error);
    return;
  }
}

await fetchProducts();

closeModal();
};

 const handleDelete = async (id: number) => {
  if (window.confirm(t('confirmDelete'))) {

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(error);
      return;
    }

    await fetchProducts();
  }
};
const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from('products')
    .upload(fileName, file);

  if (error) {
    console.log(error);
    return;
  }

  const { data } = supabase.storage
    .from('products')
    .getPublicUrl(fileName);

  console.log(data.publicUrl);

  setFormData((prev) => ({
    ...prev,
    image: data.publicUrl,
  }));
};
const handleMultipleImagesUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const files = e.target.files;
  if (!files) return;

  const uploadedUrls: string[] = [];

  for (const file of Array.from(files)) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('products')
      .upload(fileName, file);

    if (error) continue;

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    uploadedUrls.push(data.publicUrl);
  }

  setFormData((prev) => ({
    ...prev,
    images: [...prev.images, ...uploadedUrls],
  }));
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCategoryLabel = (category: string) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat ? (isRTL ? cat.labelAr : cat.label) : category;
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{t('adminDashboard')}</h1>
            </div>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t('addProduct')}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Products Table */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('productName')}
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('category')}
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('price')}
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('origin')}
                  </th>
                  <th className={`px-6 py-4 text-right text-sm font-semibold text-gray-900`}>
                    {isRTL ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      {t('noProducts')}
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {isRTL ? (product.namear || product.name) : (product.name || product.namear)}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {isRTL ? (product.descriptionar || product.description) : (product.description || product.descriptionar)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.category === 'heavy-machinery' ? 'bg-blue-100 text-blue-800' :
                          product.category === 'medical-supplies' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {getCategoryLabel(product.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {product.price || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.origin || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center justify-end gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <button
                            onClick={() => openModal(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`flex items-center justify-between p-6 border-b ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? t('editProduct') : t('addProduct')}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Product Name */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('productName')} (English) *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('productName')} (العربية) *
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    required
                    value={formData.nameAr}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('category')} *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {isRTL ? cat.labelAr : cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('description')} (English) *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('description')} (العربية) *
                  </label>
                  <textarea
                    name="descriptionAr"
                    required
                    rows={3}
                    value={formData.descriptionAr}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              {/* Price & Origin */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('price')}
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder="e.g., $1,000 - $1,500"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('origin')}
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder="e.g., Germany, USA"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
    Upload Image *
    {/* Multiple Images Upload */}
<div>
  <label className="block text-sm font-medium mb-2">
    Upload Extra Images
  </label>

  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleMultipleImagesUpload}
    className="w-full"
  />

  {formData.images.length > 0 && (
    <div className="flex gap-3 mt-4 flex-wrap">
      {formData.images.map((img, i) => (
        <img key={i} src={img} className="w-24 h-24 rounded-lg object-cover" />
      ))}
    </div>
  )}
</div>
  </label>

  <input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  className="w-full"
/>

{formData.image && (
  <img
    src={formData.image}
    alt="preview"
    className="w-32 h-32 object-cover rounded-lg mt-4"
  />
)}
</div>
{/* Video URL */}
<div>
  <label className="block text-sm font-medium mb-2">
    Product Video (YouTube link)
  </label>

  <input
    type="text"
    name="video"
    value={formData.video}
    onChange={handleChange}
    placeholder="https://youtube.com/..."
    className="w-full px-4 py-3 rounded-xl border border-gray-200"
  />
</div>
              {/* Specifications */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('specifications')} (English)
                  </label>
                  <textarea
                    name="specifications"
                    rows={2}
                    value={formData.specifications}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('specifications')} (العربية)
                  </label>
                  <textarea
                    name="specificationsAr"
                    rows={2}
                    value={formData.specificationsAr}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className={`flex items-center justify-end gap-4 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
