import Image from "next/image";
import imageHand from "@/app/ui/competitions/hand.png";
import {Recherche} from "@/app/ui/competitions/recherche";
import {Suspense} from "react";
import CartesCompetitions from "@/app/ui/competitions/cartes-competitions";

export default async function RechercheCompetitions({recherche}: { recherche: string }) {

    return <>
        <div className="container px-6 py-1 mx-auto">
            <div className="items-center lg:flex">
                <div className="w-full lg:w-1/2">
                    <div className="lg:max-w-lg">
                        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">Recherche ton club sur <span
                            className="text-blue-500">FFHandball</span></h1>

                        <p className="mt-3 text-gray-600 dark:text-gray-400">Toi aussi tu n&apos;en peux plus de rechercher sur le site de la Fédération française de
                            handball. <span
                                className="font-medium text-blue-500">Alors cet outil est fait pour toi</span></p>
                        <div className="flex flex-col mt-6 space-y-3 lg:space-y-0 lg:flex-row">
                            <div className="relative w-full z-0">
                                <Recherche/>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
                    <div className={"hidden" + (recherche != '' ? " md:block" : "block")}>
                        <Image className="w-full h-full max-w-md" src={imageHand} alt="email illustration vector art"/>
                    </div>
                </div>
            </div>
        </div>
        {recherche != '' &&
            <section className="bg-white dark:bg-gray-900">
                <div className="container px-6 py-1 mx-auto">
                    <Suspense key={recherche} fallback={<div>loading...</div>}>
                        <CartesCompetitions query={recherche}/>
                    </Suspense>
                </div>
            </section>
        }
    </>;
}