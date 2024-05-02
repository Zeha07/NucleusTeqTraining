import mysql.connector  
 # Creating the connection object     
conn_obj = mysql.connector.connect(host="localhost", user="Python", passwd="PythonCon",database = "Python", auth_plugin = 'mysql_native_password')  
  # creating the cursor object    
cur_obj = conn_obj.cursor()  
print(conn_obj )
try:
#  dbs = cur_obj.execute("create table Employee(name varchar(20) not null, id int(20) not null primary key, salary float not null, Dept_id int not null)")  
 dbs = cur_obj.execute("show tables")
except:
 cur_obj.rollback()


for x in cur_obj:
 print(x)

# print(cur_obj )
conn_obj.close()  
  
