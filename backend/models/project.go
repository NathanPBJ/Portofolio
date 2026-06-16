package models

type Project struct {
	ID          int      `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	LongDesc    string   `json:"long_description"`
	TechStack   []string `json:"tech_stack"`
	GithubURL   string   `json:"github_url"`
	DemoURL     string   `json:"demo_url"`
	ImageURL    string   `json:"image_url"`
	Featured    bool     `json:"featured"`
	Year        int      `json:"year"`
}
