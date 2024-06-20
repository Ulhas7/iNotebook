const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//ROUTE 1:-Get all the notes using :Post "/api/auth/createuser"  login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
} catch (error) {
    console.error(error.message);
    res.status(500).send('error in note of route 1 ') 
}
});

//ROUTE 2:-Add a new notes using post :Post "/api/auth/addnote" login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "minimum length of titlte should be 3 words").isLength({
      min: 3,
    }),
    body(
      "descprition",
      "minimum length of descprition should be 5 words"
    ).isLength({ min: 5 })
  ],
  async (req, res) => {
      try {
        //if there are error return the bad request and the error
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          return res.status(400).json({ error: errors.array() });
        }
        
    
    const { title, description, tag } = req.body;
    const note = new Note({
      title,
      description,
      tag,
      user: req.user.id,
    });
    const savedNote = await note.save()
    res.json(savedNote);
  }
 catch (error) {
    console.error(error.message);
    res.status(500).send('error in notes in route 2 ') 
}
});

//ROUTE 3:-Update an existing notes using put :Put "/api/auth/updatenote/id" login required
router.put( "/updatenote/:id",fetchuser,async (req, res) => {
        try {
            
            const {title,description,tag}=req.body;
            // create a newNote object
            const newnote ={};
            if(title){newnote.title=title};
            if(description){newnote.description=description};
            if(tag){newnote.tag=tag};

            // find the not to be update and update it
            let  note= await Note.findById(req.params.id);
            if(!note){ return res.status(404).send("not found")}

            if(note.user.toString()!==req.user.id){return res.status(404).send('not allowed')}


             note = await Note.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
             res.json({note});


        } catch (error) {
            console.error(error.message);
    res.status(500).send('error in notes in route 3 ') 
        }
    })
//ROUTE 4:-delete an existing notes using delete:delete "/api/auth/deletenote/id" login required
router.delete( "/deletenote/:id",fetchuser,async (req, res) => {
        try {
            

            // find the not to be deleted and delete it
            let  note= await Note.findById(req.params.id);
            if(!note){ return res.status(404).send("not found")}

            // allow deletion only if user owns this note
            if(note.user.toString()!==req.user.id){return res.status(404).send('not allowed')}


             note = await Note.findByIdAndDelete(req.params.id)
             res.json({"success":"note has been deleted",note:note});


        } catch (error) {
            console.error(error.message);
    res.status(500).send('error in notes in route 4 ') 
        }
    })

module.exports = router;


