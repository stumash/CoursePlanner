import org.bson.Document;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;

public class SequenceProvider extends DBServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        logger.info("---------Client app requested a course sequence---------");

        String sequenceID = (String) grabPropertyFromRequest("sequenceID", request);

        logger.info("requested ID: " + sequenceID);

        // find document with specified _id value
        String responseString = "";
        Document filter = new Document();
        filter.put("_id", sequenceID);
        Document dbResult = (Document) courseSequences.find(filter).first();

        if(dbResult != null) {
            String sequenceJsonString = dbResult.toJson();
            responseString = "{ \"courseSequenceObject\": " + fillAllMissingInfo(sequenceJsonString) + "}";
        } else {
            responseString = "{ \"courseSequenceObject\": \"{}\"}";
        }

        logger.info("Responding with: " + responseString);
        PrintWriter out = response.getWriter();
        out.println(responseString);

    }

    public String fillAllMissingInfo(String sequenceJsonString) throws IOException{

        JSONObject sequenceJson = new JSONObject();
        
        try{

            // convert to json object
            sequenceJson = new JSONObject(sequenceJsonString);
            JSONArray yearList = sequenceJson.getJSONArray("yearList");


            for(int i = 0; i < yearList.length(); i++) {

                JSONObject year = yearList.getJSONObject(i);
                JSONObject newYear = new JSONObject();

                for (Iterator<String> seasonIterator = year.keys(); seasonIterator.hasNext(); ) {

                    String season = seasonIterator.next();
                    JSONObject semester = year.getJSONObject(season);
                    JSONArray courseList = semester.getJSONArray("courseList");

                    // loop through course list and fill missing info for each course
                    for(int j = 0; j < courseList.length(); j++){

                        Object entry = courseList.get(j);

                        if(entry instanceof JSONObject){
                            // found a simple course
                            courseList.put(j, fillMissingInfo((JSONObject) entry));
                        } else if(entry instanceof JSONArray) {
                            // found a list of courses (OR)
                            JSONArray orList = (JSONArray) entry;

                            for(int k = 0; k < orList.length(); k++){
                                orList.put(k, fillMissingInfo((JSONObject) orList.get(k)));
                            }

                            courseList.put(j, orList);
                        } else {
                            logger.warn("Found unusual value inside course sequence. Expected a course object but found: " + entry.toString());
                        }
                    }
                    
                    semester.put("courseList", courseList);
                    newYear.put(season, semester);
                }
                
                sequenceJson.put("yearList", yearList);
            }
        } catch(JSONException e){
            e.printStackTrace();
            throw new IOException("Error parsing sequence JSON data : " + sequenceJsonString);
        }

        return sequenceJson.toString();
    }

    // add in name and credits values from the DB
    public JSONObject fillMissingInfo(JSONObject courseObject) throws JSONException{

        if(!courseObject.getBoolean("isElective")){

            Document filter = new Document();
            filter.put("_id", courseObject.getString("code"));
            Document dbResult = (Document) courseInfo.find(filter).first();

	    if(dbResult == null){
		logger.info("got null db result for course: " + courseObject.getString("code"));
		courseObject.put("name", "UNKNOWN");
		courseObject.put("credits", "0");
	    } else {
  		for (String courseKey : dbResult.keySet()) {
			courseObject.put(courseKey, dbResult.get(courseKey));
	    	}
	    }
        }
        return courseObject;
    }
}
