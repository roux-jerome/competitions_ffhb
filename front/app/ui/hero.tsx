"use client"
import {motion} from "framer-motion";
import {HeroHighlight, Highlight} from "@/app/ui/hero-highlight";

export function Hero(){

    return <HeroHighlight>
        <motion.h1
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: [20, -5, 0],
            }}
            transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
            }}
            className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
        >
            Avec RechercheFFHB, recherche les informations sur ton club de handball. {"     "}
            <Highlight className="text-black dark:text-white">
                Simple, rapide et efficace
            </Highlight>

        </motion.h1>
        <p className="mt-10 md:mt-20 mx-10 md:text-2xl font-bold text-gray-500 dark:text-gray-400">Toi aussi tu n&apos;en peux plus de rechercher sur le site de la Fédération Française de
            Handball. <span
                className="text-orange-600">Alors cet outil est fait pour toi !</span></p>
    </HeroHighlight>
}