module.exports = {

  getQuestion : (db, book=1)=>{
    return db.select('q','a', 'incorrect_1', 'incorrect_2', 'incorrect_3','book_name as book','chapter','verse', 'difficulty' ).from('questions').join('books', 'books.id', '=', 'questions.book').where({book})
  }
};