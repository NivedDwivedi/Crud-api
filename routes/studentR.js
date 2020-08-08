const express=require('express');
const fs=require('fs');
const router=express.Router();

const studentData='json/student.json';

//Get details of all the student
router.get('/', (req, res)=>{
    let data=JSON.parse(fs.readFileSync(studentData));

    res.send({data, error:null});
});


//Get student details by id
router.get('/:id', (req, res)=>{
    let id=req.params.id;
    let flag=0;
    let data=JSON.parse(fs.readFileSync(studentData));
    
    for(let i=0;i<data.length;i++)
    {
        if(data[i].id==parseInt(id))
        {
            res.send(data[i]);
            flag=1;
        }
    }

    if(flag==0)
    {
        res.send("No student available with this ID");
    }

});


//Add a student
router.post('/', (req, res)=>{

    let name=req.body.name;
    let data=JSON.parse(fs.readFileSync(studentData));

    let obj={
            "ID": data.length+1,
            "name":name
    };
    data.push(obj);
    fs.writeFileSync(studentData, JSON.stringify(data, null, 2));
    res.send({data:"Success", error:null});
});

module.exports=router;