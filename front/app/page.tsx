'use client'

import LiensFfhb from "@/app/liens-ffhb";
import {ChangeEvent, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import index from './index.json';
import lunr from 'lunr'
import Image from "next/image";
import imageHand from "./hand.png"
import iconimageHand from "./icon-handball.png"
import {Competition} from "@/app/competition";
import Resultats from "@/app/resultats";

export default function Home() {
    const [competitions, setCompetitions] = useState([] as Competition[]);
    const idx = lunr.Index.load(index)
    const [champsRecherche, setChampsRecherche] = useState("");
    const recherche = useDebouncedCallback(
        (recherche: string) => {
            if (recherche) {
                let rechercheFuzzy = recherche.normalize("NFC").replaceAll(" ", "*_*")
                let results = idx.search(`*${rechercheFuzzy}*`);
                setCompetitions(
                    results
                        .map((resultat) => new Competition(resultat))
                        .toSorted((a, b) => a.ordre - b.ordre).reverse()
                );
            }
        },
        1000
    );


    function changeLaValeurDeLaRecherche(e: ChangeEvent<HTMLInputElement>) {
        setChampsRecherche(e.target.value)
        recherche(e.target.value);
    }

    return (
        <>
            <header className="bg-white dark:bg-gray-900">
                <nav className="border-t-4 border-blue-500">
                    <div className="container flex items-center justify-between px-6 py-3 mx-auto">
                        <a href="">
                            <Image className="w-auto h-6 sm:h-7" src={iconimageHand} width={450}
                                   height={64} alt=""/>
                        </a>

                        <LiensFfhb></LiensFfhb>

                    </div>
                </nav>

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
                                        <input id="club" type="text"
                                               value={champsRecherche}
                                               onChange={changeLaValeurDeLaRecherche}
                                               className="block p-3 text-lg w-full bg-transparent text-gray-700 border rounded-full focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                                               placeholder=" "/>
                                        <label htmlFor="club"
                                               className="absolute top-0 p-4 origin-0 duration-300 -z-1 bg-white text-gray-500">Saisie ton club</label>
                                        <button type="submit" className="absolute right-6 top-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                                 stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
                            <div className={"hidden" + (competitions.length > 0 ? " md:block" : "block")}>
                                <Image className="w-full h-full max-w-md" src={imageHand} width={500}
                                       height={500} alt="email illustration vector art"/>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <section className="bg-white dark:bg-gray-900">
                <div className="container px-6 py-1 mx-auto">
                    {/*        <div className="flex py-4 mt-4 overflow-x-auto overflow-y-hidden md:justify-center dark:border-gray-700">*/}
                    {/*            <button*/}
                    {/*                className="h-12 px-8 py-2 -mb-px text-sm text-center text-blue-600 bg-transparent border-b-2 border-blue-500 sm:text-base dark:border-blue-400 dark:text-blue-300 whitespace-nowrap focus:outline-none">*/}
                    {/*                Animation*/}
                    {/*            </button>*/}

                    {/*            <button*/}
                    {/*                className="h-12 px-8 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-gray-200 sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none dark:border-gray-700 dark:hover:border-gray-400 hover:border-gray-400">*/}
                    {/*                Web design*/}
                    {/*            </button>*/}

                    {/*            <button*/}
                    {/*                className="h-12 px-8 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-gray-200 sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none dark:border-gray-700 dark:hover:border-gray-400 hover:border-gray-400">*/}
                    {/*                App design*/}
                    {/*            </button>*/}

                    {/*            <button*/}
                    {/*                className="h-12 px-8 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-gray-200 sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none dark:border-gray-700 dark:hover:border-gray-400 hover:border-gray-400">*/}
                    {/*                Branding*/}
                    {/*            </button>*/}
                    {/*        </div>*/}
                    <Resultats competitions={competitions}/>

                </div>
            </section>
        </>
    );
}


