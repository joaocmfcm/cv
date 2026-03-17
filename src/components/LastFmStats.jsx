import React, { useState, useEffect } from 'react';
import fetchJsonp from 'fetch-jsonp';
import { Disc, ExternalLink } from 'lucide-react';

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

  return (
    <div className="w-full flex flex-col gap-8 mt-24 mb-8 section-reveal">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold tracking-tight text-primary">
            On Repeat
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            My most played tracks and artists.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex bg-surface p-1 rounded-full border border-border/40 shadow-sm w-fit">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${period === p.value
                ? 'bg-primary text-surface shadow-md border border-transparent'
                : 'bg-transparent text-secondary hover:text-primary'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8  rounded-3xl ">

        {/* Top Tracks */}
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold text-secondary">
            Top Tracks
          </h4>
          <div className="bg-surface border border-border/40 rounded-2xl p-2 shadow-apple overflow-hidden h-full flex flex-col justify-between">
            {loading ? (
              <div className="animate-pulse grid grid-cols-1 gap-2 p-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-12 bg-background/50 rounded-xl w-full" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col flex-1 justify-between">
                {topTracks.map((track, i) => (
                  <a
                    key={`${track.name}-${i}`}
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-background/80 transition-colors flex-1"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="text-secondary/50 font-mono text-sm w-4 text-right shrink-0">
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
                          <span className="text-[10px] text-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            • {track.playcount} plays
                          </span>
                        </div>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-secondary/30 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Artists */}
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold text-secondary">
            Top Artists
          </h4>
          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 h-full content-between">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center p-2 sm:p-3 bg-surface border border-border/40 rounded-2xl animate-pulse">
                  <div className="w-full aspect-square max-w-[70px] mb-2 bg-background/50 rounded-full" />
                  <div className="h-2 bg-background/50 w-2/3 rounded mb-1" />
                  <div className="h-[6px] bg-background/50 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 h-full content-between">
              {topArtists.map((artist, i) => (
                <a
                  key={`${artist.mbid || artist.name}-${i}`}
                  href={artist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col items-center text-center p-2 sm:p-3 hover:-translate-y-1 transition-all duration-300 bg-surface border border-border/40 rounded-2xl shadow-sm hover:shadow-apple-hover"
                >
                  <div className="absolute top-2 right-2 bg-background/90 text-primary text-[10px] font-mono w-5 h-5 flex items-center justify-center rounded-full border border-border/40 shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                    {i + 1}
                  </div>
                  <div className="relative w-full aspect-square max-w-[70px] mb-1.5 bg-background/50 rounded-full overflow-hidden border border-border/20 shadow-inner group-hover:shadow-sm transition-all">
                    {artist.coverUrl ? (
                      <img
                        src={artist.coverUrl}
                        alt={artist.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary/40 text-[10px] font-semibold uppercase">
                        {artist.initials}
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-primary text-[11px] md:text-xs line-clamp-1 w-full leading-tight mb-0.5 group-hover:text-blue-500 transition-colors" title={artist.name}>
                    {artist.name}
                  </h4>
                  <p className="text-[9px] text-secondary font-medium">
                    {artist.playcount} plays
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Heavy Rotation Albums - All Time ONLY */}
      <div className="mt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h4 className="text-xl font-semibold text-secondary">
            All-Time Heavy Rotation
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
