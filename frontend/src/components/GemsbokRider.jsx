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
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Subtle ground gradient
            const gGrad = ctx.createLinearGradient(0, state.groundY, 0, canvas.height);
            gGrad.addColorStop(0, '#3d2b1f');
            gGrad.addColorStop(1, '#1a0e08');
            ctx.fillStyle = gGrad;
            ctx.fillRect(0, state.groundY, canvas.width, canvas.height - state.groundY);

            // Ground edge line
            ctx.strokeStyle = '#c8a96e';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, state.groundY);
            ctx.lineTo(canvas.width, state.groundY);
            ctx.stroke();

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
                    // Rock — jagged polygon
                    ctx.fillStyle = '#8c9ea0';
                    ctx.beginPath();
                    ctx.moveTo(obs.x + 4, obs.y + obs.height);
                    ctx.lineTo(obs.x, obs.y + obs.height - 8);
                    ctx.lineTo(obs.x + 6, obs.y + 6);
                    ctx.lineTo(obs.x + obs.width * 0.4, obs.y);
                    ctx.lineTo(obs.x + obs.width - 4, obs.y + 4);
                    ctx.lineTo(obs.x + obs.width, obs.y + obs.height - 6);
                    ctx.lineTo(obs.x + obs.width - 3, obs.y + obs.height);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = '#b0bec5';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                } else {
                    // Breakable crate — red box with X
                    ctx.fillStyle = '#c0392b';
                    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                    ctx.strokeStyle = '#e74c3c';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(obs.x + 1, obs.y + 1, obs.width - 2, obs.height - 2);
                    ctx.strokeStyle = 'rgba(255,100,100,0.5)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(obs.x + 4, obs.y + 4);
                    ctx.lineTo(obs.x + obs.width - 4, obs.y + obs.height - 4);
                    ctx.moveTo(obs.x + obs.width - 4, obs.y + 4);
                    ctx.lineTo(obs.x + 4, obs.y + obs.height - 4);
                    ctx.stroke();
                }
            });

            // ─── Draw Gemsbok + Rider ───────────────────────────────────────
            const p = state.player;
            const isCharging = p.charging;
            const f = state.frames;

            ctx.save();
            ctx.translate(p.x, p.y);

            // ── Running leg animation ──────────────────────────────────────
            // 4 legs: front-pair and back-pair, alternating sine phase
            const legSwing = p.grounded && !gameOver ? Math.sin(f * 0.35) : 0;
            const LEG_THICKNESS = 3;
            const BODY_BOTTOM = p.height; // relative to translate origin

            const drawLeg = (ox, phase) => {
                const swing = legSwing * phase;
                const thighAngle = swing * 0.45; // radians
                const shinAngle  = swing * 0.35;

                // Thigh
                const tx1 = ox;
                const ty1 = BODY_BOTTOM - 4;
                const tx2 = tx1 + Math.sin(thighAngle) * 11;
                const ty2 = ty1 + Math.cos(thighAngle) * 11;
                ctx.strokeStyle = '#b5651d';
                ctx.lineWidth = LEG_THICKNESS;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(tx1, ty1);
                ctx.lineTo(tx2, ty2);
                ctx.stroke();

                // Shin
                const sx2 = tx2 + Math.sin(thighAngle + shinAngle) * 10;
                const sy2 = ty2 + Math.cos(thighAngle + shinAngle) * 10;
                ctx.strokeStyle = '#8b4513';
                ctx.beginPath();
                ctx.moveTo(tx2, ty2);
                ctx.lineTo(sx2, sy2);
                ctx.stroke();

                // Hoof dot
                ctx.fillStyle = '#3d1c02';
                ctx.beginPath();
                ctx.arc(sx2, sy2, 2.5, 0, Math.PI * 2);
                ctx.fill();
            };

            // Back legs (drawn first — behind body)
            drawLeg(10, 1);   // back-left
            drawLeg(6, -1);   // back-right

            // ── Gemsbok Body ───────────────────────────────────────────────
            // Main torso — rounded rectangle approximation
            const bodyX = 0, bodyY = 14, bodyW = p.width, bodyH = p.height - 14;
            ctx.fillStyle = '#c8813a';
            ctx.beginPath();
            ctx.moveTo(bodyX + 6, bodyY);
            ctx.lineTo(bodyX + bodyW - 4, bodyY);
            ctx.quadraticCurveTo(bodyX + bodyW, bodyY, bodyX + bodyW, bodyY + 4);
            ctx.lineTo(bodyX + bodyW, bodyY + bodyH - 4);
            ctx.quadraticCurveTo(bodyX + bodyW, bodyY + bodyH, bodyX + bodyW - 4, bodyY + bodyH);
            ctx.lineTo(bodyX + 4, bodyY + bodyH);
            ctx.quadraticCurveTo(bodyX, bodyY + bodyH, bodyX, bodyY + bodyH - 4);
            ctx.lineTo(bodyX, bodyY + 4);
            ctx.quadraticCurveTo(bodyX, bodyY, bodyX + 6, bodyY);
            ctx.closePath();
            ctx.fill();

            // Darker dorsal saddle stripe
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(4, bodyY, bodyW - 8, 6);

            // White facial/belly marking
            ctx.fillStyle = 'rgba(245,230,200,0.55)';
            ctx.fillRect(bodyX + 2, bodyY + bodyH - 10, bodyW - 4, 8);

            // Front legs (drawn after body — in front)
            drawLeg(p.width - 8, -1); // front-left
            drawLeg(p.width - 4, 1);  // front-right

            // ── Neck & Head ────────────────────────────────────────────────
            const chargeAngle = isCharging ? 0.25 : 0; // head lowers when charging
            ctx.save();
            // Neck pivot at front-top of body
            ctx.translate(p.width - 2, bodyY + 2);
            ctx.rotate(chargeAngle);

            // Neck
            ctx.fillStyle = '#c8813a';
            ctx.beginPath();
            ctx.moveTo(-3, 0);
            ctx.lineTo(3, 0);
            ctx.lineTo(5, -12);
            ctx.lineTo(-2, -12);
            ctx.closePath();
            ctx.fill();

            // Head (slightly flattened circle)
            const headCX = 2, headCY = -17;
            ctx.fillStyle = '#d4915a';
            ctx.beginPath();
            ctx.ellipse(headCX, headCY, 7, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Gemsbok face markings — black & white mask-like pattern
            // White blaze
            ctx.fillStyle = '#f0e6d3';
            ctx.fillRect(headCX - 2, headCY - 3, 4, 6);
            // Black eye stripe
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(headCX + 1, headCY - 4, 5, 3);
            ctx.fillRect(headCX - 6, headCY - 4, 5, 3);
            // Eye
            ctx.fillStyle = '#2d1b00';
            ctx.beginPath();
            ctx.arc(headCX + 3, headCY - 2, 1.5, 0, Math.PI * 2);
            ctx.fill();
            // Nostril
            ctx.fillStyle = '#8b4513';
            ctx.beginPath();
            ctx.arc(headCX + 5, headCY + 2, 1, 0, Math.PI * 2);
            ctx.fill();

            // ── ICONIC Gemsbok Horns ───────────────────────────────────────
            // Long, straight, backward-sloping V-shape in normal mode.
            // Lowers to point straight forward (horizontal) on charge.
            const hornLen = 28;
            ctx.strokeStyle = '#f5f0e8';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';

            if (isCharging) {
                // Charge: horns point almost straight right (forward)
                ctx.beginPath();
                ctx.moveTo(headCX + 6, headCY - 3);
                ctx.lineTo(headCX + 6 + hornLen, headCY - 3);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(headCX + 6, headCY + 0);
                ctx.lineTo(headCX + 6 + hornLen, headCY + 3); // slight splay
                ctx.stroke();
            } else {
                // Normal: long backward-sloping V — left horn
                ctx.beginPath();
                ctx.moveTo(headCX, headCY - 5);
                ctx.lineTo(headCX - hornLen * 0.65, headCY - 5 - hornLen * 0.85);
                ctx.stroke();
                // Right horn (slight V-splay)
                ctx.beginPath();
                ctx.moveTo(headCX + 2, headCY - 5);
                ctx.lineTo(headCX + 2 + hornLen * 0.25, headCY - 5 - hornLen * 0.85);
                ctx.stroke();
            }

            ctx.restore(); // end neck/head rotation

            // ── Rider (stickman on the back) ───────────────────────────────
            // Positioned sitting in the saddle area
            const riderX = p.width * 0.35;
            const riderY = bodyY - 1;

            // Torso
            ctx.strokeStyle = '#f0c040';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(riderX, riderY);
            ctx.lineTo(riderX, riderY - 10);
            ctx.stroke();

            // Head
            ctx.fillStyle = '#f5c5a3';
            ctx.beginPath();
            ctx.arc(riderX, riderY - 13, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Arms — lean forward on charge, hold loosely otherwise
            const armFwd = isCharging ? 0.7 : 0;
            ctx.strokeStyle = '#f0c040';
            ctx.lineWidth = 1.8;
            // Left arm
            ctx.beginPath();
            ctx.moveTo(riderX, riderY - 7);
            ctx.lineTo(riderX - 4 + armFwd * 3, riderY - 2);
            ctx.stroke();
            // Right arm (reaching forward toward neck/reins)
            ctx.beginPath();
            ctx.moveTo(riderX, riderY - 7);
            ctx.lineTo(riderX + 5 + armFwd * 5, riderY - 3 - armFwd * 2);
            ctx.stroke();

            // Legs — straddle the gemsbok
            ctx.strokeStyle = '#3a7bd5';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(riderX, riderY);
            ctx.lineTo(riderX - 7, riderY + 7);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(riderX, riderY);
            ctx.lineTo(riderX + 7, riderY + 7);
            ctx.stroke();

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
