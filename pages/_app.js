import '../styles/globals.css'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function MyApp({ Component, pageProps }) {
  const [siteInfo, setSiteInfo] = useState({ name: 'My Blog', description: '' })

  useEffect(() => {
    async function fetchSiteInfo() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API}`)
        const data = await res.json()
        setSiteInfo({
          name: data.name || 'My Blog',
          description: data.description || ''
        })
      } catch (err) {
        console.error('Lỗi lấy site info:', err)
      }
    }
    fetchSiteInfo()
  }, [])

  return (
    <>
      <Head>
        <title>{siteInfo.name}</title>
        <meta name="description" content={siteInfo.description} />
      </Head>
      <Component {...pageProps} siteInfo={siteInfo} />
    </>
  )
}
