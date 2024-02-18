import {Entete} from "@/app/ui/entete";
import {Suspense} from "react";
import {ResultatClub} from "@/app/clubs/[club]/resultat-club";

export default async function Club({params}: { params: { club: string } }) {

    return (
        <>
            <Entete/>
            <Suspense key={params.club} fallback={<div>loading...</div>}>
                <ResultatClub club={decodeURI(params.club)}/>
            </Suspense>
        </>
    );
}