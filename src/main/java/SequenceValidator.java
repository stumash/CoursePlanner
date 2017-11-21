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

    private static HashMap<String,CourseInfo> courseInfoMap;

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
            validationResultsJsonObj.put("error", ExceptionUtils.getStackTrace(e));
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
        HashMap<String, Integer> course2semester = new HashMap<>();
        JSONArray yearlist = cso.getJSONArray("yearlist");
        int semesterNum = -1;

        for (JSONObject year : (JSONObject) yearlist) {
            semesterNum++;

            //TODO
        }
        return null;
    }
}
