import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.apache.log4j.Logger;
import org.bson.BsonRegularExpression;
import org.bson.Document;
import org.json.JSONArray;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class FilterCourseCodes extends HttpServlet {

    private static Logger logger = Logger.getLogger("FilterCourseCodes");

    private final int MAX_RESULTS = 25;

    public void doPost(HttpServletRequest request,
                       HttpServletResponse response)
            throws ServletException, IOException
    {

        logger.info("---------User requested to filter course codes---------");

        String courseCodeFilter = (String) Util.grabPropertyFromRequest("filter", request);

        // connect to collection from mongodb server
        MongoClient mongoClient = Util.getMongoClient();
        MongoDatabase db = mongoClient.getDatabase(Util.DB_NAME);
        MongoCollection collection = db.getCollection(Util.COURSE_DATA_COLLECTION_NAME);

        logger.info("requested course codes containing: " + courseCodeFilter);

        // find documents that contain specified course code filter text (no more than MAX_RESULTS)
        String responseString = "";
        Document filter = new Document();
        BsonRegularExpression regex = new BsonRegularExpression(courseCodeFilter, "i");
        CourseCodeBlock resultsProcessor = new CourseCodeBlock();

        filter.put("_id", regex);
        collection.find(filter).limit(MAX_RESULTS).forEach(resultsProcessor);

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
