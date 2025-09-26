import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [siteTitle, setSiteTitle] = useState('My Blog');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_WP_API; // ví dụ: https://public-api.wordpress.com/wp/v2/sites/your-site.wordpress.com

    // 1️⃣ Lấy thông tin site (để hiển thị tên web)
    axios
      .get(`${apiBase.replace('/wp/v2', '')}`)
      .then(res => {
        if (res.data.name) setSiteTitle(res.data.name);
      })
      .catch(err => console.error('Error fetching site info:', err));

    // 2️⃣ Lấy danh sách bài viết (kèm ảnh đại diện)
    axios
      .get(`${apiBase}/posts?_embed&per_page=20`)
      .then(res => setPosts(res.data))
      .catch(err => console.error('Error fetching posts:', err));
  }, []);

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
          {posts.map(post => {
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
                  <Link href={`/post/${post.id}`} style={{ textDecoration: 'none', color: '#333' }}>
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
