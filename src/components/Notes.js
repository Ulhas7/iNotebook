import React, { useContext, useEffect,useRef,useState } from "react";
import NoteContext from "../context/notes/noteContext";
import NoteItems from "./NoteItems";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const context = useContext(NoteContext);
  const navigate = useNavigate()
  const { notes, getNotes,editNote } = context;
  useEffect(() => {
    if (localStorage.getItem('token')) {
        getNotes();
    }
    else{
      navigate('/login')
    }

  }, []);

  const ref =useRef(null)
  const refClose =useRef(null)
  const [note,setNote]=useState({id:"",etitle:"",edescription:"",etag:""})

  const updateNote = (currentNote) => {
    ref.current.click()
    setNote({id:currentNote._id,etitle:currentNote.title,edescription:currentNote.description,etag:currentNote.tag})
  };

  const handleClick=(e)=>{
    console.log("Updeting the note...",note)
    editNote(note.id,note.etitle,note.edescription,note.etag)
    refClose.current.click()
    props.showAlert("Updated Successfully","success")

  }
  const onChange= (e)=>{
    setNote({...note,[e.target.name]:e.target.value})
  }

  return (
    <>
      <AddNote showAlert={props.showAlert}/>
<button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModalLong">
  Launch demo modal
</button>

<div className="modal fade" id="exampleModalLong" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLongTitle">Edit Note</h5>
        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <form className="my-3">
          <div className="mb-3 ">
            <label htmlFor="etitle" className="form-label">Title</label>
            <input
              type="text"className="form-control"id="etitle"name="etitle"aria-describedby="emailHelp"value={note.etitle} onChange={onChange} minLength={3} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="edescription" className="form-label">Description  </label>
            <input type="text"  className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="etag" className="form-label">  Tag </label>
            <input type="text"className="form-control" id="etag" name="etag" value={note.etag}onChange={onChange} />
          </div>
         </form>
      </div>
      <div className="modal-footer">
        <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" disabled ={note.etitle.length<3||note.edescription.length<5}className="btn btn-primary" onClick={handleClick}>Update Note</button>
      </div>
    </div>
  </div>
</div>
      <div className="row my-3 mx-5">
        <h2>| Your Notes</h2>
        <div className ="container mx-2">
        {notes.length===0 && 'No note to diplay'}
        </div>
        {notes.map((note) => {
          return (
            <NoteItems key={note._id} note={note} updateNote={updateNote} showAlert={props.showAlert}/>
          );
        })}
      </div>
    </>
  );
};

export default Notes;
