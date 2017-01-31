import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.HashMap;

public class CourseInfoProvider extends HttpServlet {

    private static Logger logger = Logger.getLogger("CourseInfoProvider");

    public void doPost(HttpServletRequest request,
                      HttpServletResponse response)
            throws ServletException, IOException
    {

        logger.info("---------User requested info for a course---------");

        StringBuffer jb = new StringBuffer();
        String line = null;
        JSONObject requestJson = null;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) { /*report an error*/ }
        try {
            requestJson = new JSONObject(jb.toString());
        } catch (JSONException e) {
            throw new IOException("Error parsing JSON request string");
        }

        PrintWriter out = response.getWriter();
        ServletContext cntxt = this.getServletContext();
        try {
            CourseInfoParser.init(cntxt);
            HashMap<String,CourseInfo> codeCourseMap = CourseInfoParser.courseMap;

            String courseCode = requestJson.getString("code");
            CourseInfo ci = codeCourseMap.get(courseCode);

            JSONObject responseJson = new JSONObject();

            if(ci != null){
                JSONArray prereqs = new JSONArray();
                JSONArray coreqs = new JSONArray();

                for(String prereq:ci.prereqs){
                    prereqs.put(prereq);
                }

                for(String coreq:ci.coreqs) {
                    coreqs.put(coreq);
                }

                responseJson.put("code", ci.code);
                responseJson.put("name", ci.name);
                responseJson.put("credits", ci.credits);
                responseJson.put("notes", ci.notes);
                responseJson.put("termsOffered", ci.isOfferedIn.toString());
                responseJson.put("prereqs", prereqs);
                responseJson.put("coreqs", coreqs);
            }

            logger.info("Responding with: " + responseJson.toString());
            out.println(responseJson.toString());

        } catch (JSONException e) {
            e.printStackTrace();
        } finally {
            out.close();
        }

    }
}
