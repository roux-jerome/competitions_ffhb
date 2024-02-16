import {Competitions} from "@/app/lib/competitions";
import _poules from "@/app/lib/poules.json";
import lunr from "lunr";

export interface Poule {
    index: number,
    url: string,
    libelleCompetition: string,
    sousTitreCompetition: string,
    nom: string
    phase: string
    recherche: string,
    dateJourneeSelectionee: string
}

const index = lunr(function () {
    this.ref('index')
    this.field('recherche')
    _poules.forEach((doc) => {
        this.add(doc)
    })
})

export function recherche(recherche: string) {
    if (recherche && recherche !== "") {
        let rechercheFuzzy = recherche
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replaceAll(" ", "*_*")
        let competitions = new Competitions();
        index.search(`*${rechercheFuzzy}*`)
            .forEach((resultat) => {
                competitions.ajoute(Object.keys(resultat.matchData.metadata).join(" "), _poules[Number(resultat.ref)])
            });
        return competitions;
    } else {
        return new Competitions()
    }
}