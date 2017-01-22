import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by David on 1/21/2017.
 */
public class Course {
    private String name, electiveType;
    private boolean isElective;
    public Course(JSONObject courseAsJson) throws JSONException{
        name = "";
        electiveType = "";
        isElective = courseAsJson.getBoolean("isElective");
        if(isElective){
            electiveType = courseAsJson.getString("electiveType");
        } else {
            name = courseAsJson.getString("name");
        }
    }
    public String getName(){
        return name;
    }
    public String getElectiveType(){
        return electiveType;
    }
    public boolean isElective(){
        return isElective;
    }
}
