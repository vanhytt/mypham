"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Pencil, Trash2, Search, X, UploadCloud, XCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

interface Product {
  id: number | string;
  ten_sp: string;
  gia: number;
  danh_muc?: string;
  anh_url: string;
  anh1?: string;
  anh2?: string;
  anh3?: string;
  anh4?: string;
  anh5?: string;
  anh6?: string;
  anh7?: string;
  anh8?: string;
  anh9?: string;
  anh10?: string;
  mo_ta?: string;
}

// Helper: Tách lấy đuôi file
const getFileExt = (fileName: string) => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop() : 'png';
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // States for form text fields
  const [formData, setFormData] = useState<Partial<Product>>({
    ten_sp: "",
    gia: 0,
    danh_muc: "Trang điểm",
    mo_ta: "",
  });

  // State quản lý Ảnh (File upload mới, hoặc String URL cũ)
  const [images, setImages] = useState<(File | string)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const supabase = createClient();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("list")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
      
      // Khôi phục mảng URL từ các cột anh_url, anh1 -> anh10
      const existingUrls: string[] = [];
      if (product.anh_url) existingUrls.push(product.anh_url);
      for (let i = 1; i <= 10; i++) {
        const key = `anh${i}` as keyof Product;
        if (product[key]) existingUrls.push(product[key] as string);
      }
      setImages(existingUrls);
    } else {
      setEditingProduct(null);
      setFormData({
        ten_sp: "", gia: 0, danh_muc: "Trang điểm", mo_ta: "",
      });
      setImages([]);
    }
    setUploadProgress("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gia' ? Number(value) : value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (images.length + selectedFiles.length > 11) {
        alert("Chỉ được lưu tối đa 11 ảnh cho 1 sản phẩm!");
        return;
      }
      setImages(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const uploadImagesToSupabase = useCallback(async () => {
    const finalUrls: string[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const item = images[i];
      if (typeof item === 'string') {
        // Đã là URL cũ
        finalUrls.push(item);
      } else {
        // File mới cần upload
        setUploadProgress(`Đang tải lên ảnh ${i + 1}/${images.length}...`);
        const fileExt = getFileExt(item.name);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(filePath, item);

        if (error) {
          console.error("Lỗi Upload:", error);
          throw new Error("Không thể upload ảnh. Vui lòng kiểm tra lại quyền truy cập Bucket 'product-images' trên Supabase.");
        }

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        finalUrls.push(publicUrlData.publicUrl);
      }
    }
    return finalUrls;
  }, [images, supabase.storage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Vui lòng tải lên ít nhất 1 ảnh (Ảnh chính)!");
      return;
    }

    setSaving(true);
    setUploadProgress("Bắt đầu lưu...");

    try {
      // 1. Upload ảnh trước
      const uploadedUrls = await uploadImagesToSupabase();

      // 2. Map Array URL về cấu trúc 11 Cột rời rạc để chống bung giao diện khách hàng
      const payload: Partial<Product> = {
        ...formData,
        anh_url: uploadedUrls[0] || "",
        anh1: uploadedUrls[1] || undefined,
        anh2: uploadedUrls[2] || undefined,
        anh3: uploadedUrls[3] || undefined,
        anh4: uploadedUrls[4] || undefined,
        anh5: uploadedUrls[5] || undefined,
        anh6: uploadedUrls[6] || undefined,
        anh7: uploadedUrls[7] || undefined,
        anh8: uploadedUrls[8] || undefined,
        anh9: uploadedUrls[9] || undefined,
        anh10: uploadedUrls[10] || undefined,
      };

      setUploadProgress("Đang cập nhật Cơ sở dữ liệu...");

      if (editingProduct) {
        const { error } = await supabase
          .from("list")
          .update(payload)
          .eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("list")
          .insert([payload]);
        if (error) throw error;
      }
      
      handleCloseModal();
      fetchProducts();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu. Vui lòng thử lại!";
      console.error("Lỗi khi lưu sản phẩm:", error);
      alert(errMsg);
    } finally {
      setSaving(false);
      setUploadProgress("");
    }
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      const { error } = await supabase
        .from("list")
        .delete()
        .eq("id", id);
        
      if (error)alert("Có lỗi khi xóa: " + error.message);
      else fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => 
    p.ten_sp.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.danh_muc && p.danh_muc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Thanh công cụ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 justify-between rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D]"
            placeholder="Tìm kiếm theo tên, danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#1A365D] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#112440] transition-colors shadow-md shadow-[#1A365D]/10 whitespace-nowrap"
        >
          <Plus size={18} />
          Thêm Sản phẩm
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên Sản Phẩm</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative">
                        {product.anh_url ? (
                          <Image src={product.anh_url} alt={product.ten_sp} fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs">No img</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.ten_sp}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm border border-gray-200 bg-gray-50 px-2 py-1 rounded-md">{product.danh_muc || "Không có"}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1A365D]">{product.gia.toLocaleString('vi-VN')} đ</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(product)} className="p-2 text-[#A5C4E5] hover:text-[#1A365D] hover:bg-[#A5C4E5]/20 rounded-lg">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
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

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={handleCloseModal}></div>

            <div className="relative inline-block w-full max-w-5xl p-6 my-8 text-left bg-white shadow-2xl rounded-2xl transform transition-all align-middle">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#1A365D] font-playfair">
                  {editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm Mới"}
                </h3>
                <button type="button" onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 p-2 bg-gray-50 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Cột trái: Thông tin Text */}
                  <div className="space-y-5">
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên Sản phẩm *</label>
                      <input type="text" name="ten_sp" required value={formData.ten_sp || ""} onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A365D]/30 focus:border-[#1A365D] bg-gray-50/50" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giá (VNĐ) *</label>
                        <input type="number" name="gia" required min="0" value={formData.gia || 0} onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A365D]/30 focus:border-[#1A365D] bg-gray-50/50" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Danh mục</label>
                        <select name="danh_muc" value={formData.danh_muc || "Trang điểm"} onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A365D]/30 focus:border-[#1A365D] bg-gray-50/50">
                          <option value="Trang điểm">Trang điểm</option>
                          <option value="Chăm sóc da">Chăm sóc da</option>
                          <option value="Nước hoa">Nước hoa</option>
                          <option value="Bộ quà tặng">Bộ quà tặng</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả chi tiết</label>
                      <textarea name="mo_ta" rows={10} value={formData.mo_ta || ""} onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A365D]/30 focus:border-[#1A365D] bg-gray-50/50 custom-scrollbar" />
                    </div>
                  </div>

                  {/* Cột phải: Dropzone Ảnh */}
                  <div className="space-y-4 flex flex-col h-full">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-semibold text-gray-700">Hình ảnh ({images.length}/11)</label>
                    </div>

                    {/* Vùng Dropzone */}
                    <div 
                      className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-colors cursor-pointer bg-gray-50/50 hover:bg-[#EEF2FF] hover:border-[#A5C4E5] ${images.length >= 11 ? "opacity-50 pointer-events-none" : "border-gray-300"}`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud size={40} className="text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 font-medium text-center">Click để chọn ảnh (Hỗ trợ Multiple)</p>
                      <p className="text-xs text-gray-400 mt-1">Ảnh đầu tiên sẽ là ảnh chính</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple 
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </div>

                    {/* Lưới Preview Ảnh */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                      {images.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {images.map((img, index) => {
                            const isExisting = typeof img === 'string';
                            const imgSrc = isExisting ? img : URL.createObjectURL(img);
                            
                            return (
                              <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group shadow-sm">
                                <Image src={imgSrc} alt={`Preview ${index}`} fill className="object-cover" />
                                
                                {/* Nút Xóa Ảnh */}
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                >
                                  <XCircle size={16} className="fill-white" />
                                </button>

                                {/* Huy hiệu Ảnh chính */}
                                {index === 0 && (
                                  <div className="absolute bottom-0 inset-x-0 bg-[#1A365D]/80 text-white text-[10px] text-center py-0.5 font-semibold backdrop-blur-md">
                                    ẢNH CHÍNH
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-sm text-gray-400 italic">Chưa có ảnh nào được chọn.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Modal */}
                <div className="mt-8 border-t border-gray-100 pt-5 flex items-center justify-between">
                  <div className="text-sm font-medium text-[#1A365D] animate-pulse">
                    {uploadProgress}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={handleCloseModal} disabled={saving}
                      className="px-6 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
                      Hủy thao tác
                    </button>
                    <button type="submit" disabled={saving || images.length === 0}
                      className="px-6 py-2.5 bg-[#1A365D] text-white hover:bg-[#112440] rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                      {saving && (
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {saving ? "Đang lưu..." : "Lưu Sản Phẩm"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
