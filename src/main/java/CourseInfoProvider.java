import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.apache.log4j.Logger;
import org.bson.Document;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class CourseInfoProvider extends HttpServlet {

    private static Logger logger = Logger.getLogger("CourseInfoProvider");

    public void doPost(HttpServletRequest request,
                      HttpServletResponse response)
            throws ServletException, IOException
    {

        logger.info("---------User requested info for a course---------");

        String courseCode = (String) Util.grabPropertyFromRequest("code", request);

        // connect to collection from mongodb server
        MongoClient mongoClient = Util.getMongoClient();
        MongoDatabase db = mongoClient.getDatabase(Util.DB_NAME);
        MongoCollection collection = db.getCollection(Util.COURSE_DATA_COLLECTION_NAME);

        logger.info("requested course code: " + courseCode);

        // find document with specified _id value
        String responseString = "";
        Document filter = new Document();
        filter.put("_id", courseCode);
        Document dbResult = (Document)collection.find(filter).first();

        if(dbResult != null) {
            responseString = dbResult.toJson();
        } else {
            responseString = "{}";
        }

        logger.info("Responding with: " + responseString);
        PrintWriter out = response.getWriter();
        out.println(responseString);
    }
}
