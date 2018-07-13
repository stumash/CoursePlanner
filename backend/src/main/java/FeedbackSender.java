import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.Email;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class FeedbackSender extends CPServlet {

    public void doPost(HttpServletRequest request,
                       HttpServletResponse response)
            throws ServletException, IOException
    {

        logger.info("---------User requested to send some feedback---------");

        String feedbackMessage = (String) grabPropertyFromRequest("message", request);

        logger.info("feedback message: " + feedbackMessage);
        
        boolean success = true;
        try {
            Email email = new SimpleEmail();
            email.setHostName("smtp.gmail.com");
            email.setSmtpPort(465);
            email.setAuthenticator(new DefaultAuthenticator("concordiacourseplanner@gmail.com", "tranzone"));
            email.setSSLOnConnect(true);
            email.setFrom("concordiacourseplanner@gmail.com");
            email.setSubject("ConU Course Planner Feedback");
            email.setMsg(feedbackMessage);
            email.addTo("concordiacourseplanner@gmail.com");
            email.send();
        } catch(EmailException e){
            success = false;
        }

        JSONObject responseObject = new JSONObject();
        try {
            responseObject.put("success", success);
        } catch (JSONException e){
            logger.info("Encountered a JSON error when setting response property: success");
        }

        logger.info("Responding with: " + responseObject.toString());
        PrintWriter out = response.getWriter();
        out.println(responseObject.toString());
    }
}
