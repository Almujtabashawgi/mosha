import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, Grid, List, ArrowRight } from 'lucide-react';
import { Category, CATEGORIES } from '../types';
import { supabase } from "../supabase";

const ProductsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith('ar');
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false });

  if (!error) {
    setProducts(data || []);
    console.log("LANG:", i18n.language);
console.log("FIRST PRODUCT:", data?.[0]);
  }
};
useEffect(() => {
  fetchProducts();

  const channel = supabase
    .channel('products-live')
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
  
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    (searchParams.get('category') as Category) || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category as Category);
    }
  }, [searchParams]);

  const handleCategoryChange = (category: Category | 'all') => {
    setSelectedCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.namear?.includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descriptionar?.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'heavy-machinery':
        return 'bg-blue-100 text-blue-800';
      case 'medical-supplies':
        return 'bg-emerald-100 text-emerald-800';
      case 'general-goods':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('productsTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('productsSubtitle')}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    type="text"
                    placeholder={t('search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${isRTL ? 'text-right pr-12 pl-4' : 'text-left'}`}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`px-5 py-3 rounded-xl font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-blue-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('allProducts')}
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    className={`px-5 py-3 rounded-xl font-medium transition-all ${
                      selectedCategory === category.value
                        ? 'bg-blue-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isRTL ? category.labelAr : category.label}
                  </button>
                ))}
              </div>

              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-colors ${
                    viewMode === 'list' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t('noProducts')}</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={isRTL ? product.namear : product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                        {product.category === 'heavy-machinery' ? t('heavyMachinery') :
                         product.category === 'medical-supplies' ? t('medicalSupplies') :
                         t('generalGoods')}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {isRTL ? product.namear : product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {isRTL ? product.descriptionar : product.description}
                    </p>
                    {product.specifications && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">{t('specifications')}</p>
                        <p className="text-sm text-gray-700">
                          {isRTL ? product.specificationsar : product.specifications}
                        </p>
                      </div>
                    )}
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {product.price && (
                        <p className="text-blue-900 font-semibold">{product.price}</p>
                      )}
                      {product.origin && (
                        <p className="text-gray-500 text-sm">{t('origin')}: {product.origin}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 flex flex-col md:flex-row"
                >
                  <div className="md:w-72 h-64 md:h-auto relative">
                    <img
                      src={product.image}
                      alt={isRTL ? product.namear : product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                        {product.category === 'heavy-machinery' ? t('heavyMachinery') :
                         product.category === 'medical-supplies' ? t('medicalSupplies') :
                         t('generalGoods')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className={`flex flex-col h-full ${isRTL ? 'text-right' : 'text-left'}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {isRTL ? product.namear : product.name}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-1">
                        {isRTL ? product.descriptionar : product.description}
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {product.specifications && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">{t('specifications')}</p>
                            <p className="text-sm text-gray-700">
                              {isRTL ? product.specificationsar : product.specifications}
                            </p>
                          </div>
                        )}
                        {product.origin && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">{t('origin')}</p>
                            <p className="text-sm text-gray-700">{product.origin}</p>
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {product.price && (
                          <p className="text-blue-900 font-semibold text-lg">{product.price}</p>
                        )}
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors">
                          {t('addToInquiry')}
                          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
