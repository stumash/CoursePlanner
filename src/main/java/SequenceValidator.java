import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

public class SequenceValidator extends HttpServlet {

    private static Logger logger = Logger.getLogger("SequenceValidator");
    private static HashMap<String,CourseInfo> courseInfoMap;

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        logger.info("---------User requested a sequence validation---------");

        response.setContentType("text/html");

        ArrayList<Semester> semesters = grabSemestersFromRequest(request);

        // just a simple log to make sure the json is getting parsed right
        // logSemesterData(semesters);

        CourseInfoParser.init(this.getServletContext());
        courseInfoMap = CourseInfoParser.courseMap;
        String responseString = "{}";
        try{
            responseString = validateSequence(semesters).toString();
        } catch(JSONException ex){
            ex.printStackTrace();
            logger.info("Error validating sequence");
        }

        logger.info("Responding with: " + responseString);
        PrintWriter out = response.getWriter();
        out.println(responseString);

    }

    private ArrayList<Semester> grabSemestersFromRequest(HttpServletRequest request) throws IOException{
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

    private void logSemesterData(ArrayList<Semester> semesters){
        for(Semester s:semesters){
            logger.info("------------------------------");
            logger.info(s.getSeason() + ":");
            if(s.isWorkTerm()){
                logger.info("Work Term");
            }
            for(Course c:s.getCourses()){
                if(c.isElective()){
                    logger.info(c.getElectiveType() + " elective");
                } else {
                    logger.info(c.getCode() + ", " + c.getName() + ", " + c.getCredits());
                }
            }
        }
    }

    private JSONObject validateSequence(ArrayList<Semester> semesters) throws JSONException{

        JSONObject responseMessage = new JSONObject();
        ArrayList<String> errorMessages = new ArrayList<String>();

        // start at the last semester and check that for each of itc classes c, 
        // all that courses prereqs appear somewhere in an earlier semester
//        ArrayList<String> errors = new ArrayList<String>();
        ArrayList<SequenceIssue> issues = new ArrayList<SequenceIssue>();
        for (int i = semesters.size()-1; i > -1; i--) {
            Semester semester = semesters.get(i);
            if(semester.isWorkTerm()){
                continue;
            }
            for (Course course : semester.getCourses()) { // for each course starting at the back

                if(course.isElective()){
                    continue;
                }

                CourseInfo courseInfo = courseInfoMap.get(course.getCode());

                if(courseInfo == null){
                    logger.warn("courseInfo object is null for course: " + course.toString());
                } else {
                    ArrayList<String> prereqs = (courseInfo.prereqs == null) ? new ArrayList<String>() : courseInfo.prereqs;

                    boolean[] prereqsFound = new boolean[prereqs.size()];

                    ArrayList<String> coreqs = (courseInfo.coreqs == null) ? new ArrayList<String>() : courseInfo.coreqs;
                    boolean[] coreqsFound = new boolean[coreqs.size()];
                    boolean semesterValid = false;
                    if (semester.getSeason().ordinal() > 1) {
                        if (courseInfo.isOfferedIn.summer)
                            semesterValid = true;
                    } else if (semester.getSeason().ordinal() > 0) {
                        if (courseInfo.isOfferedIn.winter)
                            semesterValid = true;
                    } else {
                        if (courseInfo.isOfferedIn.fall)
                            semesterValid = true;
                    }

                    for (int j = 0; j < i; j++) {
                        Semester semester2 = semesters.get(j);

                        for (Course course2 : semester2.getCourses()) { // go through each course in the previous semesters
                            if (prereqs.contains(course2.getCode()))
                                prereqsFound[prereqs.indexOf(course2.getCode())] = true;
                            if (coreqs.contains(course2.getCode()))
                                coreqsFound[coreqs.indexOf(course2.getCode())] = true;
                        }
                    }
                    for (Course course2 : semester.getCourses()) { //check coreq in current semester
                        if (coreqs.contains(course2.getCode()))
                            coreqsFound[coreqs.indexOf(course2.getCode())] = true;
                    }

                    for (int x = 0; x < prereqsFound.length; x++) {
                        if (!prereqsFound[x]) {
                            ArrayList<String> affectedCourses = new ArrayList<String>();
                            affectedCourses.add(courseInfo.prereqs.get(x));
                            affectedCourses.add(course.getCode());
                            String message = courseInfo.prereqs.get(x) + " must be taken before " + course.getCode();
                            SequenceIssue issue = new SequenceIssue(message, affectedCourses);
                            issues.add(issue);
//                            errors.add(courseInfo.prereqs.get(x) + " must be taken before " + course.getCode());
                        }
                    }
                    for (int x = 0; x < coreqsFound.length; x++) {
                        if (!coreqsFound[x]) {
                            ArrayList<String> affectedCourses = new ArrayList<String>();
                            affectedCourses.add(courseInfo.prereqs.get(x));
                            affectedCourses.add(course.getCode());
                            String message = courseInfo.prereqs.get(x) + " must be taken at least as soon as " + course.getCode();
                            SequenceIssue issue = new SequenceIssue(message, affectedCourses);
                            issues.add(issue);
//                            errors.add(courseInfo.coreqs.get(x) + " must be taken at least as soon as " + course.getCode());
                        }
                    }
                    if (!semesterValid) {
                        ArrayList<String> affectedCourses = new ArrayList<String>();
                        affectedCourses.add(course.getCode());
                        String message = course.getCode() + " cannot be taken in the " + semester.getSeason() + ".";
                        SequenceIssue issue = new SequenceIssue(message, affectedCourses);
                        issues.add(issue);
//                        errors.add(course.getCode() + " cannot be taken in the " + semester.getSeason() + ".");
                    }
                }

            }
        }

        // the arraylist of error messages is called errors

        JSONArray issueArray = new JSONArray();
        responseMessage.put("valid", "true");
        responseMessage.put("issues", issueArray);

        if(issues.size() > 0){
            responseMessage.put("valid","false");
            for(SequenceIssue issue:issues){
                issueArray.put(issue.toJSONObject());
            }
            responseMessage.put("issues", issueArray);
        }

        return responseMessage;
    }

}
