import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'

export default function PostDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState(null)

  useEffect(() => {
    if (!slug) return
    const apiBase = process.env.NEXT_PUBLIC_WP_API
    // 🔑 Public API: dùng ?slug= để lấy bài viết
    axios
      .get(`${apiBase}/posts?slug=${slug}`)
      .then(res => {
        if (res.data?.posts?.length) setPost(res.data.posts[0])
      })
      .catch(err => console.error('Error fetching post detail:', err))
  }, [slug])

  if (!post) return <p>Đang tải bài viết...</p>

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta
          name="description"
          content={post.excerpt?.replace(/<[^>]+>/g, '') || ''}
        />
      </Head>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>{post.title}</h1>
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ marginTop: '20px' }}
        />
      </div>
    </>
  )
}
