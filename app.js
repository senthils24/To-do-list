

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true, useUnifiedTopology: true });

const itemsSchema ={                    // HERE itemsSchema is schea.
  name: String
};

const Item =mongoose.model("Item",itemsSchema);       //HERE "Item" IS MODEL.

const item1= new Item({
  name:"welocme to do list"
});

const item2= new Item({
  name:"Hit '+' button to add a new item"
});

const item3=new Item({
  name:"<-- hit this to delete an item"
});
const defaultItems=[item1,item2,item3];

app.get("/", function(req, res) {
Item.find({},function(err ,foundItems){
 if(foundItems.length===0)
 {
   Item.insertMany(defaultItems,function(err){
   if(err)
   {
     console.log(err);
   }
  else{
     console.log("successfully saved items to DB");
   }

   });
   res.redirect("/");
 }else{
res.render("list", {listTitle: "Today", newListItems: foundItems});
}
});


});
app.get("/:customListName",function(req,res){
  //console.log(req.params.customListName);
  const a=req.params.customListName;
  res.redirect("/");
})

app.post("/", function(req, res){

const itemName= req.body.newItem;

const item=new Item({
  name: itemName
});

item.save();                          //this will save the item into the collections


res.redirect("/")

});
app.post("/delete",function(req,res){
  const checkItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkItemId,function(err)
{ if(!err)
  {
    console.log("we deleted item");
    res.redirect("/");
  }
});
});




app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
