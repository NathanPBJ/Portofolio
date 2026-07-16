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
            // ── Background ──────────────────────────────────────────
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Ground gradient
            const gGrad = ctx.createLinearGradient(0, state.groundY, 0, canvas.height);
            gGrad.addColorStop(0, '#3d2b1f');
            gGrad.addColorStop(1, '#1a0e08');
            ctx.fillStyle = gGrad;
            ctx.fillRect(0, state.groundY, canvas.width, canvas.height - state.groundY);
            
            // Ground Texture (scrolling dirt and savanna grass)
            ctx.fillStyle = '#4e3b2b';
            for(let i=0; i<30; i++) {
                let gx = (i * 20 - (state.frames * state.speed * 0.8) % 600);
                if (gx < -20) gx += 600;
                if (gx < canvas.width) {
                    // Dirt speck
                    ctx.fillRect(gx, state.groundY + 6 + (i%4)*6, 3 + (i%2)*2, 2);
                    // Dry savanna grass
                    ctx.fillStyle = '#6e6b45';
                    ctx.fillRect(gx + 8, state.groundY - (i%3)*3, 1.5, 4 + (i%3)*3);
                    ctx.fillStyle = '#4e3b2b';
                }
            }

            ctx.strokeStyle = '#c8a96e';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, state.groundY);
            ctx.lineTo(canvas.width, state.groundY);
            ctx.stroke();

            // ── Particles ──────────────────────────────────────────
            state.particles.forEach(par => {
                ctx.fillStyle = par.color;
                ctx.globalAlpha = Math.max(0, par.life);
                ctx.fillRect(par.x, par.y, 4, 4);
                ctx.globalAlpha = 1.0;
            });

            // ── Obstacles ──────────────────────────────────────────
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
                    // Breakable Wooden Crate with realistic texture
                    ctx.fillStyle = '#8B5A2B'; // Base wood brown
                    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                    
                    // Vertical wooden planks
                    ctx.strokeStyle = '#5C3A21'; // Darker wood lines
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    for(let p=1; p<=3; p++) {
                        ctx.moveTo(obs.x + (obs.width/4)*p, obs.y);
                        ctx.lineTo(obs.x + (obs.width/4)*p, obs.y + obs.height);
                    }
                    ctx.stroke();
                    
                    // Cross beams
                    ctx.strokeStyle = '#6D4C41';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.moveTo(obs.x + 2, obs.y + 2);
                    ctx.lineTo(obs.x + obs.width - 2, obs.y + obs.height - 2);
                    ctx.moveTo(obs.x + obs.width - 2, obs.y + 2);
                    ctx.lineTo(obs.x + 2, obs.y + obs.height - 2);
                    ctx.stroke();
                    
                    // Dark frame Border
                    ctx.strokeStyle = '#3E2723';
                    ctx.lineWidth = 2.5;
                    ctx.strokeRect(obs.x + 1.25, obs.y + 1.25, obs.width - 2.5, obs.height - 2.5);

                    // Iron Nails in corners
                    ctx.fillStyle = '#9E9E9E';
                    ctx.fillRect(obs.x + 3, obs.y + 3, 2, 2);
                    ctx.fillRect(obs.x + obs.width - 5, obs.y + 3, 2, 2);
                    ctx.fillRect(obs.x + 3, obs.y + obs.height - 5, 2, 2);
                    ctx.fillRect(obs.x + obs.width - 5, obs.y + obs.height - 5, 2, 2);
                }
            });

            // ── Player (Gemsbok + Rider) ────────────────────────────
            const p = state.player;
            const isCharging = p.charging;
            const f = state.frames;

            ctx.save();
            ctx.translate(p.x, p.y);
            // Scale 1.8× — keeps collision hitbox accurate, enlarges the visual sprite
            const SC = 1.8;
            ctx.scale(SC, SC);

            // Gallop animation phases (opposite legs swing opposite directions)
            const t = f * 0.28;
            const gA = p.grounded && !gameOver ? Math.sin(t) : 0.45;
            const gB = p.grounded && !gameOver ? Math.sin(t + Math.PI) : -0.45;

            // ── Color Palette (matching pixel-art reference image) ───
            const CO = {
                body:    '#b4a38b',  // gemsbok tan/fawn
                bodyL:   '#dcd4c6',  // lighter belly
                bodyS:   '#8a7b66',  // dorsal shadow
                legBlk:  '#151515',  // black lower legs
                legWht:  '#f0ebd8',  // white leg socks
                mane:    '#111111',  // dark mane and tail
                hornD:   '#1a1a1a',  // horn dark (almost black)
                hornL:   '#444444',  // horn light highlight
                fWht:    '#f5f0e6',  // white face markings
                fBlk:    '#111111',  // black face markings
                harness: '#4a2e15',  // brown leather bridle / reins
                shirt:   '#e8dfc8',  // explorer cream shirt
                vest:    '#4a3018',  // dark brown leather vest
                pants:   '#556b2f',  // olive / army pants
                boots:   '#2b1d0f',  // dark brown riding boots
                hat:     '#5c4022',  // wide-brim hat brown
                hatD:    '#36220d',  // hat band / shadow
                skin:    '#d28b5e',  // rider skin tone
                belt:    '#3a200a',  // leather belt
                saddle:  '#684122',  // saddle leather
            };

            // ── Leg helper: thigh + black lower leg + white sock + hoof ─
            const drawLeg = (ox, oy, angle, shade) => {
                ctx.save();
                ctx.translate(ox, oy);
                ctx.rotate(angle);
                ctx.fillStyle = shade;
                ctx.fillRect(-2, 0, 4, 6);          // thigh (upper, body color)
                ctx.fillStyle = CO.legBlk;
                ctx.fillRect(-1.5, 6, 3, 4);         // lower leg — black
                ctx.fillStyle = CO.legWht;
                ctx.fillRect(-1.5, 6, 3, 1.5);       // white sock at ankle
                ctx.fillStyle = CO.legBlk;
                ctx.fillRect(-2, 10, 4, 1.5);        // hoof
                ctx.restore();
            };

            // ── TAIL (behind body, flowing back-left) ────────────────
            ctx.fillStyle = CO.mane;
            ctx.beginPath();
            ctx.moveTo(4, 10);
            ctx.bezierCurveTo(-3, 7, -10, 6, -14, 14);
            ctx.bezierCurveTo(-10, 20, -4, 19, 0, 14);
            ctx.closePath();
            ctx.fill();
            // Tail hair strands
            ctx.strokeStyle = '#0d0a06';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(0, 13);
            ctx.bezierCurveTo(-7, 10, -13, 10, -16, 17);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(1, 15);
            ctx.bezierCurveTo(-6, 14, -12, 17, -15, 22);
            ctx.stroke();

            // ── BACK LEGS (drawn first — behind body) ─────────────────
            drawLeg(8,  11, gB * 0.45 + 0.3,  CO.bodyS); // rear-far (darker)
            drawLeg(12, 11, gA * 0.45 + 0.15, CO.body);  // rear-near

            // ── GEMSBOK BODY ─────────────────────────────────────────
            // Main torso: more robust fawn ellipse
            ctx.fillStyle = CO.body;
            ctx.beginPath();
            ctx.ellipse(20, 9, 20, 7.5, 0, 0, Math.PI * 2);
            ctx.fill();
            // Black flank stripe (characteristic of Gemsbok)
            ctx.fillStyle = CO.legBlk;
            ctx.beginPath();
            ctx.ellipse(20, 14, 18, 1.5, -0.05, 0, Math.PI * 2);
            ctx.fill();
            // Belly highlight (lighter underside, below the black stripe)
            ctx.fillStyle = CO.bodyL;
            ctx.beginPath();
            ctx.ellipse(20, 15.5, 16, 2, 0, 0, Math.PI * 2);
            ctx.fill();
            // Dorsal stripe (darker top)
            ctx.fillStyle = CO.bodyS;
            ctx.beginPath();
            ctx.ellipse(18, 4, 16, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            // Rear shadow / muscular hindquarter
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.beginPath();
            ctx.ellipse(4, 10, 5, 6, 0.3, 0, Math.PI * 2);
            ctx.fill();

            // ── FRONT LEGS (drawn after body — in front) ──────────────
            drawLeg(30, 11, gA * 0.45 - 0.3,  CO.bodyS); // front-far (darker)
            drawLeg(34, 11, gB * 0.45 - 0.15, CO.body);  // front-near

            // ── NECK ──────────────────────────────────────────────────
            ctx.fillStyle = CO.body;
            ctx.beginPath();
            ctx.moveTo(32, 7);
            ctx.lineTo(38, 0);
            ctx.lineTo(42, 1);
            ctx.lineTo(36, 9);
            ctx.closePath();
            ctx.fill();
            // Neck shadow (right / sun-facing side)
            ctx.fillStyle = CO.bodyS;
            ctx.beginPath();
            ctx.moveTo(35, 7);
            ctx.lineTo(41, 1);
            ctx.lineTo(42, 1);
            ctx.lineTo(36, 8);
            ctx.closePath();
            ctx.fill();
            // Mane hair along top of neck
            ctx.fillStyle = CO.mane;
            ctx.beginPath();
            ctx.moveTo(33, 7);
            ctx.lineTo(39, -0.5);
            ctx.lineTo(41, -0.5);
            ctx.lineTo(35, 7);
            ctx.closePath();
            ctx.fill();

            // ── HEAD (tilts forward when charging) ────────────────────
            const headTilt = isCharging ? 0.45 : 0;
            ctx.save();
            ctx.translate(39, 1); // pivot at neck-top
            ctx.rotate(headTilt);

            // Head base shape
            ctx.fillStyle = CO.body;
            ctx.beginPath();
            ctx.ellipse(7, 0, 8, 5, -0.1, 0, Math.PI * 2);
            ctx.fill();

            // White muzzle (front of face)
            ctx.fillStyle = CO.fWht;
            ctx.beginPath();
            ctx.ellipse(13, 0.5, 4, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            // White stripe above eye (classic gemsbok pattern)
            ctx.fillRect(4, -5, 8, 2);

            // Black eye band (horizontal stripe through eye area)
            ctx.fillStyle = CO.fBlk;
            ctx.fillRect(3, -4, 12, 2.5);
            // Black nose-bridge stripe
            ctx.fillRect(7, 1.5, 9, 1.5);

            // Eye (dark with white highlight)
            ctx.fillStyle = '#18120a';
            ctx.beginPath();
            ctx.arc(5, -1.5, 1.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(5.5, -2, 0.5, 0, Math.PI * 2);
            ctx.fill();

            // Nostril
            ctx.fillStyle = '#3a1808';
            ctx.beginPath();
            ctx.arc(15, 1.5, 0.8, 0, Math.PI * 2);
            ctx.fill();

            // Brown leather bridle / harness
            ctx.strokeStyle = CO.harness;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(11, 0, 5.5, -1.5, 1.5); // nose-band arc
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(7, -3);
            ctx.lineTo(7, 2);    // face strap
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(3, -3);
            ctx.lineTo(4, 3);    // cheek piece
            ctx.stroke();

            // ── HORNS — iconic very long, straight, backward-sweeping ─
            if (isCharging) {
                // Charge: horns level forward (right in canvas)
                ctx.fillStyle = CO.hornD;
                ctx.beginPath();
                ctx.moveTo(4, -6);
                ctx.lineTo(4, -3);
                ctx.lineTo(40, -4);
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(5, -4);
                ctx.lineTo(5, -1);
                ctx.lineTo(38, -2);
                ctx.fill();
            } else {
                // Normal: sweep straight back and slightly upward — near-parallel V
                // Draw as thick polygons tapering to a point for realism
                ctx.fillStyle = CO.hornD;
                ctx.beginPath();
                ctx.moveTo(2, -4); // Base bottom
                ctx.lineTo(7, -5); // Base top
                ctx.lineTo(-26, -34); // Tip
                ctx.fill();
                
                // Highlight line for texture
                ctx.strokeStyle = CO.hornL;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(4.5, -4.5);
                ctx.lineTo(-24, -33);
                ctx.stroke();

                // Second horn (slightly offset)
                ctx.fillStyle = CO.hornD;
                ctx.beginPath();
                ctx.moveTo(3, -3); // Base bottom
                ctx.lineTo(8, -4); // Base top
                ctx.lineTo(-22, -33); // Tip
                ctx.fill();
            }

            ctx.restore(); // end head + horns block

            // ── REINS (from rider hands forward to bridle) ─────────────
            ctx.strokeStyle = CO.harness;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(20, 7);
            ctx.bezierCurveTo(30, 5, 37, 4, 43, 3);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(20, 8);
            ctx.bezierCurveTo(30, 6, 37, 5, 43, 5);
            ctx.stroke();

            // ── RIDER ────────────────────────────────────────────────
            // Saddle on gemsbok's back
            ctx.fillStyle = CO.saddle;
            ctx.beginPath();
            ctx.ellipse(18, 7, 7, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#9a6840';
            ctx.fillRect(12, 5.5, 12, 3);

            // Rider pants — olive green, straddling either side
            ctx.fillStyle = CO.pants;
            ctx.beginPath(); // near leg (left side, visible)
            ctx.moveTo(14, 8);
            ctx.lineTo(10, 18);
            ctx.lineTo(14, 18.5);
            ctx.lineTo(17, 9);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath(); // far leg (right side, partially hidden)
            ctx.moveTo(19, 9);
            ctx.lineTo(22, 18);
            ctx.lineTo(26, 17.5);
            ctx.lineTo(23, 8);
            ctx.closePath();
            ctx.fill();

            // Tall riding boots (dark brown leather)
            ctx.fillStyle = CO.boots;
            ctx.fillRect(8,  15, 7, 8);    // near boot shaft
            ctx.fillRect(6,  21, 9, 2.5);  // near boot foot
            ctx.fillRect(21, 15, 7, 8);    // far boot shaft
            ctx.fillRect(19, 21, 9, 2.5);  // far boot foot
            ctx.fillStyle = '#3a2010';     // boot top cuff
            ctx.fillRect(8,  15, 7, 1.5);
            ctx.fillRect(21, 15, 7, 1.5);

            // Shirt (cream/beige explorer shirt)
            ctx.fillStyle = CO.shirt;
            ctx.fillRect(13, 0, 11, 10);
            ctx.beginPath();
            ctx.arc(18.5, 0, 5.5, Math.PI, 0); // rounded shoulder line
            ctx.fill();

            // Leather vest panels (dark, over shirt)
            ctx.fillStyle = CO.vest;
            ctx.fillRect(13, 0, 3, 10);    // left panel
            ctx.fillRect(22, 0, 2.5, 10);  // right panel

            // Belt + leather pouch / saddlebag
            ctx.fillStyle = CO.belt;
            ctx.fillRect(13, 8, 11, 2);
            ctx.fillStyle = '#5a3820';
            ctx.fillRect(13, 6.5, 5, 5);   // pouch body
            ctx.fillStyle = '#3a2010';
            ctx.fillRect(14, 7.5, 3, 3);   // pouch flap

            // Arm reaching forward, holding reins
            ctx.fillStyle = CO.shirt;
            ctx.beginPath();
            ctx.moveTo(22, 2);
            ctx.lineTo(29, 7);
            ctx.lineTo(28, 8.5);
            ctx.lineTo(21, 3.5);
            ctx.closePath();
            ctx.fill();
            // Exposed forearm skin (rolled sleeve)
            ctx.fillStyle = CO.skin;
            ctx.beginPath();
            ctx.moveTo(26, 5);
            ctx.lineTo(30, 7.5);
            ctx.lineTo(29, 9);
            ctx.lineTo(25, 6.5);
            ctx.closePath();
            ctx.fill();
            // Gloved hand gripping rein
            ctx.fillStyle = '#3a2010';
            ctx.beginPath();
            ctx.arc(29.5, 8, 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Second arm (slightly behind torso)
            ctx.fillStyle = CO.shirt;
            ctx.beginPath();
            ctx.moveTo(21, 2.5);
            ctx.lineTo(27, 6.5);
            ctx.lineTo(26, 8);
            ctx.lineTo(20, 4);
            ctx.closePath();
            ctx.fill();

            // Neck
            ctx.fillStyle = CO.skin;
            ctx.fillRect(17, -3, 4, 4);

            // Head (faces forward/right, slight profile)
            ctx.fillStyle = CO.skin;
            ctx.beginPath();
            ctx.ellipse(19.5, -6, 4, 5, -0.08, 0, Math.PI * 2);
            ctx.fill();

            // Eye
            ctx.fillStyle = '#18100a';
            ctx.beginPath();
            ctx.arc(21, -7, 0.8, 0, Math.PI * 2);
            ctx.fill();
            // Eyebrow
            ctx.strokeStyle = '#3a2010';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(19.5, -9);
            ctx.lineTo(22.5, -8);
            ctx.stroke();
            // Nose
            ctx.fillStyle = '#9a5028';
            ctx.beginPath();
            ctx.arc(22, -5.5, 0.7, 0, Math.PI * 2);
            ctx.fill();

            // Hair under hat brim
            ctx.fillStyle = '#3a2010';
            ctx.fillRect(15.5, -9, 9, 3);
            ctx.beginPath();
            ctx.ellipse(19.5, -9, 4.5, 1.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // ── WIDE-BRIM EXPLORER HAT ─────────────────────────────────
            // Brim (wide, flat ellipse)
            ctx.fillStyle = CO.hat;
            ctx.beginPath();
            ctx.ellipse(19.5, -10, 10, 2, 0, 0, Math.PI * 2);
            ctx.fill();
            // Brim underside shadow
            ctx.fillStyle = CO.hatD;
            ctx.beginPath();
            ctx.ellipse(19.5, -9.5, 10, 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            // Crown (tall rectangular top)
            ctx.fillStyle = CO.hat;
            ctx.fillRect(14, -18, 11, 9);
            ctx.beginPath();
            ctx.ellipse(19.5, -18, 5.5, 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            // Hat band (dark stripe around crown base)
            ctx.fillStyle = CO.hatD;
            ctx.fillRect(14, -11, 11, 1.5);
            ctx.beginPath();
            ctx.ellipse(19.5, -11, 5.5, 1.2, 0, 0, Math.PI * 2);
            ctx.fill();
            // Crown left-face highlight
            ctx.fillStyle = '#8a6035';
            ctx.fillRect(14.5, -17, 2.5, 6);

            ctx.restore(); // end SC scale + player translate

            // ── GAME OVER OVERLAY ─────────────────────────────────────
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
