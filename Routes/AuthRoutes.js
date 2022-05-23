const router = require("express").Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const TeacherModel = require("../Models/TeacherModel");
const StudentModel = require("../Models/StudentGrades");
const authenticateJWT = require("../Middleware/authorize");


const loginSchema = Joi.object({
  name: Joi.string().min(6).required(),
  password: Joi.string().min(6).required(),
});

const studentGradeSchema = Joi.object({
  name: Joi.string().min(6).required(),
  maths: Joi.number(),
  science: Joi.number(),
  english: Joi.number(),
  dutch: Joi.number(),
  grade: Joi.number(),
});

//routes 
router.post("/register", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if teacher exits already
  const teacherExists = await TeacherModel.findOne({ name: req.body.name });
  if (teacherExists) return res.status(400).send("Teacher name already exists");
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  // create new teacher
  const teacher = new TeacherModel({
    name: req.body.name,
    password: hashPassword,
  });
  try {
    const savedTeacher = await teacher.save();
    res.send(savedTeacher);
  } catch (err) {
    res.send(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if teacher exits
  const teacher = await TeacherModel.findOne({ name: req.body.name });
  if (!teacher) return res.status(400).send("user name or password is wront");

  // check password correctnes
  const validPassword = await bcrypt.compare(
    req.body.password,
    teacher.password
  );

  if (!validPassword)
    return res.status(400).send("user name or password is wront");

  // create jwt token

  const token = jwt.sign({ _id: teacher._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

//add grades to db
router.post("/addGrades", authenticateJWT, async (req, res) => {
  // if teacher has valid token proceed

  const { error } = studentGradeSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if student already exists
  const student = await StudentModel.findOne({ name: req.body.name });
  if (student) return res.status(405).send("student already exits");

  // create new student grade
  const stuGrade = new StudentModel({
    name: req.body.name,
    maths: req.body.maths,
    science: req.body.science,
    english: req.body.english,
    dutch: req.body.dutch,
    grade: req.body.grade,
  });
  try {
    const savedStudentGrade = await stuGrade.save();
    res.status(200).send(" Student Added ");
  } catch (err) {
    res.status(400).send(err);
  }
});
//get grades from db
router.get("/getAllGrades", authenticateJWT, async (req, res) => {
  // if teacher has valid token proceed
  const grades = await StudentModel.find({});

  res.status(200).send(grades);
});
//edit grades
router.put("/editGrades", authenticateJWT, async (req, res) => {
  // if teacher has valid token proceed
  let query = { _id: req.body.objId };

  let newData = {};
  newData.maths = req.body.maths;
  newData.science = req.body.science;
  newData.grade = req.body.grade;
  newData.english = req.body.english;
  newData.dutch = req.body.dutch;
  try {
    //update records for a given id
    const updateRecords = await StudentModel.findOneAndUpdate(query, newData, {
      upsert: true,
      new: true,
    });
    res.status(200).send("Edidted success");
  } catch (error) {
    res.send(400).send(error);
  }
});
//delete grades
router.delete("/deletestudentgrade", authenticateJWT, async (req, res) => {
  // if teacher has valid token proceed
  console.log(" delete req ", req.body);
  const id = req.body.objId;

  try {
    //delete record for a given id
    const deleteRecords = await StudentModel.deleteOne({ _id: id });
    res.status(200).send("deleted");
  } catch (error) {
    res.send(400).send(error);
  }
});
module.exports = router;
