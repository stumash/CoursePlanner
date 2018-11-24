import com.mongodb.Block;
import org.bson.BsonRegularExpression;
import org.bson.Document;
import org.json.JSONArray;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class FilterCourseCodes extends DBServlet {

    private final int MAX_RESULTS = 25;

    public void doGet(HttpServletRequest request,
                       HttpServletResponse response)
            throws ServletException, IOException
    {

        logger.info("---------User requested to filter course codes---------");

        String courseCodeFilter = (String) request.getParameter("filter");

        logger.info("requested course codes containing: " + courseCodeFilter);

        // find documents that contain specified course code filter text (no more than MAX_RESULTS)
        String responseString = "";
        Document filter = new Document();
        BsonRegularExpression regex = new BsonRegularExpression(courseCodeFilter, "i");
        CourseCodeBlock resultsProcessor = new CourseCodeBlock();

        filter.put("_id", regex);
        courseInfo.find(filter).limit(MAX_RESULTS).forEach(resultsProcessor);

        responseString = resultsProcessor.getResults();

        logger.info("Responding with: " + responseString);
        PrintWriter out = response.getWriter();
        out.println(responseString);
    }
}

class CourseCodeBlock implements Block<Document>{

    JSONArray results;

    public CourseCodeBlock(){
        results = new JSONArray();
    }

    public String getResults(){
        return results.toString();
    }

    public void apply(Document document) {
        results.put(document.get("_id").toString());
    }

}
