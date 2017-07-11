import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import org.apache.log4j.Logger;
import org.bson.Document;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by David Huculak on 2017-02-02.
 */
public class SequenceNamesList extends HttpServlet {

    private static Logger logger = Logger.getLogger("SequenceNamesList");

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        logger.info("---------Client app requested the list of course sequences---------");

        // connect to collection from mongodb server
        MongoClient mongoClient = Util.getMongoClient();
        MongoDatabase db = mongoClient.getDatabase("courseplannerdb");
        MongoCollection collection = db.getCollection("courseSequences");

        // find document with specified _id value
        String responseString = "[";

        try {
            MongoCursor<Document> cursor = collection.find().iterator();
            while (cursor.hasNext()) {
                String documentName = cursor.next().getString("_id");
                responseString += "\"" + documentName + "\"";
                if(cursor.hasNext()){
                    responseString += ",";
                }
            }
        } catch (Exception e){
            logger.info("Error getting sequence names: " + e.toString());
        }

        responseString += "]";

        logger.info("Responding with: " + responseString);
        PrintWriter out = response.getWriter();
        out.println(responseString);

    }

}
