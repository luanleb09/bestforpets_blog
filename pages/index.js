import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  const [siteTitle, setSiteTitle] = useState('My Blog')
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_WP_API
    if (!apiBase) {
      console.error('⚠️ Chưa cấu hình NEXT_PUBLIC_WP_API trong .env.local')
      return
    }

    // 1️⃣ Lấy tên site
    axios
      .get(apiBase) // lấy info site (nếu được)
      .then(res => {
        if (res.data && res.data.name) setSiteTitle(res.data.name)
      })
      .catch(() => {}) // có thể bỏ qua nếu không cần

    // 2️⃣ Lấy danh sách bài viết
    axios
      .get(`${apiBase}/posts?number=20&fields=ID,slug,title,excerpt,date,featured_image`)
      .then(res => {
        const list = Array.isArray(res.data.posts) ? res.data.posts : []
        setPosts(list)
      })
      .catch(err => console.error('Error fetching posts:', err))
  }, [])

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content="Next.js blog powered by WordPress.com Public API" />
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
          {posts.map(post => (
            <div
              key={post.ID}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                background: '#fff'
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                {/* 
                  👉 URL là slug để SEO,
                  nhưng truyền thêm id để trang chi tiết load nhanh.
                */}
                <Link
                  href={`/posts/${post.slug}?id=${post.ID}`}
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
                style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px' }}
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
  )
}
