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
      axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts/${id}?_embed`)
        .then(res => setPost(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>{post.title.rendered}</title>
        <meta name="description" content={post.excerpt.rendered.replace(/<[^>]+>/g, '')} />
      </Head>
      <article>
        <h1>{post.title.rendered}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </article>
    </>
  );
}