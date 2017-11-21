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

            try { // have to put a try, but no real chance of failure
                validationResultsJsonObj.put("error", ExceptionUtils.getStackTrace(e));
            } catch(JSONException jsonExc){ jsonExc.printStackTrace(); }

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
        // map course code to semester number (semesters are 'numbered' 0, 1, 2, 3, 4, ...)
        // semesters (0, 1, 2) are year 1, semesters (3, 4, 5) are year 2, etc.
        HashMap<String, Integer> cc2sn = new HashMap<>();

        JSONArray yearList = cso.getJSONArray("yearList");
        if (yearList.length() == 0) throw new Exception("empty yearList");

        // construct cc2sn on first pass through cso
        for (int yearIdx = 0; yearIdx < yearList.length(); yearIdx++)
        {
            JSONObject year = (JSONObject) yearList.get(yearIdx);

            JSONObject fall   = (JSONObject) year.get("fall");
            JSONObject winter = (JSONObject) year.get("winter");
            JSONObject summer = (JSONObject) year.get("summer");

            JSONObject[] semsInYear = {fall, winter, summer};
            for (int semsInYearIdx = 0; semsInYearIdx < semsInYear.length; semsInYearIdx++)
            {
                JSONArray coursesInSem = (JSONArray) semsInYear[semsInYearIdx].get("courseList");
                for (int i = 0; i < coursesInSem.length(); i++)
                {
                    JSONObject course = (JSONObject) coursesInSem.get(i);
                    String courseCode = (String) course.get("code");

                    cc2sn.put(courseCode, yearIdx + semsInYearIdx);
                }
            }
        }

        // for each course in order, make sure prereqs and coreqs are first
        for (int yearIdx = 0; yearIdx < yearList.length(); yearIdx++)
        {
            JSONObject year = (JSONObject) yearList.get(yearIdx);

            JSONObject fall   = (JSONObject) year.get("fall");
            JSONObject winter = (JSONObject) year.get("winter");
            JSONObject summer = (JSONObject) year.get("summer");

            JSONObject[] semsInYear = {fall, winter, summer};
            for (int semsInYearIdx = 0; semsInYearIdx < semsInYear.length; semsInYearIdx++)
            {
                JSONArray coursesInSem = (JSONArray) semsInYear[semsInYearIdx].get("courseList");
                for (int i = 0; i < coursesInSem.length(); i++)
                {
                    JSONObject course = (JSONObject) coursesInSem.get(i);

                    // TODO: check prereqs, check coreqs
                }
            }
        }
        return null;
    }
}
