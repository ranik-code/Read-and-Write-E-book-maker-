const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchTerm = urlParams.get('res')
const key = searchTerm.toLowerCase().replace(/[&\/\\#,+()@$~%.'":;*^?!<>{}]/g,'');

const bookList = document.querySelector('#book-list');
const profileList = document.querySelector('#profile-list');
firebase.auth().onAuthStateChanged((user)=>{
    if (user) {
        // User logged in already or has just logged in.
        var userId = user.uid;
        firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
            var username = (snapshot.val() && snapshot.val().fullname) || 'Anonymous';
            var letter = username.charAt(0);
            document.getElementById("profile").innerHTML = letter;

            db.collection('books').get().then((snapshot) =>{
                snapshot.docs.forEach(doc =>{
                    let bookTitle = doc.data().Title;
                    let temp = bookTitle.toLowerCase().replace(/[&\/\\#,+()@$~%.'":;*^?!<>{}]/g,'');
                    if(temp.includes(key)) {
                        let li = document.createElement('li');
                        let div1 = document.createElement('div');
                        let div2 = document.createElement('div');
                        let bookcover = document.createElement('img');
                        let bookname = document.createElement('span');
                        let author = document.createElement('span');
    
                        li.setAttribute('id', doc.id);
                        
    
                        bookcover.src = doc.data().Image;
                        bookname.textContent = doc.data().Title;
                        author.textContent = doc.data().Author;
    
                        div1.appendChild(bookcover);
                        div2.appendChild(bookname);
                        div2.appendChild(author);
    
                        li.appendChild(div1);
                        li.appendChild(div2);

                        bookList.appendChild(li);
                    }
                    
                });
            });

            db.collection('users').get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    let fullName = doc.data().fullname;
                    let temp = fullName.toLowerCase().replace(/[&\/\\#,+()@$~%.'":;*^?!<>{}]/g,'');
                    if(temp.includes(key)) {
                        let li = document.createElement('li');
                        let div1 = document.createElement('div');
                        let div2 = document.createElement('div');
                        let profilePic = document.createElement('img');
                        profilePic.setAttribute('class', 'avatar');
                        let profileName = document.createElement('h3');
    
                        li.setAttribute('id', doc.id);
                        
                        if(doc.get('ProfilePicture') != null) {
                            console.log(doc.data().ProfilePicture)
                            profilePic.src = doc.data().ProfilePicture;
                        }
                        else {
                            console.log("No Profile Pic");
                            profilePic.src = "images/user-img.jpg"
                        }

                        profileName.textContent = doc.data().fullname;
    
                        div1.appendChild(profilePic);
                        div2.appendChild(profileName);
    
                        li.appendChild(div1);
                        li.appendChild(div2);

                        profileList.appendChild(li);
                    }
                })
            })
            
          });
     }
    else{
        //
    }
})