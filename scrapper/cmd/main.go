package main

import (
	"encoding/json"
	"fmt"
	"github.com/gocolly/colly"
	"html"
	"log"
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

type CompetitionSortie struct {
	Id      string `json:"id"`
	Equipes string `json:"equipes"`
}

func main() {

	urlsCompetition := recupereLesUrlDesCompetitionsDeLaSaison2024()

	aggregatedCompetitions := scrappingDesCompetitions(urlsCompetition)

	if err := os.MkdirAll("../competitions/", os.ModePerm); err != nil {
		log.Fatal(err)
	}
	for typeCompetition := range aggregatedCompetitions {
		file, err := os.Create("../competitions/" + typeCompetition + ".json")
		check(err)
		jsonCompetitions, err := json.Marshal(aggregatedCompetitions[typeCompetition])
		_, err = file.Write(jsonCompetitions)
		check(err)
		err = file.Sync()
		check(err)
		err = file.Close()
		check(err)
	}
}

func scrappingDesCompetitions(urlsCompetition []string) map[string][]CompetitionSortie {
	var aggregatedCompetitions = make(map[string][]CompetitionSortie)
	collecteurCompetitions := colly.NewCollector(colly.MaxDepth(2), colly.CacheDir("../cache-competitions"))

	collecteurCompetitions.OnHTML("smartfire-component[name=competitions---mini-classement-or-ads]", func(e *colly.HTMLElement) {
		fmt.Println("Compétition trouvée")
		unescaped := html.UnescapeString(e.Attr("attributes"))
		var competition Competition
		err := json.Unmarshal([]byte(unescaped), &competition)
		check(err)
		var equipes []string
		for _, equipe := range competition.Classement {
			equipes = append(equipes, equipe.EquipeLibelle)

		}
		competitionSortie := CompetitionSortie{
			competition.UrlCompetitionType + "/" + competition.UrlCompetition + "/poule-" + competition.Poule,
			strings.Join(equipes, ", "),
		}
		valeur, ok := aggregatedCompetitions[competition.UrlCompetitionType]
		if ok == true {
			aggregatedCompetitions[competition.UrlCompetitionType] =
				append(valeur, competitionSortie)
		} else {
			aggregatedCompetitions[competition.UrlCompetitionType] = []CompetitionSortie{competitionSortie}
		}
	})

	collecteurCompetitions.OnError(func(r *colly.Response, err error) {
		fmt.Println("Problème de récupération de la compétition", r.Request.URL, " statut:", r.StatusCode)
	})

	collecteurCompetitions.OnRequest(func(r *colly.Request) {
		fmt.Println("Récupération de la compétition", r.URL.String())
	})

	for _, urlCompetition := range urlsCompetition {
		collecteurCompetitions.Visit(urlCompetition)

	}
	fmt.Println("Fin du scrapping des compétitions")
	return aggregatedCompetitions
}

func recupereLesUrlDesCompetitionsDeLaSaison2024() []string {
	var urlCompetitions []string
	collecteurURLCompetitions := colly.NewCollector(colly.MaxDepth(3))
	collecteurURLCompetitions.OnXML("//sitemapindex/sitemap/loc", func(e *colly.XMLElement) {
		if strings.Contains(e.Text, "competitions_poules") {
			e.Request.Visit(e.Text)
		}

	})

	collecteurURLCompetitions.OnXML("//urlset/url/loc", func(e *colly.XMLElement) {
		if strings.Contains(e.Text, "saison-2023-2024") {
			urlCompetitions = append(urlCompetitions, e.Text)
		}
	})
	collecteurURLCompetitions.OnError(func(r *colly.Response, err error) {
		fmt.Println("Problème de récupération du sitemap", r.Request.URL, "statut: ", r.StatusCode)
	})

	collecteurURLCompetitions.OnRequest(func(r *colly.Request) {
		fmt.Println("Parcours du sitemap", r.URL.String())
	})

	collecteurURLCompetitions.Visit("https://www.ffhandball.fr/sitemap_index.xml")

	fmt.Println("Fin du scrapping du sitemap")
	return urlCompetitions
}
