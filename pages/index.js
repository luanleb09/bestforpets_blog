import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_WP_API}/posts/?number=20&fields=ID,title,excerpt,date,featured_image`)
      .then(res => setPosts(res.data.posts))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Head>
        <title>My WP Blog</title>
        <meta name="description" content="Next.js blog powered by WordPress.com Jetpack API" />
      </Head>
      <div>
        <h1>My Blog</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {posts.map(post => (
            <div key={post.ID}>
              <h3>
                <Link href={`/post/${post.ID}`}>
                  {post.title}
                </Link>
              </h3>
              {post.featured_image && (
                <img src={post.featured_image} alt={post.title} style={{ width: '100%', borderRadius: '8px' }} />
              )}
              <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
