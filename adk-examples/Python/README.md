# Falkonry ADK Example - Python
#### This app provides useful code snippets to build applications using Falkonry ADK.

### Usage:

1) Make sure python 3.6 is installed in your system.

2) All the dependencies are in the file `requirements.txt`. Open the terminal and navigate to the directory of file and enter the following command.<br>
`pip3 install -r requirements.txt`<br>
This will install all the dependencies required to run the application.

3) Inside this folder there are two files:<br>
i) ADKConnectorHist.py<br>
ii) ADKConnectorLive.py<br>
To send historical data to Falkonry use `ADKConnectorHist.py` and to integrate with Falkonry's live monitoring API use `ADKConnectorLive.py`.

4) Add **URL and API Token** to the code. [Reference](https://help.falkonry.com/en/latest/using/accounts.html?highlight=token#integration)

5) Edit the code according to the use case.

For more information regarding Falkonry ADK visit the documentation [here](https://help.falkonry.com/en/latest/adk_documentation.html).