import org.apache.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class CourseInfoProvider extends HttpServlet {

    private static Logger logger = Logger.getLogger("CourseInfoProvider");

    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
            throws ServletException, IOException
    {

        logger.info("INCOMING GET REQUEST:");

        response.setContentType("text/html");

        String message = "You tried to get me";

        logger.info("Responding with message: " + message);

        PrintWriter out = response.getWriter();
        out.println(message);
    }

}
