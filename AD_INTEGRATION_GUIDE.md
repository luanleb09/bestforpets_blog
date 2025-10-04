# Advertisement Integration Guide

## Overview
The blog now supports dynamic advertisement insertion in 3 locations:
1. **In-Content Ad** - Inside the post content (after 3rd paragraph)
2. **Sidebar Ad** - Right sidebar on post pages
3. **Banner Ad** - Bottom of post pages

## How It Works

### Current Implementation
- Ads are **conditionally rendered** - they only appear when ad content is available
- No placeholders or empty ad spaces when there's no ad content
- Ads are fetched via state variables: `adContent`, `sidebarAd`, `bannerAd`

### Ad State Variables
```javascript
const [adContent, setAdContent] = useState(null);    // In-content ad
const [sidebarAd, setSidebarAd] = useState(null);    // Sidebar ad
const [bannerAd, setBannerAd] = useState(null);      // Banner ad
```

## Integration Methods

### Method 1: Via API (Recommended)
Create an API endpoint to serve ad content:

```javascript
// pages/api/ads.js
export default async function handler(req, res) {
  const ads = {
    inContentAd: `
      <div style="padding: 20px; text-align: center;">
        <a href="https://example.com" target="_blank">
          <img src="/ads/banner-300x250.jpg" alt="Advertisement" />
        </a>
      </div>
    `,
    sidebarAd: `
      <div>
        <img src="/ads/sidebar-300x600.jpg" alt="Ad" style="width: 100%;" />
      </div>
    `,
    bannerAd: `
      <div style="padding: 20px;">
        <img src="/ads/banner-728x90.jpg" alt="Ad" style="max-width: 100%;" />
      </div>
    `
  };
  
  res.status(200).json(ads);
}
```

Then update the useEffect in `[slug].js`:
```javascript
// Fetch ads from API
fetch('/api/ads')
  .then(res => res.json())
  .then(data => {
    setAdContent(data.inContentAd);
    setSidebarAd(data.sidebarAd);
    setBannerAd(data.bannerAd);
  })
  .catch(err => console.error('Error fetching ads:', err));
```

### Method 2: Google AdSense
```javascript
const adsenseCode = `
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
       data-ad-slot="XXXXXXXXXX"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
`;

setAdContent(adsenseCode);
```

### Method 3: Direct HTML/Script
```javascript
useEffect(() => {
  // Set ads directly
  setAdContent(`
    <div style="background: #f0f0f0; padding: 20px; text-align: center;">
      <p>Your Ad Content Here</p>
    </div>
  `);
}, []);
```

## Ad Placement Logic

### In-Content Ad
- Inserted after the **3rd paragraph** of post content
- Falls back to middle position if post has less than 6 paragraphs
- Wrapped in `.in-content-ad` class for styling

### Sidebar Ad
- Sticky positioned (stays visible while scrolling)
- Only visible on post pages
- Takes full width of right panel (20% of screen)

### Banner Ad
- Displayed at bottom of post (after related posts)
- Full-width responsive
- Good for 728x90 or larger banner ads

## Styling

### In-Content Ad Styling
```css
.in-content-ad {
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e2e8f0;
}
```

### Best Practices
1. **Responsive**: Ensure ad images/scripts are responsive
2. **Loading**: Consider lazy loading for better performance
3. **Privacy**: Include privacy policy if using third-party ads
4. **User Experience**: Don't overwhelm with too many ads

## Testing

### Test with Dummy Content
```javascript
// In useEffect
setAdContent(`
  <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;">
    <h4>Test Ad Content</h4>
    <p>This is a test advertisement</p>
  </div>
`);
```

### Verify Placement
1. Load a blog post
2. Check console for any errors
3. Verify ad appears in correct position
4. Test on different screen sizes

## Future Enhancements
- [ ] A/B testing for ad positions
- [ ] Ad rotation/refresh
- [ ] Analytics integration
- [ ] Ad blocker detection
- [ ] Dynamic ad placement based on content length

## Troubleshooting

### Ad Not Showing
1. Check if state variable is set: `console.log(adContent)`
2. Verify HTML is valid
3. Check for AdBlocker interference
4. Inspect console for errors

### Ad Positioning Issues
- Adjust `insertPosition` in `insertAdIntoContent` function
- Modify CSS for `.in-content-ad` class
- Test with different content lengths

## Support
For issues or questions, check the main README or open an issue on GitHub.