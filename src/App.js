import {useState, useEffect} from 'react';
import { db, auth} from './firebaseConnection';
import {
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

import './app.css';
import { async } from '@firebase/util';

function App() {
  const  [ title, setTitle] = useState('');
  const  [ author, setAuthor ] = useState('');
  const [ idPost, setIdPost] = useState('');
  
  const [ email, setEmail] = useState('');
  const [ pass, setPass] = useState('');

  const [ user, setUser] = useState(false);
  const [ userDetail, setUserDetail] = useState({})

  const [ posts, setPosts] = useState([ ]);

  useEffect(() =>{
    async function loadPosts(){
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) =>{
        let listPost = [];

        snapshot.forEach((doc) =>{
          listPost.push({
            id: doc.id,
            title: doc.data().title,
            author: doc.data().author
          })
        })

        setPosts(listPost);
      })
    }

    loadPosts();

  }, [])

  useEffect(() =>{
    async function checkLogin(){
      onAuthStateChanged(auth, () =>{
        if(user){
          //if the user is logged in, enter here...
          console.log(user)
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          //if any user is loggeg in
          setUser(false);
          setUserDetail({})
        }
      })

    }
    checkLogin();
  })

  async function handleAdd(){

    await addDoc(collection(db, "posts"), {
      title: title,
      author: author,
    }) 
    .then(() =>{
      console.log("registered successfully")
      setTitle('');
      setAuthor('')
    })
    .catch((error) =>{
      console.log("ERROR" + error)
    })
  }

  // ********FINDING POST********
  async function findPost(){

    const postsRef = collection(db, "posts")
    await getDocs(postsRef)
    .then((snapshot) => {
      let list = [ ];

      snapshot.forEach((doc) =>{
        list.push({
          id: doc.id,
          title: doc.data().title,
          author: doc.data().author,
        })
      })

      setPosts(list);
    })
    .catch((error) =>{
      console.log("ERROR IN FINDING THE POST")
    })
  }

  // ******EDIT POST******
  async function editPost() {
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      title: title,
      author: author
    })
    .then(() =>{
      console.log("POST UPDATED")
      setIdPost('');
      setTitle('')
      setAuthor('')
    })
    .catch(()=>
    console.log("ERROR ON UPDATE POST"))
  }

  // *******DELETE POST*******
  async function deletePost(id){
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    .then(() =>{
      alert ('POST DELETED')
    })
  }

  // *******CREATE NEW USER*******
  async function newUser(){
    await createUserWithEmailAndPassword(auth, email, pass)
    .then((value) =>{
      console.log("SUCCESSFUL REGISTRATION!")
      setEmail('')
      setPass('')
    })
    .catch((error)=>{
      if(error.code === 'auth/weak-password'){
        alert("weak password")
      }else if(error.code === 'auth/email-already-in-use'){
        alert("email already exists")
      }
    })
  }


  // *********SIGN IN*********
  async function userSignIn(){
    await signInWithEmailAndPassword(auth, email, pass)
    .then((value) => {
      console.log("SUCCESSFULLY LOGGED!")
      console.log(value.user)
      
      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })
      setUser(true);

      setEmail('')
      setPass('')

    })
    .catch(()=>{
      console.log("ERROR WHEN LOGGING IN!")
    })
  }


  // ********LOG OUT********
  async function LogOut() {
    await signOut(auth)
    setUser(false);
    setUserDetail({})
  }

  return (

    <div>
      <h1>React Js + Firebase :)</h1>

      {user && (
        <div>
          <strong>Welcome!</strong><br/>
          <span>ID: {userDetail.uid} - {userDetail.email}</span><br/><br/>
          <button onClick={LogOut}>Log Out</button>
          <br/><br/>
        </div>
      )}

      <div className='container'>
        <h2>USERS</h2>
        <label>Email: </label>
        <input
          placeholder='type your email'
          value={email}
          onChange={ (e) => setEmail(e.target.value)}
        /><br/>

        <label>Password: </label>
        <input
        placeholder='your password'
        value={pass}
        onChange={(e) => setPass(e.target.value)}/><br/>

        <button onClick={newUser}>Register</button>
        <button onClick={userSignIn}>Sign In</button>
      </div>

      <br/><br/>
      <hr/>
      <br/>

      <div className='container'>
        <h2>POSTS</h2>

        <label>Post ID:</label>
        <input
          type='text'
          placeholder='Type ID post'
          value={idPost}
          onChange={ (e) => setIdPost(e.target.value)}
        /><br/>

        <label>Title:</label>
        <textarea
          type="text"
          placeholder='Type the title'
          value={title}
          onChange={ (e) => setTitle(e.target.value)}
        />
        <br/>

        <label>Author:</label>
        <input
          type='text'
          placeholder='Author of the post'
          value={author}
          onChange={ (e) => setAuthor(e.target.value)}
        />
          

        <button onClick={handleAdd}>Sign Up</button>
        <button onClick={findPost} >Find Post</button><br/>

        <button onClick={editPost}>Update post</button>

        <ul>
          {posts.map((post) =>{
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong><br/>
                <span>Title: {post.title} </span> <br/>
                <span>Author: {post.author} </span> <br/>
                <button onClick={ () => deletePost(post.id)}>Delete</button><br/><br/>

              </li>
            )
          })}
        </ul>

      </div>
     
    </div>
  )
}

export default App;
