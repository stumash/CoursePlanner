import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by David Huculak on 2017-02-02.
 */
public class SequenceExporter extends HttpServlet {

    private static Logger logger = Logger.getLogger("SequenceExporter");

    public void doPost(HttpServletRequest request,
                       HttpServletResponse response)
            throws ServletException, IOException
    {

        logger.info("---------User requested a sequence export---------");

        ArrayList<Semester> semesters = grabSemestersFromRequest(request);

        logger.info(semesters.get(3).isWorkTerm());

        JSONObject responseJson = new JSONObject();

        PrintWriter out = response.getWriter();
        ServletContext cntxt = this.getServletContext();

        logger.info("Responding with: " + responseJson.toString());
        out.println(responseJson.toString());
    }

    private ArrayList<Semester> grabSemestersFromRequest(HttpServletRequest request) throws IOException{
        StringBuffer jb = new StringBuffer();
        String line;
        JSONObject requestJson;
        ArrayList<Semester> semesters = new ArrayList<Semester>();
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null) {
                jb.append(line);
            }
        } catch (Exception e) { /*report an error*/ }
        try {
            requestJson =  new JSONObject(jb.toString());
            JSONArray semestersAsJson = requestJson.getJSONArray("semesterList");
            for(int i = 0; i < semestersAsJson.length(); i++){
                semesters.add(new Semester(semestersAsJson.getJSONObject(i)));
            }
        } catch (JSONException e) {
            e.printStackTrace();
            // crash and burn
            throw new IOException("Error parsing JSON request string");
        }
        return semesters;
    }

}
