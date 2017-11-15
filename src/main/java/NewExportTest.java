import org.apache.pdfbox.Overlay;
import org.apache.pdfbox.exceptions.COSVisitorException;
import org.apache.pdfbox.pdmodel.PDDocument;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

public class NewExportTest extends CPServlet {

    private String EXPORTS_DIR;

    public void init(ServletConfig config) throws ServletException{
        super.init(config);
        EXPORTS_DIR = config.getServletContext().getRealPath("/") + appProperties.getProperty("exportsDirectory") + "/";
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        logger.info("---------New export test---------");

        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();

        logger.info("loading sequence table");
        PDDocument sequenceTable = PDDocument.loadNonSeq(new File(classLoader.getResource("sequenceTable.pdf").getFile()), null);
        logger.info("loading watermark");
        PDDocument watermark = PDDocument.loadNonSeq(new File(classLoader.getResource("watermark.pdf").getFile()), null);
        
        //the above is the document you want to watermark                   


        logger.info("performing overlay");
        Overlay overlay = new Overlay();
        overlay.overlay(sequenceTable, sequenceTable);

        logger.info("saving sequence table");
        try {
            sequenceTable.save(EXPORTS_DIR + "out.pdf");
        } catch (COSVisitorException e) {
            logger.info("Got a COSVisitorException");
            e.printStackTrace();
        }

        //final.pdf will have the original PDF with watermarks.

        sequenceTable.close();
        watermark.close();

        String responseString = "{}";
        logger.info("Responding with: " + responseString);
        PrintWriter out = response.getWriter();
        out.println(responseString);

    }
}
