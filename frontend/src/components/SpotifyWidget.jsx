import { useEffect, useState } from 'react';
import { SiSpotify } from 'react-icons/si';
import './SpotifyWidget.css';

const SpotifyWidget = () => {
    const [songData, setSongData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpotify = async () => {
            try {
                const response = await fetch('/api/spotify');
                const data = await response.json();
                
                if (data.is_playing) {
                    setSongData({
                        title: data.item.name,
                        artist: data.item.artists.map(a => a.name).join(', '),
                        albumArt: data.item.album.images[0]?.url,
                        url: data.item.external_urls.spotify
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
                    <SiSpotify style={{ color: '#1DB954', fontSize: '2rem' }} />
                </div>
                <div className="spotify-info">
                    <p className="spotify-label">Spotify</p>
                    <h4 className="song-title">Not currently playing</h4>
                </div>
            </div>
        );
    }

    return (
        <a href={songData.url} target="_blank" rel="noopener noreferrer" className="spotify-widget is-playing">
            <div className="album-art-container">
                <img src={songData.albumArt} alt="Album Art" className="album-art" />
                <div className="playing-bars">
                    <span className="bar bar1"></span>
                    <span className="bar bar2"></span>
                    <span className="bar bar3"></span>
                </div>
            </div>
            <div className="spotify-info">
                <p className="spotify-label">
                    <SiSpotify style={{ color: '#1DB954', marginRight: '5px', verticalAlign: 'middle', fontSize: '0.9em' }} />
                    Currently Playing
                </p>
                <h4 className="song-title">{songData.title}</h4>
                <p className="song-artist">{songData.artist}</p>
            </div>
        </a>
    );
};

export default SpotifyWidget;
