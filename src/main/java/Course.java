import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by David on 1/21/2017.
 */
public class Course {
    private String code, electiveType;
    private boolean isElective;
    public Course(JSONObject courseAsJson) throws JSONException{
        code = "";
        electiveType = "";
        isElective = courseAsJson.getBoolean("isElective");
        if(isElective){
            electiveType = courseAsJson.getString("electiveType");
        } else {
            code = courseAsJson.getString("code");
        }
    }
    public String getCode(){
        return code;
    }
    public String getElectiveType(){
        return electiveType;
    }
    public boolean isElective(){
        return isElective;
    }
}
