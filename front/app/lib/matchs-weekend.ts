import {DateTime} from "luxon";
import {recherche, Resultats} from "@/app/lib/recherche";
import {Poule, Rencontre} from "@/app/lib/poule";
import {construitLesTagsDepuisLUrl} from "@/app/lib/tags";

export interface JourneeDePoule {
    urlPoule: string,
    libellePoule: string;
    dateDebutJournee: string;
    numeroJournee: number;
    nomEquipe: string;
    extEquipeId: string,
    equipe1Libelle?: string;
    equipe2Libelle?: string;
    structure1Logo?: string;
    structure2Logo?: string;
    equipe1Score?: string,
    equipe2Score?: string,
    dateRencontre?: string,
}


export function laJourneeLaPlusProcheDeMaintenantDansLeFuture(journeesDePoule: JourneeDePoule[]) {
    const maintenantAvecDecallage = DateTime.now()

    let journeeLaPlusProcheDeMaintenant: DateTime | undefined
    journeesDePoule.forEach(journeeDePoule => {

        let date = DateTime.fromISO(journeeDePoule.dateDebutJournee);
        if (!journeeLaPlusProcheDeMaintenant) {
            journeeLaPlusProcheDeMaintenant = date
        }
        if (Math.abs(journeeLaPlusProcheDeMaintenant.diff(maintenantAvecDecallage).toMillis()) > Math.abs(date.diff(maintenantAvecDecallage).toMillis())) {
            journeeLaPlusProcheDeMaintenant = date
        }


    })
    return journeeLaPlusProcheDeMaintenant!!
}

export function laDateEstDansLaMemeSemaineQuUneAutreDate(date: DateTime, autreDate: DateTime): boolean {
    return date.weekNumber === autreDate.weekNumber && date.year === autreDate.year;
}

const DATE_INVALIDE = DateTime.fromISO("");

export function calculeDateJournee(journeesDePoule: JourneeDePoule[], decalage: number) {
    let dates: DateTime[] = []

    journeesDePoule.forEach(journeeDePoule => {
        let dateDebutJournee = DateTime.fromISO(journeeDePoule.dateDebutJournee);
        let resultatTrouve = dates.find(resultat => laDateEstDansLaMemeSemaineQuUneAutreDate(resultat, dateDebutJournee))

        if (!resultatTrouve) {
            dates.push(dateDebutJournee)
        }
    })
    dates.sort((a: DateTime, b: DateTime) => a.diff(b).toMillis());
    let dateDeReference = laJourneeLaPlusProcheDeMaintenantDansLeFuture(journeesDePoule);
    let indexDateDeReference = 0;
    dates.forEach((date, index) => {
        if (laDateEstDansLaMemeSemaineQuUneAutreDate(date, dateDeReference)) {
            indexDateDeReference = index
        }
    })
    return indexDateDeReference + decalage >= 0 && indexDateDeReference + decalage < dates.length ? dates[indexDateDeReference + decalage] : DATE_INVALIDE
}


class AjouteJourneesDePoule implements Resultats {
    public readonly journeesDePoule: JourneeDePoule[] = []

    ajoute(nomEquipe: string, poule: Poule) {
        const rencontre = poule.rencontres?.find(rencontre => rencontre.equipe1Libelle.toLocaleLowerCase() === nomEquipe || rencontre.equipe2Libelle.toLocaleLowerCase() === nomEquipe)
        const equipe = poule.equipes?.find(equipe => equipe.libelle.toLocaleLowerCase() === nomEquipe)
        if (equipe) {
            this.journeesDePoule.push(
                {
                    urlPoule: poule.url,
                    dateDebutJournee: poule.dateDebutJourneeSelectionee,
                    numeroJournee: poule.journeeCourante,
                    nomEquipe: nomEquipe,
                    extEquipeId: equipe.id,
                    libellePoule: poule.libelleCompetition,
                    equipe1Libelle: rencontre?.equipe1Libelle,
                    equipe2Libelle: rencontre?.equipe2Libelle,
                    structure1Logo: rencontre?.structure1Logo,
                    structure2Logo: rencontre?.structure2Logo,
                    equipe1Score: rencontre?.equipe1Score,
                    equipe2Score: rencontre?.equipe2Score,
                    dateRencontre: rencontre?.date
                }
            )
        }
    }
}

export function rechercheCoteServeurLesJourneesDePoules(club: string) {
    const ajouteJourneesDePoule = new AjouteJourneesDePoule()
    recherche(club, ajouteJourneesDePoule)
    return ajouteJourneesDePoule.journeesDePoule
}

export class Match {

    constructor(
        public readonly libelle: string, public readonly url: string, public readonly nomEquipe: string, public readonly rencontre: Rencontre, public readonly numeroJournee = 0) {

    }

    public get categorie() {
        if (this.libelle.toLowerCase().indexOf("u11") >= 0 || this.libelle.toLowerCase().startsWith("-11 ")) {
            return "-11"
        } else if (this.libelle.toLowerCase().indexOf("u13") >= 0) {
            return "-13"
        } else if (this.libelle.toLowerCase().indexOf("u15") >= 0) {
            return "-15"
        } else if (this.libelle.toLowerCase().indexOf("u18") >= 0 || this.libelle.toLowerCase().indexOf("u17") >= 0) {
            return "-18"
        } else if (this.libelle.toLowerCase().indexOf("plateau") >= 0 || this.libelle.toLowerCase().indexOf("minihand") >= 0) {
            return "mini"
        } else {
            return "S"
        }
    }

    public get type() {
        if (this.libelle.toLowerCase().indexOf("garcons") >= 0
            || this.libelle.toLowerCase().indexOf("masculin") >= 0
            || this.libelle.toLowerCase().indexOf("masc") >= 0
            || this.libelle.toLowerCase().indexOf(" m ") >= 0
            || this.libelle.toLowerCase().endsWith(" m")
            || this.libelle.toLowerCase().indexOf("u11m") >= 0
            || this.libelle.toLowerCase().indexOf("u13m") >= 0
            || this.libelle.toLowerCase().indexOf("u15m") >= 0
        ) {
            return "G"
        } else if (
            this.libelle.toLowerCase().indexOf("feminin") >= 0
            || this.libelle.toLowerCase().indexOf(" f ") >= 0
            || this.libelle.toLowerCase().endsWith(" f")
            || this.libelle.toLowerCase().indexOf("u11f") >= 0
            || this.libelle.toLowerCase().indexOf("u13f") >= 0
            || this.libelle.toLowerCase().indexOf("u15f") >= 0
        ) {
            return "F"
        } else if (this.libelle.toLowerCase().indexOf("mixte") >= 0) {
            return "Mixte"
        } else {
            return ""
        }
    }

    public get dateRencontre() {
        return DateTime.fromFormat(this.rencontre.date, 'yyyy-MM-dd HH:mm:ss.SSS')
    }

    public get estADomicile() {
        return this.rencontre.equipe1Libelle.toLowerCase() === this.nomEquipe
    }

    public get tags() {
        return construitLesTagsDepuisLUrl(this.url)
    }


}