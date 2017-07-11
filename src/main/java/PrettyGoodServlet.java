import org.apache.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by David Huculak on 2016-11-28.
 */

public class PrettyGoodServlet extends HttpServlet {

    private static Logger logger = Logger.getLogger("PrettyGoodServlet");

    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
            throws ServletException, IOException
    {

        logger.info("INCOMING GET REQUEST:");

        response.setContentType("text/html");

        String message = "What is good?";

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        logger.info("Responding with message: " + message);

        PrintWriter out = response.getWriter();
        out.println(message);
    }

}
