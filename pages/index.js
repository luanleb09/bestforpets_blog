import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed&per_page=20`)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Head>
        <title>My WP Blog</title>
        <meta name="description" content="Next.js blog powered by WordPress Headless CMS" />
      </Head>
      <div>
        <h1>My Blog</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {posts.map(post => (
            <div key={post.id}>
              <h3>
                <Link href={`/post/${post.id}`}>
                  {post.title.rendered}
                </Link>
              </h3>
              <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}