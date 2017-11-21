import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

public class SequenceValidator extends DBServlet {

    private static HashMap<String,CourseInfo> courseInfoMap;

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        logger.info("---------User requested a sequence validation---------");

        response.setContentType("text/html");

        String responseString = "{}";

        logger.info("Responding with: " + responseString);
        PrintWriter out = response.getWriter();
        out.println(responseString);

    }

    private void logSemesterData(ArrayList<Semester> semesters){
        for(Semester s:semesters){
            logger.info("------------------------------");
            logger.info(s.getSeason() + ":");
            if(s.isWorkTerm()){
                logger.info("Work Term");
            }
            for(Course c:s.getCourses()){
                if(c.isElective()){
                    logger.info(c.getElectiveType() + " elective");
                } else {
                    logger.info(c.getCode() + ", " + c.getName() + ", " + c.getCredits());
                }
            }
        }
    }

    private JSONObject validateSequence(ArrayList<Semester> semesters) throws JSONException {
    }
}
