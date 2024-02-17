import {Entete} from "@/app/ui/entete";
import RechercheCompetitions from "@/app/ui/competitions/recherche-competitions";

export default async function Club({params}: { params: { club: string } }) {

    return (
        <>
            <Entete/>
            {params.club}
        </>
    );
}