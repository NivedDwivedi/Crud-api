const express=require('express');
const fs=require('fs');
const router=express.Router();


const courseData='json/course.json';
const studentData='json/student.json';


// all courses details
router.get('/', (req, res)=>{
    let data=JSON.parse(fs.readFileSync(courseData));
    res.send({data, error:null}); 
});


//Specific course detail
router.get('/:id', (req, res)=>{
    let id=req.params.id;
    let flag=0;
    let data=JSON.parse(fs.readFileSync(courseData));
    
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
        res.send("No Course available with this ID");
    }
    
});


//Adding a course
router.post('/', (req,res)=>{

    let name = req.body.name;
    let description = req.body.description;
    let availableSlots = req.body.availableSlots;
    if (!name || !description || !availableSlots)
    {
        res.send("Entry is Invalid");
    }

    let data=JSON.parse(fs.readFileSync(courseData));
    let obj= {
            "id": data.length+1,
            "name":name,
            "description":description,
            "availableSlots":availableSlots,
            enrolledStudents: []
        };
        data.push(obj);
        
        fs.writeFileSync(courseData, JSON.stringify(data, null, 2));
        res.send({ data: "Success", error: null });
});





//Enroll a student to a course if stots are available
router.post('/:id/enroll', (req, res)=>{
    let courseId=req.params.id;
    let studentId=req.body.studentId;
    let flag=0;
    let course_index, student_index;
    let coursedata=JSON.parse(fs.readFileSync(courseData));
    let studentdata=JSON.parse(fs.readFileSync(studentData));

    for(let i=0;i<studentdata.length;i++)
    {
        if(studentdata[i].id==studentId)
        {
            flag=1;
            student_index=i;
        }
    }
    if(flag==0)
    {
        res.send("No student exist with the given Id");
    }
    flag=0;
    for(let i=0;i<coursedata.length;i++)
    {
        if(coursedata[i].id==courseId)
        {
            flag=1;
            course_index=i;
        }
    }
    if(flag==0)
    {
        res.send("No course exist with the given Id");
    }


    if (coursedata[course_index]["availableSlots"] == 0)
    {
        res.send("No slots are available");
    }
     
    else
    {
        if(flag!=0)
        {
            coursedata[course_index]["availableSlots"] -= 1;
            let obj={
                "id":studentdata,
                "name":studentdata[student_index].name
            }
            coursedata[course_index]["enrolledStudents"].push(obj);
            fs.writeFileSync(courseData, JSON.stringify(coursedata, null, 2));
            res.send({ data: "Success", error: null });
        }
        
    }
        

});

//Remove a student from course 
router.put('/:id/deregister', (req, res)=>{
    let courseId=req.params.id;
    let studentId=req.body.studentId;
    let flag=0;
    let course_index,student_index;
    let coursedata=JSON.parse(fs.readFileSync(courseData));
    let studentdata=JSON.parse(fs.readFileSync(studentData));

    for(let i=0;i<studentdata.length;i++)
    {
        if(studentdata[i].id==studentId)
        {
            flag=1;
            student_index=i;
        }
    }
    if(flag==0)
    {
        res.send("No student exist with the given Id");
    }
    flag=0;
    for(let i=0;i<coursedata.length;i++)
    {
        if(coursedata[i].id==courseId)
        {
            flag=1;
            course_index=i;
        }
    }
    if(flag==0)
    {
        res.send("No course exist with the given Id");
    }
    
    if (flag!=0)
    {
        coursedata[course_index]["availableSlots"] += 1;
        coursedata[course_index]["enrolledStudents"].splice(student_index, 1);
        fs.writeFileSync(courseData, JSON.stringify(coursedata, null, 2));
        res.send({ data: "Success", error: null });
        
    }
    else
    {
        res.send("Something went wrong!");
    }
        

});

module.exports=router;