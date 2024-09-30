import {DateTime} from "luxon";
import {recherche, Resultats} from "@/app/lib/recherche";
import {Poule} from "@/app/lib/poule";

export interface JourneeDePoule {
    urlPoule: string,
    libellePoule: string;
    dateDebutJournee: string;
    numeroJournee: number;
    nomEquipe: string;
    extEquipeId: string,
    equipe2Libelle?: string;
    equipe1Libelle?: string;
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
        const recontre = poule.rencontres?.find(rencontre => rencontre.equipe1Libelle.toLocaleLowerCase() === nomEquipe || rencontre.equipe2Libelle.toLocaleLowerCase() === nomEquipe)
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
                    equipe1Libelle: recontre?.equipe1Libelle,
                    equipe2Libelle: recontre?.equipe2Libelle,
                    dateRencontre: recontre?.date
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
