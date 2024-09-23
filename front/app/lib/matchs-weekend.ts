import {Poule, Rencontre} from "@/app/lib/poule";
import {recherche, Resultats} from "@/app/lib/recherche";
import {DateTime} from "luxon";

export class Match {

    constructor(public libelle: string, public url: string, public nomEquipe: string, public rencontre: Rencontre) {

    }

    public get categorie() {
        if (this.libelle.toLowerCase().indexOf("u11") >= 0 || this.libelle.toLowerCase().startsWith("-11 ")) {
            return "-11 "
        } else if (this.libelle.toLowerCase().indexOf("u13") >= 0) {
            return "-13 "
        } else if (this.libelle.toLowerCase().indexOf("u15") >= 0) {
            return "-15 "
        } else if (this.libelle.toLowerCase().indexOf("u18") >= 0) {
            return "-18 "
        } else if (this.libelle.toLowerCase().indexOf("plateau") >= 0 || this.libelle.toLowerCase().indexOf("minihand") >= 0) {
            return "mini "
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


}

class Journee {
    private _domicile: Match[] = []
    private _exterieur: Match[ ] = []

    constructor(public debut: DateTime, public fin: DateTime) {
    }

    public ajouteMatch(match: Match) {
        if (match.estADomicile) {
            this._domicile.push(match)
        } else {
            this._exterieur.push(match)
        }
    }

    public get domicile() {
        return this._domicile.sort((a, b) => a.dateRencontre.toMillis() - b.dateRencontre.toMillis())
    }

    public get exterieur() {
        return this._exterieur.sort((a, b) => a.dateRencontre.toMillis() - b.dateRencontre.toMillis())
    }

}

const LOCAL_FR = {locale: "fr"};
const FORMAT_COURT = 'd LLLL yyyy';

export class MatchsDuWeekend implements Resultats {
    private readonly dateAChercher?: DateTime<true>;

    constructor(dateAChercher?: DateTime<true>) {
        this.dateAChercher = dateAChercher
    }


    private _nomsEquipesParPoules: { nomEquipe: string, poule: Poule }[] = []


    public get date(): string {
        if (this.dateAChercher) {
            return `du ${(this.dateAChercher.toFormat(FORMAT_COURT, LOCAL_FR))} au ${(this.dateAChercher.plus({day: 1}).toFormat(FORMAT_COURT, LOCAL_FR))}`
        } else {
            let laJourneeLaPlusProche = this.laJourneeLaPlusProcheDeMaintenantDansLeFuture;
            return `du ${(laJourneeLaPlusProche.debut.toFormat(FORMAT_COURT, LOCAL_FR))} au ${(laJourneeLaPlusProche.fin.toFormat(FORMAT_COURT, LOCAL_FR))}`
        }
    }

    private get laJourneeLaPlusProcheDeMaintenantDansLeFuture() {

        const journees: Journee[] = []
        this._nomsEquipesParPoules.forEach(nomEquipeEtPoule => {
            let rencontre = nomEquipeEtPoule.poule.rencontres?.find(
                rencontre => rencontre.equipe1Libelle.toLowerCase() === nomEquipeEtPoule.nomEquipe || rencontre.equipe2Libelle.toLowerCase() === nomEquipeEtPoule.nomEquipe
            );
            if (rencontre) {
                let dateDebutJournee = DateTime.fromISO(nomEquipeEtPoule.poule.dateDebutJourneeSelectionee);
                let dateFinJournee = DateTime.fromISO(nomEquipeEtPoule.poule.dateFinJourneeSelectionee);

                let journeeAModifier = journees.find(
                    journee =>
                        journee.debut.equals(dateDebutJournee)
                        || journee.debut.equals(dateDebutJournee.minus({days: 1}))
                        || journee.debut.equals(dateDebutJournee.plus({days: 1})))

                if (!journeeAModifier) {
                    journeeAModifier = new Journee(
                        DateTime.fromISO(nomEquipeEtPoule.poule.dateDebutJourneeSelectionee),
                        DateTime.fromISO(nomEquipeEtPoule.poule.dateFinJourneeSelectionee)
                    )
                    journees.push(journeeAModifier)
                }
                journeeAModifier.ajouteMatch(new Match(
                    nomEquipeEtPoule.poule.libelleCompetition, nomEquipeEtPoule.poule.url,
                    nomEquipeEtPoule.nomEquipe,
                    rencontre
                ))
                if (dateDebutJournee < journeeAModifier.debut) {
                    journeeAModifier.debut = dateDebutJournee
                }
                if (dateFinJournee > journeeAModifier.fin) {
                    journeeAModifier.fin = dateFinJournee
                }

            }
        })

        let journeeLaPlusProcheDeMaintenant = journees[0]
        journees.forEach(journee => {
            if (Math.abs(journeeLaPlusProcheDeMaintenant.debut.diffNow().toMillis()) > Math.abs(journee.debut.diffNow().toMillis())) {
                journeeLaPlusProcheDeMaintenant = journee
            }
        })

        return journeeLaPlusProcheDeMaintenant
    }

    ajoute(nomEquipe: string, poule: Poule) {
        this._nomsEquipesParPoules.push({nomEquipe: nomEquipe, poule: poule})
    }


    public get matchs() {
        if(this.dateAChercher){
            return this.laJourneeLaPlusProcheDeMaintenantDansLeFuture
        }else{
            return this.laJourneeLaPlusProcheDeMaintenantDansLeFuture
        }

    }

}

export async function rechercheMatchsDuWeekend(club: string, dateAChercher?: DateTime<true>) {
    return recherche(club, new MatchsDuWeekend(dateAChercher));
}

