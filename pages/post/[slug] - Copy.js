import Head from 'next/head';

// Lấy Base URL của API từ biến môi trường
// Biến này sẽ được Next.js tự động thay thế khi build
const BASE_URL = process.env.NEXT_PUBLIC_WP_API;

// Component để hiển thị nội dung bài viết
export default function Post({ post }) {
  if (!post) {
    return <h1>404 - Không tìm thấy bài viết</h1>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{post.title} | BestForPets Blog</title>
        {/* Đảm bảo bài viết có excerpt trước khi dùng */}
        {post.excerpt && (
            <meta 
                name="description" 
                content={post.excerpt.replace(/<[^>]*>?/gm, '').substring(0, 150)} 
            />
        )}
      </Head>

      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        {/* HIỂN THỊ NỘI DUNG: Quan trọng là sử dụng dangerouslySetInnerHTML */}
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
      </article>
    </div>
  );
}

// -----------------------------------------------------
// PHẦN LOGIC TẢI DỮ LIỆU BẰNG getStaticProps
// -----------------------------------------------------

export async function getStaticProps({ params }) {
  const { slug } = params;

  // SỬ DỤNG BASE_URL ĐƯỢC KHAI BÁO BÊN TRÊN
  const apiUrl = `${BASE_URL}/posts/slug:${slug}`;

  try {
    const res = await fetch(apiUrl);
    const postData = await res.json();

    // 1. KIỂM TRA LỖI: Nếu API trả về lỗi hoặc không có ID, coi như không tìm thấy
    if (postData.error || postData.ID === undefined) {
      console.error(`Post not found for slug: ${slug}`);
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post: postData, // Gửi dữ liệu bài viết vào component
      },
      revalidate: 600, // ISR: Tái tạo lại trang sau mỗi 10 phút
    };
  } catch (e) {
    console.error(`Error fetching post ${slug}:`, e);
    return {
      notFound: true,
    };
  }
}

// -----------------------------------------------------
// PHẦN TẠO ĐƯỜNG DẪN TĨNH BẰNG getStaticPaths
// -----------------------------------------------------

export async function getStaticPaths() {
  // SỬ DỤNG BASE_URL ĐỂ LẤY DANH SÁCH POSTS
  const listApiUrl = `${BASE_URL}/posts?fields=slug&number=50`;
  
  const res = await fetch(listApiUrl);
  const data = await res.json();
  const posts = data.posts || [];

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    // fallback: false - mọi URL không được pre-build sẽ trả về 404
    fallback: false, 
  };
}