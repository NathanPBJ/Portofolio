package models

type Profile struct {
	Name   string   `json:"name"`
	Title  string   `json:"title"`
	Bio    string   `json:"bio"`
	Skills []string `json:"skills"`
}
