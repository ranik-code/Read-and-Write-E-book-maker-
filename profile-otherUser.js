const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userEmail = urlParams.get('email');
const username = urlParams.get('name');
document.getElementById('user-name').innerHTML = username;
document.getElementById('fname').innerHTML = username;

var letter = username.charAt(0);

db.collection('users').where('email', '==', userEmail).get().then((snapshot)=>{
    snapshot.docs.forEach(doc =>{
        var lastActive = doc.data().last_login.toDate();
        document.getElementById('last-active').innerHTML = lastActive.toDateString();

        if(doc.get('ProfilePicture') != null) {
            console.log(doc.data().ProfilePicture)
            let dp = document.createElement('img');
            dp.src = doc.data().ProfilePicture;
            document.querySelector('#profile-pic').appendChild(dp);
        }
        else {
            console.log("No Profile Pic")
            document.getElementById('profile-pic').innerHTML = letter;
        }
    });
});

var count=0;
const bookList = document.querySelector('#book-list');
db.collection('books').where('AuthorEmail', '==', userEmail).get().then((snapshot) => {
    snapshot.docs.forEach(doc =>{
        count+=1;
        var bookTitle = doc.data().Title;
        var bookCover = doc.data().Image;
        var bookdescrp = doc.data().Description;

        let li = document.createElement('li');
        let div1 = document.createElement('div');
        let div2 = document.createElement('div');
        let bookcover = document.createElement('img');
        let bookname = document.createElement('span');
        let description = document.createElement('span');

        li.setAttribute('data-id', doc.id);
        bookcover.src = bookCover;
        bookname.textContent = bookTitle;
        description.textContent = bookdescrp;

        div1.appendChild(bookcover);
        div2.appendChild(bookname);
        div2.appendChild(description);
        li.appendChild(div1);
        li.appendChild(div2);
        li.onclick=function(){
            location.replace(`file:///C:/Users/Lenovo/Documents/test-firebase/books/book.html?id=${doc.id}`)
        }

        bookList.appendChild(li);
    });   
console.log(count)
});
