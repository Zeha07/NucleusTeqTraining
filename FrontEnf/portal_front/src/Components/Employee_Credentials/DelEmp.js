export default function DelEmp ({selectempId , setdel ,setshowsingleemp}){
  const delemployee = async() =>{
    try{
        const form = new FormData();
        form.append("empId" , selectempId.empId);
        const res = await fetch('http://localhost:8000/delemp' ,{
            method : "DELETE",
            body : form ,
        }).then((res) =>{
            alert(res.json())
        }) 
        
        setdel(false);
         setshowsingleemp(false);
    }catch(error){}
  }

    return(
        <div className="Main-Screen">
            <span className="Del">Delete the employee permanently !!!</span>
            <div className="buttons-container-emp">
            <button onClick={e => delemployee()}>
                Delete
            </button>
            <button onClick ={e => setdel(false)}>
                Back
            </button>
         </div>
        </div>
    )
}