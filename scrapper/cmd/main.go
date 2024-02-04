package main

import (
	"encoding/json"
	"fmt"
	"github.com/gocolly/colly"
	"html"
	"os"
	"strings"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

type Competition struct {
	UrlCompetitionType string `json:"url_competition_type"`
	UrlCompetition     string `json:"url_competition"`
	Poule              string `json:"ext_poule_id"`
	Classement         []struct {
		EquipeLibelle string `json:"equipe_libelle"`
	} `json:"classements"`
}

func main() {

	var competitions []Competition
	c := colly.NewCollector(colly.MaxDepth(4))
	//c := colly.NewCollector(colly.MaxDepth(4), colly.Async(true))
	//c := colly.NewCollector(colly.MaxDepth(3), colly.Async(true))
	//c.Limit(&colly.LimitRule{Parallelism: 20})

	c.OnXML("//sitemapindex/sitemap/loc", func(e *colly.XMLElement) {
		if strings.Contains(e.Text, "competitions_poules") {
			err := e.Request.Visit(e.Text)
			check(err)
		}

	})

	c.OnXML("//urlset/url/loc", func(e *colly.XMLElement) {
		if strings.Contains(e.Text, "saison-2023-2024") {
			err := e.Request.Visit(e.Text)
			if err != nil {
				print("erreur", err)
				return
			}
		}
	})

	c.OnHTML("smartfire-component[name=competitions---mini-classement-or-ads]", func(e *colly.HTMLElement) {
		unescaped := html.UnescapeString(e.Attr("attributes"))
		var competition Competition
		err := json.Unmarshal([]byte(unescaped), &competition)
		check(err)
		competitions = append(competitions, competition)
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL.String())
	})

	c.Visit("https://www.ffhandball.fr/sitemap_index.xml")
	//c.Wait()

	fName := "competions.json"
	file, err := os.Create(fName)
	check(err)
	_, err = file.WriteString("[")
	check(err)
	jsonCompetitions, err := json.Marshal(competitions)
	_, err = file.Write(jsonCompetitions)
	check(err)
	_, err = file.WriteString("]")
	check(err)
	err = file.Sync()
	check(err)
	err = file.Close()
	check(err)

}
