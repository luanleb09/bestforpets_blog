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

    axios
      .get(`${process.env.NEXT_PUBLIC_WP_API}/posts?slug=${slug}&_embed`)
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPost(res.data[0])
        }
      })
      .catch(err => console.error('Error fetching post detail:', err))
  }, [slug])

  if (!post) return <p style={{ padding: 20 }}>Đang tải bài viết...</p>

  const featuredImg =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null

  return (
    <>
      <Head>
        <title>{post.title.rendered}</title>
        <meta
          name="description"
          content={post.excerpt.rendered.replace(/<[^>]+>/g, '')}
        />
      </Head>

      <article style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        {featuredImg && (
          <img
            src={featuredImg}
            alt={post.title.rendered}
            style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }}
          />
        )}
        <div
          style={{ lineHeight: '1.8', fontSize: '1.1rem' }}
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
        <p style={{ color: '#999', marginTop: '20px' }}>
          📅 {new Date(post.date).toLocaleDateString()}
        </p>
      </article>
    </>
  )
}
