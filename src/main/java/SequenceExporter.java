import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.charset.Charset;

public class SequenceExporter extends CPServlet {

    private String EXPORTS_DIR;

    private final String EXPORT_TYPE_LIST = "list";
    private final String EXPORT_TYPE_TABLE = "table";
    private final String LINE_ENDING = "\r\n";
    private final String TAB = "    ";

    public void init(ServletConfig config) throws ServletException{
        super.init(config);
        EXPORTS_DIR = config.getServletContext().getRealPath("/") + appProperties.getProperty("exportsDirectory") + "/";
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        logger.info("---------User requested a sequence export---------");

        JSONObject requestObject = getRequestJson(request);
        JSONObject responseObject = new JSONObject();
        
        try {
            JSONObject courseSequenceObject = requestObject.getJSONObject("courseSequenceObject");
            String exportType = requestObject.getString("exportType");
            JSONArray yearList = courseSequenceObject.getJSONArray("yearList");
            
            String fileName = generateFileName();
            boolean exportSucceeded = false;

            if(exportType.equals(EXPORT_TYPE_LIST)){
                exportSucceeded = exportToList(fileName, yearList);
            } else if(exportType.equals(EXPORT_TYPE_TABLE)){
                exportSucceeded = exportToTable(fileName, yearList);
            }

            if(exportSucceeded){
                logger.info("Export succeeded");
                responseObject.put("exportPath",appProperties.getProperty("exportsDirectory")+"/"+fileName+".pdf");
            } else {
                logger.info("Export failed");
                responseObject.put("error", "Error exporting sequence");
            }
        } catch (JSONException e) {
            logger.error(e.toString());
            throw new IOException("Encountered JSON error when trying to export sequence");
        }

        PrintWriter out = response.getWriter();
        logger.info("Responding with: " + responseObject.toString());
        out.println(responseObject.toString());
    }

    //create a unique filename for each exported file
    private String generateFileName(){
        long time = System.currentTimeMillis();
        long threadId = Thread.currentThread().getId();
        return time + "-" + threadId;
    }

    private boolean exportToTable(String fileName, JSONArray yearList) throws JSONException, IOException {

        String semesterAsHtml = yearListToHtmlString(yearList);
        String filePathNoExtension = EXPORTS_DIR + fileName;
        String commandString = "wkhtmltopdf " + filePathNoExtension + ".html " + filePathNoExtension + ".pdf";

        return writeFile(filePathNoExtension + ".html", semesterAsHtml) && runCommand(commandString);
    }

    private boolean exportToList(String fileName, JSONArray yearList) throws JSONException {

        String semesterAsMarkdown = yearListToMarkdownString(yearList);
        String filePathNoExtension = EXPORTS_DIR + fileName;
        String commandString = "pandoc " + filePathNoExtension + ".md -o " + filePathNoExtension + ".pdf";

        return writeFile(filePathNoExtension + ".md", semesterAsMarkdown) && runCommand(commandString);
    }

    // returns true if write succeeded
    private boolean writeFile(String fullFilePath, String fileContent){
        File outputFile = new File(fullFilePath);
        try {
            if(!outputFile.exists()){
                outputFile.createNewFile();
            }
            PrintWriter out = new PrintWriter(outputFile);
            out.println(fileContent);
            out.close();
        } catch (FileNotFoundException e) {
            logger.error("File not found: " + fullFilePath);
            e.printStackTrace();
            return false;
        } catch (IOException e) {
            logger.error("IO Exception while writing to file: " + fullFilePath);
            e.printStackTrace();
            return false;
        }
        return true;
    }

    // return true if command succeeded
    private boolean runCommand(String commandString){
        logger.info("executing command: " + commandString);
        int exitCode = -1;
        try {
            Process proc = Runtime.getRuntime().exec(commandString);
            BufferedReader read = new BufferedReader(new InputStreamReader(proc.getInputStream()));
            try {
                proc.waitFor();
                exitCode = proc.exitValue();
            } catch (InterruptedException e) {
                logger.error("Interrupted Exception while running command: " + commandString);
                e.printStackTrace();
                return false;
            }
            while (read.ready()) {
                logger.info("Command output:" + read.readLine());
            }
        } catch (IOException e) {
            logger.error("IO Exception while running command: " + commandString);
            e.printStackTrace();
            return false;
        }
        return exitCode == 0;
    }
    
    /* Beefy StringBuilder functions */

    private String yearListToMarkdownString(JSONArray yearList) throws JSONException {

        StringBuilder builder = new StringBuilder();

        builder.append("# My Proposed Sequence" + LINE_ENDING + LINE_ENDING);

        for (int yearIndex = 0; yearIndex < yearList.length(); yearIndex++) {

            JSONObject year = yearList.getJSONObject(yearIndex);

            String[] seasons = {"fall", "winter", "summer"};

            for (String season : seasons) {

                JSONObject semester = year.getJSONObject(season);
                boolean isWorkTerm = semester.getBoolean("isWorkTerm");
                JSONArray courseList = semester.getJSONArray("courseList");

                String prettySeason = ((season.charAt(0) + "").toUpperCase()) + season.substring(1);

                builder.append("### " + prettySeason + " " + (yearIndex + 1) + ((isWorkTerm) ? " (Work Term)" : "") + LINE_ENDING + LINE_ENDING);

                if (courseList.length() == 0) {
                    builder.append("- No Courses" + LINE_ENDING);
                }

                // loop through course list and fill missing info for each course
                for (int i = 0; i < courseList.length(); i++) {

                    Object entry = courseList.get(i);

                    if (entry instanceof JSONObject) {

                        // found a simple course
                        builder.append(courseObjectToMarkdown((JSONObject) entry));

                    } else if (entry instanceof JSONArray) {

                        // found a list of courses (OR)
                        JSONArray orList = (JSONArray) entry;

                        for (int j = 0; j < orList.length(); j++) {
                            JSONObject course = (JSONObject) orList.get(j);
                            boolean isSelected = course.has("isSelected") && course.getBoolean("isSelected");
                            if (isSelected) {
                                builder.append(courseObjectToMarkdown(course));
                            }
                        }
                    } else {
                        logger.warn("Found unusual value inside course sequence. Expected a course object but found: " + entry.toString());
                    }
                }
                builder.append(LINE_ENDING);
            }
        }
        return builder.toString();
    }

    // replace {tableRows} in html template with generated html rows
    private String yearListToHtmlString(JSONArray yearList) throws JSONException, IOException {
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        File sequenceTableFile = new File(classLoader.getResource("sequenceTableTemplate.html").getFile());
        String sequenceTableTemplateAsString = FileUtils.readFileToString(sequenceTableFile, Charset.defaultCharset());
        return sequenceTableTemplateAsString.replace("{tableRows}", yearListToHtmlRows(yearList));
    }
    
    private String yearListToHtmlRows(JSONArray yearList) throws JSONException {

        StringBuilder builder = new StringBuilder();

        for (int yearIndex = 0; yearIndex < yearList.length(); yearIndex++) {

            JSONObject year = yearList.getJSONObject(yearIndex);

            String[] seasons = {"fall", "winter", "summer"};

            indent(builder, 4);
            builder.append("<tr>" + LINE_ENDING);

            indent(builder, 5);
            builder.append("<td>Year " + (yearIndex + 1) + "</td>" + LINE_ENDING);

            for (String season : seasons) {

                JSONObject semester = year.getJSONObject(season);
                JSONArray courseList = semester.getJSONArray("courseList");
                boolean isWorkTerm = semester.getBoolean("isWorkTerm");

                indent(builder, 5);
                builder.append("<td>" + LINE_ENDING);

                if(isWorkTerm){
                    indent(builder, 6);
                    builder.append("(Work Term)" + LINE_ENDING);
                }

                if (courseList.length() == 0) {
                    indent(builder, 6);
                    builder.append("<br/>No Courses" + LINE_ENDING);
                } else {
                    indent(builder, 6);
                    builder.append("<ol>" + LINE_ENDING);
                }

                // loop through course list and fill missing info for each course
                for (int i = 0; i < courseList.length(); i++) {

                    Object entry = courseList.get(i);

                    if (entry instanceof JSONObject) {

                        // found a simple course
                        JSONObject course = (JSONObject) entry;
                        indent(builder, 7);
                        builder.append("<li>" + courseObjectToHtml(course) + "</li>" + LINE_ENDING);

                    } else if (entry instanceof JSONArray) {

                        // found a list of courses (OR)
                        JSONArray orList = (JSONArray) entry;

                        for (int j = 0; j < orList.length(); j++) {
                            JSONObject course = (JSONObject) orList.get(j);
                            boolean isSelected = course.has("isSelected") && course.getBoolean("isSelected");
                            if (isSelected) {
                                indent(builder, 7);
                                builder.append("<li>" + courseObjectToHtml(course) + "</li>" + LINE_ENDING);
                            }
                        }
                    } else {
                        logger.warn("Found unusual value inside course sequence. Expected a course object but found: " + entry.toString());
                    }
                }

                if(courseList.length() > 0){
                    indent(builder, 6);
                    builder.append("</ol>" + LINE_ENDING);
                }
                indent(builder, 5);
                builder.append("</td>" + LINE_ENDING);
            }
            indent(builder, 4);
            builder.append("</tr>" + LINE_ENDING);
        }
        return builder.toString();
    }

    // used to indent the html so that the raw text is easier to read
    private void indent(StringBuilder builder, int times) {
        for(int i = 0; i < times; i++){
            builder.append(TAB);
        }
    }

    // representation of a course in markdown list
    private String courseObjectToMarkdown(JSONObject course) throws JSONException{
        if(course.getBoolean("isElective")){
            return ("- " + course.getString("electiveType") + " Elective" + LINE_ENDING);
        } else {
            return ("- " + course.getString("code") + ", " + course.getString("name") + ", " + course.getString("credits") + " Credits" + LINE_ENDING);
        }
    }

    // representation of a course in html table
    private String courseObjectToHtml(JSONObject course) throws JSONException{
        if(course.getBoolean("isElective")){
            return (course.getString("electiveType") + " Elective");
        } else {
            return (course.getString("code"));
        }
    }
}
