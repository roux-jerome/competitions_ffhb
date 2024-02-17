import _poules from "@/app/lib/poules.json";
import lunr from "lunr";
import {Equipe, Poule} from "@/app/lib/poule";

const poules: Poule[] = _poules as Poule[]

const index = lunr(function () {
    this.ref('index')
    this.field('recherche')
    poules.forEach((doc) => {
        this.add(doc)
    })
})

export class Competition {

    libelleCompetition: string;

    sousTitreCompetition: string;

    private _poules: Poule[] = []
    dernierePoule: Poule
    tags: string[] = [];


    constructor(public equipe: string, poule: Poule) {
        this.libelleCompetition = poule.libelleCompetition
        this.sousTitreCompetition = poule.sousTitreCompetition
        this._poules.push(poule)
        this.dernierePoule = poule
        this.construitLesTags(poule)
    }

    get anciennesPoules(): Poule[] {
        let anciennesPoules = Array.from(this._poules);
        anciennesPoules.pop()
        return anciennesPoules
            .sort((poule1, poule2) => Date.parse(poule1.dateJourneeSelectionee) - Date.parse(poule2.dateJourneeSelectionee))
            .reverse();
    }

    public ajoute(poule: Poule) {
        if (Date.parse(poule.dateJourneeSelectionee) > Date.parse(this.dernierePoule.dateJourneeSelectionee)) {
            this.dernierePoule = poule;
        }
        this._poules.push(poule)
    }

    public get dateDernierePoule() {
        return Date.parse(this.dernierePoule.dateJourneeSelectionee)
    }


    construitLesTags = (poule: Poule) => {
        let details = poule.url.split("/");

        let chaineContenantDesTags = details[1];
        let formatageTexte = chaineContenantDesTags.split("-");
        formatageTexte.pop()
        this.tags.push(details[0].replaceAll("-", " "));

        ["masculin", "masculins", "feminine", "feminines", "u18", "u15", "u13", "u11"].forEach((tagAChercher: string) => {
            if (formatageTexte.includes(tagAChercher)) {
                this.tags.push(tagAChercher)
            }
        })

        if (formatageTexte.includes("16")) {
            this.tags.push("senior")
        }


    }


}

export class Resultat {

    private _competitions = new Map<string, Competition>();
    private _clubs = new Map<string, Equipe | undefined>();

    public ajoute = (nomEquipe: string, poule: Poule) => {
        let urlPoule = poule.url.split("/");
        let urlCompetitionEtEquipe = `${nomEquipe}/${urlPoule[0]}/${urlPoule[1]}`
        let equipeFormatee = nomEquipe.replaceAll("_", " ").trim()
        if (this._competitions.has(urlCompetitionEtEquipe)) {
            this._competitions.get(urlCompetitionEtEquipe)?.ajoute(poule)
        } else {
            this._competitions.set(urlCompetitionEtEquipe, new Competition(equipeFormatee, poule))
        }
        let nomDuClub = equipeFormatee.toUpperCase().replace(/ [0-9]+$/, '').trim()
        if (!this._clubs.has(nomDuClub)) {
            this._clubs.set(
                nomDuClub,
                poule.equipes
                    ?.map(equipe => ({
                            libelle: equipe.libelle.replace(/ [0-9]+/, '').trim(),
                            logo:
                            equipe.logo
                        } as Equipe)
                    )
                    .find(equipe => {
                        return equipe.libelle === nomDuClub
                    })
            )
        }
    }


    public get competitions() {
        return Array.from(this._competitions.values())
            .sort((competition1, competition2) =>
                competition1.dateDernierePoule - competition2.dateDernierePoule)
            .reverse()
    }

    public get clubs() {
        return Array.from(this._clubs.values())
    }
}

export function recherche(recherche: string) {
    if (recherche && recherche !== "") {
        let rechercheFuzzy = recherche
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .trim()
            .replaceAll(" ", "*_*")
        let competitions = new Resultat();
        index.search(`*${rechercheFuzzy}*`)
            .forEach((resultat) => {
                competitions.ajoute(Object.keys(resultat.matchData.metadata).join(" "), poules[Number(resultat.ref)])
            });
        return competitions;
    } else {
        return new Resultat()
    }
}