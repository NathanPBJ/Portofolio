import { useEffect, useState } from 'react';
import { SlSocialSpotify } from 'react-icons/sl';
import './SpotifyWidget.css';

const SpotifyWidget = () => {
    const [songData, setSongData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const playedAt = new Date(dateString);
        const diffMs = now - playedAt;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs} hr ago`;
        return `${Math.floor(diffHrs / 24)} days ago`;
    };

    useEffect(() => {
        const fetchSpotify = async () => {
            try {
                const response = await fetch('/api/spotify');
                const data = await response.json();
                
                if (data.is_playing || data.recently_played) {
                    setSongData({
                        title: data.item.name,
                        artist: data.item.artists.map(a => a.name).join(', '),
                        albumArt: data.item.album.images[0]?.url,
                        url: data.item.external_urls.spotify,
                        isPlaying: data.is_playing,
                        timeAgo: data.recently_played ? getTimeAgo(data.played_at) : null
                    });
                } else {
                    setSongData(null);
                }
            } catch (error) {
                console.error("Failed to fetch Spotify status", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpotify();
        const interval = setInterval(fetchSpotify, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="spotify-widget skeleton-loading">Loading Spotify...</div>;
    }

    if (!songData) {
        return (
            <div className="spotify-widget not-playing">
                <div className="spotify-icon">
                    <SlSocialSpotify style={{ color: 'var(--color-text-secondary)', fontSize: '2rem', strokeWidth: '1' }} />
                </div>
                <div className="spotify-info">
                    <p className="spotify-label">Spotify</p>
                    <h4 className="song-title">Not currently playing</h4>
                </div>
            </div>
        );
    }

    return (
        <a href={songData.url} target="_blank" rel="noopener noreferrer" className={`spotify-widget ${songData.isPlaying ? 'is-playing' : 'recently-played'}`}>
            <div className="album-art-container">
                <img src={songData.albumArt} alt="Album Art" className={`album-art ${!songData.isPlaying ? 'grayscale' : ''}`} />
                {songData.isPlaying && (
                    <div className="playing-bars">
                        <span className="bar bar1"></span>
                        <span className="bar bar2"></span>
                        <span className="bar bar3"></span>
                    </div>
                )}
            </div>
            <div className="spotify-info">
                <p className="spotify-label" style={{ color: songData.isPlaying ? '#1DB954' : 'var(--color-text-secondary)' }}>
                    <SlSocialSpotify style={{ color: songData.isPlaying ? '#1DB954' : 'var(--color-text-secondary)', marginRight: '5px', verticalAlign: 'middle', fontSize: '0.9em' }} />
                    {songData.isPlaying ? 'Currently Playing' : `Played ${songData.timeAgo}`}
                </p>
                <h4 className="song-title" style={{ color: songData.isPlaying ? 'inherit' : 'var(--color-text-secondary)' }}>{songData.title}</h4>
                <p className="song-artist">{songData.artist}</p>
            </div>
        </a>
    );
};

export default SpotifyWidget;
