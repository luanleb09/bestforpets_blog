import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'

export default function PostDetail() {
  const router = useRouter()
  const { slug, id } = router.query   // ✅ nhận cả slug và id
  const [post, setPost] = useState(null)

  useEffect(() => {
    if (!slug) return
    const apiBase = process.env.NEXT_PUBLIC_WP_API

    if (id) {
      // ✅ Trường hợp có ID → gọi thẳng, nhanh nhất
      axios
        .get(`${apiBase}/posts/${id}`)
        .then(res => setPost(res.data))
        .catch(err => console.error('Error fetching post by ID:', err))
    } else {
      // ❗ Không có ID → gọi danh sách rồi tìm slug (chậm hơn)
      axios
        .get(`${apiBase}/posts?number=50`)
        .then(res => {
          const match = res.data.posts.find(p => p.slug === slug)
          if (match) setPost(match)
        })
        .catch(err => console.error('Error fetching posts list:', err))
    }
  }, [slug, id])

  if (!post) return <p style={{ padding: 20 }}>Đang tải bài viết...</p>

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta
          name="description"
          content={post.excerpt ? post.excerpt.replace(/<[^>]+>/g, '') : ''}
        />
      </Head>

      <article style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 dangerouslySetInnerHTML={{ __html: post.title }} />
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }}
          />
        )}
        <div
          style={{ lineHeight: '1.8', fontSize: '1.1rem' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <p style={{ color: '#999', marginTop: '20px' }}>
          📅 {new Date(post.date).toLocaleDateString()}
        </p>
      </article>
    </>
  )
}
