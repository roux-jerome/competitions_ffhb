import lunr from "lunr";

export default class LunrWrapper {
    constructor(
        public readonly index: lunr.Index
    ) {
    }

}