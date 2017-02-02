import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;

/**
 * Created by David Huculak on 2017-02-02.
 */
public class SequenceExporter extends HttpServlet {

    private static Logger logger = Logger.getLogger("SequenceExporter");

    private final String EXPORTS_DIR = "/opt/tomcat/webapps/courseplanner/exports/";

    public void doPost(HttpServletRequest request,
                       HttpServletResponse response)
            throws ServletException, IOException
    {

        logger.info("---------User requested a sequence export---------");

        ArrayList<Semester> semesters = Util.grabSemestersFromRequest(request);

        String semesterAsMarkdown = semesterListToMarkdownString(semesters);

        //create a funky-unique filename in case of concurrent file access issues (multiple users trying to export at once)
        long time = System.currentTimeMillis();
        long threadId = Thread.currentThread().getId();
        String fileName = time + "-" + threadId;

        generatePDF(semesterAsMarkdown, fileName);

        JSONObject responseJson = new JSONObject();

        try {
            responseJson.put("exportPath","/exports/"+fileName+".pdf");
        } catch (JSONException e) {
            logger.error("JSONException occured");
            e.printStackTrace();
        }

        PrintWriter out = response.getWriter();

        logger.info("Responding with: " + responseJson.toString());
        out.println(responseJson.toString());
    }

    private String semesterListToMarkdownString(ArrayList<Semester> semesters) {
        StringBuilder builder = new StringBuilder();

        builder.append("# My Course Sequence\n\n");

        int year = 0;
        for (int i = 0; i < semesters.size(); i++) {
            if (i % 3 == 0) {
                year++;
            }
            Semester semester = semesters.get(i);
            builder.append("### " + semester.getSeason() + " " + year + "\n\n");
            if (semester.isWorkTerm()) {
                builder.append("- Work Term\n");
            } else {
                for (Course course : semester.getCourses()) {
                    if (course.isElective()) {
                        builder.append("- " + course.getElectiveType() + " Elective\n");
                    } else {
                        builder.append("- " + course.getCode() + ", " + course.getName() + ", " + course.getCredits() + " Credits\n");
                    }
                }
            }
            builder.append("\n");
        }
        return builder.toString();
    }

    // generate a pdf file in EXPORTS_DIR folder with name {fileName}.pdf
    private String generatePDF(String markdownString, String fileName) {

        // First, we write the markdown string to a .md file
        File outputFile = new File(EXPORTS_DIR + fileName + ".md");
        try {
            if(!outputFile.exists()){
                outputFile.createNewFile();
            }
            PrintWriter out = new PrintWriter(outputFile);
            out.println(markdownString);
            out.close();
        } catch (FileNotFoundException e) {
            logger.error("File not found");
            e.printStackTrace();
        } catch (IOException e) {
            logger.error("IO Exception while writing to markdown file");
            e.printStackTrace();
        }

        //Second, we run pandoc on that .md file to generate a .pdf
        runPandoc(fileName);

        return fileName;
    }

    private void runPandoc(String fileName){

        String filePath = EXPORTS_DIR + fileName;
        String commandString = "pandoc " + filePath + ".md -o " + filePath + ".pdf";
        logger.info("executing command: " + commandString);

        try {
            Process proc = Runtime.getRuntime().exec(commandString);
            BufferedReader read = new BufferedReader(new InputStreamReader(proc.getInputStream()));
            try {
                proc.waitFor();
            } catch (InterruptedException e) {
                logger.error("Interrupted Exception");
                e.printStackTrace();
            }
            while (read.ready()) {
                logger.warn("Pandoc output:" + read.readLine());
            }
        } catch (IOException e) {
            logger.error("IO Exception while running pandoc");
            e.printStackTrace();
        }
    }

}
