const express= require('express');
const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const courseR=require('./routes/courseR');
const studentR=require('./routes/studentR');




app.use('/api/course/', courseR);
app.use('/api/students/', studentR);



const PORT=process.env.PORT || 3000;
app.listen(PORT, (req, res)=>console.log(`We are at port ${PORT}`));