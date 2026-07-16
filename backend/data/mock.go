package data

import "portfolio-backend/models"

func GetProfile() models.Profile {
	return models.Profile{
		Name:  "Nathan Abigail Rahman",
		Title: "Undergraduate Informatics Student at UPN \"Veteran\" Jakarta",
		Bio:   "Undergraduate Informatics Student at Universitas Pembangunan Nasional \"Veteran\" Jakarta, class of 2024. Highly enthusiastic about learning new technologies, exploring the world of software engineering, and utilizing AI to solve complex problems.",
		Skills: []string{
			"Go", "React", "Vite", "JavaScript", "HTML/CSS", "MySQL", "Python", "Java", "C", "C++", "Unity", "Android Studio",
		},
	}
}

func GetProjects() []models.Project {
	return []models.Project{
		{
			ID:          1,
			Title:       "Sistem Kepegawaian & Absensi \u2014 Yayasan Satwa Lestari",
			Description: "A microservices-based employee management and attendance system built for a wildlife conservation foundation (Note: fictional company created for a university final project/UAS).",
			LongDesc:    "Developed as a university project for a Service-Oriented Software Development course, this application provides a robust microservices architecture for managing employees at 'Yayasan Satwa Lestari.' It utilizes an API Gateway to route traffic to independent services handling authentication, employee data (Laravel), and attendance tracking (Node.js). The platform features Google OAuth integration, a gamified attendance point system with a leaderboard, and automated generation of monthly .docx reports.",
			TechStack:   []string{"Node.js", "Express.js", "Laravel 11", "MySQL", "Docker", "OAuth 2.0"},
			GithubURL:   "",
			DemoURL:     "https://youtu.be/KOFXuiQl0m8",
			ImageURL:    "/microservices-cover.png",
			Featured:    true,
			Year:        2024,
		},
		{
			ID:          2,
			Title:       "WisataKita",
			Description: "A bilingual Android travel companion for exploring Indonesian destinations, saving trips, and building a personal travel passport.",
			LongDesc:    "WisataKita is a native Android app that helps users discover tourism destinations across Indonesia with rich details, search, filtering, location-aware sorting, and travel collection features. It combines offline bundled destination data with optional web-service updates, real-time weather, nearby places, photo discovery, reviews, favorites, albums, and journey stamps. The app also includes onboarding, authentication, bilingual Indonesian/English UI, notifications, Lottie animations, and custom travel-inspired UI polish. Key features include destination discovery with list, grid, and card views; location-aware recommendations; favorites, history, passport stamps, reviews, and photo albums; offline-first JSON and Room caching; and integrations with OpenWeather, Pexels, Geoapify, Google Location, and Google sign-in. Role: App Architect and Android developer responsible for app structure, navigation, data and repository layers, Room persistence, API integrations, travel collection features, notifications, bilingual resources, and UI polish.",
			TechStack:   []string{"Kotlin", "Android XML", "Room", "Coroutines", "Glide", "Location API"},
			GithubURL:   "https://github.com/Hesham-prog/WisataKita",
			DemoURL:     "",
			ImageURL:    "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80",
			Featured:    true,
			Year:        2026,
		},
		{
			ID:          3,
			Title:       "NBA Central Division Dashboard",
			Description: "A dynamic, real-time command center tracking stats, rosters, and live data for NBA Central Division teams.",
			LongDesc:    "The NBA Central Division Dashboard is an interactive, premium web application designed to track real-time analytics, player statistics, and franchise history for all five teams in the NBA Central Division. It seamlessly fetches live, up-to-date information directly from public ESPN and Wikipedia APIs using a custom-built Vercel Serverless backend. The interface features a modern sports aesthetic with dynamic routing, rotating hero displays, and responsive data visualizations that adapt to each team's unique brand identity.",
			TechStack:   []string{"React", "Tailwind CSS", "Framer Motion", "Recharts", "Node.js", "Vercel"},
			GithubURL:   "https://github.com/NathanPBJ/nba-central-division-dashboard",
			DemoURL:     "https://nba-central-division-dashboard.vercel.app/",
			ImageURL:    "/pacers-cover.jpg.webp",
			Featured:    true,
			Year:        2024,
		},
		{
			ID:          4,
			Title:       "SignVault: Sistem Pengarsipan Dokumen Akademik Berbasis Digital Signature",
			Description: "A secure digital archiving system that ensures document authenticity using RSA-PSS digital signatures and SHA-256 hashing.",
			LongDesc:    "SignVault is a secure digital document archiving platform built to protect the integrity of academic and legal files. The system calculates a SHA-256 hash for every uploaded document and cryptographically signs it using an RSA-PSS algorithm. Featuring a custom Python API server and a modern React frontend, it provides an intuitive dashboard for users to archive files and perform real-time verification to instantly detect unauthorized modifications or forgery.",
			TechStack:   []string{"React", "Python", "Cryptography", "SQLite", "Vite", "CSS"},
			GithubURL:   "https://github.com/NathanPBJ/signvault-digital-archive-uas",
			DemoURL:     "",
			ImageURL:    "/signvault-cover.png",
			Featured:    true,
			Year:        2024,
		},
		{
			ID:          5,
			Title:       "Smart Crowd Control Platform",
			Description: "A smart crowd management platform where I developed the core Machine Learning models for real-time risk prediction and anomaly detection.",
			LongDesc:    "Smart Crowd Control Platform is an advanced system designed to enhance public safety by monitoring crowds in real-time. Working within a team, my primary contribution was as the Machine Learning Engineer. I exclusively designed and developed the AI predictive models (using Python, Scikit-Learn, and FastAPI) that analyze live IoT sensor data to generate actionable insights and detect anomalies. My ML models were then integrated into the broader microservices architecture managed by my teammates.",
			TechStack:   []string{"Python", "Scikit-Learn", "FastAPI", "Machine Learning", "IoT", "Docker"},
			GithubURL:   "https://github.com/hendrvy/tubes-pplbs-3",
			DemoURL:     "",
			ImageURL:    "/crowdcontrol-cover.png",
			Featured:    true,
			Year:        2024,
		},
		{
			ID:          6,
			Title:       "Zoo Tycoon 2 Mod Optimizer & Conflict Resolver",
			Description: "An automated PowerShell toolset to analyze, repair, merge, and optimize game modifications for Zoo Tycoon 2.",
			LongDesc:    "Developed a suite of automation scripts designed to manage, repair, and optimize heavily modded instances of the classic simulation game, Zoo Tycoon 2. By reverse-engineering the game's .z2f archive structure, the toolset parses internal XML configurations to resolve entity conflicts, identify missing dependencies, and safely consolidate hundreds of individual mods. The final Mega Pack compiler drastically reduces system I/O operations, significantly accelerating game startup times and improving overall engine stability.",
			TechStack:   []string{"PowerShell", "XML", "Batch Scripting", "Regex", ".NET"},
			GithubURL:   "",
			DemoURL:     "",
			ImageURL:    "/zootycoon-cover.png",
			Featured:    true,
			Year:        2024,
		},
	}
}
