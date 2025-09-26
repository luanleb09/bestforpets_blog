import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

export default function Home({ siteTitle, posts }) {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content="Next.js blog powered by WordPress REST API" />
      </Head>

      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>{siteTitle}</h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}
        >
          {posts.map((post) => {
            const featuredImg =
              post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

            return (
              <div
                key={post.id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '16px',
                  background: '#fff'
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  {/* ✅ Dùng slug để có URL SEO đẹp */}
                  <Link href={`/post/${post.slug}`}>
                    {post.title.rendered}
                  </Link>
                </h3>

                {featuredImg && (
                  <img
                    src={featuredImg}
                    alt={post.title.rendered}
                    style={{ width: '100%', borderRadius: '6px', marginBottom: '12px' }}
                  />
                )}

                <div
                  style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px' }}
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
                <small style={{ color: '#999' }}>
                  📅 {new Date(post.date).toLocaleDateString()}
                </small>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/**
 * 👉 Hàm này sẽ chạy ở build time (hoặc revalidate) để fetch data
 */
export async function getStaticProps() {
  const apiBase = process.env.NEXT_PUBLIC_WP_API; 
  // VD: https://public-api.wordpress.com/wp/v2/sites/tenblog.wordpress.com

  // Lấy thông tin site
  let siteTitle = 'My Blog';
  try {
    const siteRes = await axios.get(`${apiBase}`);
    if (siteRes.data.name) siteTitle = siteRes.data.name;
  } catch (e) {
    console.error('Error fetching site info:', e);
  }

  // Lấy danh sách bài viết
  let posts = [];
  try {
    const postRes = await axios.get(`${apiBase}/posts?_embed&per_page=20`);
    posts = postRes.data;
  } catch (e) {
    console.error('Error fetching posts:', e);
  }

  return {
    props: {
      siteTitle,
      posts
    },
    revalidate: 60 // ISR: làm mới mỗi 60 giây
  };
}
