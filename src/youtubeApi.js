const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

const demoVideos = [
  { id: 'jNQXAC9IVRw', title: 'Me at the zoo', channel: 'jawed', category: 'Music', views: 2400000, age: '2 days ago', duration: '0:19', thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg' },
  { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', channel: 'Rick Astley', category: 'Live', views: 892000, age: '5 hours ago', duration: '3:33', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: 'M7lc1UVf-VE', title: 'YouTube Player Demo', channel: 'YouTube Developers', category: 'Recently uploaded', views: 1300000, age: '1 week ago', duration: '1:05', thumbnail: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg' },
  { id: 'aqz-KE-bpKQ', title: 'Big Buck Bunny 60fps 4K', channel: 'Blender Foundation', category: 'Mixes', views: 6400000, age: 'Streaming now', duration: '10:34', thumbnail: 'https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg' },
  { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', channel: 'Luis Fonsi', category: 'News', views: 2100000, age: '3 days ago', duration: '4:42', thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg' },
  { id: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE', channel: 'officialpsy', category: 'Cooking', views: 570000, age: '4 days ago', duration: '4:13', thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg' },
  { id: '3JZ_D3ELwOQ', title: 'Mark Ronson - Uptown Funk', channel: 'Mark Ronson', category: 'Gaming', views: 980000, age: '6 days ago', duration: '4:31', thumbnail: 'https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg' },
  { id: 'L_jWHffIx5E', title: 'Smash Mouth - All Star', channel: 'Smash Mouth', category: 'Music', views: 3500000, age: '2 weeks ago', duration: '3:21', thumbnail: 'https://i.ytimg.com/vi/L_jWHffIx5E/hqdefault.jpg' },
];

export const isDemoMode = !process.env.REACT_APP_YOUTUBE_API_KEY;

function parseDuration(value) {
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 'VIDEO';
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export async function fetchVideos(search = 'creative culture') {
  const key = process.env.REACT_APP_YOUTUBE_API_KEY;
  if (!key) return demoVideos;

  try {
    const searchParams = new URLSearchParams({ part: 'snippet', maxResults: '24', q: search, type: 'video', key });
    const searchResponse = await fetch(`${SEARCH_URL}?${searchParams}`);
    if (!searchResponse.ok) throw new Error('YouTube search request failed');
    const searchData = await searchResponse.json();
    const ids = searchData.items.map((item) => item.id.videoId).join(',');
    if (!ids) return [];

    const detailsParams = new URLSearchParams({ part: 'snippet,contentDetails,statistics', id: ids, key });
    const detailsResponse = await fetch(`${VIDEOS_URL}?${detailsParams}`);
    if (!detailsResponse.ok) throw new Error('YouTube video details request failed');
    const detailsData = await detailsResponse.json();
    return detailsData.items.map((item) => ({
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      category: 'All',
      views: Number(item.statistics?.viewCount || 0),
      age: new Date(item.snippet.publishedAt).toLocaleDateString(),
      duration: parseDuration(item.contentDetails?.duration || ''),
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
    }));
  } catch (error) {
    return demoVideos;
  }
}