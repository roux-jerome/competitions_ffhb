import {Poule} from "@/app/poule";

export class Competitions {

    private _competitions = new Map<string, Competition>();

    public ajoute = (equipe: string, poule: Poule) => {
        let urlPoule = poule.url.split("/");
        let urlCompetition = `${urlPoule[0]}/${urlPoule[1]}`
        let equipeFormatee = equipe.replaceAll("_", " ")
        if (this._competitions.has(urlCompetition)) {
            this._competitions.get(urlCompetition)?.ajoute(poule)
        } else {
            this._competitions.set(urlCompetition, new Competition(equipeFormatee, poule))
        }
    }


    public get liste() {
        return Array.from(this._competitions.values())
            .sort((competition1, competition2) =>
                competition1.dateDernierePoule - competition2.dateDernierePoule)
            .reverse()
    }
}

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
        console.log(formatageTexte)
        this.tags.push(details[0].replaceAll("-", " "));

        ["masculin", "feminin", "u18", "u15", "u13", "u11"].forEach((tagAChercher: string) => {
            if (formatageTexte.includes(tagAChercher)) {
                this.tags.push(tagAChercher)
            }
        })

        if (formatageTexte.includes("16")) {
            this.tags.push("senior")
        }


    }


}
