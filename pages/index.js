import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [siteTitle, setSiteTitle] = useState('My Blog');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_WP_API;
    if (!apiBase) {
      console.error('⚠️ NEXT_PUBLIC_WP_API chưa được cấu hình trong .env.local');
      return;
    }

    // 1️⃣ Lấy thông tin site
    axios
      .get(`${apiBase}`)
      .then(res => {
        if (res.data && res.data.name) setSiteTitle(res.data.name);
      })
      .catch(err => console.error('Error fetching site info:', err));

    // 2️⃣ Lấy danh sách bài viết (Jetpack)
    // Jetpack trả về { posts: [ ... ] }
    axios
      .get(`${apiBase}/posts/?number=20&fields=ID,title,excerpt,date,featured_image`)
      .then(res => {
        const data = Array.isArray(res.data.posts) ? res.data.posts : [];
        setPosts(data);
      })
      .catch(err => console.error('Error fetching posts:', err));
  }, []);

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta
          name="description"
          content={`Next.js blog powered by WordPress.com Jetpack API`}
        />
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
          {Array.isArray(posts) &&
            posts.map(post => (
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
                  <Link
                    href={`/post/${post.slug}`}
                    style={{ textDecoration: 'none', color: '#333' }}
                  >
                    {post.title}
                  </Link>
                </h3>

                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    style={{
                      width: '100%',
                      borderRadius: '6px',
                      marginBottom: '12px'
                    }}
                  />
                )}

                <div
                  style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    marginBottom: '8px'
                  }}
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
                <small style={{ color: '#999' }}>
                  📅 {new Date(post.date).toLocaleDateString()}
                </small>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
