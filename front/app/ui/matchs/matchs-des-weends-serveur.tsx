import MatchsDesWeekendsClient from "@/app/ui/matchs/matchs-des-weekends-client";
import {rechercheCoteServeurLesJourneesDePoules} from "@/app/lib/matchs-weekend3";


export default function MatchsDesWeekEndsServeur({club}: { club: string }) {

    return <MatchsDesWeekendsClient journeesDePouleInitiale={rechercheCoteServeurLesJourneesDePoules(club)} club={club}/>
}