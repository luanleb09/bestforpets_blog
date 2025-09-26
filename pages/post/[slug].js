import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'

export default function PostDetail() {
  const router = useRouter()
  const { slug, id } = router.query   // slug và id được truyền từ URL
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug && !id) return
    const apiBase = process.env.NEXT_PUBLIC_WP_API   // 👉 Public API bạn đã khai báo

    async function fetchPost() {
      try {
        let res
        if (id) {
          // ✅ Trường hợp có ID → gọi trực tiếp
          res = await axios.get(`${apiBase}/posts/${id}`)
        } else if (slug) {
          // ✅ Trường hợp chỉ có slug → dùng endpoint slug
          res = await axios.get(`${apiBase}/posts/slug:${slug}`)
        }
        if (res?.data) setPost(res.data)
      } catch (err) {
        console.error('❌ Error fetching post detail:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug, id])

  if (loading) return <p style={{ padding: 20 }}>Đang tải bài viết...</p>
  if (!post) return <p style={{ padding: 20 }}>❌ Không tìm thấy bài viết</p>

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
