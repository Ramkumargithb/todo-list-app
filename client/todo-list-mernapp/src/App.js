import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// ... (import statements and other code)

function App() {
  const [itemText, setItemText] = useState('');
  const [itemDescription, setItemDescription] = useState(''); // Added description state
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const [updateItemDescription, setUpdateItemDescription] = useState(''); // Added description state

  const [completedItems, setCompletedItems] = useState([]);

  const [checkedItems, setCheckedItems] = useState({});
  const [filterOption, setFilterOption] = useState('all');

  const toggleCheckbox = (_id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [_id]: !prev[_id],
    }));
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  const filterItems = () => {
    if (filterOption === 'completed') {
      return listItems.filter((item) => checkedItems[item._id]);
    } else if (filterOption === 'active') {
      return listItems.filter((item) => !checkedItems[item._id]);
    } else {
      return listItems;
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!itemText || itemText.trim() === '') {
      alert('Please enter ToDo item.');
      return false;
    }

    try {
      const res = await axios.post('http://localhost:5500/api/item', {
        item: itemText,
        description: itemDescription, // Save description in the database
      });
      setListItems((prev) => [...prev, res.data]);
      setItemText('');
      setItemDescription('');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/item');
        setListItems(res.data);
      } catch (err) { 
        console.log(err);
      }
    };
    getItemsList();
  }, []);

  const deleteItem = async (_id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this task?');
    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5500/api/item/${_id}`);
      const newListItems = listItems.filter((item) => item._id !== _id);
      setListItems(newListItems);
    } catch (err) {
      console.log(err);
    }
  };

  const updateItem = async (e) => {
    e.preventDefault();

    if (!updateItemText || updateItemText.trim() === '') {
      alert('Please enter Updated ToDo item.');
      return false;
    }

    try {
      await axios.put(`http://localhost:5500/api/item/${isUpdating}`, {
        item: updateItemText,
        description: updateItemDescription, // Update description in the database
      });
      const updatedItemIndex = listItems.findIndex((item) => item._id === isUpdating);
      listItems[updatedItemIndex].item = updateItemText;
      listItems[updatedItemIndex].description = updateItemDescription; // Update local state
      setUpdateItemText('');
      setUpdateItemDescription('');
      setIsUpdating('');
    } catch (err) {
      console.log(err);
    }
  };

  const completeItem = async (_id) => {
    try {
      const res = await axios.put(`http://localhost:5500/api/item/${_id}`, {
        status: 'Completed',
      });
      const updatedItemIndex = listItems.findIndex((item) => item._id === _id);
      listItems[updatedItemIndex] = res.data;
      setListItems([...listItems]);
      setCompletedItems([...completedItems, _id]);
    } catch (err) {
      console.log(err);
    }
  };

  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e) => updateItem(e)}>
      <input
        className="update-new-input"
        type="text"
        placeholder="Update Item"
        onChange={(e) => setUpdateItemText(e.target.value)}
        value={updateItemText}
      />
      <textarea
        className="update-new-description"
        placeholder="Update Description"
        onChange={(e) => setUpdateItemDescription(e.target.value)}
        value={updateItemDescription}
      />
      <button className="update-btn" type="submit">
        Update
      </button>
      <button className="cancel-btn" type="button" onClick={cancelUpdate}>
        Cancel
      </button>
    </form>
  );

  const cancelUpdate = () => {
    setUpdateItemText('');
    setUpdateItemDescription('');
    setIsUpdating('');
  };

  return (
    <div className="App">
      <h1>Todo List App</h1>
      <form className="form" onSubmit={(e) => addItem(e)}>
        <input
          type="text"
          id="input-box"
          placeholder="Add Todo Item"
          onChange={(e) => setItemText(e.target.value)}
          value={itemText}
        />
        { <textarea
          id="description-box"
          placeholder="Optional Description"
          onChange={(e) => setItemDescription(e.target.value)}
          value={itemDescription}/> }
        
        <button type="submit">Add</button>
      </form>

      <div className="filter-container">
        <label htmlFor="filter">Filter:</label>
        <select id="filter" onChange={handleFilterChange} value={filterOption}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>
      </div>

      <div className="todo-listItems">
        {filterItems().map((item) => (
          <div className={`todo-item ${checkedItems[item._id] ? 'checked' : ''}`} key={item._id}>
            {isUpdating === item._id ? (
              renderUpdateForm()
            ) : (
              <>
                <input
                  type="checkbox"
                  className="item-checkbox"
                  checked={checkedItems[item._id] || false}
                  onChange={() => toggleCheckbox(item._id)}
                />
                <p
                  className={`item-content`}
                  style={{ textDecoration: checkedItems[item._id] ? 'line-through' : 'none' }}
                >
                  <strong>Title:</strong> {item.item}
                  {item.description && (
                    <>
                      <br />
                      <strong>Description:</strong> {item.description}
                    </>
                  )}
                </p>
                <div className="item-actions">
                  <button
                    className="update-item"
                    onClick={() => setIsUpdating(item._id)}
                    disabled={checkedItems[item._id]}
                  >
                    Edit
                  </button>
                  <button className="delete-item" onClick={() => deleteItem(item._id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
