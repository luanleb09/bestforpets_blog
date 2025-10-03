import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const { menu: queryMenu, tag: queryTag } = router.query
  const [siteTitle, setSiteTitle] = useState('My Blog')
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [menus, setMenus] = useState([])
  const [tags, setTags] = useState([])
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [selectedTag, setSelectedTag] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 12

  // Set filter từ URL query
  useEffect(() => {
    if (queryMenu) setSelectedMenu(decodeURIComponent(queryMenu))
    if (queryTag) setSelectedTag(decodeURIComponent(queryTag))
  }, [queryMenu, queryTag])

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_WP_API
    
    if (!apiBase) {
      console.error('⚠️ Chưa cấu hình NEXT_PUBLIC_WP_API')
      return
    }

    // Lấy thông tin site
    axios.get(apiBase)
      .then(res => {
        if (res.data?.name) setSiteTitle(res.data.name)
      })
      .catch(err => console.error('Error fetching site info:', err))

    // Lấy danh sách bài viết
    axios.get(`${apiBase}/posts/?number=50`)
      .then(res => {
        const postList = Array.isArray(res.data.posts) ? res.data.posts : []
        setPosts(postList)
        setFilteredPosts(postList)
        
        // Tạo menu từ categories
        const menuSet = new Set()
        const tagSet = new Set()
        
        postList.forEach(post => {
          // Lấy categories làm menu
          if (post.categories) {
            Object.values(post.categories).forEach(cat => {
              menuSet.add(cat.name)
            })
          }
          
          // Lấy tags
          if (post.tags) {
            Object.values(post.tags).forEach(tag => {
              tagSet.add(tag.name)
            })
          }
        })
        
        setMenus(Array.from(menuSet))
        setTags(Array.from(tagSet))
      })
      .catch(err => console.error('Error fetching posts:', err))
  }, [])

  // Filter posts theo menu hoặc tag
  useEffect(() => {
    let filtered = posts

    if (selectedMenu) {
      filtered = posts.filter(post => {
        if (!post.categories) return false
        return Object.values(post.categories).some(cat => cat.name === selectedMenu)
      })
    }

    if (selectedTag) {
      filtered = posts.filter(post => {
        if (!post.tags) return false
        return Object.values(post.tags).some(tag => tag.name === selectedTag)
      })
    }

    setFilteredPosts(filtered)
    setCurrentPage(1)
  }, [selectedMenu, selectedTag, posts])

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu === selectedMenu ? null : menu)
    setSelectedTag(null)
  }

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag)
    setSelectedMenu(null)
  }

  const clearFilters = () => {
    setSelectedMenu(null)
    setSelectedTag(null)
  }

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content="Next.js blog powered by WordPress" />
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
            <h1 style={{ margin: 0, fontSize: '2rem', cursor: 'pointer' }} onClick={clearFilters}>
              {siteTitle}
            </h1>
            <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Discover new knowledge every day</p>
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
          
          {/* LEFT PANEL - 20% */}
          <aside style={{ 
            width: '20%', 
            minWidth: '200px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* MENU Section */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                marginTop: 0, 
                marginBottom: '15px',
                fontSize: '1.1rem',
                color: '#333',
                borderBottom: '2px solid #667eea',
                paddingBottom: '10px'
              }}>
                📚 Categories
              </h3>
              {menus.length === 0 ? (
                <p style={{ fontSize: '0.9rem', color: '#999' }}>Loading...</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {menus.map((menu, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      <button
                        onClick={() => handleMenuClick(menu)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 12px',
                          border: 'none',
                          borderRadius: '6px',
                          background: selectedMenu === menu ? '#667eea' : '#f5f5f5',
                          color: selectedMenu === menu ? 'white' : '#333',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s',
                          fontWeight: selectedMenu === menu ? 'bold' : 'normal'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedMenu !== menu) {
                            e.target.style.background = '#e8e8e8'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedMenu !== menu) {
                            e.target.style.background = '#f5f5f5'
                          }
                        }}
                      >
                        {menu}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* TAGS Section */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                marginTop: 0, 
                marginBottom: '15px',
                fontSize: '1.1rem',
                color: '#333',
                borderBottom: '2px solid #764ba2',
                paddingBottom: '10px'
              }}>
                🏷️ Tags
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTagClick(tag)}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '20px',
                      background: selectedTag === tag ? '#764ba2' : '#f0f0f0',
                      color: selectedTag === tag ? 'white' : '#555',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.3s',
                      fontWeight: selectedTag === tag ? 'bold' : 'normal'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTag !== tag) {
                        e.target.style.background = '#e0e0e0'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTag !== tag) {
                        e.target.style.background = '#f0f0f0'
                      }
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* CENTER PANEL - 60% */}
          <main style={{ flex: 1 }}>
            {/* Active Filter Display */}
            {(selectedMenu || selectedTag) && (
              <div style={{
                background: '#fff3cd',
                padding: '12px 20px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ffc107'
              }}>
                <span>
                  Filtering by: <strong>{selectedMenu || selectedTag}</strong>
                </span>
                <button
                  onClick={clearFilters}
                  style={{
                    background: '#ffc107',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  ✕ Clear Filter
                </button>
              </div>
            )}

            {/* Posts Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {currentPosts.map((post, idx) => (
                <div key={post.ID}>
                  {/* Chèn quảng cáo sau mỗi 6 bài */}
                  {idx === 6 && (
                    <div style={{
                      gridColumn: '1 / -1',
                      background: '#f0f0f0',
                      padding: '40px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      color: '#999',
                      border: '2px dashed #ddd'
                    }}>
                      📢 Mid-page Advertisement Space
                    </div>
                  )}
                  
                  <Link 
                    href={`/post/${post.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)'
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    >
                      {/* Featured Image */}
                      <div style={{ 
                        position: 'relative', 
                        paddingTop: '60%',
                        background: '#f0f0f0'
                      }}>
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            color: '#ddd'
                          }}>
                            📄
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{
                          margin: '0 0 10px',
                          fontSize: '1.1rem',
                          lineHeight: '1.4',
                          color: '#333',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {post.title}
                        </h3>

                        <div
                          style={{
                            fontSize: '0.85rem',
                            color: '#666',
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            marginBottom: '12px',
                            flex: 1
                          }}
                          dangerouslySetInnerHTML={{ __html: post.excerpt }}
                        />

                        <div style={{
                          fontSize: '0.8rem',
                          color: '#999',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '10px',
                          borderTop: '1px solid #f0f0f0'
                        }}>
                          <span>📅 {new Date(post.date).toLocaleDateString('vi-VN')}</span>
                          <span style={{ color: '#667eea', fontWeight: 'bold' }}>Read More →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '30px',
                marginBottom: '20px'
              }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    background: currentPage === 1 ? '#e0e0e0' : '#667eea',
                    color: currentPage === 1 ? '#999' : 'white',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ← Trước
                </button>

                <span style={{
                  padding: '10px 20px',
                  background: 'white',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'bold'
                }}>
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    background: currentPage === totalPages ? '#e0e0e0' : '#667eea',
                    color: currentPage === totalPages ? '#999' : 'white',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Sau →
                </button>
              </div>
            )}

            {/* Bottom Banner Ad */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '60px 40px',
              borderRadius: '12px',
              textAlign: 'center',
              color: 'white',
              marginTop: '30px'
            }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.5rem' }}>📢 Advertisement Banner</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>Bottom banner ad space - 728x90 or responsive</p>
            </div>
          </main>

          {/* RIGHT PANEL - 20% */}
          <aside style={{ 
            width: '20%', 
            minWidth: '200px' 
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ 
                marginTop: 0, 
                marginBottom: '15px',
                fontSize: '1.1rem',
                textAlign: 'center',
                color: '#333'
              }}>
                📢 Advertisement
              </h3>
              <div style={{
                background: '#f5f5f5',
                padding: '40px 20px',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#999',
                border: '2px dashed #ddd',
                marginBottom: '20px'
              }}>
                300x250
              </div>
              <div style={{
                background: '#f5f5f5',
                padding: '40px 20px',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#999',
                border: '2px dashed #ddd'
              }}>
                300x600
              </div>
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
            <p style={{ margin: '0 0 10px', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {siteTitle}
            </p>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>
              © {new Date().getFullYear()} All rights reserved. Powered by WordPress & Next.js
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}