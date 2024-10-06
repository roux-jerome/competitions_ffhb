import {Entete} from "@/app/ui/entete/entete";
import Link from "next/link";
import ListeClub from "@/app/ui/clubs/liste-club";
import MatchsDesWeekEndsServeur from "@/app/ui/matchs/matchs-des-weends-serveur";

export async function generateMetadata({params}: { params: { club: string } }) {
    return {
        title: `Recherche FFHB - matchs ${decodeURIComponent(params.club)}`,
        description: `Accéde aux matchs du week-end de ${decodeURIComponent(params.club)} à partir des informations du site de la Fédération Française de handball.`
    };
}


export const revalidate = 28800

export const dynamicParams = true

export function generateStaticParams(){
    return ["HBC IZONNAIS", "CANEJAN HBC","AS AMBARESIENNE"].map(club => ({
        params: {
            club: encodeURIComponent(club)
        }
    }))
}

export default async function Matchs({params}: { params: { club: string }; }) {
    const club = decodeURIComponent(params.club)

    return <>
        <Entete/>

        <section>
            <div className="container mx-auto flex flex-col items-start">
                <Link href={"/?recherche=" + params.club} className="text-gray-500 text-sm py-2 px-1 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round" className="lucide lucide-chevron-left">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                    <span className="">Recherche</span>
                </Link>

            </div>
            <div className="container px-2 py-2 mx-auto flex flex-col items-center">
                <ListeClub recherche={club} afficheSousFormeDeLien={false}/>
                <MatchsDesWeekEndsServeur club={club}/>
            </div>
        </section>
    </>

}