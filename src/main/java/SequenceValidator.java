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

        // just a simple log to make sure the json is getting parsed right
        for(Semester s:semesters){
            logger.info("------------------------------");
            logger.info(s.getSeason() + " of " + s.getYear() + ":");
            for(Course c:s.getCourses()){
                if(c.isElective()){
                    logger.info(c.getElectiveType() + " elective");
                } else {
                    logger.info(c.getCode());
                }
            }
        }

        String responseString = validateSequence(semesters).toString();

        PrintWriter out = response.getWriter();
        out.println(responseString);

    }

    // in this method we want to loop through the list of semesters, checking that each class in
    // in a valid position in terms of its prerequisites and semesters it's offered in. If there
    // are any issues with the list, make sure responseMessage indicates that it is invalid and append
    // the related message to the variable called errorMessages.
    private JSONObject validateSequence(ArrayList<Semester> semesters){

        JSONObject responseMessage = new JSONObject();
        ArrayList<String> errorMessages = new ArrayList<String>();

        for(Semester semester:semesters){
            //for each semester, find out each class' prerequisites and offered semesters and validate dat shit
        }
        return responseMessage;
    }

}
