package models

type Profile struct {
	Name        string   `json:"name"`
	Title       string   `json:"title"`
	Bio         string   `json:"bio"`
	Avatar      string   `json:"avatar"`
	Email       string   `json:"email"`
	Location    string   `json:"location"`
	Skills      []string `json:"skills"`
	SocialLinks []Social `json:"social_links"`
}

type Social struct {
	Platform string `json:"platform"`
	URL      string `json:"url"`
	Icon     string `json:"icon"`
}
