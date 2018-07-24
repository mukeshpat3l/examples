using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FalkonryClient;
using FalkonryClient.Helper.Models;

namespace ConsoleApp2
{
    class FileAdapter
    {
        public String GetData(String fileName)
        {
            String stream = "";
            if (!File.Exists(fileName))
            {
                throw new FileNotFoundException("Please enter the correct path of the file");
            }
            var sr = new StreamReader(File.OpenRead(fileName));
            stream = sr.ReadToEnd().ToString();
            return stream;
        }

        public byte[] GetStream(String fileName)
        {
            if (!File.Exists(fileName))
            {
                throw new FileNotFoundException("Please enter the correct path of the file");
            }
            byte[] bytes = System.IO.File.ReadAllBytes(fileName);
            return bytes;
        }

        /*static void Main(string[] args)
        {
            FileAdapter file_adapter = new FileAdapter("C:\\Users\\Parth Shah\\Desktop\\Falkonry\\June 12\\source2.csv");
            Console.Write(file_adapter.GetData());
            Console.ReadKey();
        }*/
    }
}