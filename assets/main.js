const bookshelf = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook(); 
    });
});


function addBook(){
    const titleBook = document.getElementById('booktitle').value;
    const timestamp = document.getElementById('bookyear').value;
    const authorBook = document.getElementById('bookauthor').value;
    const publisherBook = document.getElementById('bookpublisher').value;

    const bookID = bookId();
    const bookShelfObject = generateBookObject(bookID, titleBook, timestamp, authorBook, publisherBook, false);
    
    bookshelf.push(bookShelfObject);

    const checkbox = document.getElementById('book-complete').checked;
    if(!checkbox){
        bookShelfObject.isCompleted = false;
    }else{
        bookShelfObject.isCompleted = true;
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}

function bookId(){
    return +new Date();
}

function generateBookObject(id, title, timestamp, author, publisher, isCompleted){
    return{
        id,
        title,
        timestamp,
        author,
        publisher,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function(){

    const uncompletedBook = document.getElementById('uncompletebookshelf');
    uncompletedBook.innerHTML = '';

    const completedBook = document.getElementById('completebookshelf');
    completedBook.innerHTML = '';

    for(const book of bookshelf){
        const bookElement = makeBook(book);
        if(!book.isCompleted){
            uncompletedBook.append(bookElement);
        }else{
            completedBook.append(bookElement);
        }
    }
});

function makeBook(bookShelfObject){
    const textTitle = document.createElement('h3');
    textTitle.classList.add('title');
    textTitle.innerText = bookShelfObject.title;

    const textTimestamp = document.createElement('p');
    textTimestamp.classList.add('year');
    textTimestamp.innerText = bookShelfObject.timestamp;

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('title-book');
    titleContainer.append(textTitle, textTimestamp);

    const labelAuthor = document.createElement('p');
    labelAuthor.innerText = 'Author:';

    const textAuthor = document.createElement('p');
    textAuthor.classList.add('author');
    textAuthor.innerText = bookShelfObject.author;

    const containerAuthor = document.createElement('div');
    containerAuthor.classList.add('author-book');
    containerAuthor.append(labelAuthor, textAuthor);

    const labelPublisher = document.createElement('p');
    labelPublisher.innerText = 'Publisher:';

    const textPublisher = document.createElement('p');
    textPublisher.classList.add('publisher');
    textPublisher.innerText = bookShelfObject.publisher;

    const containerPublisher = document.createElement('div');
    containerPublisher.classList.add('publisher-book');
    containerPublisher.append(labelPublisher, textPublisher);

    const container = document.createElement('article');
    container.classList.add('book-item');
    container.append(titleContainer, containerAuthor, containerPublisher);

    if(bookShelfObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('yellow','button');
        undoButton.innerText = "Undo";

        undoButton.addEventListener('click', function(){
            undoBook(bookShelfObject.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red','button');
        deleteButton.innerText = "Delete";

        deleteButton.addEventListener('click', function(){
            removeBook(bookShelfObject.id);
        });

        const formAction = document.createElement('div');
        formAction.classList.add('action');
        formAction.append(undoButton, deleteButton);

        container.append(formAction);
    }else{
        const doneButton = document.createElement('button');
        doneButton.classList.add('green','button');
        doneButton.innerText = "Done";

        doneButton.addEventListener('click', function(){
            doneBook(bookShelfObject.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red','button');
        deleteButton.innerText = "Delete";

        deleteButton.addEventListener('click', function(){
            removeBook(bookShelfObject.id);
        });

        const formAction = document.createElement('div');
        formAction.classList.add('action');
        formAction.append(doneButton, deleteButton);

        container.append(formAction);
    }
    return container;
}

// Search fitur
const btnSearch = document.getElementById('button-search');

btnSearch.addEventListener('click', function(event){
    event.preventDefault();
    searchBook();
});

function searchBook(){
    const inputSearch = document.getElementById('search-book-title').value.toLowerCase();
    const bookItem = document.querySelectorAll('.title-book');

    for(book of bookItem){
        if(book.innerText.toLowerCase().includes(inputSearch)){
            book.parentElement.style.display = 'block';
        }else{
            book.parentElement.style.display = 'none';
        }

    }

}

function doneBook(bookId){
    const targetbook = findBook(bookId);

    if(targetbook == null) return;

    targetbook.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}

function findBook(bookId){
    for(const item of bookshelf){
        if(item.id === bookId){
            return item;
        }
            
    }
    return null;
}

function removeBook(bookId){
    const targetbook = findBookIndex(bookId);

    if(targetbook === -1) return;

    bookshelf.splice(targetbook, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}

function findBookIndex(bookId){
    for(const index in bookshelf){
        if(bookshelf[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function undoBook(bookId){
    const targetbook = findBook(bookId);

    if(targetbook === null)return;

    targetbook.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}


// Local Storage

const  STORAGE_KEY = 'BOOKSHELF_APP';
const SAVED_EVENT = 'saved_book';

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(bookshelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

function isStorageExist(){
    if(typeof(Storage) === 'Undifined'){
        alert("Browser tidak mendukung Web Storage, silahkan gunakan Browser lainnya!");
        return false;
    }
    return true;
}
document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null){
        for(const book of data){
            bookshelf.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function(){
    if(isStorageExist){
        loadDataFromStorage();
    }
});


// ======= dark-mode======
const body = document.body;
const changeTheme = document.getElementById('themeChange');
changeTheme.addEventListener('click', function(){
        body.classList.toggle('dark-theme');
        changeTheme.classList.toggle('bx-sun');
})
