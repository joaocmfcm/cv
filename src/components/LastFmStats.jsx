import React, { useState, useEffect } from 'react';
import fetchJsonp from 'fetch-jsonp';
import { Music, User, Disc, CalendarDays, ExternalLink, Headphones } from 'lucide-react';

const API_KEY = '22352886c44c422eb3f90bc78cc6d996';
const USERNAME = 'tw1sted1989';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

const PERIODS = [
  { value: '3month', label: 'Last 90 Days' },
  { value: '12month', label: 'Last Year' },
  { value: 'overall', label: 'All Time' }
];

const LastFmStats = () => {
  const [period, setPeriod] = useState('3month');
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);

  // Fetch Tracks and Artists based on period
  useEffect(() => {
    const fetchPeriodData = async () => {
      setLoading(true);
      try {
        const [tracksRes, artistsRes] = await Promise.all([
          fetch(`${BASE_URL}?method=user.gettoptracks&user=${USERNAME}&api_key=${API_KEY}&format=json&period=${period}&limit=10`),
          fetch(`${BASE_URL}?method=user.gettopartists&user=${USERNAME}&api_key=${API_KEY}&format=json&period=${period}&limit=10`)
        ]);

        const tracksData = await tracksRes.json();
        const artistsData = await artistsRes.json();

        const lastFmArtists = artistsData.topartists?.artist || [];
        
        // Fetch higher quality artist pictures from Deezer API as Last.fm removed them
        const processedArtists = await Promise.all(lastFmArtists.map(async (artist) => {
          let deezerImageUrl = null;
          try {
            // Using Deezer API via JSONP to avoid CORS issues
            const deezerRes = await fetchJsonp(`https://api.deezer.com/search/artist?q=${encodeURIComponent(artist.name)}&output=jsonp`);
            const deezerData = await deezerRes.json();
            if (deezerData.data && deezerData.data.length > 0) {
              deezerImageUrl = deezerData.data[0].picture_medium;
            }
          } catch (err) {
            console.error("Error fetching Deezer artist image:", err);
          }

          const defaultStarUrl = '2a96cbd8b46e442fc41c2b86b821562f';
          const lastfmImageUrl = artist.image && artist.image[3] ? artist.image[3]['#text'] : '';
          
          return {
            ...artist,
            coverUrl: deezerImageUrl || (lastfmImageUrl && !lastfmImageUrl.includes(defaultStarUrl) ? lastfmImageUrl : null),
            initials: artist.name ? artist.name.substring(0, 2).toUpperCase() : '?'
          };
        }));

        setTopTracks(tracksData.toptracks?.track || []);
        setTopArtists(processedArtists);
      } catch (error) {
        console.error("Error fetching Last.fm period data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodData();
  }, [period]);

  // Fetch Overall Albums just once
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const albumsRes = await fetch(`${BASE_URL}?method=user.gettopalbums&user=${USERNAME}&api_key=${API_KEY}&format=json&period=overall&limit=10`);
        const albumsData = await albumsRes.json();

        // Filter out albums missing images (the default star image is 2a96cbd8b46e442fc41c2b86b821562f.png but albums usually have real covers)
        const albums = albumsData.topalbums?.album?.map(album => {
          const defaultStarUrl = '2a96cbd8b46e442fc41c2b86b821562f';
          const imageUrl = album.image[3]['#text']; // extralarge size
          return {
            ...album,
            coverUrl: imageUrl.includes(defaultStarUrl) ? null : imageUrl
          };
        }) || [];

        setTopAlbums(albums);
      } catch (error) {
        console.error("Error fetching Last.fm albums:", error);
      } finally {
        setLoadingAlbums(false);
      }
    };

    fetchAlbums();
  }, []);

  const TabButton = ({ active, label, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${active
        ? 'bg-primary text-surface shadow-md'
        : 'bg-surface text-secondary hover:text-primary hover:bg-surface/80 border border-border/40'
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full flex flex-col gap-8 mt-24 mb-8 section-reveal">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-semibold tracking-tight text-primary flex items-center gap-3">
          On Repeat
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          My most played tracks, artists and albums.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Period Selector */}
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <TabButton
              key={p.value}
              active={period === p.value}
              label={p.label}
              onClick={() => setPeriod(p.value)}
            />
          ))}
        </div>

        {/* Top Tracks (2 columns) */}
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold text-secondary flex items-center gap-2">
            <Music size={18} /> Top Tracks
          </h4>
          <div className="bg-surface border border-border/40 rounded-2xl p-2 shadow-apple overflow-hidden">
            {loading ? (
              <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-12 bg-background/50 rounded-xl w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                {topTracks.map((track, i) => (
                  <a
                    key={`${track.name}-${i}`}
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-background/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="text-secondary/50 font-mono text-sm w-4 text-right">
                        {i + 1}
                      </span>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium text-primary truncate group-hover:text-blue-500 transition-colors">
                          {track.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-secondary truncate">
                            {track.artist.name}
                          </span>
                          <span className="text-xs text-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            • {track.playcount} plays
                          </span>
                        </div>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-secondary/30 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Artists - Grid Layout */}
      <div className="mt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h4 className="text-xl font-semibold text-secondary flex items-center gap-2">
            <User size={20} /> Top Artists
          </h4>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 animate-pulse">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-full aspect-square rounded-full bg-surface" />
                <div className="h-4 bg-surface w-3/4 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {topArtists.map((artist, i) => (
              <a
                key={`${artist.mbid || artist.name}-${i}`}
                href={artist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center text-center p-2 sm:p-4 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-md text-primary text-xs font-mono w-6 h-6 flex items-center justify-center rounded-full border border-border/40 shadow-sm z-10 transition-transform group-hover:scale-110">
                  {i + 1}
                </div>
                <div className="relative w-full aspect-square mb-4 bg-surface rounded-full overflow-hidden border border-border/40 shadow-apple group-hover:shadow-apple-hover transition-all">
                  {artist.coverUrl ? (
                    <img
                      src={artist.coverUrl}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-background/50 text-secondary/40 text-4xl font-semibold uppercase">
                      {artist.initials}
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-primary line-clamp-1 w-full leading-tight mb-1 group-hover:text-blue-500 transition-colors" title={artist.name}>
                  {artist.name}
                </h4>
                <p className="text-xs text-secondary font-medium mt-1">
                  {artist.playcount} plays
                </p>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Heavy Rotation Albums - All Time ONLY */}
      <div className="mt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h4 className="text-xl font-semibold text-secondary flex items-center gap-2">
            <Disc size={20} /> All-Time Heavy Rotation
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">My top 10 most played albums of all time.</p>
        </div>

        {loadingAlbums ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 animate-pulse">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl aspect-square w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {topAlbums.map((album, i) => (
              <a
                key={`${album.mbid || album.name}-${i}`}
                href={album.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-surface border border-border/40 rounded-2xl p-4 shadow-apple hover:shadow-apple-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative w-full aspect-square mb-4 bg-background/50 rounded-xl overflow-hidden">
                  {album.coverUrl ? (
                    <img
                      src={album.coverUrl}
                      alt={album.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <Disc size={32} className="text-secondary/30 object-cover" />
                    </div>
                  )}
                  {/* Rank badge */}
                  <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-md text-primary text-xs font-mono px-2 py-1 rounded border border-border/20 shadow-sm">
                    #{i + 1}
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h4 className="font-semibold text-primary line-clamp-1 leading-tight mb-1 group-hover:text-blue-500 transition-colors" title={album.name}>
                    {album.name}
                  </h4>
                  <p className="text-sm text-secondary line-clamp-1 mt-auto" title={album.artist.name}>
                    {album.artist.name}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LastFmStats;
