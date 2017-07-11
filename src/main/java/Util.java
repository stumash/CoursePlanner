import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;

/**
 * Created by David Huculak on 2017-02-02.
 */
public class Util {

    static final String MONGO_URL = "mongodb://138.197.6.26:27017";

    static final String DB_NAME = "courseplannerdb";

    static final String COURSE_DATA_COLLECTION_NAME = "courseData";

    static final String COURSE_SEQUENCE_COLLECTION_NAME = "courseSequences";

    static ArrayList<Semester> grabSemestersFromRequest(HttpServletRequest request) throws IOException {

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

    static Object grabPropertyFromRequest(String key, HttpServletRequest request) throws IOException {
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

    static MongoClient getMongoClient(){
        return new MongoClient(new MongoClientURI(MONGO_URL));
    }

    static String getCourseObjectFromDB(String courseCode){

        // connect to collection from mongodb server
        MongoClient mongoClient = Util.getMongoClient();
        MongoDatabase db = mongoClient.getDatabase(Util.DB_NAME);
        MongoCollection collection = db.getCollection(Util.COURSE_DATA_COLLECTION_NAME);


        // find document with specified _id value
        Document filter = new Document();
        filter.put("_id", courseCode);
        Document dbResult = (Document)collection.find(filter).first();

        if(dbResult != null) {
            return dbResult.toJson();
        } else {
            return "{}";
        }
    }

}
