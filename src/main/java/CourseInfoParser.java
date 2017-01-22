import org.apache.log4j.Logger;

import javax.servlet.ServletContext;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.StringTokenizer;
import java.util.HashMap;

public class CourseInfoParser {

    public static HashMap<String,CourseInfo> courseMap;
    private static Logger logger = Logger.getLogger("PrettyGoodServlet");
    private static final int NUMCOLUMNS = 7;

    public static void init(ServletContext cntxt) {


        courseMap = new HashMap<String,CourseInfo>();
        try {

            StringTokenizer st;
            String currLine;
            String currToken;

            String logString = null;

            String fName = "/soendf2.csv";
            InputStream ins = cntxt.getResourceAsStream(fName);
            BufferedReader br = new BufferedReader(new InputStreamReader(ins));

            currLine = br.readLine(); //ignore column names
            currLine = br.readLine();

            while (currLine != null) {
                st = new StringTokenizer(currLine,"#",true);
                CourseInfo currCourseInfo = new CourseInfo();
                logString = "";

                for (int i = 0; i < NUMCOLUMNS; i++) {
                    if (st.hasMoreTokens())
                        currToken = st.nextToken();
                    else
                        break;

                    if (currToken.equals("#")) //if empty token
                        continue; 

                    switch(i) {
                        case 0: //course name
                            currCourseInfo.name = currToken;
                            break;
                        case 1: //course code
                            currCourseInfo.code = currToken;
                            break;
                        case 2: //credits
                            currCourseInfo.credits = Double.parseDouble(currToken);
                            break;
                        case 3: //prereqs
                            String[] prs = currToken.split(";");
                            for (String pr : prs)
                                currCourseInfo.prereqs.add(pr);
                            break;
                        case 4: //coreqs
                            String[] crs = currToken.split(";");
                            for (String cr : crs)
                                currCourseInfo.coreqs.add(cr);
                            break;
                        case 5: //semesters offered
                            String[] sos = currToken.split(";");
                            for (String so : sos) {
                                if (so.equals("1")) {
                                    currCourseInfo.isOfferedIn.fall = true;
                                    logger.info("k");
                                }
                                if (so.equals("2")) {
                                    currCourseInfo.isOfferedIn.winter = true;
                                    logger.info("k");
                                }
                                if (so.equals("3")) {
                                    currCourseInfo.isOfferedIn.summer = true;
                                    logger.info("k");
                                }
                            }
                            break;
                        case 6: //notes
                            currCourseInfo.notes = currToken;
                            break;
                        default:
                            break;
                    }

                    logString += i + ": " + currToken + ", ";
                    if (st.hasMoreTokens())
                        st.nextToken(); //consume trailing comma
                    else
                        break;
                }

                logger.info(logString);
                currLine = br.readLine();
                courseMap.put(currCourseInfo.code,currCourseInfo);
            } 

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class CourseInfo {
    public String name;
    public String code;
    public double credits;
    public ArrayList<String> prereqs = new ArrayList<String>();
    public ArrayList<String> coreqs = new ArrayList<String>();
    public TermsOffered isOfferedIn = new TermsOffered();
    public String notes;
    
    @Override
    public String toString() {
        return code + "/" + name + " -- " + credits + " crds, offerediIn " + isOfferedIn.toString() + " -- prereqs: " + 
            prereqs.toString() + " -- coreqs: " + coreqs.toString();
    }
}

class TermsOffered {
    public boolean fall;
    public boolean winter;
    public boolean summer;

    @Override
    public String toString() {
        String result = "";
        if (fall)
            result += "f";
        if (winter)
            result += "w";
        if (summer)
            result += "s";
        return result;
    }
}
