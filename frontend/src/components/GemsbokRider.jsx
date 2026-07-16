import { useEffect, useRef, useState } from 'react';
import './GemsbokRider.css';

const GemsbokRider = () => {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const savedHigh = localStorage.getItem('gemsbokHighScore');
        if (savedHigh) setHighScore(parseInt(savedHigh));
    }, []);

    useEffect(() => {
        if (!isPlaying && !gameOver) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Game State
        const state = {
            frames: 0,
            score: 0,
            speed: 5,
            obstacles: [],
            particles: [],
            groundY: canvas.height - 30,
            player: {
                x: 50,
                y: canvas.height - 30 - 40,
                width: 40,
                height: 40,
                dy: 0,
                jumpForce: -12,
                gravity: 0.6,
                grounded: true,
                charging: false,
                chargeTimer: 0
            }
        };

        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (state.player.grounded) {
                    state.player.dy = state.player.jumpForce;
                    state.player.grounded = false;
                } else if (gameOver) {
                    resetGame();
                }
            } else if (e.code === 'KeyZ' || e.code === 'Enter') {
                e.preventDefault();
                if (!state.player.charging && state.player.chargeTimer === 0) {
                    state.player.charging = true;
                    state.player.chargeTimer = 20; // Charge lasts for 20 frames
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        const spawnObstacle = () => {
            // Types: 0 = rock (must jump), 1 = bug/box (can be destroyed with charge)
            const type = Math.random() > 0.5 ? 1 : 0;
            state.obstacles.push({
                x: canvas.width,
                y: state.groundY - (type === 0 ? 30 : 40),
                width: type === 0 ? 30 : 40,
                height: type === 0 ? 30 : 40,
                type: type
            });
        };

        const createParticles = (x, y, color) => {
            for (let i = 0; i < 15; i++) {
                state.particles.push({
                    x: x + 20,
                    y: y + 20,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 1.0,
                    color: color
                });
            }
        };

        const resetGame = () => {
            state.frames = 0;
            state.score = 0;
            state.speed = 5;
            state.obstacles = [];
            state.particles = [];
            setScore(0);
            setGameOver(false);
            setIsPlaying(true);
        };

        const update = () => {
            if (gameOver) return;

            state.frames++;
            state.score++;
            
            if (state.frames % 10 === 0) {
                setScore(Math.floor(state.score / 10));
            }

            // Increase speed slowly
            if (state.frames % 500 === 0) state.speed += 0.5;

            // Player Physics
            state.player.y += state.player.dy;
            if (state.player.y + state.player.height < state.groundY) {
                state.player.dy += state.player.gravity;
                state.player.grounded = false;
            } else {
                state.player.dy = 0;
                state.player.grounded = true;
                state.player.y = state.groundY - state.player.height;
            }

            // Charging Logic
            if (state.player.charging) {
                state.player.chargeTimer--;
                if (state.player.chargeTimer <= 0) {
                    state.player.charging = false;
                    state.player.chargeTimer = -30; // Cooldown
                }
            } else if (state.player.chargeTimer < 0) {
                state.player.chargeTimer++;
            }

            // Spawn Obstacles
            if (state.frames % (Math.max(60, 150 - Math.floor(state.speed * 5))) === 0) {
                spawnObstacle();
            }

            // Update Obstacles
            for (let i = state.obstacles.length - 1; i >= 0; i--) {
                let obs = state.obstacles[i];
                obs.x -= state.speed;

                // Collision Detection
                if (
                    state.player.x < obs.x + obs.width &&
                    state.player.x + state.player.width > obs.x &&
                    state.player.y < obs.y + obs.height &&
                    state.player.y + state.player.height > obs.y
                ) {
                    // Collision!
                    if (state.player.charging && obs.type === 1) {
                        // Destroy breakable!
                        createParticles(obs.x, obs.y, '#e74c3c');
                        state.obstacles.splice(i, 1);
                        state.score += 100; // Bonus score
                    } else {
                        // Game Over
                        setGameOver(true);
                        setIsPlaying(false);
                        const finalScore = Math.floor(state.score / 10);
                        if (finalScore > highScore) {
                            setHighScore(finalScore);
                            localStorage.setItem('gemsbokHighScore', finalScore.toString());
                        }
                    }
                }

                // Remove off-screen obstacles
                if (obs && obs.x + obs.width < 0) {
                    state.obstacles.splice(i, 1);
                }
            }

            // Update Particles
            for (let i = state.particles.length - 1; i >= 0; i--) {
                let p = state.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.05;
                if (p.life <= 0) state.particles.splice(i, 1);
            }
        };

        const draw = () => {
            // Clear canvas
            ctx.fillStyle = '#111'; // Dark background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Ground
            ctx.fillStyle = '#333';
            ctx.fillRect(0, state.groundY, canvas.width, canvas.height - state.groundY);

            // Draw Particles
            state.particles.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.fillRect(p.x, p.y, 4, 4);
                ctx.globalAlpha = 1.0;
            });

            // Draw Obstacles
            state.obstacles.forEach(obs => {
                if (obs.type === 0) {
                    ctx.fillStyle = '#7f8c8d'; // Rock (gray)
                    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                } else {
                    ctx.fillStyle = '#e74c3c'; // Breakable (red bug)
                    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                }
            });

            // Draw Player (Gemsbok & Rider)
            const p = state.player;
            ctx.save();
            ctx.translate(p.x, p.y);

            // Gemsbok Body
            ctx.fillStyle = '#d35400';
            ctx.fillRect(0, 15, p.width, p.height - 15);

            // Gemsbok Horns (Attack animation)
            ctx.strokeStyle = '#ecf0f1';
            ctx.lineWidth = 3;
            ctx.beginPath();
            if (p.charging) {
                // Horns pointing forward
                ctx.moveTo(p.width, 15);
                ctx.lineTo(p.width + 20, 20);
                ctx.stroke();
            } else {
                // Horns pointing up
                ctx.moveTo(p.width - 5, 15);
                ctx.lineTo(p.width, -5);
                ctx.stroke();
            }

            // Rider
            ctx.fillStyle = '#3498db';
            ctx.fillRect(5, 0, 15, 15); // Rider Body

            // Run Animation (bouncing)
            if (p.grounded && !gameOver) {
                const bounce = Math.sin(state.frames * 0.5) * 3;
                ctx.translate(0, bounce);
            }

            ctx.restore();

            // Draw Game Over Overlay
            if (gameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#fff';
                ctx.font = '20px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 10);
                ctx.font = '14px sans-serif';
                ctx.fillText('Press SPACE to Restart', canvas.width / 2, canvas.height / 2 + 20);
            }
        };

        const loop = () => {
            update();
            draw();
            animationFrameId = requestAnimationFrame(loop);
        };

        if (isPlaying || gameOver) {
            loop();
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, gameOver, highScore]);

    return (
        <div className="gemsbok-game-container">
            <div className="game-header">
                <div className="game-controls">
                    <span className="key-hint">SPACE to Jump</span>
                    <span className="key-hint">Z to Charge</span>
                </div>
                <div className="game-score">
                    <span>HI: {highScore.toString().padStart(5, '0')}</span>
                    <span>{score.toString().padStart(5, '0')}</span>
                </div>
            </div>
            <div className="canvas-wrapper">
                {!isPlaying && !gameOver && (
                    <div className="start-overlay" onClick={() => setIsPlaying(true)}>
                        <h3>Gemsbok Rider</h3>
                        <p>Click to Start</p>
                    </div>
                )}
                <canvas 
                    ref={canvasRef} 
                    width={400} 
                    height={150} 
                    className="game-canvas"
                />
            </div>
        </div>
    );
};

export default GemsbokRider;
