import { useEffect, useRef, useState } from 'react';
import './RhinoRun.css';

const RhinoRun = () => {
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
            // ── Background (Dark theme for portfolio) ──
            ctx.fillStyle = '#1e1e1e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // ── Ground Line ──
            ctx.strokeStyle = '#eeeeee';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, state.groundY);
            ctx.lineTo(canvas.width, state.groundY);
            ctx.stroke();

            // Ground Specks (moving)
            ctx.fillStyle = '#eeeeee';
            for(let i=0; i<25; i++) {
                let gx = (i * 24 - (state.frames * state.speed)) % 600;
                if (gx < -20) gx += 600;
                if (gx < canvas.width && i % 2 === 0) {
                    ctx.fillRect(gx, state.groundY + 4 + (i%5)*3, 2, 2);
                }
            }

            // ── Particles ──
            state.particles.forEach(par => {
                ctx.fillStyle = '#eeeeee'; // All particles are white
                ctx.globalAlpha = Math.max(0, par.life);
                ctx.fillRect(par.x, par.y, 4, 4);
                ctx.globalAlpha = 1.0;
            });

            // ── Obstacles ──
            ctx.fillStyle = '#eeeeee';
            state.obstacles.forEach(obs => {
                if (obs.type === 0) {
                    // Rock / Cactus
                    ctx.beginPath();
                    ctx.moveTo(obs.x + obs.width/2, obs.y);
                    ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
                    ctx.lineTo(obs.x, obs.y + obs.height);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // Breakable block
                    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                    // Draw a dark X to show it's breakable
                    ctx.strokeStyle = '#1e1e1e';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(obs.x, obs.y);
                    ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
                    ctx.moveTo(obs.x + obs.width, obs.y);
                    ctx.lineTo(obs.x, obs.y + obs.height);
                    ctx.stroke();
                }
            });

            // ── Rhino ──
            const p = state.player;
            const isCharging = p.charging;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            
            // Animation for galloping legs
            const runOffset = (p.grounded && !gameOver) ? Math.sin(state.frames * 0.4) * 4 : 0;
            
            ctx.fillStyle = '#eeeeee';

            // Rhino Body
            ctx.beginPath();
            ctx.ellipse(15, 10, 16, 10, 0, 0, Math.PI * 2); // Main Torso
            ctx.fill();

            // Head (Lowered slightly)
            ctx.beginPath();
            ctx.ellipse(32, 12, 9, 7, 0.2, 0, Math.PI * 2);
            ctx.fill();

            // Neck connecting body and head
            ctx.beginPath();
            ctx.moveTo(25, 4);
            ctx.lineTo(35, 7);
            ctx.lineTo(28, 17);
            ctx.lineTo(15, 15);
            ctx.fill();

            // Eye (dark hole)
            ctx.fillStyle = '#1e1e1e';
            ctx.beginPath();
            ctx.arc(34, 10, 1.5, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#eeeeee';

            // Horns
            if (isCharging) {
                // Pointing forward
                ctx.beginPath();
                ctx.moveTo(38, 14);
                ctx.lineTo(48, 14); // Primary horn
                ctx.lineTo(36, 10);
                ctx.fill();
            } else {
                // Pointing Up/forward
                ctx.beginPath();
                ctx.moveTo(38, 14);
                ctx.lineTo(43, 2); // Primary horn
                ctx.lineTo(36, 10);
                ctx.fill();
                
                // Secondary smaller horn
                ctx.beginPath();
                ctx.moveTo(32, 8);
                ctx.lineTo(34, 3);
                ctx.lineTo(30, 6);
                ctx.fill();
            }

            // Legs (Thick and stocky)
            // Back Leg 1
            ctx.fillRect(4 + runOffset/2, 15, 6, 12 + runOffset);
            // Front Leg 1
            ctx.fillRect(20 - runOffset/2, 15, 6, 12 - runOffset);

            // Small tail
            ctx.beginPath();
            ctx.moveTo(1, 8);
            ctx.lineTo(-4, 12);
            ctx.lineTo(-2, 14);
            ctx.fill();

            ctx.restore();

            // ── GAME OVER OVERLAY ──
            if (gameOver) {
                ctx.fillStyle = 'rgba(30, 30, 30, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#eeeeee';
                ctx.font = 'bold 20px "Inter", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 10);
                ctx.font = '14px "Inter", sans-serif';
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
        <div className="rhino-game-container">
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
                        <h3>Rhino Run</h3>
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

export default RhinoRun;
