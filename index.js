'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Product = require('./models/product')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended:false}))
app.use(bodyParser.json())

app.get('/api/product', (req, res) =>{
  Product.find({}, (err, products) => {
    if(err)return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
    if(!products) return res.status(404).send({message: 'El producto no existe'})

    res.send(200, {products})
  })
})

app.get('/api/product/:productId', (req, res) =>{
  let productId = req.params.productId

  Product.findById(productId, (err, product) =>{
    if(err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
    if(!product) return res.status(404).send({message: 'El producto no existe'})

    res.status(200).send({ product })
  })
})

app.post('/api/product', (req, res) =>{
  console.log('Post //api/product')
  console.log(req.body)

  let product = new Product()
  product.name = req.body.name
  product.picture = req.body.picture
  product.price = req.body.price
  product.category = req.body.category
  product.description = req.body.description

  product.save((err, productStored) =>{
    if (err) res.status(500).send({message:`Error al guardar en la base de datos, error: ${err}`})

    res.status(200).send({product: productStored})
  })
})

mongoose.connect('mongodb://127.0.0.1:32017/test', (err, res) =>{
  if (err){
    return console.log(`erro al conectar a la BD: ${err}`)
  }
  console.log("conexion a la base de datos establecida..")

  app.listen(port, () => {
    console.log(`API REST corriendo ${port}`)
  })

})
