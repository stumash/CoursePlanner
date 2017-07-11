import org.apache.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class CourseInfoProvider extends HttpServlet {

    private static Logger logger = Logger.getLogger("CourseInfoProvider");

    public void doPost(HttpServletRequest request,
                      HttpServletResponse response)
            throws ServletException, IOException
    {

        logger.info("---------User requested info for a course---------");

        String courseCode = (String) Util.grabPropertyFromRequest("code", request);

        logger.info("requested course code: " + courseCode);

        String responseString = Util.getCourseObjectFromDB(courseCode);

        logger.info("Responding with: " + responseString);
        PrintWriter out = response.getWriter();
        out.println(responseString);
    }
}
