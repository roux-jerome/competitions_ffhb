import {Entete} from "@/app/ui/entete/entete";
import {Suspense} from "react";
import ListeClub from "@/app/ui/clubs/liste-club";
import CartesCompetitions from "@/app/ui/competitions/cartes-competitions";
import {Hero} from "@/app/ui/hero";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

export async function generateMetadata({searchParams,}: { searchParams?: { recherche?: string; }; }) {
    const recherche = searchParams?.recherche ? ` - ${searchParams.recherche}` : '';

    return {
        title: `Recherche FFHB${recherche}`
    };
}

export default async function Home({searchParams,}: { searchParams?: { recherche?: string; }; }) {

    const recherche = searchParams?.recherche || '';
    return (
        <div className="min-h-screen flex flex-col">
            <Entete/>
            <Hero/>
            {recherche != '' &&
                <section className="bg-white dark:bg-gray-900 flex-grow flex flex-col">

                    <div className="container px-6 py-1 mx-auto flex-grow text-center">
                        <h2 className="font-bold pt-10 text-4xl section-title text-gray-800">
                            Clubs trouvés
                        </h2>
                        <span className="inline-block w-16 h-1 bg-orange-500 rounded-full"></span>
                        <p className="text-gray-500 mt-5">
                            Choisis ton club pour accéder aux matchs du week-end.<br/>
                        </p>
                        <div className="relative text-center">
                            <Suspense key={recherche + "clubs"} fallback={<div>loading...</div>}>
                                <ListeClub recherche={recherche}/>
                            </Suspense>
                        </div>

                    </div>
                    <div className="container px-6 py-1 mx-auto text-center">
                        <Accordion type="single" className="mt-auto" collapsible>
                            <AccordionItem value="competitions">
                                <AccordionTrigger>
                                    <p className="text-gray-500 mt-5 w-full">
                                        Tu ne trouves pas ton club ?<br/>
                                        <span className="text-xs">Cliques pour afficher la liste des compétitions</span>
                                    </p>

                                </AccordionTrigger>
                                <AccordionContent>
                                    <h2 className="font-bold pt-10 text-4xl section-title text-gray-800">
                                        Compétitions trouvées
                                    </h2>
                                    <span className="inline-block w-16 h-1 bg-orange-500 rounded-full"></span>
                                    <p className="text-s text-gray-500 mt-5 font-medium "> Choisis une compétition pour accéder au détail sur le site de la ffhandball.</p>
                                    <Suspense key={recherche + "competitions"} fallback={<div>loading...</div>}>
                                        <CartesCompetitions recherche={recherche}/>
                                    </Suspense>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                </section>
            }
        </div>
    );
}


