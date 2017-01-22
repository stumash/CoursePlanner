import java.io.FileReader;
import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.StringTokenizer;
import java.util.HashMap;

public class CourseParser {
    private static final int NUMCOLUMNS = 7;

    public static void main(String[] args) {

        HashMap<String,CourseInfo> courseMap = new HashMap<String,CourseInfo>();

        try (BufferedReader br = new BufferedReader(new FileReader("courseSheet.csv"))) {

            StringTokenizer st;
            String currLine;
            String currToken;
            int j = 0;

            currLine = br.readLine();
            while (currLine != null) {
                st = new StringTokenizer(currLine,",",true);
                CourseInfo currCourseInfo = new CourseInfo();

                for (int i = 0; i < NUMCOLUMNS; i++) {
                    currToken = st.nextToken();

                    if (currToken.equals(",")) //if empty token
                        continue; 

                    switch(i) {
                        case 0:
                            currCourseInfo.name = currToken;
                            break;
                        case 1:
                            currCourseInfo.code = currToken;
                            break;
                        case 2:
                            currCourseInfo.credits = Integer.parseInt(currToken);
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
                        case 5:
                            break;
                        case 6:
                            break;
                        case 7:
                            break;
                        default:
                            break;
                    }

                    System.out.print(i + ": " + currToken + ", ");
                    st.nextToken(); //consume trailing comma
                }
                System.out.println();
                currLine = br.readLine();
                if (j++ > 4) {break;}
            } 

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class CourseInfo {
    public String name;
    public String code;
    public int credits;
    public ArrayList<String> prereqs;
    public ArrayList<String> coreqs;
    public TermsOffered isOfferedIn;
    
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
