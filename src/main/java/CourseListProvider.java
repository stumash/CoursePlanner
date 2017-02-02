import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

/**
 * Created by David Huculak on 2017-02-02.
 */
public class CourseListProvider extends HttpServlet {

    private static Logger logger = Logger.getLogger("CourseListProvider");

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        logger.info("---------User requested the list of courses---------");

        // get map containing all courses
        ServletContext cntxt = this.getServletContext();
        CourseInfoParser.init(cntxt);
        HashMap<String,CourseInfo> codeCourseMap = CourseInfoParser.courseMap;

        // fill up json array with course codes
        JSONArray codesJson = new JSONArray(codeCourseMap.keySet());


        // respond with JSON object containing codes array
        try {

            JSONObject responseJson = new JSONObject();
            responseJson.put("codes", codesJson);

            logger.info("Responding with: " + responseJson.toString());

            PrintWriter out = response.getWriter();
            out.println(responseJson.toString());

        } catch (JSONException e) {
            logger.error("Error creating course list JSON object");
            e.printStackTrace();
        }
    }

}
