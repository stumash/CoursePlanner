import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by David on 1/21/2017.
 */
public class Semester {

    enum SemesterSeason {
        FALL, WINTER, SUMMER
    }

    private SemesterSeason season;
    private ArrayList<Course> courses;
    private boolean isWorkTerm;

    public Semester(JSONObject semesterAsJson) throws JSONException {
        season = parseSeason(semesterAsJson.getString("season"));
        courses = parseCourses(semesterAsJson.getJSONArray("courseList"));
        isWorkTerm = semesterAsJson.getBoolean("isWorkTerm");
    }

    public Semester(SemesterSeason season, ArrayList<Course> courses, boolean isWorkTerm){
        this.season = season;
        this.courses = courses;
        this.isWorkTerm = isWorkTerm;
    }

    public SemesterSeason parseSeason(String season){
        if(season.equals("fall")){
            return SemesterSeason.FALL;
        }
        if(season.equals("winter")){
            return SemesterSeason.WINTER;
        }
        if(season.equals("summer")){
            return SemesterSeason.SUMMER;
        }
        return null;
    }

    public ArrayList<Course> parseCourses(JSONArray coursesAsJson) throws JSONException{
        ArrayList<Course> courses = new ArrayList<Course>();
        for(int i = 0; i < coursesAsJson.length(); i++){
            JSONObject courseAsJson = coursesAsJson.getJSONObject(i);
            courses.add(new Course(courseAsJson));
        }
        return courses;
    }

    public SemesterSeason getSeason(){
        return season;
    }

    public ArrayList<Course> getCourses(){
        return courses;
    }

    public boolean isWorkTerm() {
        return isWorkTerm;
    }

    public JSONObject toJsonObject() throws JSONException{
        JSONObject result = new JSONObject();
        result.put("season", season.toString().toLowerCase());
        JSONArray courseList = new JSONArray();
        for(Course course:courses){
            courseList.put(course.toJsonObject());
        }
        result.put("courseList", courseList);
        result.put("isWorkTerm", isWorkTerm);
        return result;
    }
}
