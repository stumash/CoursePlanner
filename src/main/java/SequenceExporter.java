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

        ArrayList<Semester> semesters = Util.grabSemestersFromRequest(request);

        logger.info(semesters.get(3).isWorkTerm());

        JSONObject responseJson = new JSONObject();

        PrintWriter out = response.getWriter();
        ServletContext cntxt = this.getServletContext();

        logger.info("Responding with: " + responseJson.toString());
        out.println(responseJson.toString());
    }

}
