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
    private int year;
    private ArrayList<Course> courses;

    public Semester(JSONObject semesterAsJson) throws JSONException {
        season = parseSeason(semesterAsJson.getString("season"));
        year = semesterAsJson.getInt("year");
        courses = parseCourses(semesterAsJson.getJSONArray("courseList"));
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

    public int getYear(){
        return year;
    }

    public ArrayList<Course> getCourses(){
        return courses;
    }
}
