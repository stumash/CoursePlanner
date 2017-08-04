import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

public class SequenceExporter extends CPServlet {

    private String EXPORTS_DIR;

    public void init(ServletConfig config) throws ServletException{
        super.init(config);
        EXPORTS_DIR = config.getServletContext().getRealPath("/") + appProperties.getProperty("exportsDirectory") + "/";
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        logger.info("---------User requested a sequence export---------");

        JSONObject requestObject = getRequestJson(request);

        JSONObject responseObject = new JSONObject();
        try{

            JSONArray yearList = requestObject.getJSONArray("yearList");

            String semesterAsMarkdown = yearListToMarkdownString(yearList);

            logger.info("Generated the following markdown:");

            logger.info(semesterAsMarkdown);

            //create a funky-unique filename in case of multiple users trying to export at once
            long time = System.currentTimeMillis();
            long threadId = Thread.currentThread().getId();
            String fileName = time + "-" + threadId;

            generatePDF(semesterAsMarkdown, fileName);

            responseObject.put("exportPath",appProperties.getProperty("exportsDirectory")+"/"+fileName+".pdf");

        } catch (JSONException e) {
            logger.error(e.toString());
            throw new IOException("Encountered JSON error when trying to export");
        }

        PrintWriter out = response.getWriter();

        logger.info("Responding with: " + responseObject.toString());
        out.println(responseObject.toString());
    }

    private String yearListToMarkdownString(JSONArray yearList) throws JSONException {

        StringBuilder builder = new StringBuilder();

        builder.append("# My Course Sequence\n\n");

        for (int yearIndex = 0; yearIndex < yearList.length(); yearIndex++) {

            JSONObject year = yearList.getJSONObject(yearIndex);

            String[] seasons = {"fall", "winter", "summer"};

            for (String season : seasons) {

                JSONObject semester = year.getJSONObject(season);
                boolean isWorkTerm = semester.getBoolean("isWorkTerm");
                JSONArray courseList = semester.getJSONArray("courseList");

                String prettySeason = ((season.charAt(0) + "").toUpperCase()) + season.substring(1);

                builder.append("### " + prettySeason + " " + (yearIndex + 1) + ((isWorkTerm) ? " (Work Term)" : "") + "\n\n");

                if (courseList.length() == 0) {
                    builder.append("- No Courses\n");
                }

                // loop through course list and fill missing info for each course
                for (int i = 0; i < courseList.length(); i++) {

                    Object entry = courseList.get(i);

                    if (entry instanceof JSONObject) {

                        // found a simple course
                        builder.append(courseObjectToString((JSONObject) entry));

                    } else if (entry instanceof JSONArray) {

                        // found a list of courses (OR)
                        JSONArray orList = (JSONArray) entry;

                        for (int j = 0; j < orList.length(); j++) {
                            JSONObject course = (JSONObject) orList.get(j);
                            boolean isSelected = course.has("isSelected") && course.getBoolean("isSelected");
                            if (isSelected) {
                                builder.append(courseObjectToString(course));
                            }
                        }
                    } else {
                        logger.warn("Found unusual value inside course sequence. Expected a course object but found: " + entry.toString());
                    }
                }
                builder.append("\n");
            }
        }
        return builder.toString();
    }

    private String courseObjectToString(JSONObject course) throws JSONException{
        if(course.getBoolean("isElective")){
            return ("- " + course.getString("electiveType") + " Elective\n");
        } else {
            return ("- " + course.getString("code") + ", " + course.getString("name") + ", " + course.getString("credits") + " Credits\n");
        }
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
