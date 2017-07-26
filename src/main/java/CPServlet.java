import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Properties;

public abstract class CPServlet extends HttpServlet {

    protected static Logger logger;

    protected Properties appProperties;

    public void init(ServletConfig config) throws ServletException {
        super.init(config);

        // set up the logger
        logger = Logger.getLogger(getServletName());

        // load the app properties
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        InputStream input = classLoader.getResourceAsStream("courseplanner.properties");
        appProperties = new Properties();
        try{
            appProperties.load(input);
        } catch(IOException e){
            logger.error("Error getting webapp properties");
            throw new ServletException(e);
        }
    }

    Object grabPropertyFromRequest(String key, HttpServletRequest request) throws IOException {
        StringBuffer jb = new StringBuffer();
        String line;
        Object propertyValue = null;
        JSONObject requestJson;
        ArrayList<Semester> semesters = new ArrayList<Semester>();
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null) {
                jb.append(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new IOException("Error reading from request string");
        }
        try {
            requestJson =  new JSONObject(jb.toString());
            propertyValue = requestJson.get(key);
        } catch (JSONException e) {
            e.printStackTrace();
            throw new IOException("Error parsing JSON request string : " + jb.toString());
        }
        return  propertyValue;
    }

    ArrayList<Semester> grabSemestersFromRequest(HttpServletRequest request) throws IOException {

        ArrayList<Semester> semesters = new ArrayList<Semester>();

        try {
            JSONArray semestersAsJson = (JSONArray) grabPropertyFromRequest("semesterList", request);
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

    public void destroy() {
        LogManager.shutdown();
        super.destroy();
    }
}
