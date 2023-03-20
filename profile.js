var fullname, userId, userEmail, username, myURL;
const bookList = document.querySelector('#book-list');
const draftList = document.querySelector('#draft-list');
firebase.auth().onAuthStateChanged((user)=>{
    if (user) {
        // User logged in already or has just logged in.
        userId = user.uid;
        firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
            fullname = (snapshot.val() && snapshot.val().fullname) || 'Anonymous';
            userEmail = (snapshot.val() && snapshot.val().email);
            username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
            var letter = fullname.charAt(0);
            document.getElementById("profile").innerHTML = letter;
            document.getElementById("fullname").innerHTML = fullname;
            document.getElementById("username").innerHTML = username;
            document.getElementById("email").innerHTML = userEmail;
            // ...
            db.collection('users').doc(userId).get().then((doc)=>{
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
            })

            db.collection('books').where('AuthorEmail', '==', userEmail).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    var docID = doc.id;
                    var bookTitle = doc.data().Title;
                    var bookCover = doc.data().Image;
                    console.log(doc.data().Title)
                    db.collection('books').doc(docID).collection('chapters').get().then((snapshot) => {
                        snapshot.docs.forEach(doc => {
                            let li = document.createElement('li');
                            let div1 = document.createElement('div');
                            let div2 = document.createElement('div');
                            let bookcover = document.createElement('img');
                            let bookname = document.createElement('span');
                            let chapter = document.createElement('span');
                            

                            li.setAttribute('data-id', doc.id);
                            bookcover.src = bookCover;
                            bookname.textContent = bookTitle;

                            let temp1 = doc.data().chapterName;
                            let temp2 = temp1.split(">");
                            if(temp2.length > 1) {
                              for(let i=0; i<temp2.length-1; i++) {
                                if(temp2[i].charAt(0) != '<') {
                                  let temp3 = temp2[i];
                                  let temp4 = temp3.split("<");
                                  chapName = temp4[0];
                                }         
                              }
                            }
                            if(temp2.length == 1) {
                              chapName = temp2[0];
                            }
                            chapter.textContent = chapName;

                            div1.appendChild(bookcover);
                            div2.appendChild(bookname);
                            div2.appendChild(chapter);
                            li.appendChild(div1);
                            li.appendChild(div2);

                            bookList.appendChild(li);
                        });
                    });

                    db.collection('books').doc(docID).collection('drafts').get().then((snapshot) => {
                        snapshot.docs.forEach(doc => {
                            let li = document.createElement('li');
                            let div1 = document.createElement('div');
                            let div2 = document.createElement('div');
                            let bookcover = document.createElement('img');
                            let bookname = document.createElement('span');
                            let chapter = document.createElement('span');
                            let div3 = document.createElement('div');
                            let span = document.createElement('span');
                            let edit = document.createElement('button');
                            edit.textContent = 'Edit';
                            edit.onclick=function(){
                              location.replace(`editor2.html?bookid=${docID}&chapid=${doc.id}`);
                            }


                            li.setAttribute('data-id', doc.id);
                            bookcover.src = bookCover;
                            bookname.textContent = bookTitle;

                            let temp1 = doc.data().chapterName;
                            let temp2 = temp1.split(">");
                            if(temp2.length > 1) {
                              for(let i=0; i<temp2.length-1; i++) {
                                if(temp2[i].charAt(0) != '<') {
                                  let temp3 = temp2[i];
                                  let temp4 = temp3.split("<");
                                  chapName = temp4[0];
                                }         
                              }
                            }
                            if(temp2.length == 1) {
                              chapName = temp2[0];
                            }
                            chapter.textContent = chapName;

                            span.appendChild(edit)
                            div1.appendChild(bookcover);
                            div2.appendChild(bookname);
                            div2.appendChild(chapter);
                            div3.appendChild(span);
                            li.appendChild(div1);
                            li.appendChild(div2);
                            li.appendChild(div3);

                            draftList.appendChild(li);
                        });
                    });

              });
            });
        })
    }

    else{
        location.replace("login.html")
    }
})

function preview_image(event) 
{
 var reader = new FileReader();
 reader.onload = function()
 {
  var output = document.getElementById('profile-img');
  output.src = reader.result;
 }
 reader.readAsDataURL(event.target.files[0]);
}

function  uploadData() {
    const ref = firebase.storage().ref();
    const file = document.querySelector("#photo").files[0];
    const name = +new Date() + "-" + file.name;
    const metadata = {
      contentType: file.type
    };
    const task = ref.child('users/'+userId+'/profile/'+name).put(file, metadata);
    task
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
        myURL = url;
        console.log(myURL);
        addData();
      })
      .catch(console.error);
}


function addData() {
    db.collection('users').doc(userId).update({
      ProfilePicture: myURL
    })
    .then(
      ()=>{
        alert("Profile Picture Uploaded!");
      }
    );
  }