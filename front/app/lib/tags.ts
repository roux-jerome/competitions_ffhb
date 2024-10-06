export function construitLesTagsDepuisLUrl(url: String) {

    let tags = []

    let details = url.split("/");

    let chaineContenantDesTags = details[1];
    let formatageTexte = chaineContenantDesTags.split("-");
    formatageTexte.pop()
    tags.push(details[0].replaceAll("-", " "));

    ["masculin", "masculine", "masculins", "feminin", "feminine", "feminines", "u18", "u15", "u13", "u11"].forEach((tagAChercher: string) => {
        if (formatageTexte.includes(tagAChercher)) {
            tags.push(tagAChercher)
        }
    })

    if (formatageTexte.includes("u11m") || formatageTexte.includes("u13m") || formatageTexte.includes("u15m")) {
        tags.push("masculin")
    }

    if (formatageTexte.includes("u11f") || formatageTexte.includes("u13f") || formatageTexte.includes("u15f")) {
        tags.push("feminin")
    }

    if (formatageTexte.includes("u11m") || formatageTexte.includes("u11f")) {
        tags.push("u11")
    }

    if (formatageTexte.includes("u13m") || formatageTexte.includes("u13f")) {
        tags.push("u13")
    }

    if (formatageTexte.includes("u15m") || formatageTexte.includes("u15f")) {
        tags.push("u15")
    }

    if (formatageTexte.includes("16")) {
        tags.push("senior")
    }

    return tags
}