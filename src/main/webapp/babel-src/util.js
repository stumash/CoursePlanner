/*
 *  Collection of utilities such as constants or functions that may be used by more than one component
 *
 *  All constants should be kept in this file.
 *
 */

export const SEASON_NAMES = ["Fall", "Winter", "Summer"];
export const DEFAULT_PROGRAM = "SOEN-General-Coop";

// Take an array of semester objects and add in any missing semesters - this functionality will be rendered useless once we include years in the sequence JSON spec
export function fillMissingSemesters(semesterList){
    for(let i = 0; i < semesterList.length; i++){

        let expectedSeason = SEASON_NAMES[i%3].toLowerCase();

        if(!(semesterList[i].season === expectedSeason)){
            semesterList.splice(i, 0, {
                "courseList" : [],
                "isWorkTerm" : "false",
                "season" : expectedSeason
            });
        }

    }
    return semesterList;
}