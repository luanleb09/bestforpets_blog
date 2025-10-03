import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_WP_API;

export default function Post() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [menus, setMenus] = useState([]);
  const [tags, setTags] = useState([]);
  const [siteTitle, setSiteTitle] = useState('My Blog');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Fetch site info và all posts cho sidebar
  useEffect(() => {
    if (!BASE_URL) return;

    // Lấy thông tin site
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        if (data?.name) setSiteTitle(data.name);
      })
      .catch(err => console.error('Error fetching site info:', err));

    // Lấy tất cả bài viết cho sidebar
    fetch(`${BASE_URL}/posts/?number=50`)
      .then(res => res.json())
      .then(data => {
        const postList = Array.isArray(data.posts) ? data.posts : [];
        setAllPosts(postList);

        // Tạo menu và tags
        const menuSet = new Set();
        const tagSet = new Set();

        postList.forEach(p => {
          if (p.categories) {
            Object.values(p.categories).forEach(cat => menuSet.add(cat.name));
          }
          if (p.tags) {
            Object.values(p.tags).forEach(tag => tagSet.add(tag.name));
          }
        });

        setMenus(Array.from(menuSet));
        setTags(Array.from(tagSet));
      })
      .catch(err => console.error('Error fetching posts:', err));
  }, []);

  // Fetch bài viết hiện tại
  useEffect(() => {
    if (!slug) return;

    setIsLoading(true);
    setIsError(false);
    setPost(null);

    const fetchPost = async () => {
      try {
        const apiUrl = `${BASE_URL}/posts?slug=${slug}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        
        if (data.posts && data.posts.length > 0) {
          const matchedPost = data.posts.find(p => p.slug === slug);
          
          if (matchedPost) {
            setPost(matchedPost);
          } else {
            setIsError(true);
          }
        } else {
          setIsError(true);
        }
      } catch (e) {
        setIsError(true);
        console.error("Error fetching post:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleMenuClick = (menu) => {
    router.push(`/?menu=${encodeURIComponent(menu)}`);
  };

  const handleTagClick = (tag) => {
    router.push(`/?tag=${encodeURIComponent(tag)}`);
  };

  if (isLoading || router.isFallback) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading content...</div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
              <h1 style={{ margin: 0, fontSize: '2rem', cursor: 'pointer' }}>{siteTitle}</h1>
            </Link>
          </div>
        </header>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>😢</div>
            <h2 style={{ color: '#e53e3e', marginBottom: '10px' }}>Post Not Found</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>The post you are looking for does not exist or has been removed.</p>
            <Link href="/" style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Lấy bài viết liên quan (cùng category hoặc tag)
  const relatedPosts = allPosts
    .filter(p => {
      if (p.ID === post.ID) return false;
      
      // Check if shares any category
      if (post.categories && p.categories) {
        const postCats = Object.keys(post.categories);
        const pCats = Object.keys(p.categories);
        const hasCommonCategory = postCats.some(cat => pCats.includes(cat));
        if (hasCommonCategory) return true;
      }
      
      // Check if shares any tag
      if (post.tags && p.tags) {
        const postTags = Object.keys(post.tags);
        const pTags = Object.keys(p.tags);
        const hasCommonTag = postTags.some(tag => pTags.includes(tag));
        if (hasCommonTag) return true;
      }
      
      return false;
    })
    .slice(0, 6);

  return (
    <>
      <Head>
        <title>{post.title} | {siteTitle}</title>
        <meta name="description" content={post.excerpt?.replace(/<[^>]*>/g, '').substring(0, 160)} />
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
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
              <h1 style={{ margin: 0, fontSize: '2rem', cursor: 'pointer' }}>{siteTitle}</h1>
              <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Discover new knowledge every day</p>
            </Link>
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
                        background: '#f5f5f5',
                        color: '#333',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#667eea'}
                      onMouseLeave={(e) => e.target.style.background = '#f5f5f5'}
                      onMouseOver={(e) => e.target.style.color = 'white'}
                      onMouseOut={(e) => e.target.style.color = '#333'}
                    >
                      {menu}
                    </button>
                  </li>
                ))}
              </ul>
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
                      background: '#f0f0f0',
                      color: '#555',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#764ba2';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f0f0f0';
                      e.target.style.color = '#555';
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
            {/* Breadcrumb */}
            <div style={{ marginBottom: '20px' }}>
              <Link href="/" style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.9rem' }}>
                ← Back to Home
              </Link>
            </div>

            {/* Article */}
            <article style={{
              background: 'white',
              borderRadius: '12px',
              padding: '40px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}>
              {/* Title */}
              <h1 style={{
                fontSize: '2.5rem',
                lineHeight: '1.3',
                marginBottom: '20px',
                color: '#1a202c'
              }}>
                {post.title}
              </h1>

              {/* Meta Info */}
              <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: '2px solid #f0f0f0',
                fontSize: '0.9rem',
                color: '#718096'
              }}>
                <span>📅 {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: '2-digit' 
                })}</span>
              </div>

              {/* Featured Image */}
              {post.featured_image && (
                <div style={{ marginBottom: '30px' }}>
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div 
                className="post-content"
                style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  color: '#2d3748'
                }}
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />

              {/* Tags removed as requested */}
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div style={{ 
                background: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '30px'
              }}>
                <h2 style={{ 
                  fontSize: '1.8rem', 
                  marginTop: 0,
                  marginBottom: '25px',
                  color: '#1a202c',
                  borderBottom: '3px solid #667eea',
                  paddingBottom: '15px'
                }}>
                  📖 Related Posts
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px'
                }}>
                  {relatedPosts.map(relatedPost => (
                    <Link 
                      key={relatedPost.ID}
                      href={`/post/${relatedPost.slug}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div style={{
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                      }}
                      >
                        {/* Featured Image */}
                        <div style={{ 
                          position: 'relative',
                          paddingTop: '60%',
                          background: relatedPost.featured_image 
                            ? `url(${relatedPost.featured_image}) center/cover` 
                            : '#e0e0e0'
                        }}>
                          {!relatedPost.featured_image && (
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
                              color: '#bbb'
                            }}>
                              📄
                            </div>
                          )}
                        </div>

                        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h3 style={{
                            margin: '0 0 10px',
                            fontSize: '1.05rem',
                            lineHeight: '1.4',
                            color: '#2d3748',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontWeight: '600'
                          }}>
                            {relatedPost.title}
                          </h3>

                          {/* Excerpt */}
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: '#718096',
                              lineHeight: '1.5',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              marginBottom: '12px',
                              flex: 1
                            }}
                            dangerouslySetInnerHTML={{ __html: relatedPost.excerpt }}
                          />

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            color: '#999',
                            paddingTop: '10px',
                            borderTop: '1px solid #e2e8f0'
                          }}>
                            <span>📅 {new Date(relatedPost.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit'
                            })}</span>
                            <span style={{ color: '#667eea', fontWeight: 'bold' }}>Read More →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Banner Ad */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '60px 40px',
              borderRadius: '12px',
              textAlign: 'center',
              color: 'white'
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

      <style jsx global>{`
        .post-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 20px 0;
        }
        .post-content p {
          margin-bottom: 1.2em;
        }
        .post-content h2 {
          font-size: 1.8rem;
          margin-top: 2em;
          margin-bottom: 0.8em;
          color: #1a202c;
        }
        .post-content h3 {
          font-size: 1.5rem;
          margin-top: 1.5em;
          margin-bottom: 0.6em;
          color: #2d3748;
        }
        .post-content ul, .post-content ol {
          margin-left: 1.5em;
          margin-bottom: 1.2em;
        }
        .post-content li {
          margin-bottom: 0.5em;
        }
        .post-content a {
          color: #667eea;
          text-decoration: underline;
        }
        .post-content blockquote {
          border-left: 4px solid #667eea;
          padding-left: 20px;
          margin: 20px 0;
          font-style: italic;
          color: #4a5568;
        }
        .post-content code {
          background: #f7fafc;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
      `}</style>
    </>
  );
}