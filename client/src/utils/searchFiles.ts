import { MDFile } from "./types";

const searchFiles = (array: MDFile[], query: string) => {

    if (!array.length || !query || query.length < 2) {
        return [];
    }

    let results: number[] = [];

    /* We create a sliding window with our query which begins with the whole word search
    and every iteration decreases length by 1 backwards e.g. test will start with test then tes then te upto maximum 2 chars */
    for (let i = query.length - 1; i >= 1; i--) {
        /* Creates sliding window or the new search term we will use for this iteration */
        let searchTerm = query.substring(0, i).toLowerCase();

        /* To store the matches for this iteration because if we get a couple of matches now, the next
        iteration will likely just match the same unit, and because of our sliding window, the first match is the closest
        to the input search query */
        let tempResults = [];

        /* Iterate through all available files */
        for (let j = 0; j < array.length; j++) {

            /* For convenience */
            let lowercaseName = array[j].name.toLowerCase();

            /* If the name is smaller than the temp search term then its impossible for it to match */
            if (lowercaseName.length < searchTerm.length) {
                continue;
            }

            /* Create a sliding window of the size of our search term which checks if its equal to our search query.
            The greater than equals to is important otherwise we will skip the last character of the file name we are searching */
            for (let k = 0; k + searchTerm.length <= lowercaseName.length; k++) {
                if (lowercaseName.substring(k, k + searchTerm.length) === searchTerm) {
                    tempResults.push(j);
                    /* Dont search once the file has been added */
                    break;
                }
            }

        }

        /* If we get any matches assign to main results variable and stop searching */
        if (tempResults.length) {
            results = tempResults;
            break;
        }
    }

    // eslint-disable-next-line array-callback-return
    let resultFiles = array.filter((x, index) => {
        if (results.includes(index)) {
            return x;
        }
    });

    return resultFiles;

}

export default searchFiles;