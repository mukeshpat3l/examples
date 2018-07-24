using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FalkonryClient;
using FalkonryClient.Helper.Models;

namespace examples
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

    }
}