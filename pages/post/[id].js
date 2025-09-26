import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_WP_API}/posts/${id}/?fields=ID,title,content,excerpt,date,categories,tags,featured_image`)
        .then(res => setPost(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt.replace(/<[^>]+>/g, '')} />
      </Head>
      <article>
        <h1>{post.title}</h1>
        {post.featured_image && (
          <img src={post.featured_image} alt={post.title} style={{ width: '100%', borderRadius: '8px' }} />
        )}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
}
