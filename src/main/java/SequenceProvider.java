import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.apache.log4j.Logger;
import org.bson.Document;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class SequenceProvider extends HttpServlet {

    private static Logger logger = Logger.getLogger("SequenceProvider");

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        logger.info("---------Client app requested a course sequence---------");

        String sequenceID = (String) Util.grabPropertyFromRequest("sequenceID", request);

        // connect to collection from mongodb server
        MongoClient mongoClient = Util.getMongoClient();
        MongoDatabase db = mongoClient.getDatabase(Util.DB_NAME);
        MongoCollection collection = db.getCollection(Util.COURSE_SEQUENCE_COLLECTION_NAME);

        logger.info("requested ID: " + sequenceID);

        // find document with specified _id value
        String responseString = "";
        Document filter = new Document();
        filter.put("_id", sequenceID);
        Document dbResult = (Document)collection.find(filter).first();

        if(dbResult != null) {
            String sequenceJsonString = dbResult.toJson();
            responseString = "{ \"response\": " + fillAllMissingInfo(sequenceJsonString) + "}";
        } else {
            responseString = "{ \"response\": \"Sequence ID not found\"}";
        }

        logger.info("Responding with: " + responseString);
        PrintWriter out = response.getWriter();
        out.println(responseString);

    }

    public String fillAllMissingInfo(String sequenceJsonString) throws IOException{

        MongoClient mongoClient = Util.getMongoClient();
        MongoDatabase db = mongoClient.getDatabase(Util.DB_NAME);
        MongoCollection collection = db.getCollection(Util.COURSE_DATA_COLLECTION_NAME);
        JSONObject sequenceJson = new JSONObject();
        try{

            // convert to json object
            sequenceJson = new JSONObject(sequenceJsonString);
            JSONArray semesterList = sequenceJson.getJSONArray("semesterList");

            // traverse through, filling missing info on each valid course code
            for(int i = 0; i < semesterList.length(); i++){
                JSONObject semester = semesterList.getJSONObject(i);
                JSONArray courseList = semester.getJSONArray("courseList");
                for(int j = 0; j < courseList.length(); j++){
                    Object entry = courseList.get(j);
                    if(entry instanceof JSONObject){
                        courseList.put(j, fillMissingInfo((JSONObject) entry, collection));
                    } else if(entry instanceof JSONArray) {
                        JSONArray orList = (JSONArray) entry;
                        for(int k = 0; k < orList.length(); k++){
                            orList.put(k, fillMissingInfo((JSONObject) orList.get(k), collection));
                        }
                        courseList.put(j, orList);
                    } else {
                        logger.warn("Found unusual value inside course sequence. Expected a course object but found: " + entry.toString());
                    }
                }
                semester.put("courseList", courseList);
                semesterList.put(i, semester);
            }
            sequenceJson.put("semesterList", semesterList);

        } catch(JSONException e){
            e.printStackTrace();
            throw new IOException("Error parsing sequence JSON data : " + sequenceJsonString);
        }

        return sequenceJson.toString();
    }

    // add in name and credits values from the DB
    public JSONObject fillMissingInfo(JSONObject courseObject, MongoCollection collection) throws JSONException{

        if(!courseObject.getBoolean("isElective")){

            Document filter = new Document();
            filter.put("_id", courseObject.getString("code"));
            Document dbResult = (Document)collection.find(filter).first();

            JSONObject dbCourseDoc;
            if(dbResult != null) {
                dbCourseDoc = new JSONObject(dbResult.toJson());
            } else {
                dbCourseDoc = new JSONObject("{}");
            }

            try{
                courseObject.put("name", dbCourseDoc.getString("name"));
            } catch(JSONException e){
                logger.warn("Error grabbing name for course: " + courseObject.getString("code"));
                courseObject.put("name", "UNKNOWN");
            }

            try{
                courseObject.put("credits", dbCourseDoc.getString("credits"));
            } catch(JSONException e){
                logger.warn("Error grabbing credits for course: " + courseObject.getString("code"));
                courseObject.put("credits", "0");
            }
        }
        return courseObject;
    }

}
