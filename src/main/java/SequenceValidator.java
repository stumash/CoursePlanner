import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

public class SequenceValidator extends HttpServlet {

    private static Logger logger = Logger.getLogger("SequenceValidator");

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        logger.info("INCOMING POST REQUEST:");

        response.setContentType("text/html");

        StringBuffer jb = new StringBuffer();
        String line = null;
        JSONObject requestJson = null;
        ArrayList<Semester> semesters = new ArrayList<Semester>();
        Semester semester = null;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) { /*report an error*/ }

        try {
            requestJson =  new JSONObject(jb.toString());
            JSONArray semestersAsJson = requestJson.getJSONArray("semesterList");
            for(int i = 0; i < semestersAsJson.length(); i++){
                semesters.add(new Semester(semestersAsJson.getJSONObject(i)));
            }
        } catch (JSONException e) {
            // crash and burn
            throw new IOException("Error parsing JSON request string");
        }

        for(Semester s:semesters){
            logger.info("------------------------------");
            logger.info(s.getSeason() + " of " + s.getYear() + ":");
            for(Course c:s.getCourses()){
                if(c.isElective()){
                    logger.info(c.getElectiveType() + " elective");
                } else {
                    logger.info(c.getName());
                }
            }
        }

        String responseMessage = "You tried to post me";

        PrintWriter out = response.getWriter();
        out.println(responseMessage);

    }

    private JSONObject validateSequence(ArrayList<Semester> semesters){
        return null;
    }

}
