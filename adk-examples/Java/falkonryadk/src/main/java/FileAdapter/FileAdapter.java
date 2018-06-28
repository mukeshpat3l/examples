package FileAdapter;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;

import java.io.*;

public class FileAdapter {
    private File f;
    private String fileName;

    public String getData(String fileName) throws FileNotFoundException {
        f= new File(fileName);
        if(f.isFile()){
            String fileType = FilenameUtils.getExtension(fileName);
            if((fileType.toLowerCase().equals("csv"))||(fileType.toLowerCase().equals("json"))){
                try {
                    FileReader fr = new FileReader(f);
                    BufferedReader br = new BufferedReader(fr);
                    String s = IOUtils.toString(br);
                    return s;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } else{
            throw new FileNotFoundException("Please enter the correct path of the file");
        }
        return null;
    }

    public ByteArrayInputStream getDataStream(String fileName) throws FileNotFoundException {
        f= new File(fileName);
        if(f.isFile()){
            String fileType = FilenameUtils.getExtension(fileName);
            if((fileType.toLowerCase().equals("csv"))||(fileType.toLowerCase().equals("json"))){
                try {

                    File file = new File(fileName);
                    ByteArrayInputStream istream = new ByteArrayInputStream(FileUtils.readFileToByteArray(file));
                    return istream;

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } else{
            throw new FileNotFoundException("Please enter the correct path of the file");

        }

        return null;
    }
}

