# RechercheFFHB

Avec RechercheFFHB, trouve les informations sur tes clubs de handball préférés. Tu pourras aussi accéder 

Toi aussi tu n'en peux plus de rechercher sur le site de la Fédération Française de Handball alors cet outil est fait pour toi !

Essaye-le ici: <https://rechercheffhb.fr/> 👈


## Fonctionnement

Le projet est séparé en deux modules : 
* scrapper : C'est un programme go qui permet de constituer un référentiel contenant l'ensemble des poules informations des poules de la ligue pour une saison donnée. Le référentiel est disponnible dans front/app/lib/poules.json. Le référentiel est mise à jour tout les deux trois jours automatiquement ( lancement par un github action ).
* front : C'est une application nextjs. Elle constitue un index ( utilisation de la librairie lunr) qui permet d'effectuer une recherche dans le référentiel et propose une interface permettant de présenter les résultats. Elle est déployée avec vercel


## Contribution

