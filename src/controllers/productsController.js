const db=require('../database/models');
const fs = require('fs');
const path = require('path');
const { readJSON, writeJSON } = require('../data'); /* clase 60 multer min 00:40:03 */
const { error } = require('console');
const { response } = require('express');
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		db.Product.findAll()
		.then(products=>{
			return res.render("products",{
			products,
			toThousand	
			})
		})
		.catch(error=>console.log(error))	
	},
	detail: (req, res) => {
		db.Product.findByPk(req.params.id)
		.then(product=>{
		return res.render('detail', {
			...product.dataValues,
			toThousand	
		})
		})
		.catch(error=>console.log(error))	
	},
	create: (req, res) => {
		db.Category.findAll()
		.then(categories=>{
			return res.render('product-create-form',{
				categories
			})
		}).catch(error=>console.log(error))
		
	},

	store: (req, res) => {
		const {name, price, discount, description, categoryId}=req.body;
		db.Product.create({
			name: name.trim(),
			price,
			discount : discount || 0,
			categoryId,
			description: description.trim(),
			image:req.file ? req.file.filename : null 
		})
		.then(product =>{
			console.log(product);
			return res.redirect('/products')
		}).catch(error=>console.log(error));
	},


	edit: (req, res) => {
		const categories = db.Category.findAll();
		const product = db.Product.findByPk(req.params.id)

		Promise.all([categories,product])

		.then(([categories,product]) =>{ 
		return res.render('product-edit-form', {
			...product.dataValues, 
			categories
		})
		})
		.catch(error=>console.log(error))
	},


	// Update - Method to update
	update: (req, res) => {

		const {name, price, discount, description, categoryId}=req.body;

		db.Product.findByPk(req.params.id,{
			attributes:['image']
		})
		.then(product=>{ 
		db.Product.update(
		{

			name : name.trim(),
			price,
			discount,
			categoryId,
			description : description.trim(),
			image: req.file ? req.file.filename : product.image
		},
		{
			where:{
				id:req.params.id
		}
		}
		)	
		.then(response=>{
			console.log(response)
			return res.redirect('/products/detail/' + req.params.id)
		}).catch(error=>console.log(error)) })
		},




	destroy: (req, res) => {
		// Do the magic
		db.Product.destroy({
		where:{
			id:req.params.id
		}	
		})
		.then(response =>{
			console.log(response)
			return res.redirect('/products')
		}).catch(error=>console.log(error))
		
	}
};

module.exports = controller;