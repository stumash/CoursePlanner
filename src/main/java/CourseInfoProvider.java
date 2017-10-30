import org.bson.Document;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class CourseInfoProvider extends DBServlet {

    public void doPost(HttpServletRequest request,
                      HttpServletResponse response)
            throws ServletException, IOException
    {

        logger.info("---------User requested info for a course---------");

        String courseCode = (String) grabPropertyFromRequest("code", request);

        logger.info("requested course code: " + courseCode);

        String responseString = getCourseObjectFromDB(courseCode);

        logger.info("Responding with: " + responseString);
        PrintWriter out = response.getWriter();
        out.println(responseString);
    }

    String getCourseObjectFromDB(String courseCode){

        // find document with specified _id value
        Document filter = new Document();
        filter.put("_id", courseCode);
        Document dbResult = (Document) courseInfo.find(filter).first();

        if(dbResult != null) {
            return dbResult.toJson();
        } else {
            return "{}";
        }
    }
}
