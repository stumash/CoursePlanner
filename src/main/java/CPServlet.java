import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.apache.commons.io.IOUtils;

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

    JSONObject getRequestJson(HttpServletRequest request) throws IOException{
        JSONObject requestJson;
	String requestString = IOUtils.toString(request.getReader());
        try {
            logger.info("raw request String:");
            logger.info(requestString);
            logger.info("end raw request String");
            requestJson =  new JSONObject(requestString);
        } catch (JSONException e) {
            e.printStackTrace();
            throw new IOException("Error parsing JSON request string : " + requestString);
        }
        return requestJson;
    }

    // This function can only be called once per request. It should be replaced by above method getRequestJson
    Object grabPropertyFromRequest(String key, HttpServletRequest request) throws IOException {

        Object propertyValue = null;
        JSONObject requestJson = getRequestJson(request);

        try {
            propertyValue = requestJson.get(key);
        } catch (JSONException e) {
            e.printStackTrace();
            throw new IOException("Error grabbing JSON property from request : " + requestJson.toString());
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
