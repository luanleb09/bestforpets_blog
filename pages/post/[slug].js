import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Biến này CÓ THỂ được đọc trên client-side vì có tiền tố NEXT_PUBLIC_
const BASE_URL = process.env.NEXT_PUBLIC_WP_API;

export default function Post() {
  const router = useRouter();
  const { slug } = router.query; // Lấy slug từ URL
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Chỉ chạy khi slug đã có và chưa tải
    if (slug && !post) {
      const apiUrl = `${BASE_URL}/posts/slug:${slug}`;
      
      const fetchPost = async () => {
        try {
          const res = await fetch(apiUrl);
          const postData = await res.json();
          
          if (postData.error || postData.ID === undefined) {
            setIsError(true); // Đặt trạng thái lỗi nếu API không tìm thấy
          } else {
            setPost(postData);
          }
        } catch (e) {
          setIsError(true);
          console.error("Lỗi khi fetch API trên client:", e);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPost();
    }
  }, [slug, post]);

  // --- Trạng thái hiển thị ---

  if (isLoading || router.isFallback) {
    return <div className="text-center mt-10">Đang tải nội dung...</div>;
  }

  if (isError || !post) {
    // Lưu ý: Nếu post rỗng, URL API WordPress sẽ được thấy trong Network tab của trình duyệt!
    return <div className="text-center mt-10 text-red-600">Lỗi: Không tìm thấy bài viết hoặc không thể tải dữ liệu.</div>;
  }
  
  // --- Hiển thị nội dung ---

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{post.title} | Blog</title>
      </Head>

      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        {/* NỘI DUNG SẼ ĐƯỢC RENDER SAU KHI TẢI DỮ LIỆU */}
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
      </article>
    </div>
  );
}

// KHÔNG CÓ getStaticProps HOẶC getStaticPaths
// Trang này hoàn toàn là Client-Side Rendering