"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Search, X, UploadCloud, XCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

// Helper: Tách lấy đuôi file
const getFileExt = (fileName: string) => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop() : 'png';
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  // States for form
  const [formData, setFormData] = useState<Partial<Post>>({
    title: "",
    content: "",
  });

  const [image, setImage] = useState<File | string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi khi tải bài viết:", error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const handleOpenModal = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData(post);
      setImage(post.image_url || null);
    } else {
      setEditingPost(null);
      setFormData({
        title: "",
        content: "",
      });
      setImage(null);
    }
    setUploadProgress("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const uploadImageToSupabase = async (): Promise<string> => {
    if (!image) return "";
    if (typeof image === 'string') return image;

    setUploadProgress("Đang tải lên ảnh bìa...");
    const fileExt = getFileExt(image.name);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    // Tạm dùng bucket product-images với thư mục posts/ để tránh phải tạo Bucket mới
    const filePath = `posts/${fileName}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, image);

    if (error) {
      console.error("Lỗi Upload:", error);
      throw new Error("Không thể upload ảnh bìa.");
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setUploadProgress("Bắt đầu lưu...");

    try {
      const finalImageUrl = await uploadImageToSupabase();
      
      const payload: Partial<Post> = {
        ...formData,
        image_url: finalImageUrl,
      };

      setUploadProgress("Đang cập nhật Cơ sở dữ liệu...");

      if (editingPost) {
        // Cập nhật
        const { error } = await supabase
          .from("posts")
          .update(payload)
          .eq("id", editingPost.id);
        
        if (error) throw error;
      } else {
        // Thêm mới
        const { error } = await supabase
          .from("posts")
          .insert([payload]);
          
        if (error) throw error;
      }
      
      handleCloseModal();
      fetchPosts();
    } catch (error: any) {
      console.error("Lỗi khi lưu bài viết:", error);
      alert(error.message || "Có lỗi xảy ra khi lưu. Vui lòng thử lại!");
    } finally {
      setSaving(false);
      setUploadProgress("");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);
        
      if (error) {
        alert("Có lỗi khi xóa: " + error.message);
      } else {
        fetchPosts();
      }
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] transition-all sm:text-sm"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#1A365D] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#112440] transition-colors shadow-md shadow-[#1A365D]/10 whitespace-nowrap"
        >
          <Plus size={18} />
          Đăng Tin Tức
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Ảnh bìa</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tiêu đề bài viết</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Ngày đăng</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy bài viết nào.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-20 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                        {post.image_url ? (
                          <img src={post.image_url} alt={post.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">Trống</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(post)} className="p-2 text-[#A5C4E5] hover:text-[#1A365D] hover:bg-[#A5C4E5]/20 rounded-lg transition-colors" title="Chỉnh sửa">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
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

            <div className="relative inline-block w-full max-w-4xl p-6 my-8 text-left bg-white shadow-2xl rounded-2xl transform transition-all align-middle">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#1A365D] font-playfair">
                  {editingPost ? "Chỉnh sửa Bài viết" : "Soạn Bài viết Mới"}
                </h3>
                <button type="button" onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 p-2 bg-gray-50 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  
                  {/* Cột trái: Thông tin text */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tiêu đề bài viết *</label>
                      <input type="text" name="title" required value={formData.title || ""} onChange={handleChange} placeholder="Khám phá bộ sưu tập..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A365D]/30 focus:border-[#1A365D] bg-gray-50/50" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nội dung chi tiết *</label>
                      <textarea name="content" required rows={12} value={formData.content || ""} onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A365D]/30 focus:border-[#1A365D] bg-gray-50/50 custom-scrollbar" 
                        placeholder="Bài viết của bạn..." />
                    </div>
                  </div>

                  {/* Cột phải: Dropzone Ảnh bìa */}
                  <div className="space-y-4 flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ảnh bìa (1 ảnh)</label>
                    
                    {!image ? (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-10 h-64 transition-colors cursor-pointer bg-gray-50/50 hover:bg-[#EEF2FF] hover:border-[#A5C4E5]"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadCloud size={48} className="text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 font-medium text-center">Click để chọn ảnh bìa</p>
                        <p className="text-xs text-gray-400 mt-2 text-center">Chỉ hỗ trợ 1 ảnh. Chọn ảnh ngang (16:9) để hiển thị đẹp nhất.</p>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-gray-200 group shadow-sm h-64">
                         <img 
                            src={typeof image === 'string' ? image : URL.createObjectURL(image)} 
                            alt="Preview banner" 
                            className="w-full h-full object-cover" 
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-3 right-3 bg-white/90 text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 shadow-md"
                          >
                            <XCircle size={24} className="fill-white" />
                          </button>
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1A365D]/80 to-transparent pt-8 pb-3 px-4">
                             <div className="text-white text-xs font-semibold">ẢNH BÌA TIN TỨC</div>
                          </div>
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
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
                      Hủy bỏ
                    </button>
                    <button type="submit" disabled={saving}
                      className="px-6 py-2.5 bg-[#1A365D] text-white hover:bg-[#112440] rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                      {saving && (
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {saving ? "Đang xuất bản..." : "Xuất bản bài viết"}
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
