package main

import (
	"encoding/json"
	"fmt"
	"github.com/gocolly/colly"
	"html"
	"os"
	"strconv"
	"strings"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

type MiniClassement struct {
	UrlCompetitionType string `json:"url_competition_type"`
	UrlCompetition     string `json:"url_competition"`
	Poule              string `json:"ext_poule_id"`
	Classement         []struct {
		EquipeLibelle string `json:"equipe_libelle"`
		Logo          string `json:"structure_logo"`
	} `json:"classements"`
}

type PageHeader struct {
	Title    string `json:"title"`
	SubTitle string `json:"subTitle"`
}

type JourneeSelector struct {
	SelectedNumeroJournee string `json:"selected_numero_journee"`
	Poule                 struct {
		Libelle  string `json:"libelle"`
		PhaseId  string `json:"phaseId"`
		Journees string `json:"journees"`
	} `json:"poule"`
}

type Journee struct {
	Numero    int    `json:"journee_numero"`
	DateDebut string `json:"date_debut"`
	DateFin   string `json:"date_fin"`
}

type PouleSelector struct {
	Phases []struct {
		Id      string `json:"id"`
		Libelle string `json:"libelle"`
	} `json:"phases"`
}
type Equipe struct {
	Libelle string `json:"libelle"`
	Logo    string `json:"logo"`
}

type Poule struct {
	Index                       int         `json:"index"`
	Url                         string      `json:"url"`
	LibelleCompetition          string      `json:"libelleCompetition"`
	SousTitreCompetition        string      `json:"sousTitreCompetition"`
	Nom                         string      `json:"nom"`
	Phase                       string      `json:"phase"`
	Equipes                     []Equipe    `json:"equipes"`
	Recherche                   string      `json:"recherche"`
	DateDebutJourneeSelectionee string      `json:"dateDebutJourneeSelectionee"`
	DateFinJourneeSelectionee   string      `json:"dateFinJourneeSelectionee"`
	Rencontres                  []Rencontre `json:"rencontres"`
}
type Rencontre struct {
	Date           string `json:"date"`
	Equipe1Libelle string `json:"equipe1Libelle"`
	Equipe2Libelle string `json:"equipe2Libelle"`
}

type RencontreList struct {
	Recontres []Rencontre `json:"rencontres"`
}

func main() {

	urlsCompetition := recupereLesUrlDesCompetitionsDeLaSaison2024()

	aggregatedCompetitions := scrappingDesCompetitions(urlsCompetition)

	file, err := os.Create("../front/app/lib/poules.json")
	check(err)
	jsonCompetitions, err := json.Marshal(aggregatedCompetitions)
	_, err = file.Write(jsonCompetitions)
	check(err)
	err = file.Sync()
	check(err)
	err = file.Close()
	check(err)
}

func scrappingDesCompetitions(urlsCompetition []string) []Poule {
	var aggregatedCompetitions []Poule
	collecteurCompetitions := colly.NewCollector(colly.MaxDepth(2), colly.CacheDir("../cache-poules"))

	collecteurCompetitions.OnHTML("smartfire-component[name=scorelive---score-live-context-wrapper]", func(e *colly.HTMLElement) {

		var pageHeader PageHeader
		deserialiseSousElement(e, "page-header", &pageHeader)
		var journeeSelector JourneeSelector
		deserialiseSousElement(e, "competitions---journee-selector", &journeeSelector)
		var miniClassement MiniClassement
		deserialiseSousElement(e, "competitions---mini-classement-or-ads", &miniClassement)
		var pouleSelector PouleSelector
		deserialiseSousElement(e, "competitions---poule-selector", &pouleSelector)
		var journees []Journee
		deserialise(journeeSelector.Poule.Journees, &journees)
		var rencontreList RencontreList
		deserialiseSousElement(e, "competitions---rencontre-list", &rencontreList)

		var equipes []Equipe
		var recherches []string
		for _, equipe := range miniClassement.Classement {
			equipes = append(equipes, Equipe{equipe.EquipeLibelle, equipe.Logo})
			recherches = append(recherches, strings.ReplaceAll(equipe.EquipeLibelle, " ", "_")+"_")

		}

		competition := Poule{
			len(aggregatedCompetitions),
			miniClassement.UrlCompetitionType + "/" + miniClassement.UrlCompetition + "/poule-" + miniClassement.Poule,
			pageHeader.Title,
			pageHeader.SubTitle,
			journeeSelector.Poule.Libelle,
			TrouveLaPhase(pouleSelector, journeeSelector),
			equipes,
			strings.Join(recherches, " "),
			TrouveLaDateDeDebutDeLaJourneeSelectionee(journees, journeeSelector),
			TrouveLaDateDeFinDeLaJourneeSelectionee(journees, journeeSelector),
			rencontreList.Recontres,
		}
		aggregatedCompetitions = append(aggregatedCompetitions, competition)

	})

	collecteurCompetitions.OnError(func(r *colly.Response, err error) {
		fmt.Println("Problème de récupération de la poule", r.Request.URL, " statut:", r.StatusCode)
	})

	//collecteurCompetitions.OnRequest(func(r *colly.Request) {
	//	fmt.Println("Récupération de la poule", r.URL.String())
	//})

	for _, urlCompetition := range urlsCompetition {
		collecteurCompetitions.Visit(urlCompetition)

	}
	fmt.Println("Fin du scrapping des poules")
	return aggregatedCompetitions
}

func TrouveLaDateDeDebutDeLaJourneeSelectionee(journees []Journee, selector JourneeSelector) string {
	for _, journee := range journees {
		if strconv.Itoa(journee.Numero) == selector.SelectedNumeroJournee {
			return journee.DateDebut
		}
	}
	return ""
}

func TrouveLaDateDeFinDeLaJourneeSelectionee(journees []Journee, selector JourneeSelector) string {
	for _, journee := range journees {
		if strconv.Itoa(journee.Numero) == selector.SelectedNumeroJournee {
			return journee.DateFin
		}
	}
	return ""
}

func TrouveLaPhase(pouleSelector PouleSelector, selector JourneeSelector) string {
	phaseSelectionee := ""
	for _, phase := range pouleSelector.Phases {
		if phase.Id == selector.Poule.PhaseId {
			return phase.Libelle
		}
	}
	return phaseSelectionee
}

func deserialiseSousElement(e *colly.HTMLElement, attribute string, resultat any) {
	texte := html.UnescapeString(e.ChildAttr("smartfire-component[name="+attribute+"]", "attributes"))
	deserialise(texte, resultat)
}

func deserialise(texte string, resultat any) {
	err := json.Unmarshal([]byte(texte), &resultat)
	check(err)
}

func recupereLesUrlDesCompetitionsDeLaSaison2024() []string {
	var urlCompetitions []string
	collecteurURLCompetitions := colly.NewCollector(colly.MaxDepth(3), colly.CacheDir("../cache-sitemap"))
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

	//collecteurURLCompetitions.OnRequest(func(r *colly.Request) {
	//	fmt.Println("Parcours du sitemap", r.URL.String())
	//})

	err := collecteurURLCompetitions.Visit("https://www.ffhandball.fr/sitemap_index.xml")
	check(err)

	fmt.Println("Fin du scrapping du sitemap")
	return urlCompetitions
}
