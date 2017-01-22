import org.apache.log4j.Logger;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

public class CourseInfoProvider extends HttpServlet {

    private static Logger logger = Logger.getLogger("CourseInfoProvider");

    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
            throws ServletException, IOException
    {

        logger.info("INCOMING GET REQUEST:");

        response.setContentType("text/html");

        PrintWriter out = response.getWriter();
        ServletContext cntxt = this.getServletContext();
        String fName = "/input.txt";
        InputStream ins = cntxt.getResourceAsStream(fName);
        try {
            if (ins != null) {
                InputStreamReader isr = new InputStreamReader(ins);
                BufferedReader reader = new BufferedReader(isr);
                int n = 0;
                String word = "";
                while ((word = reader.readLine()) != null) {
                    out.println(word);
                }
            }
        }finally {
            out.close();
        }

    }

}
