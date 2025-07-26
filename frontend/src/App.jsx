import { use } from 'react';
import { useState } from 'react'

import { useForm } from 'react-hook-form';
import './App.css';

function App() {
  const [selectedComment, setselectedComment] = useState(null)
  const {register , reset, handleSubmit }= useForm({
    defaultValues : {
      link:" "
    }
  })
  
  const findrandom = async (data) => {
    const { link } = data;
    try {
      const da = await fetch("https://comment-picker-eight.vercel.app/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link })
      });
      let response = await da.json();
      
      // Check if response is an array and has items
      if (Array.isArray(response) && response.length > 0) {
        const randomNum = Math.floor(Math.random() * response.length);
        setselectedComment(response[randomNum]);
      } else if (response && typeof response === 'object') {
        // If response is a single object
        setselectedComment(response);
      } else {
        console.error('Invalid response format:', response);
        setselectedComment(null);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setselectedComment(null);
    }
  }

  return (
    <>
    <div className="heading">
      Welcome To Random Youtube Comment Picker
    </div>
    <div>
      <form onSubmit={handleSubmit(findrandom)}>
        
        <input {...register("link" , {required: true} )}  placeholder='Enter Youtube Video Link' type="text" />
        <button type="submit">Pick Random Comment</button>
      </form>
    </div>
    {selectedComment && (
      <div className="selected-comment">
        <div className="author">{selectedComment.author}</div>
        <div className="text">{selectedComment.text}</div>
        <div><a target='_blank' href={selectedComment.link}>View Comment on Youtube</a></div>
      </div>
    )}

    </>
  )
}

export default App
