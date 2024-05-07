from fastapi import FastAPI


app = FastAPI()

@app.get('/')
def index():
    return {'data':{'Blog list'}} 

@app.get('/blog/unpublished')
def unpublished(limit=10,published : bool = True):
    
        return limit 
   
@app.get('/blog/{id}')
def show(id : int):
    return {'data' :id}



@app.get('/blog/{id}/comments')
def comment(id:int):
    return {'data' : {'1','2'}}
