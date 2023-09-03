const fs = require('fs');
const path = require('path');
const { readJSON, writeJSON } = require('../data') /* clase 60 multer min 00:40:03 */
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		return res.render('products', {
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const product = products.find(product => product.id === +req.params.id)
		return res.render('detail', {
			...product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form')
	},

	// Create -  Method to store
	store: (req, res) => {
		const products = readJSON('productsDataBase.json')
		products.push({
			id: products[products.length - 1].id + 1,/* clase 60 multer min 01:08:00 */
			name: req.body.name,
			price: +req.body.price,
			discount: +req.body.discount,
			description: req.body.description.trim(),
			category: req.body.category,
			image: req.file ? req.file.filename : null /* clase 60 multer min 01:24:17  subir producto sin imagen//imagen por defecto*/ 
		}
		)
		writeJSON(products, 'productsDataBase.json')
		return res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		const product = products.find(product => product.id === +req.params.id)
		return res.render('product-edit-form', {
			...product
		})
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		const products = readJSON('productsDataBase.json')
		const productsModify = products.map(product => {
			if (product.id === +req.params.id) {
				req.file && (fs.existsSync(`./public/images/products/${product.image}`) && fs.unlinkSync(`./public/images/products/${product.image}`))
				product.name = req.body.name.trim();
				product.price = +req.body.price;
				product.discount = +req.body.discount;
				product.description = req.body.description.trim();
				product.category = req.body.category;
				product.image = req.file ? req.file.filename : product.image
			}
			return product
		})
		writeJSON(productsModify, 'productsDataBase.json')
		return res.redirect('/products')
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		// Do the magic
		const products = readJSON('productsDataBase.json')
		const productsModify = products.filter((product) => {
			if (product.id === +req.params.id) {
				fs.existsSync(`./public/images/products/${product.image}`) && fs.unlinkSync(`./public/images/products/${product.image}`)
			}
			return product.id !== +req.params.id
		})
		writeJSON(productsModify, 'productsDataBase.json')
		return res.redirect('/products')
	}
};

module.exports = controller;