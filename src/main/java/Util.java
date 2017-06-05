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

    static ArrayList<Semester> grabSemestersFromRequest(HttpServletRequest request) throws IOException {
        StringBuffer jb = new StringBuffer();
        String line;
        JSONObject requestJson;
        ArrayList<Semester> semesters = new ArrayList<Semester>();
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null) {
                jb.append(line);
            }
        } catch (Exception e) { /*report an error*/ }
        try {
            requestJson =  new JSONObject(jb.toString());
            JSONArray semestersAsJson = requestJson.getJSONArray("semesterList");
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

    static String grabSequenceIdFromRequest(HttpServletRequest request) throws IOException {
        StringBuffer jb = new StringBuffer();
        String line;
        String sequenceID = "";
        JSONObject requestJson;
        ArrayList<Semester> semesters = new ArrayList<Semester>();
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null) {
                jb.append(line);
            }
        } catch (Exception e) { /*report an error*/ };
        try {
            requestJson =  new JSONObject(jb.toString());
            sequenceID = requestJson.getString("sequenceID");
        } catch (JSONException e) {
            e.printStackTrace();
            // crash and burn
            throw new IOException("Error parsing JSON request string");
        }
        return sequenceID;
    }

}
