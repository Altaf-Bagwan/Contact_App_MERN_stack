const express = require('express');
require('dotenv').config()
const server = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_PASSWORD_KEY);
  console.log('db connected')
}
const contactSchema = new mongoose.Schema({
    name: String,
    number: Number
  });
  const Contact = mongoose.model('Contact', contactSchema);


server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded());

server.use(express.static(__dirname+'/build'))

server.get('/',(req,res)=>{
  res.sendFile(__dirname+'/static/index.html')
})
server.post('/contacts',async(req,res)=>{
    let contact = new Contact();
    contact.name = req.body.name;
    contact.number = req.body.number;
    const doc = await contact.save();
    // console.log(doc._id)
    // console.log(req.body)
    res.json(doc);
})
server.get('/contacts', async(req,res)=>{
  // const id = req.params.id;
    const docs = await Contact.find({});
    res.json(docs);
    // console.log(docs)
})
server.delete(`/contacts/:id`, async(req,res)=>{
  console.log(req.params.id)
  const deleteDoc = await Contact.findOneAndDelete({_id:req.params.id});
  // res.json(deleteDoc);
  res.sendStatus(200);
})
server.put(`/contacts/:id`, async(req,res)=>{
  // console.log(req.params.id)
  // console.log(req.body)
  const updateDoc = await Contact.findOneAndReplace({_id:req.params.id},req.body,{new:true});
  res.json(updateDoc);
})
server.listen(8080 , ()=>{
    console.log('server stared')
});