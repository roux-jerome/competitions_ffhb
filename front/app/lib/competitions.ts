import {Poule} from "@/app/lib/poule";
import {recherche, Resultats} from "@/app/lib/recherche";
import {construitLesTagsDepuisLUrl} from "@/app/lib/tags";

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
            .sort((poule1, poule2) => Date.parse(poule1.dateDebutJourneeSelectionee) - Date.parse(poule2.dateDebutJourneeSelectionee))
            .reverse();
    }

    public ajoute(poule: Poule) {
        if (Date.parse(poule.dateDebutJourneeSelectionee) > Date.parse(this.dernierePoule.dateDebutJourneeSelectionee)) {
            this.dernierePoule = poule;
        }
        this._poules.push(poule)
    }

    public get dateDernierePoule() {
        return Date.parse(this.dernierePoule.dateDebutJourneeSelectionee)
    }


    construitLesTags = (poule: Poule) => {
        this.tags = construitLesTagsDepuisLUrl(poule.url)
    }
}

export class ResultatsCompetitions implements Resultats {

    private _competitions = new Map<string, Competition>();

    public ajoute = (equipeFormatee: string, poule: Poule) => {
        let urlPoule = poule.url.split("/");
        let idCompetition = `${equipeFormatee}/${urlPoule[0]}/${urlPoule[1]}`
        if (this._competitions.has(idCompetition)) {
            this._competitions.get(idCompetition)?.ajoute(poule)
        } else {
            this._competitions.set(idCompetition, new Competition(equipeFormatee, poule))
        }
    }


    public get competitions() {
        return Array.from(this._competitions.values())
            .sort((competition1, competition2) =>
                competition1.dateDernierePoule - competition2.dateDernierePoule)
            .reverse()
    }

}

export function rechercheCompetitions(requete: string) {
    return recherche(requete, new ResultatsCompetitions())
}