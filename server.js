const app=require('./app')
const database_uri=process.env.DATABASE_URI.replace('<password>',process.env.PASSWORD);
const port=process.env.PORT
const mongoose=require('mongoose')
process.on("uncaughtException", (err) => {
    console.log(err.stack);
    console.log(`SHUTTING DOWN SERVER DUE ${err}`);
  });
process.on('unhandledRejection',(err)=>{
  console.log(`Shutting Down server due to ${err.message}`)
  server.close(()=>{
      process.exit(1)
  })
})

mongoose.connect(database_uri).then(()=>{
    console.log('database connected')
})

const server=app.listen(port,()=>{
    console.log(`server is listening at port ${port}`)
})