import com.mongodb.client.MongoCursor;
import org.bson.Document;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by David Huculak on 2017-02-02.
 */
public class SequenceNamesList extends DBServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        logger.info("---------Client app requested the list of course sequences---------");

        // find document with specified _id value
        String responseString = "[";

        try {
            MongoCursor<Document> cursor = courseSequences.find().iterator();
            while (cursor.hasNext()) {
                String documentName = cursor.next().getString("_id");
                responseString += "\"" + documentName + "\"";
                if(cursor.hasNext()){
                    responseString += ",";
                }
            }
            cursor.close();
        } catch (Exception e){
            logger.info("Error getting sequence names: " + e.toString());
        }

        responseString += "]";

        logger.info("Responding with: " + responseString);
        PrintWriter out = response.getWriter();
        out.println(responseString);

    }
}
