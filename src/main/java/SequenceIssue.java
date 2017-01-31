import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by David Huculak on 2017-01-31.
 */
public class SequenceIssue {

    //the course codes of all affected courses (I.E. those that should be highlighted in red in the UI)
    private ArrayList<String> affectedCourses;
    private String message;

    public SequenceIssue(String message, ArrayList<String> affectedCourses){
        this.message = message;
        this.affectedCourses = affectedCourses;
    }

    public String getMessage(){
        return message;
    }

    public ArrayList<String> getAffectedCourses(){
        return affectedCourses;
    }

    public JSONObject toJSONObject() throws JSONException{
        JSONObject issueJSON = new JSONObject();

        issueJSON.put("message", message);

        JSONArray affectedCoursesJSON = new JSONArray();
        for(String affectedCourse:this.affectedCourses){
            affectedCoursesJSON.put(affectedCourse);
        }

        issueJSON.put("affectedCourses",affectedCoursesJSON);

        return issueJSON;
    }

}
