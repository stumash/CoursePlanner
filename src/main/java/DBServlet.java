import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;

public abstract class DBServlet extends CPServlet {

    protected MongoCollection courseData, courseSequences;

    public void init(ServletConfig config) throws ServletException {
        super.init(config);

        // set up references to mongo collections
        MongoClient mongoClient = new MongoClient(new MongoClientURI(appProperties.getProperty("mongoUrl")));
        MongoDatabase db = mongoClient.getDatabase(getDbName());
        courseData = db.getCollection(appProperties.getProperty("courseDataCollectionName"));
        courseSequences = db.getCollection(appProperties.getProperty("courseSequenceCollectionName"));
    }

    public String getDbName(){
        return appProperties.getProperty("buildType").equals("prod") ? appProperties.getProperty("dbNameProd") : appProperties.getProperty("dbNameDev");
    }

}
