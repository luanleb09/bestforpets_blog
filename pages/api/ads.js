// API endpoint to serve advertisement codes
export default async function handler(req, res) {
  const ads = {
    // In-content ad (appears in the middle of blog post)
    inContentAd: `
      <div style="text-align: center; padding: 20px;">
        <script async="async" data-cfasync="false" src="//pl27782521.revenuecpmgate.com/29bea718a1ee32f257cc303576e677cb/invoke.js"></script>
        <div id="container-29bea718a1ee32f257cc303576e677cb"></div>
      </div>
    `,
    
    // Sidebar ad - DISABLED to avoid conflict
    // Get a separate ad code from your ad network for sidebar
    sidebarAd: null,
    
    // Banner ad (appears at bottom of post pages)
    bannerAd: `
      <div style="text-align: center; padding: 20px 0;">
        <script type="text/javascript">
          atOptions = {
            'key' : '1bccc8126dbef944742d11469630f9c6',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="//www.highperformanceformat.com/1bccc8126dbef944742d11469630f9c6/invoke.js"></script>
      </div>
    `
  };
  
  res.status(200).json(ads);
}