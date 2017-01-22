import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by David on 1/21/2017.
 */
public class Course {
    private String code, name, electiveType;
    private boolean isElective;
    private double credits;
    public Course(JSONObject courseAsJson) throws JSONException{
        code = "";
        name = "";
        electiveType = "";
        credits = -1;
        isElective = courseAsJson.getBoolean("isElective");
        if(isElective){
            electiveType = courseAsJson.getString("electiveType");
        } else {
            code = courseAsJson.getString("code");
            name = courseAsJson.getString("name");
            credits = courseAsJson.getDouble("credits");
        }
    }
    public Course(boolean isElective, String code, String name, String electiveType, double credits){
        this.isElective = isElective;
        this.code = code;
        this.name = name;
        this.electiveType = electiveType;
        this.credits = credits;
    }
    public String getCode(){
        return code;
    }
    public String getName(){
        return name;
    }
    public double getCredits(){
        return credits;
    }
    public String getElectiveType(){
        return electiveType;
    }
    public boolean isElective(){
        return isElective;
    }
    public JSONObject toJsonObject() throws JSONException{
        JSONObject result = new JSONObject();
        result.put("isElective", isElective);
        result.put("electiveType", electiveType);
        result.put("code", code);
        result.put("name", name);
        result.put("credits", credits);
        return result;
    }
}
