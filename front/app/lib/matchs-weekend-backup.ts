import {Poule} from "@/app/lib/poule";
import {recherche, Resultats} from "@/app/lib/recherche";
import {DateTime} from "luxon";
import {Match} from "@/app/lib/matchs-weekend";
import {FORMAT_COURT, LOCAL_FR} from "@/lib/configuration";

class JourneeBackup {
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


export class MatchsDuWeekendBackup implements Resultats {


    private _nomsEquipesParPoules: { nomEquipe: string, poule: Poule }[] = []


    public get date(): string {
        let laJourneeLaPlusProche = this.laJourneeLaPlusProcheDeMaintenantDansLeFuture;
        return `du ${(laJourneeLaPlusProche.debut.toFormat(FORMAT_COURT, LOCAL_FR))} au ${(laJourneeLaPlusProche.fin.toFormat(FORMAT_COURT, LOCAL_FR))}`
    }

    private get laJourneeLaPlusProcheDeMaintenantDansLeFuture() {

        const journees: JourneeBackup[] = []
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
                    journeeAModifier = new JourneeBackup(
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
        return this.laJourneeLaPlusProcheDeMaintenantDansLeFuture
    }

}

export async function rechercheMatchsDuWeekendBackup(club: string) {
    return recherche(club, new MatchsDuWeekendBackup());
}

