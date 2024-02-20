import _poules from "@/app/lib/poules.json";
import lunr from "lunr";
import {Poule} from "@/app/lib/poule";

const poules: Poule[] = _poules as Poule[]

const index = lunr(function () {
    this.ref('index')
    this.field('recherche')
    poules.forEach((doc) => {
        this.add(doc)
    })
})

export interface Resultats {
    ajoute(nomEquipe: string, poule: Poule): void
}

export function recherche<R extends Resultats>(requete: string, resultats: R) {
    if (requete && requete !== "") {
        let rechercheFuzzy = requete
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .trim()
            .replaceAll(" ", "*_*")
        index.search(`*${rechercheFuzzy}*`)
            .forEach((resultatLunr) => {
                let nomEquipe = Object.keys(resultatLunr.matchData.metadata).join(" ");
                resultats.ajoute(nomEquipe.replaceAll("_", " ").trim(), poules[Number(resultatLunr.ref)])
            });
    }
    return resultats
}

