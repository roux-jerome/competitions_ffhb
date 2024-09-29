import {NextRequest} from "next/server";
import {JourneeFFHB, recupereLaCleCFK, recupereLesRecontres} from "@/app/lib/api-ffhb";
import {rechercheCoteServeurLesJourneesDePoules, JourneeDePoule} from "@/app/lib/matchs-weekend3";


export async function GET(_: NextRequest, {params}: { params: { club: string } }) {
    let journeesDePoule = rechercheCoteServeurLesJourneesDePoules(params.club);


    let cleCFK = await recupereLaCleCFK();
    const details = await Promise.allSettled(
        journeesDePoule.map(journeeDePoule => {
            let urlPouleSplit = journeeDePoule.urlPoule.split("/");
            const typeCompetition = urlPouleSplit[0]
            const idCompetition = urlPouleSplit[1]
            return recupereLesRecontres(typeCompetition, idCompetition, journeeDePoule.extEquipeId, cleCFK)
                .then(resultat => {
                    const journeesFFHB: JourneeFFHB[] = JSON.parse(resultat.poule.journees)

                    return resultat.rencontres.map(rencontre => {
                        let journee = journeesFFHB.find(journeesRecontre => journeesRecontre.journee_numero === Number(rencontre.journeeNumero))!!;
                        return {
                            urlPoule: journeeDePoule.urlPoule,
                            libellePoule: journeeDePoule.libellePoule,
                            numeroJournee: journee.journee_numero,
                            dateDebutJournee: journee.date_debut,
                            nomEquipe: journeeDePoule.nomEquipe,
                            extEquipeId: journeeDePoule.extEquipeId,
                            dateRencontre: rencontre.date,
                            equipe1Libelle: rencontre.equipe1Libelle,
                            equipe2Libelle: rencontre.equipe2Libelle
                        } as JourneeDePoule
                    })
                })
        }))
    logErreurs(details);

    return Response.json(details.filter(detail => detail.status === "fulfilled").flatMap(detail => detail.value))
}


function logErreurs(details: Array<PromiseSettledResult<Awaited<Promise<JourneeDePoule[]>>>>) {
    details.filter(detail => detail.status === "rejected").forEach(console.error);
}
