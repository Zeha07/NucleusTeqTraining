import mysql.connector 

def db():
 try:
     s = msc.connect(host ="localhost" , user = "Python" , passwd = "PythonCon" , database ="Python")
     cur = msc.cursor()
     
 except Exception as e:
     print(e)
 else:
     print("successfully connected")
 return cur

