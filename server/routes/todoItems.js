const router = require('express').Router();
//import todo model
const todoItemsModel = require('../models/todoItems');



//Lets create our frist route -- we will add Todo Item to our database
// router.post('/api/item', async (req, res)=>{
//     try{
//         const newItem = new todoItemsModel({
//             item: req.body.item
           
//         })
//         //save this in database
//         const saveItem = await newItem.save()
//         res.status(200).json(saveItem);
//     }catch(err){
//         res.json(err);
//     }
// })

router.post('/api/item', async (req, res)=>{
    try{
        const newItem = new todoItemsModel({
            item: req.body.item,
            description: req.body.description // Include the description from req.body
            
        })
        //save this in the database
        const saveItem = await newItem.save()
        res.status(200).json(saveItem);
    } catch(err){
        res.json(err);
    }
})

//Lets create second route -- get data from database
router.get('/api/item', async (req, res) => {
    try{
        const allTodoItems = await todoItemsModel.find({});
        res.status(200).json(allTodoItems);
    } catch(err){
         res.json(err);
  }});


//Let's update item
router.put('/api/item/:id', async (req, res)=>{
    try{
        //find the item by its id and update it 
        const updateItem = await todoItemsModel.findByIdAndUpdate(req.params.id,{$set: req.body});
        res.status(200).json(updateItem);
    }catch(err){
        res.json(err);
    }
})

//Delete the item from database
router.delete('/api/item/:id', async (req, res)=>{
    try{
        //find the item by its id and delete it 
        const deleteItem = await todoItemsModel.findByIdAndDelete(req.params.id);
        res.status(200).json(deleteItem);
    }catch(err){
        res.json(err);
    }
})

//   router.post('/api/item', async (req, res) => {
//     try {
//       const newItem = new todoItemsModel({
//         item: req.body.item,
//         description: req.body.description, 
//       });
//       const saveItem = await newItem.save();
//       res.status(200).json(saveItem);
//     } catch (err) {
//       res.json(err);
//     }
//   });


//export router
module.exports = router;


