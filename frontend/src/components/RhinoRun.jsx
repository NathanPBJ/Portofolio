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
            ctx.scale(1.5, 1.5);
            
            // Animation for galloping legs (smooth swinging)
            const runA = (p.grounded && !gameOver) ? Math.sin(state.frames * 0.4) : 0;
            const runB = (p.grounded && !gameOver) ? Math.cos(state.frames * 0.4) : 0;
            
            ctx.fillStyle = '#eeeeee';

            const drawLeg = (ox, oy, angle) => {
                ctx.save();
                ctx.translate(ox, oy);
                ctx.rotate(angle);
                // Leg is drawn downwards from the pivot point
                ctx.beginPath();
                ctx.moveTo(-3, -2); // Start inside body to prevent gaps
                ctx.lineTo(3, -2);
                ctx.lineTo(2, 12); // Foot
                ctx.lineTo(-2.5, 12); // Foot
                ctx.closePath();
                ctx.fill();
                // Little toe bump
                ctx.fillRect(1.5, 10.5, 1.5, 1.5);
                ctx.restore();
            };

            // Draw Legs first (far side)
            drawLeg(7, 15, runB * 0.4); // Back far leg
            drawLeg(21, 15, -runA * 0.4); // Front far leg

            // Main Rhino Body (Organic curved silhouette)
            ctx.beginPath();
            ctx.moveTo(3, 14); 
            ctx.bezierCurveTo(2, 6, 8, 3, 15, 4); // Rear hump
            ctx.bezierCurveTo(22, 5, 26, 7, 28, 9); // Back sloping down to neck
            ctx.bezierCurveTo(32, 9, 36, 11, 35, 15); // Head and snout
            ctx.bezierCurveTo(33, 18, 25, 18, 20, 16); // Lower jaw and chest
            ctx.bezierCurveTo(15, 18, 8, 17, 3, 14); // Belly
            ctx.fill();

            // Ear
            ctx.beginPath();
            ctx.moveTo(27, 9);
            ctx.lineTo(25, 4);
            ctx.lineTo(29, 8);
            ctx.fill();

            // Horns
            if (isCharging) {
                // Pointing forward (leveling horn for charge)
                ctx.beginPath();
                ctx.moveTo(34, 13);
                ctx.lineTo(44, 13); // Primary horn
                ctx.lineTo(33, 11);
                ctx.fill();
            } else {
                // Natural sweeping horn curve
                ctx.beginPath();
                ctx.moveTo(34, 12);
                ctx.quadraticCurveTo(36, 6, 39, 2); // Primary horn curve
                ctx.quadraticCurveTo(37, 8, 33, 10);
                ctx.fill();
                
                // Secondary smaller horn
                ctx.beginPath();
                ctx.moveTo(31, 10);
                ctx.lineTo(32, 5);
                ctx.lineTo(29, 9);
                ctx.fill();
            }

            // Eye (dark hole)
            ctx.fillStyle = '#1e1e1e';
            ctx.beginPath();
            ctx.arc(31, 11, 1.2, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#eeeeee';

            // Near Legs (drawn over body)
            drawLeg(7, 15, runA * 0.4); // Back near leg
            drawLeg(21, 15, -runB * 0.4); // Front near leg

            // Small tail with tuft
            ctx.beginPath();
            ctx.moveTo(3, 8);
            ctx.quadraticCurveTo(-2, 10, -4, 14);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#eeeeee';
            ctx.stroke();

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
