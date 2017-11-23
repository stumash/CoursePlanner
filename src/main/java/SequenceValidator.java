import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.exception.ExceptionUtils;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

public class SequenceValidator extends CPServlet {

    // Constants representing the types of issues that course sequences are validated against.
    private static enum VALIDATION_ISSUES {

        COURSE_DUPLICATE, CREDITCOUNT, PREREQUISITE, COREQUISITE;

        // JSON-friendly names for returning validation messages to client
        @Override
        public String toString() {
            if (this == COURSE_DUPLICATE) {
                return "courseDuplicate";
            } else if (this == CREDITCOUNT) {
                return "creditCount";
            } else if (this == PREREQUISITE) {
                return "prerequisite";
            } else if (this == COREQUISITE){
                return "corequisite";
            }
            return null;
        }
    }


    private static final int SEMESTERS_PER_YEAR = 3;

    public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
    {
        logger.info("---------User requested a sequence validation---------");

        response.setContentType("text/html");

        JSONObject courseSequenceObject = (JSONObject) grabPropertyFromRequest("courseSequenceObject", request);

        String validationResults;
        try {
            validationResults = validateSequence(courseSequenceObject).toString();
        } catch(Exception e){
            JSONObject validationResultsJsonObj = new JSONObject();

            try {
                // TODO: output error object only if logger.DEBUG ?
                validationResultsJsonObj.put("error", ExceptionUtils.getStackTrace(e));
            } catch(JSONException jsonExc) { jsonExc.printStackTrace(); }

            validationResults = validationResultsJsonObj.toString();
        }

        logger.info("Responding with: " + validationResults);

        response.getWriter().println(validationResults);
    }

    /**
     * @param cso the json course sequence object
     * @return a json object representing the results of the course sequence validation
     */
    private JSONObject validateSequence(JSONObject cso)
    throws Exception
    {
        JSONObject sequenceValidationResults = new JSONObject();
        boolean sequenceIsValid = true;
        JSONArray issues = new JSONArray();

        int creditCount = 0; // sum up all credits to check if total credits in valid range
        HashMap<String, Integer> cc2si = new HashMap<>(); // map course code to semester id

        JSONArray yearList = cso.getJSONArray("yearList");
        if (yearList.length() == 0) throw new Exception("empty yearList");

        // loop through all the courses in each semester multiple times
        int numLoops = 2; // for now only 2 loops needed
        for (int loopCount = 0; loopCount < numLoops; loopCount++)
        {
            // for each year
            for (int yearIdx = 0; yearIdx < yearList.length(); yearIdx++)
            {
                JSONObject year = (JSONObject) yearList.get(yearIdx);

                JSONObject fall   = (JSONObject) year.get("fall");
                JSONObject winter = (JSONObject) year.get("winter");
                JSONObject summer = (JSONObject) year.get("summer");

                // for each semester in that year
                JSONObject[] semsInYear = {fall, winter, summer};
                for (int semsInYearIdx = 0; semsInYearIdx < semsInYear.length; semsInYearIdx++)
                {
                    int uniqueSemesterId = yearIdx * semsInYear.length + semsInYearIdx;

                    // for each course in that semester
                    JSONArray coursesInSem = (JSONArray) semsInYear[semsInYearIdx].get("courseList");
                    for (int coursesInSemIdx = 0; coursesInSemIdx < coursesInSem.length(); coursesInSemIdx++)
                    {
                        JSONObject course = (JSONObject) coursesInSem.get(coursesInSemIdx);
                        String courseCode = (String) course.get("code");

                        if (loopCount == 0)
                        {
                            // COURSE DUPLICATE

                            // if not duplicate course
                            if (cc2si.get(courseCode) == null) {
                                // only put course in map once, not for duplicates
                                cc2si.put(courseCode, uniqueSemesterId);
                            } else {
                                sequenceIsValid = false;

                                JSONObject issue = new JSONObject();
                                issue.put("type", VALIDATION_ISSUES.COURSE_DUPLICATE.toString());

                                JSONObject issueData = new JSONObject();
                                issueData.put("courseCode", courseCode);

                                issue.put("data", issueData);
                                issues.put(issue);
                            }

                            // CREDIT COUNT

                            creditCount += (Integer) course.get("credits");
                        }
                        else if (loopCount == 1)
                        {
                            // PREREQUISITE

                            boolean prereqsValid = true;
                            JSONObject issue = new JSONObject();
                            issue.put("type", VALIDATION_ISSUES.PREREQUISITE.toString());
                            JSONObject issueData = new JSONObject();
                            issueData.put("culpritCourseCode", courseCode);
                            JSONArray missingPrereqCourseCodes = new JSONArray();

                            JSONArray prereqs = (JSONArray) course.get("prereqs");
                            for (int prereqIdx = 0; prereqIdx < prereqs.length(); prereqIdx++) {
                                String prereqCourseCode = (String) prereqs.get(prereqIdx);
                                Integer prereqSemesterId = cc2si.get(prereqCourseCode);
                                if (prereqSemesterId == null || prereqSemesterId >= uniqueSemesterId) {
                                    sequenceIsValid = false;
                                    prereqsValid = false;
                                    missingPrereqCourseCodes.put(prereqCourseCode);
                                }
                            }

                            if (!prereqsValid) {
                                issueData.put("missingCourseCodes", missingPrereqCourseCodes);
                                issue.put("data", issueData);
                                issues.put(issue);
                            }

                            // COREQUISITE

                            boolean coreqsValid = true;
                            issue = new JSONObject();
                            issue.put("type", VALIDATION_ISSUES.COREQUISITE.toString());
                            issueData = new JSONObject();
                            issueData.put("culpritCourseCode", courseCode);
                            JSONArray missingCoreqCourseCodes = new JSONArray();

                            JSONArray coreqs = (JSONArray) course.get("coreqs");
                            for (int coreqIdx = 0; coreqIdx < coreqs.length(); coreqIdx++) {
                                String coreqCourseCode = (String) coreqs.get(coreqIdx);
                                Integer coreqSemesterId = cc2si.get(coreqCourseCode);
                                if (coreqSemesterId == null || coreqSemesterId > uniqueSemesterId) {
                                    sequenceIsValid = false;
                                    coreqsValid = false;
                                    missingCoreqCourseCodes.put(coreqCourseCode);
                                }
                            }

                            if (!coreqsValid) {
                                issueData.put("missingCourseCodes", missingCoreqCourseCodes);
                                issue.put("data", issueData);
                                issues.put(issue);
                            }
                        }
                    }
                }
            }
        }

        // CREDIT COUNT

        Integer minTotalCredits = (Integer) cso.get("minTotalCredits");
        if (creditCount < minTotalCredits) {
            sequenceIsValid = false;
            JSONObject issue = new JSONObject();
            issue.put("type", VALIDATION_ISSUES.CREDITCOUNT.toString());
            JSONObject issueData = new JSONObject();
            issueData.put("required", minTotalCredits.toString());
            issueData.put("actual", new Integer(creditCount).toString());
            issue.put("data", issueData);
            issues.put(issue);
        }

        // SEND ISSUE LIST IF SEQUENCE NOT VALID

        if (!sequenceIsValid) {
            sequenceValidationResults.put("isValid", "false");
            sequenceValidationResults.put("issues", issues);
        } else {
            sequenceValidationResults.put("isValid", "true");
        }

        return sequenceValidationResults;
    }

}
