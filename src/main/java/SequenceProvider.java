import com.mongodb.*;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.apache.log4j.Logger;
import org.bson.BSON;
import org.bson.Document;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

/**
 * Created by David Huculak on 2017-02-02.
 */
public class SequenceProvider extends HttpServlet {

    private static Logger logger = Logger.getLogger("SequenceProvider");

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        logger.info("---------Client app requested a course sequence---------");

        String sequenceID = Util.grabSequenceIDFromRequest(request);

        // do mongo db operations here

        Block<Document> dbCallback = new Block<Document>() {
            public String responseString = "";
            public void apply(final Document document) {
                responseString = "{ \"response\": \"" + document.toJson() + "\"}";
                //logger.info(document.toJson());
            }
        };

        MongoClient mongoClient = new MongoClient(new MongoClientURI("mongodb://138.197.6.26:27017"));
        MongoDatabase db = mongoClient.getDatabase("mongotest");
        MongoCollection collection = db.getCollection("courseSequences");

        logger.info("requested ID: " + sequenceID);

        // loop through the collection

        String responseString = "";
        Document filter = new Document();
        filter.put("_id", sequenceID);
        Document dbResult = (Document)collection.find(filter).first();
        if(dbResult != null) {
            responseString = "{ \"response\": " + dbResult.toJson() + "}";
        } else {
            responseString = "{ \"response\": \"Sequence ID not found\"}";
        }

        logger.info("Responding with: " + responseString);
        PrintWriter out = response.getWriter();
        out.println(responseString);

    }

}
