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
			TechStack:   []string{"Node.js", "Express.js", "PHP 8.3", "Laravel 11", "MySQL 8.0", "Docker", "Docker Compose", "JWT", "Google OAuth 2.0"},
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
			TechStack:   []string{"Kotlin", "Android XML Views", "ViewBinding", "Material Components", "Room", "Coroutines", "Lifecycle ViewModel", "Glide", "Lottie", "Google Play Services Location", "Android Credential Manager", "MPAndroidChart", "OpenWeather API", "Pexels API", "Geoapify API", "Gradle Kotlin DSL"},
			GithubURL:   "https://github.com/Hesham-prog/WisataKita",
			DemoURL:     "",
			ImageURL:    "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80",
			Featured:    true,
			Year:        2026,
		},
		{
			ID:          3,
			Title:       "Pixel Heroes",
			Description: "A classic Mario Bros-style 2D platformer game built with Java and JavaFX.",
			LongDesc:    "A 2D platformer game that puts you in the shoes of a hero to save the kingdom from the Shadow Lord who stole the Crystal of Light. The game features 3 levels with increasing difficulty, patrolling AI enemies, a coin system, realistic platformer physics (gravity, jumping, collision), and an interactive storyline system.",
			TechStack:   []string{"Java", "JavaFX", "Maven"},
			GithubURL:   "https://github.com/Hesham-prog/pixel-heroes",
			DemoURL:     "",
			ImageURL:    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
			Featured:    true,
			Year:        2024,
		},
	}
}
