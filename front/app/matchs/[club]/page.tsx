import {Entete} from "@/app/ui/entete/entete";
import ListeClub from "@/app/ui/clubs/liste-club";
import {Suspense} from "react";
import {MatchsDuWeekEnd} from "@/app/ui/matchs/matchs-du-weekend";
import Link from "next/link";

export default async function Matchs({params}: { params: { club: string } }) {
    const club = decodeURIComponent(params.club)

    return <>
        <Entete/>
        <Link href={"/?recherche=" + params.club} className="text-sm text-blue-500 pl-3">
            &lt;- Recherche
        </Link>
        <section className="bg-white dark:bg-gray-900">

            <div className="container px-6 py-12 mx-auto flex flex-col items-center">
                <small className="text-white ml-4 px-2 py-1 rounded-full bg-blue-500">EN CONSTRUCTION</small>
                <Suspense key={club + "clubs"} fallback={<div>loading...</div>}>
                    <ListeClub recherche={club} afficheSousFormeDeLien={false}/>
                </Suspense>
                <h1 className="font-bold text-2xl">Matchs du week-end</h1>
                <Suspense key={club + "match"} fallback={<div>loading...</div>}>
                    <MatchsDuWeekEnd club={club}/>
                </Suspense>
            </div>
        </section>
    </>

}