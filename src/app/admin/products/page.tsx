"use client";

import { useEffect, useState } from "react";
import { Package, Plus, Search, MoreVertical, Edit, Trash2, X, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { formatMoney } from "@/lib/money";
import Image from "next/image";
import { cn } from "@/lib/cn";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSource, setImageSource] = useState<"url" | "upload">("url");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  });

  const fetchData = async () => {
    const [pRes, cRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/search"),
    ]);
    const pData = await pRes.json();
    setProducts(pData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetch("/api/search")
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        images: [{ url: formData.imageUrl }]
      }),
    });
    if (res.ok) {
      setIsModalOpen(false);
      setFormData({ title: "", description: "", price: "", stock: "", categoryId: "", imageUrl: "" });
      fetchData();
    }
  };

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Product Management</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Manage your store's inventory and stock</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name or category..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4 whitespace-nowrap">Product</th>
                <th className="px-8 py-4 whitespace-nowrap">Category</th>
                <th className="px-8 py-4 whitespace-nowrap">Price</th>
                <th className="px-8 py-4 whitespace-nowrap">Stock</th>
                <th className="px-8 py-4 whitespace-nowrap">Status</th>
                <th className="px-8 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 relative overflow-hidden flex-shrink-0 border border-slate-200 dark:border-zinc-700">
                        {product.images?.[0] && (
                          <Image src={product.images[0].url} alt={product.title} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{product.title}</span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">ID: {product.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold whitespace-nowrap">
                      {product.category?.name}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-900 dark:text-white whitespace-nowrap">{formatMoney(product.price)}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-sm font-bold whitespace-nowrap",
                      product.stock < 10 ? "text-red-500" : "text-slate-600 dark:text-zinc-400"
                    )}>
                      {product.stock} <span className="text-[10px] font-medium uppercase ml-1">In Stock</span>
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                      <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-tighter">Active</span>
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-all border border-transparent hover:border-slate-100 dark:hover:border-zinc-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh] border border-slate-100 dark:border-zinc-800">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Add New Product</h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Fill in the details to list a new item</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all border border-slate-100 dark:border-zinc-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Product Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-slate-900 dark:text-white transition-all font-medium placeholder:text-slate-300 dark:placeholder:text-zinc-600"
                    placeholder="e.g. iPhone 15 Pro Max"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Category</label>
                  <div className="relative">
                    <select
                      required
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-slate-900 dark:text-white appearance-none transition-all font-medium"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                      <option value="" className="text-slate-300">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-zinc-500">
                      <MoreVertical size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-slate-900 dark:text-white transition-all resize-none font-medium placeholder:text-slate-300 dark:placeholder:text-zinc-600"
                  placeholder="Describe your product features, condition, and warranty..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Price (NPR)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 font-bold">रू</span>
                    <input
                      type="number"
                      required
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-slate-900 dark:text-white transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-zinc-600"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-slate-900 dark:text-white transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-zinc-600"
                    placeholder="e.g. 100"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Product Media</label>
                  <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setImageSource("url")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${imageSource === "url" ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white"}`}
                    >
                      <LinkIcon size={14} /> URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSource("upload")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${imageSource === "upload" ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white"}`}
                    >
                      <Upload size={14} /> Upload
                    </button>
                  </div>
                </div>

                {imageSource === "url" ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      required={imageSource === "url"}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-slate-900 dark:text-white transition-all font-medium placeholder:text-slate-300 dark:placeholder:text-zinc-600"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full py-16 bg-slate-50 dark:bg-zinc-800 border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-[32px] flex flex-col items-center justify-center gap-4 group-hover:bg-slate-100 dark:group-hover:bg-zinc-700 group-hover:border-blue-300 transition-all">
                      <div className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm flex items-center justify-center text-slate-400 dark:text-zinc-500 group-hover:text-blue-500 group-hover:scale-110 transition-all border border-slate-100 dark:border-zinc-800">
                        <Upload size={28} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-700 dark:text-white">Drop your image here</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-medium text-balance max-w-[200px]">Supports JPG, PNG and WebP formats up to 5MB</p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.imageUrl && (
                  <div className="relative w-full aspect-video rounded-[32px] overflow-hidden border-4 border-slate-50 dark:border-zinc-800 shadow-xl group">
                    <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: "" })}
                        className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 shadow-2xl scale-90 group-hover:scale-100 transition-all font-bold flex items-center gap-2"
                      >
                        <Trash2 size={20} /> Remove Image
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>

            <div className="p-8 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 px-6 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all active:scale-95 border border-slate-100 dark:border-zinc-700"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleAddProduct}
                disabled={!formData.imageUrl || !formData.title || !formData.categoryId || !formData.price}
                className="flex-[2] py-4 px-6 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-95 disabled:opacity-40 disabled:grayscale disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Publish Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
