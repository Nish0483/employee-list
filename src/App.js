import React, { useState, useEffect } from 'react';
import axios from 'axios';// api fetch package
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '',  age:'', salary: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: '', age: '', salary: '' });
  const [addPopup, setAddPopup] = useState(false);
  const [editPopup,setEditPopup]=useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

 

  useEffect(() => {
   
    axios.get('https://nishil.glitch.me/api/employees/')  // fetching all users from DB
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });

  }, [editedUser]);  //re render when this value change

  const addNewUser = () => {

    // Send a POST/add request
    axios.post('https://nishil.glitch.me/api/employees', newUser)
      .then((response) => {
       
        setUsers([...users, response.data]);
        setNewUser({ name: '',  age: '',salary: '', }); //clearing fields
        setAddPopup(false);
      })
      .catch((error) => {
        console.error('Error adding a new user: ', error);
      });

  };
  
const editUser = (user) => {
    setEditPopup(true);
    setEditingUser(user.id);
    // Pre-fill the edit form with the current details
    setEditedUser({name: user.name, age: user.age, salary: user.salary });
  };


const saveUserChanges = () => {
    axios
      .put(`https://nishil.glitch.me/api/employees/${editingUser}`, editedUser) // edit user
      .then((response) => {
        
        setUsers(users.map((user) => (user.id === editingUser.id ? response.data : user)));
        setEditingUser(null);
        setEditedUser({ name: '', age: '', salary: '' });
        setEditPopup(false);
      })
      .catch((error) => {
        console.error('Error updating user: ', error);
      });
  };


const deleteUser = (user) => {
    setUserToDelete(user);
    setDeletePopup(true);
    };
  
    
const confirmDeleteUser = () => {           // delete user
      if (userToDelete) {
        axios
          .delete(`https://nishil.glitch.me/api/employees/${userToDelete.id}`)
          .then(() => {
            setUsers(users.filter((user) => user.id !== userToDelete.id));
            
            setUserToDelete(null);
            setDeletePopup(false);
          })
          .catch((error) => {
            console.error('Error deleting user: ', error);
          });
      }
    };
    
    

return (
    <div >
      <h1>EMPLOYEE LIST</h1>
      <div className="ADD" ><button  onClick={() => setAddPopup(true)}>Add User</button></div>

      {addPopup && (
        <div className="popup-container">
      <div className="popup">
      <h3>Add User</h3>
      <div className="input-container">
      <input
        type="text"
        placeholder="Name"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Age"
        value={newUser.age}
        onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
      />
      <input
        type="number"
        placeholder="Salary"
        value={newUser.salary}
        onChange={(e) => setNewUser({ ...newUser, salary: e.target.value })}
      />
      </div>
      
      <button  onClick={addNewUser}>Add User</button>
      
      <button  onClick={() => setAddPopup(false)}>Close</button>
     </div>
   </div>
  )}

 <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Age</th> 
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
            <td>{user.id}</td>
              <td>
                <img className="avatar" src={'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'} alt={'User Avatar'}  />
                
              </td>
              <td>{user.name}</td>
              <td>{user.age}</td> 
              <td>{user.salary}</td>
              <td>
                <button onClick={() => deleteUser(user)}>Delete</button>
                <button onClick={() => editUser(user)}>Edit</button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>


{ editPopup && (
  <div className="popup-container">
    <div className='popup'>
      <h3>Edit User</h3>
      <div className="input-container">
        <input
          type="text"
           placeholder="Name"
           value={editedUser.name}
          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          value={editedUser.age}
          onChange={(e) => setEditedUser({ ...editedUser, age: e.target.value })}
        />
        <input
          type="number"
          placeholder="Salary"
          value={editedUser.salary}
          onChange={(e) => setEditedUser({ ...editedUser, salary: e.target.value })}
        />
      </div>
      <button onClick={() => saveUserChanges()}>Save</button>
      <button onClick={() => setEditPopup(false)}>Close</button>
    </div>
  </div>
)}

{deletePopup && (
  <div className="popup-container">
    <div className="popup">
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to delete {userToDelete ? userToDelete.name : 'this user'}?</p>
      <div className="button-container">
        <button onClick={confirmDeleteUser}>Confirm Delete</button>
        <button onClick={() => setDeletePopup(false)}>Cancel</button>
      </div>
    </div>
  </div>
 )}

</div>
  );
};

export default App;
