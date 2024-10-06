import {Entete} from "@/app/ui/entete/entete";
import ListeClub from "@/app/ui/clubs/liste-club";
import {Suspense} from "react";
import {MatchsDuWeekEndBackup} from "@/app/ui/matchs/matchs-du-week-end-backup";
import Link from "next/link";

export async function generateMetadata({params, searchParams}: { params: { club: string }, searchParams?: { date?: string; }; }) {
    const date = searchParams?.date ? ` - ${searchParams.date}` : '';

    return {
        title: `Recherche FFHB - matchs ${decodeURIComponent(params.club)}${date}`,
        description: `Accéde aux matchs du week-end de ${decodeURIComponent(params.club)} à partir des informations du site de la Fédération Française de handball.`
    };
}


export default async function Matchs({params}: { params: { club: string }; }) {
    const club = decodeURIComponent(params.club)

    return <>
        <Entete/>

        <section>
            <div className="container pt-10 mx-auto flex flex-col items-start">
                <Link href={"/?recherche=" + params.club} className="text-gray-500 text-sm py-2 px-4 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round" className="lucide lucide-chevron-left">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                    <span className="">Recherche</span>
                </Link>

            </div>
            <div className="container px-6 py-2 mx-auto flex flex-col items-center">

                <Suspense key={club + "clubs"} fallback={<div>loading...</div>}>
                    <ListeClub recherche={club} afficheSousFormeDeLien={false}/>
                </Suspense>
                <h1 className="font-bold text-2xl">Matchs du week-end </h1>
                <Suspense key={club + "match"} fallback={<div>loading...</div>}>
                    <MatchsDuWeekEndBackup club={club}/>
                </Suspense>
            </div>
        </section>
    </>

}