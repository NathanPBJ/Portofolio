package data

import "portfolio-backend/models"

func GetProfile() models.Profile {
	return models.Profile{
		Name:     "Nathan Abigail Rahman",
		Title:    "Undergraduate Informatics Student at UPN \"Veteran\" Jakarta",
		Bio:      "Mahasiswa S1 Informatika di Universitas Pembangunan Nasional \"Veteran\" Jakarta angkatan 2024. Sangat antusias mempelajari teknologi baru, mengeksplorasi dunia software engineering, dan memanfaatkan AI untuk memecahkan masalah kompleks.",
		Avatar:   "/avatar.jpg",
		Email:    "nathanabigailr@gmail.com",
		Location: "Jakarta, Indonesia",
		Skills: []string{
			"Go", "React", "Vite", "JavaScript", "HTML/CSS", "MySQL", "Python", "Java", "C", "C++", "Unity", "Android Studio",
		},
		SocialLinks: []models.Social{
			{Platform: "GitHub", URL: "https://github.com/NathanPBJ", Icon: "github"},
			{Platform: "LinkedIn", URL: "https://www.linkedin.com/in/nathan-abigail-r-102090310/", Icon: "linkedin"},
		},
	}
}

func GetProjects() []models.Project {
	return []models.Project{
		{
			ID:          1,
			Title:       "Sistem Kepegawaian & Absensi — Yayasan Satwa Lestari",
			Description: "Aplikasi manajemen kepegawaian dan absensi berbasis microservices.",
			LongDesc:    "Sistem ini dibangun menggunakan arsitektur microservices yang mencakup API Gateway (Node.js/Express), Auth Service dengan Google OAuth, Employee Service (PHP Laravel), dan Attendance Service (Node.js). Fitur utamanya mencakup manajemen data pegawai dengan riwayat jabatan terintegrasi, sistem absensi dengan perhitungan poin kehadiran (gamifikasi sederhana), serta ekspor laporan rekapitulasi absensi otomatis ke format Word (.docx). Seluruh layanan diisolasi dan dijalankan menggunakan Docker dan Docker Compose.",
			TechStack:   []string{"Node.js", "Express", "PHP", "Laravel", "MySQL", "Docker"},
			GithubURL:   "https://github.com/NathanPBJ/uts-pplos-a-2410511036",
			DemoURL:     "https://youtu.be/KOFXuiQl0m8",
			ImageURL:    "/microservices-cover.png",
			Featured:    true,
			Year:        2024,
		},
		{
			ID:          2, // Set to 2 to maintain sequential order
			Title:       "WisataKita App",
			Description: "Aplikasi Android native untuk mengeksplorasi destinasi wisata dengan fitur galeri dan pemutar musik latar.",
			LongDesc:    "WisataKita adalah aplikasi Android native yang dirancang sebagai panduan pariwisata virtual. Aplikasi ini dilengkapi dengan fitur autentikasi pengguna (Login/Register), pengaturan profil, serta daftar destinasi wisata lengkap dengan detailnya. Selain itu, terdapat fitur galeri foto, album, dan pemutar musik latar (MusicService) untuk memberikan pengalaman yang interaktif. Dibangun dengan Kotlin, UI berbasis XML, serta menggunakan library Glide untuk pemuatan gambar secara dinamis.",
			TechStack:   []string{"Kotlin", "Android Studio", "XML", "Glide", "RecyclerView"},
			GithubURL:   "https://github.com/NathanPBJ/WisataKitaApp",
			DemoURL:     "",
			ImageURL:    "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80", // Added w=800&q=80 for faster loading and better framing
			Featured:    true,
			Year:        2026,
		},
		{
			ID:          3, // Set to 3 to maintain sequential order
			Title:       "Pixel Heroes",
			Description: "Game platformer 2D bergaya klasik seperti Mario Bros yang dibuat dengan Java dan JavaFX.",
			LongDesc:    "Game platformer 2D yang menempatkan Anda sebagai pahlawan untuk menyelamatkan kerajaan dari Shadow Lord yang mencuri Crystal of Light. Game ini memiliki 3 level dengan kesulitan yang terus meningkat, musuh AI yang berpatroli, sistem koin, fisika platformer realistis (gravitasi, lompat, collision), serta sistem storyline interaktif.",
			TechStack:   []string{"Java", "JavaFX", "Maven"},
			GithubURL:   "https://github.com/Hesham-prog/pixel-heroes",
			DemoURL:     "",
			ImageURL:    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
			Featured:    true,
			Year:        2024,
		},
	}
}
