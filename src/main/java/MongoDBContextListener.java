import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

@WebListener
public class MongoDBContextListener implements ServletContextListener {

    private Logger logger;

    @Override
    public void contextInitialized(ServletContextEvent sce) {

        logger = Logger.getLogger(sce.getServletContext().getServletContextName());

        // load the app properties
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        InputStream input = classLoader.getResourceAsStream("courseplanner.properties");
        Properties appProperties = new Properties();
        try{
            appProperties.load(input);
        } catch(IOException e){
            String message = "Error reading courseplanner.properties";
            logger.error(message);
            throw new RuntimeException(message);
        }

//        logger.info("pushBackSize: " + System.getProperty("org.apache.pdfbox.baseParser.pushBackSize"));

        System.setProperty("org.apache.pdfbox.baseParser.pushBackSize", "130000");

        // add the app properties to the servlet context
        sce.getServletContext().setAttribute("APP_PROPERTIES", appProperties);

        // create a mongo client
        MongoClient mongoClient = new MongoClient(new MongoClientURI(appProperties.getProperty("mongoUrl")));
        logger.info("MongoClient initialized successfully");

        // add the mongo client to the servlet context
        sce.getServletContext().setAttribute("MONGO_CLIENT", mongoClient);

    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        MongoClient mongoClient = (MongoClient) sce.getServletContext().getAttribute("MONGO_CLIENT");
        mongoClient.close();
        logger.info("MongoClient closed successfully");
        LogManager.shutdown();
    }
}