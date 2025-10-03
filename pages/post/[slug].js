import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const BASE_URL = process.env.NEXT_PUBLIC_WP_API;

export default function Post() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    // Reset state khi slug thay đổi
    setIsLoading(true);
    setIsError(false);
    setPost(null);

    const fetchPost = async () => {
      try {
        const apiUrl = `${BASE_URL}/posts?slug=${slug}`;
        
        console.log('🔍 Fetching URL:', apiUrl);
        console.log('📌 Slug từ URL:', slug);
        
        const res = await fetch(apiUrl);
        const data = await res.json();
        
        console.log('📦 Full API Response:', data);
        console.log('📝 Number of posts returned:', data.posts?.length);
        
        if (data.posts && data.posts.length > 0) {
          console.log('✅ Post found:');
          console.log('  - ID:', data.posts[0].ID);
          console.log('  - Title:', data.posts[0].title);
          console.log('  - Slug:', data.posts[0].slug);
          console.log('  - Does slug match?', data.posts[0].slug === slug);
          
          setPost(data.posts[0]);
        } else {
          console.error('❌ No posts found in response');
          setIsError(true);
        }
      } catch (e) {
        setIsError(true);
        console.error("❌ Lỗi khi fetch API:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading || router.isFallback) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Đang tải nội dung...</div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">
          Lỗi: Không tìm thấy bài viết hoặc không thể tải dữ liệu.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{post.title} | Blog</title>
        <meta name="description" content={post.excerpt?.substring(0, 160)} />
      </Head>
      
      <article className="max-w-3xl mx-auto">
        {/* Nút quay lại */}
        <button 
          onClick={() => router.push('/')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Quay lại trang chủ
        </button>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        {/* Thông tin meta */}
        <div className="text-gray-600 mb-6 flex gap-4">
          <span>📅 {new Date(post.date).toLocaleDateString('vi-VN')}</span>
          {post.author && <span>✍️ {post.author.name}</span>}
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <img 
            src={post.featured_image} 
            alt={post.title}
            className="w-full h-auto rounded-lg mb-6"
          />
        )}

        {/* Nội dung bài viết */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>
    </div>
  );
}