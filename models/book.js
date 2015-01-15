var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var bookSchema = mongoose.Schema({
	author: { type: String},
	title: { type: String},
	isbn: { type: String},
	publisher: { type: String},
	price: { type: String},
	currency: { type: String},
	status: { type: String, es_type: 'multi_field', es_fields: { status: { type: 'string', index: 'analyzed' }, untouched: { type: 'string', index: 'not_analyzed' }}},
	pages: { type: String},
	country: { type: String, es_type: 'multi_field', es_fields: { country: { type: 'string', index: 'analyzed' }, untouched: { type: 'string', index: 'not_analyzed' }}},
	date: { type: String},
	group: { type: String, es_type: 'multi_field', es_fields: { group: { type: 'string', index: 'analyzed' }, untouched: { type: 'string', index: 'not_analyzed' }}},
	place: { type: String}
});

bookSchema.plugin(mongoosastic);

var Book = mongoose.model('Book', bookSchema);
// var stream = Book.synchronize();
// var count = 0;

// stream.on('data', function (err, doc) { 
// 	if (err) console.log(err);
// 	count++; 
// 	console.log(count); 
// });
// stream.on('close', function () { console.log('FINISHED!'); });
// stream.on('error', function (err) {	console.log(err); });
			
module.exports = Book;