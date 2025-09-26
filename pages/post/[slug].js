import { useRouter } from 'next/router';
import axios from 'axios';

export default function PostDetail({ post }) {
  const router = useRouter();
  if (router.isFallback) return <p>Đang tải bài viết...</p>;

  const featuredImg = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

  return (
    <article style={{ padding: '20px' }}>
      <h1>{post.title.rendered}</h1>
      {featuredImg && <img src={featuredImg} alt={post.title.rendered} style={{ maxWidth: '100%' }} />}
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  );
}

export async function getStaticPaths() {
  const apiBase = process.env.NEXT_PUBLIC_WP_API;
  const res = await axios.get(`${apiBase}/posts?_embed&per_page=20`);
  const posts = res.data;

  const paths = posts.map(post => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: true, // cho phép build động
  };
}

export async function getStaticProps({ params }) {
  const apiBase = process.env.NEXT_PUBLIC_WP_API;
  const res = await axios.get(`${apiBase}/posts?slug=${params.slug}&_embed`);
  const post = res.data[0];

  return {
    props: { post },
    revalidate: 60
  };
}
