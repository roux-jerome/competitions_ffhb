import {Entete} from "@/app/ui/entete/entete";
import {Suspense} from "react";
import ListeClub from "@/app/ui/clubs/liste-club";
import CartesCompetitions from "@/app/ui/competitions/cartes-competitions";
import {Hero} from "@/app/ui/hero";

export default async function Home({
                                       searchParams,
                                   }: {
    searchParams?: {
        recherche?: string;
    };
}) {

    const recherche = searchParams?.recherche || '';
    return (
        <>
            <Entete/>
            <Hero/>
            {recherche != '' &&
                <section className="bg-white dark:bg-gray-900">

                    <div className="container px-6 py-1 mx-auto">
                        <h2 className="font-semibold">
                            Clubs
                        </h2>
                        <small className="text-xs text-gray-500 py-5 font-light"> Choisis ton club pour accéder aux matchs du week-end.</small>

                        <div className="py-7">
                            <Suspense key={recherche + "clubs"} fallback={<div>loading...</div>}>
                                <ListeClub recherche={recherche}/>
                            </Suspense>
                        </div>
                        <h2 className="font-semibold">Compétitions</h2>
                        <small className="text-xs text-gray-500 py-5 font-light"> Choisis une compétition pour accéder au détail sur le site de la ffhandball.</small>
                        <Suspense key={recherche + "competitions"} fallback={<div>loading...</div>}>
                            <CartesCompetitions recherche={recherche}/>
                        </Suspense>
                    </div>
                </section>
            }
        </>
    );
}


