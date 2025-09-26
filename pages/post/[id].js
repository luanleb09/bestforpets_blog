import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);
  const [siteTitle, setSiteTitle] = useState('My Blog');

  useEffect(() => {
    if (!id) return;

    const apiBase = process.env.NEXT_PUBLIC_WP_API; 
    // ví dụ: https://public-api.wordpress.com/wp/v2/sites/luanle0911-qkvjr.wordpress.com

    // 1️⃣ Lấy thông tin site (để hiển thị trong <title>)
    axios
      .get(`${apiBase.replace('/wp/v2', '')}`)
      .then(res => {
        if (res.data.name) setSiteTitle(res.data.name);
      })
      .catch(err => console.error('Error fetching site info:', err));

    // 2️⃣ Lấy chi tiết bài viết
    axios
      .get(`${apiBase}/posts/${id}?_embed`)
      .then(res => setPost(res.data))
      .catch(err => console.error('Error fetching post:', err));
  }, [id]);

  if (!post) return <p style={{ padding: '20px' }}>Loading...</p>;

  const featuredImg =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

  return (
    <>
      <Head>
        <title>{post.title.rendered} | {siteTitle}</title>
        <meta name="description" content={post.excerpt?.rendered?.replace(/<[^>]+>/g, '')} />
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          style={{ textAlign: 'center', marginBottom: '20px' }}
        />

        <p style={{ textAlign: 'center', color: '#999' }}>
          📅 {new Date(post.date).toLocaleDateString()}
        </p>

        {featuredImg && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <img
              src={featuredImg}
              alt={post.title.rendered}
              style={{ maxWidth: '100%', borderRadius: '8px' }}
            />
          </div>
        )}

        <div
          style={{ fontSize: '1rem', lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
