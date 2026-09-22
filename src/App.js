import './App.css';
import { useEffect, useMemo, useState } from 'react';
import { fetchVideos, isDemoMode } from './youtubeApi';
import { ArrowLeft, Bell, Bookmark, Check, Clock3, Film, History, Home, ListVideo, LogIn, LogOut, Menu, Mic, MoreVertical, Music2, PlaySquare, Plus, Radio, Search, Share2, ThumbsUp, TrendingUp, UserCircle, Video } from 'lucide-react';

const categories = ['All', 'Music', 'Live', 'Mixes', 'News', 'Gaming', 'Cooking', 'Recently uploaded'];

const navItems = [
  ['Home', Home],
  ['Shorts', PlaySquare],
  ['Subscriptions', Bell],
];

const libraryItems = [
  ['History', History],
  ['Playlists', ListVideo],
  ['Your videos', Video],
  ['Watch later', Clock3],
  ['Liked videos', ThumbsUp],
];

function formatViews(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return String(value);
}

function VideoGrid({ videos, savedVideos, likedVideos, onOpen, onSave, onLike, showToast }) {
  if (!videos.length) return <div className="library-empty"><ListVideo size={38} /><h2>Nothing here yet</h2><p>Videos you interact with will appear in this section.</p></div>;
  return <div className="video-grid">{videos.map((video) => <article className="video-card" key={video.id}>
    <div className="thumbnail-wrap" onClick={() => onOpen(video)} role="button" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && onOpen(video)}><img src={video.thumbnail} alt={video.title} /><span className="duration">{video.duration}</span><button className={`watch-later ${savedVideos.includes(video.id) ? 'saved' : ''}`} aria-label={`Save ${video.title} for later`} onClick={(event) => { event.stopPropagation(); onSave(video); }}><Bookmark size={16} /></button></div>
    <div className="video-meta"><div className="channel-avatar">{video.channel.charAt(0)}</div><div><h3><button className="title-button" onClick={() => onOpen(video)}>{video.title}</button></h3><p>{video.channel} <span className="verified"><Check size={9} /></span></p><p>{formatViews(video.views)} views · {video.age}</p></div><button className="more-button" aria-label="Like video" onClick={() => { onLike(video); showToast(likedVideos.includes(video.id) ? 'Like removed' : 'Added to liked videos'); }}><ThumbsUp size={17} fill={likedVideos.includes(video.id) ? 'currentColor' : 'none'} /></button></div>
  </article>)}</div>;
}

function LibraryView({ section, videos, savedVideos, likedVideos, historyVideos, onOpen, onSave, onLike, showToast, onCreatePlaylist }) {
  const sections = {
    History: { title: 'History', subtitle: 'Videos you watched recently', items: historyVideos },
    Playlists: { title: 'Playlists', subtitle: 'Organize your favorite videos', items: [] },
    'Your videos': { title: 'Your videos', subtitle: 'Videos you have uploaded', items: [] },
    'Watch later': { title: 'Watch later', subtitle: `${savedVideos.length} videos saved for later`, items: videos.filter((video) => savedVideos.includes(video.id)) },
    'Liked videos': { title: 'Liked videos', subtitle: `${likedVideos.length} videos you liked`, items: videos.filter((video) => likedVideos.includes(video.id)) },
  };
  const current = sections[section] || sections.History;
  return <section className="library-view"><div className="library-header"><div><span className="eyebrow">Your library</span><h1>{current.title}</h1><p>{current.subtitle}</p></div>{section === 'Playlists' && <button className="primary-button" onClick={onCreatePlaylist}><Plus size={16} /> New playlist</button>}{section === 'Your videos' && <button className="primary-button" onClick={() => showToast('Upload tools are ready for your next API extension')}><Plus size={16} /> Upload video</button>}</div>{section === 'Playlists' ? <div className="playlist-empty"><ListVideo size={42} /><h2>Your playlists</h2><p>Create a playlist to save videos in one place.</p><button className="primary-button" onClick={onCreatePlaylist}>Create playlist</button></div> : <VideoGrid videos={current.items} savedVideos={savedVideos} likedVideos={likedVideos} onOpen={onOpen} onSave={onSave} onLike={onLike} showToast={showToast} />}</section>;
}

function WatchPage({ video, relatedVideos, onSelectVideo, onBack, onSave, onLike, likedVideos, savedVideos, showToast }) {
  const related = relatedVideos.filter((item) => item.id !== video.id).slice(0, 6);
  return (
    <div className="watch-page">
      <button className="back-button" onClick={onBack}><ArrowLeft size={16} /> Back to home</button>
      <div className="watch-layout">
        <section className="watch-main">
          <div className="player-frame">
            <iframe title={video.title} src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          </div>
          <h1 className="watch-title">{video.title}</h1>
          <div className="watch-subline">{formatViews(video.views)} views · {video.age} · Public</div>
          <div className="watch-actions">
            <span className="watch-channel"><span className="channel-avatar">{video.channel.charAt(0)}</span><strong>{video.channel}</strong></span>
            <button onClick={() => showToast('Subscribed to this channel')}>Subscribe</button>
            <button onClick={() => { onLike(video); showToast(likedVideos.includes(video.id) ? 'Like removed' : 'Added to liked videos'); }}><ThumbsUp size={15} fill={likedVideos.includes(video.id) ? 'currentColor' : 'none'} /> Like</button>
            <button onClick={() => showToast('Share link copied')}><Share2 size={15} /> Share</button>
            <button onClick={() => onSave(video)}>{savedVideos.includes(video.id) ? <><Check size={15} /> Saved</> : <><Bookmark size={15} /> Save</>}</button>
          </div>
          <div className="description-box"><strong>About this video</strong><p>Watch {video.title} from {video.channel}. Explore more videos, channels, and recommendations below.</p><button onClick={() => showToast('Description expanded')}>Show more</button></div>
          <section className="comments"><h2>Comments <span>24</span></h2><div className="comment-input"><div className="avatar">A</div><input placeholder="Add a comment..." onKeyDown={(event) => event.key === 'Enter' && showToast('Comment posted')} /></div><div className="comment"><div className="channel-avatar">J</div><div><strong>Jordan Lee</strong><p>This is exactly what I needed to watch today.</p></div></div></section>
        </section>
        <aside className="related-column"><h2>Related videos</h2>{related.map((item) => <button className="related-card" key={item.id} onClick={() => onSelectVideo(item)}><span className="related-thumb"><img src={item.thumbnail} alt="" /><span>{item.duration}</span></span><span className="related-copy"><strong>{item.title}</strong><small>{item.channel}</small><small>{formatViews(item.views)} views · {item.age}</small></span></button>)}</aside>
      </div>
    </div>
  );
}

function App() {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeNav, setActiveNav] = useState('Home');
  const [activeExplore, setActiveExplore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openPanel, setOpenPanel] = useState(null);
  const [savedVideos, setSavedVideos] = useState(() => JSON.parse(localStorage.getItem('savedVideos') || '[]'));
  const [likedVideos, setLikedVideos] = useState(() => JSON.parse(localStorage.getItem('likedVideos') || '[]'));
  const [historyIds, setHistoryIds] = useState(() => JSON.parse(localStorage.getItem('historyIds') || '[]'));
  const [librarySection, setLibrarySection] = useState(null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('demoUser') || 'null'));
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [moreFor, setMoreFor] = useState(null);
  const [toast, setToast] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  async function loadVideos(search = 'creative culture') {
    setLoading(true);
    const items = await fetchVideos(search);
    setVideos(items);
    setLoading(false);
  }

  function submitSearch(event) {
    event.preventDefault();
    setSearchSubmitted(true);
    setSelectedVideo(null);
    setLibrarySection(null);
    setActiveExplore(null);
    setActiveNav('Home');
    loadVideos(query.trim() || 'creative culture');
  }

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  }

  function toggleSaved(video) {
    const next = savedVideos.includes(video.id) ? savedVideos.filter((id) => id !== video.id) : [...savedVideos, video.id];
    setSavedVideos(next);
    localStorage.setItem('savedVideos', JSON.stringify(next));
    showToast(next.includes(video.id) ? 'Saved to Watch later' : 'Removed from Watch later');
  }

  function toggleLiked(video) {
    const next = likedVideos.includes(video.id) ? likedVideos.filter((id) => id !== video.id) : [...likedVideos, video.id];
    setLikedVideos(next);
    localStorage.setItem('likedVideos', JSON.stringify(next));
  }

  function openLibrary(section) {
    setLibrarySection(section);
    setSelectedVideo(null);
    setActiveNav('You');
    setOpenPanel(null);
  }

  function login(event) {
    event.preventDefault();
    const nextUser = { name: loginEmail.split('@')[0] || 'Alex', email: loginEmail || 'alex@example.com' };
    setUser(nextUser);
    localStorage.setItem('demoUser', JSON.stringify(nextUser));
    setLoginEmail('');
    setLoginPassword('');
    showToast('Signed in successfully');
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('demoUser');
    setOpenPanel(null);
    showToast('Signed out');
  }

  function handleNav(label) {
    setActiveNav(label);
    setOpenPanel(null);
    setSelectedVideo(null);
    setLibrarySection(null);
    setActiveExplore(null);
    setActiveCategory('All');
    setSearchSubmitted(false);
    if (label === 'Home') loadVideos('creative culture');
    if (label === 'Shorts') loadVideos('shorts vertical videos');
    if (label === 'Subscriptions' && !user) showToast('Sign in to sync your subscriptions');
    if (label === 'Subscriptions') loadVideos('latest videos from channels you follow');
  }

  function handleCategory(category) {
    setSelectedVideo(null);
    setActiveExplore(null);
    setActiveCategory(category);
    setActiveNav('Home');
    if (category !== 'All' && !isDemoMode) loadVideos(category);
  }

  function handleExplore(label) {
    setSelectedVideo(null);
    setLibrarySection(null);
    setActiveCategory('All');
    setActiveExplore(label);
    setActiveNav('Explore');
    const searches = { Trending: 'trending videos', Music: 'new music', 'Movies & TV': 'movies and tv', Live: 'live now' };
    if (!isDemoMode) loadVideos(searches[label]);
  }

  function openVideo(video) {
    setSelectedVideo(video);
    setMoreFor(null);
    const next = [video.id, ...historyIds.filter((id) => id !== video.id)].slice(0, 30);
    setHistoryIds(next);
    localStorage.setItem('historyIds', JSON.stringify(next));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    let mounted = true;
    fetchVideos().then((items) => {
      if (mounted) {
        setVideos(items);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const visibleVideos = useMemo(() => videos.filter((video) => {
    const matchesQuery = `${video.title} ${video.channel}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === 'All' || isDemoMode || video.category === activeCategory || video.category === 'All';
    return matchesQuery && matchesCategory;
  }), [activeCategory, query, videos]);

  const historyVideos = useMemo(() => historyIds.map((id) => videos.find((video) => video.id === id)).filter(Boolean), [historyIds, videos]);
  const feedVideos = activeNav === 'Shorts' ? visibleVideos.filter((video) => video.duration === 'LIVE' || (video.duration.split(':').length === 2 && Number(video.duration.split(':')[0]) < 2)).slice(0, 8) : visibleVideos;
  const feedTitle = activeExplore || (activeNav === 'Shorts' ? 'Shorts' : activeNav === 'Subscriptions' ? 'Latest from your subscriptions' : query ? `Results for “${query}”` : activeCategory === 'All' ? 'Recommended' : activeCategory);
  const exploreVideos = activeExplore === 'Music' ? visibleVideos.filter((video) => isDemoMode ? video.category === 'Music' : true) : activeExplore === 'Live' ? visibleVideos.filter((video) => isDemoMode ? video.category === 'Live' : true) : visibleVideos;
  const displayedVideos = activeExplore ? exploreVideos : feedVideos;

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-button menu-button" aria-label="Toggle menu" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={21} /></button>
        <button className="brand" aria-label="YouTube home" onClick={() => handleNav('Home')}>
          <span className="brand-mark"><PlaySquare size={19} /></span><span className="brand-word">YouTube</span>
        </button>
        <form className="search-bar" onSubmit={submitSearch}>
          <input aria-label="Search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
          <button aria-label="Search videos" type="submit"><Search size={20} /></button>
        </form>
        <button className="icon-button voice-button" aria-label="Search with your voice" onClick={() => showToast('Voice search is not available in this browser')}><Mic size={19} /></button>
        <div className="top-actions">
          <button className="icon-button" aria-label="Create" onClick={() => setOpenPanel(openPanel === 'create' ? null : 'create')}><Plus size={21} /></button>
          <button className="icon-button" aria-label="Notifications" onClick={() => setOpenPanel(openPanel === 'notifications' ? null : 'notifications')}><Bell size={19} /><span className="notification-dot">3</span></button>
          <button className="avatar" aria-label="Account" onClick={() => setOpenPanel(openPanel === 'account' ? null : 'account')}><UserCircle size={21} /></button>
        </div>
        {openPanel === 'account' && <div className="popover account-popover">{user ? <><strong>Signed in as {user.name}</strong><p>{user.email}</p><button className="popover-action" onClick={() => openLibrary('History')}><History size={14} /> Open your history</button><button className="popover-action" onClick={logout}><LogOut size={14} /> Sign out</button></> : <><strong>Sign in to YouTube Clone</strong><p>Sign in to keep your library on this device.</p><form onSubmit={login}><input type="email" required value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} placeholder="Email" /><input type="password" required value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} placeholder="Password" /><button className="popover-submit" type="submit"><LogIn size={14} /> Sign in</button></form></>}</div>}
        {openPanel === 'create' && <div className="popover"><strong>Create</strong><p>Upload videos and start a live stream from your creator tools.</p><button onClick={() => { setOpenPanel(null); showToast('Creator tools are ready for your next API extension'); }}>Got it</button></div>}
        {openPanel === 'notifications' && <div className="popover"><strong>Notifications</strong><p>You are all caught up.</p><button onClick={() => setOpenPanel(null)}>Got it</button></div>}
      </header>

      <div className="layout">
        <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <nav>
            {navItems.map(([label, Icon]) => (
              <button className={`nav-item ${activeNav === label ? 'selected' : ''}`} key={label} onClick={() => handleNav(label)}>
                <span className="nav-icon"><Icon size={19} /></span><span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-rule" />
          <p className="sidebar-heading">You</p>
          {libraryItems.map(([label, Icon]) => <button className={`nav-item ${librarySection === label ? 'selected' : ''}`} key={label} onClick={() => openLibrary(label)}><span className="nav-icon"><Icon size={19} /></span><span>{label}</span></button>)}
          <div className="sidebar-rule" />
          <p className="sidebar-heading">Explore</p>
          {['Trending', 'Music', 'Movies & TV', 'Live'].map((label, index) => { const Icon = [TrendingUp, Music2, Film, Radio][index]; return <button className={`nav-item ${activeExplore === label ? 'selected' : ''}`} key={label} onClick={() => { setQuery(''); handleExplore(label); }}><span className="nav-icon"><Icon size={19} /></span><span>{label}</span></button>; })}
          <p className="sidebar-footer">About &nbsp; Press &nbsp; Copyright<br />Contact us &nbsp; Creators<br /><br />Terms &nbsp; Privacy &nbsp; Policy & Safety<br /><br />© 2024 YouTube Clone</p>
        </aside>

        <main className="content">
          {selectedVideo ? <WatchPage video={selectedVideo} relatedVideos={videos} onSelectVideo={openVideo} onBack={() => setSelectedVideo(null)} onSave={toggleSaved} onLike={toggleLiked} likedVideos={likedVideos} savedVideos={savedVideos} showToast={showToast} /> : librarySection ? <LibraryView section={librarySection} videos={videos} savedVideos={savedVideos} likedVideos={likedVideos} historyVideos={historyVideos} onOpen={openVideo} onSave={toggleSaved} onLike={toggleLiked} showToast={showToast} onCreatePlaylist={() => showToast('Playlist created locally')} /> : <>
          <div className="category-row" aria-label="Video categories">
            {categories.map((category) => <button className={`category-chip ${activeCategory === category ? 'active' : ''}`} key={category} onClick={() => handleCategory(category)}>{category}</button>)}
          </div>
          <section className="hero-strip">
            <div><span className="eyebrow">{isDemoMode ? 'Demo feed' : 'Live from YouTube'}</span><h1>Good evening, Alex</h1><p>Pick up where you left off or find something new.</p></div>
            <div className="hero-stat"><strong>{videos.length || '—'}</strong><span>fresh picks<br />for you</span></div>
          </section>
          <div className="section-heading"><h2>{feedTitle}</h2><button className="refresh-button" onClick={() => activeExplore ? handleExplore(activeExplore) : handleNav(activeNav)}>Refresh ↻</button></div>
          {loading ? <div className="loading-state">Loading your feed...</div> : displayedVideos.length ? <div className="video-grid">{displayedVideos.map((video) => <article className="video-card" key={video.id}>
            <div className="thumbnail-wrap" onClick={() => openVideo(video)} role="button" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && openVideo(video)}><img src={video.thumbnail} alt={video.title} /><span className="duration">{video.duration}</span><button className={`watch-later ${savedVideos.includes(video.id) ? 'saved' : ''}`} aria-label={`Save ${video.title} for later`} onClick={(event) => { event.stopPropagation(); toggleSaved(video); }}><Bookmark size={16} /></button></div>
            <div className="video-meta"><div className="channel-avatar">{video.channel.charAt(0)}</div><div><h3><button className="title-button" onClick={() => openVideo(video)}>{video.title}</button></h3><p>{video.channel} <span className="verified"><Check size={9} /></span></p><p>{formatViews(video.views)} views · {video.age}</p></div><button className="more-button" aria-label="More options" onClick={() => setMoreFor(moreFor === video.id ? null : video.id)}><MoreVertical size={19} /></button>{moreFor === video.id && <div className="video-menu"><button onClick={() => toggleSaved(video)}>{savedVideos.includes(video.id) ? 'Remove from Watch later' : 'Save to Watch later'}</button><button onClick={() => showToast('Not interested preference saved')}>Not interested</button></div>}</div>
          </article>)}</div> : <div className="empty-state"><span>⌕</span><h2>{searchSubmitted ? `No results for “${query}”` : 'No videos found'}</h2><p>{isDemoMode && searchSubmitted ? 'Add a YouTube API key to search the live catalog.' : 'Try a different search or category.'}</p></div>}
          </>}
        </main>
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

export default App;
