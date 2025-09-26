import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'

export default function PostDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    const apiBase = process.env.NEXT_PUBLIC_WP_API
    if (!apiBase) {
      console.error('⚠️ NEXT_PUBLIC_WP_API chưa được cấu hình')
      return
    }

    // ✅ Gọi API theo slug
    axios
      .get(`${apiBase}/posts/slug:${slug}`)
      .then(res => {
        // Public API trả về object bài viết trực tiếp
        if (res.data && res.data.ID) {
          setPost(res.data)
        } else {
          setError('Không tìm thấy bài viết')
        }
      })
      .catch(err => {
        console.error('Error fetching post by slug:', err)
        setError('Không tìm thấy bài viết')
      })
  }, [slug])

  if (error) return <p style={{ padding: 20 }}>{error}</p>
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
