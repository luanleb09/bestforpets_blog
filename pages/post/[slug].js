import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function PostDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [siteTitle, setSiteTitle] = useState("My Blog")
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const apiBase = process.env.NEXT_PUBLIC_WP_API

    if (!apiBase) {
      console.error("⚠️ Chưa cấu hình NEXT_PUBLIC_WP_API")
      return
    }

    // Lấy thông tin site
    axios.get(apiBase)
      .then(res => {
        if (res.data?.name) setSiteTitle(res.data.name)
      })

    // Lấy bài viết theo slug
    axios.get(`${apiBase}/post/slug:${slug}`)
      .then(res => {
        if (res.data?.posts?.[0]) setPost(res.data.posts[0])
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching post:", err)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>⏳ Đang tải...</p>
  }

  if (!post) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>❌ Không tìm thấy bài viết</p>
  }

  return (
    <>
      <Head>
        <title>{post.title} | {siteTitle}</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* HEADER */}
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
            <Link href="/" style={{ textDecoration: "none", color: "white" }}>
              <h1 style={{ margin: 0, fontSize: '2rem', cursor: 'pointer' }}>
                {siteTitle}
              </h1>
            </Link>
            <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Khám phá kiến thức mới mỗi ngày</p>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div style={{
          flex: 1,
          display: 'flex',
          maxWidth: '1400px',
          margin: '20px auto',
          width: '100%',
          gap: '20px',
          padding: '0 20px'
        }}>

          {/* LEFT PANEL */}
          <aside style={{
            width: '20%',
            minWidth: '200px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              📚 Sidebar menu
            </div>
          </aside>

          {/* CENTER PANEL */}
          <main style={{
            flex: 1,
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Tiêu đề */}
            <h1 style={{ marginTop: 0, fontSize: "2rem", color: "#333" }}>
              {post.title}
            </h1>

            {/* Meta info */}
            <p style={{ fontSize: "0.9rem", color: "#777" }}>
              📅 {new Date(post.date).toLocaleDateString("vi-VN")}
            </p>

            {/* Ảnh featured */}
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  margin: "20px 0"
                }}
              />
            )}

            {/* Nội dung bài viết */}
            <div
              style={{ lineHeight: "1.8", color: "#333" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Back button */}
            <div style={{ marginTop: "30px" }}>
              <Link href="/" style={{
                display: "inline-block",
                background: "#667eea",
                color: "white",
                padding: "10px 20px",
                borderRadius: "6px",
                textDecoration: "none"
              }}>
                ← Quay lại trang chủ
              </Link>
            </div>
          </main>

          {/* RIGHT PANEL */}
          <aside style={{ width: '20%', minWidth: '200px' }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: '20px'
            }}>
              📢 Quảng cáo
            </div>
          </aside>
        </div>

        {/* FOOTER */}
        <footer style={{
          background: '#2d3748',
          color: 'white',
          padding: '30px 0',
          marginTop: '40px'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 20px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              © {new Date().getFullYear()} {siteTitle}
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
