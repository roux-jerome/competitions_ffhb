import {NextRequest} from "next/server";
import {DateTime} from "luxon";
import {recherche, Resultats} from "@/app/lib/recherche";
import {Poule} from "@/app/lib/poule";
import {recupereLaCleCFK, recupereLesRecontres} from "@/app/lib/api-ffhb";
import {Equipe, EquipeRencontre} from "@/app/lib/matchs-weekend2";


export async function GET(_: NextRequest, {params}: { params: { club: string } }) {
    let resultat = recherche(params.club, new Journees());
    let equipes = resultat.laJourneeLaPlusProcheDeMaintenantDansLeFuture.equipes;

    let cleCFK = await recupereLaCleCFK();
    const details = await Promise.allSettled(
        equipes.map(equipe =>
            recupereLesRecontres(equipe.typeCompetition, equipe.idCompetition, equipe.extEquipeId, cleCFK)
                .then(resultat => resultat.rencontres.map(rencontre => new EquipeRencontre(equipe, rencontre)))
        ))
    logErreurs(details);

    return Response.json(details.filter(detail => detail.status === "fulfilled").flatMap(detail => detail.value))
}

class Journee {

    public equipes: Equipe[] = []

    constructor(
        public debut: DateTime,
        public fin: DateTime
    ) {
    }

    public ajouteEquipe(equipe: Equipe) {
        this.equipes.push(equipe);
    }
}

class Journees implements Resultats {
    public journees: Journee[] = []

    ajoute(nomEquipe: string, poule: Poule) {
        const extEquipeId = poule.equipes?.find(equipe => equipe.libelle.toLowerCase() === nomEquipe)?.id
        if (extEquipeId) {
            let dateDebutJournee = DateTime.fromISO(poule.dateDebutJourneeSelectionee);
            let dateFinJournee = DateTime.fromISO(poule.dateFinJourneeSelectionee);

            let journeeAModifier = this.journees.find(
                journee =>
                    journee.debut.equals(dateDebutJournee)
                    || journee.debut.equals(dateDebutJournee.minus({days: 1}))
                    || journee.debut.equals(dateDebutJournee.plus({days: 1})))


            if (!journeeAModifier) {


                journeeAModifier = new Journee(
                    DateTime.fromISO(poule.dateDebutJourneeSelectionee),
                    DateTime.fromISO(poule.dateFinJourneeSelectionee),
                )
                this.journees.push(journeeAModifier)
            }
            journeeAModifier.ajouteEquipe(new Equipe(
                poule.url,
                nomEquipe,
                extEquipeId,
                `${poule.journeeCourante}`,
                poule.dateDebutJourneeSelectionee
            ))
            if (dateDebutJournee < journeeAModifier.debut) {
                journeeAModifier.debut = dateDebutJournee
            }
            if (dateFinJournee > journeeAModifier.fin) {
                journeeAModifier.fin = dateFinJournee
            }
        }

    }

    public get laJourneeLaPlusProcheDeMaintenantDansLeFuture() {
        let journeeLaPlusProcheDeMaintenant = this.journees[0]
        this.journees.forEach(journee => {
            if (Math.abs(journeeLaPlusProcheDeMaintenant.debut.diffNow().toMillis()) > Math.abs(journee.debut.diffNow().toMillis())) {
                journeeLaPlusProcheDeMaintenant = journee
            }
        })

        return journeeLaPlusProcheDeMaintenant
    }
}

function logErreurs(details: Array<PromiseSettledResult<Awaited<Promise<EquipeRencontre[]>>>>) {
    details.filter(detail => detail.status === "rejected").forEach(console.error);
}
