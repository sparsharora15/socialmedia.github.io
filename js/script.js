let Comment, Name, phone, email, password, userName, role, checkpass, POSTS, PostData, PostFileData;

function handleName() {
    Name = document.getElementById("text").value
    console.log(Name);
}
function handleEmail() {
    email = document.getElementById("email").value
    console.log(email);
}
function handlePhone() {
    phone = document.getElementById("phone").value
    console.log(phone);
}
function handlePassword() {
    password = document.getElementById("password").value
    console.log(password);
}

async function signup() {
    try {

        let data = {
            name: Name,
            email: email,
            password: password,
            phone: phone
        }
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        }
        let res = await fetch('https://social-media-app-v1-final.herokuapp.com/signup', options)
        res = await res.json()
        console.log(data);
        console.log(res)

        // if()

        alert(res.message)


    }
    catch (e) {
        alert(e.message)
    }
}


function handleUsername() {
    userName = document.getElementById("username").value
    console.log(userName);
}
function handleComment() {
    Comment = document.getElementById("inputComment").value
    console.log(Comment);
}

function checkPassword() {
    checkpass = document.getElementById("checkPass").value
    console.log(checkpass);
}

function checkIfNumber(phone) {
    let count = 0;
    for (let i = 0; i < phone.length; i++) {
        if (isNaN(phone[i])) {
            return false;
        } else {
            count++;
        }
    }
    if (count == 10) {
        return true
    }
}


async function Login() {
    let data = {}
    if (userName.includes('@')) {
        data['email'] = userName;
        data['phone'] = null;
    } else if (checkIfNumber(userName)) {
        data['phone'] = userName;
        data['email'] = null;
    }
    else {
        alert("Please check your username")
    }
    data['password'] = checkpass
    console.log(data)
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    }
    try {
        let Get = await fetch('https://social-media-app-v1-final.herokuapp.com/login', options)
        Get = await Get.json();
        if (Get.token) {
            window.location.href = "./index.html";
            localStorage.setItem('user_name', Get.data.name)
            localStorage.setItem('user_id', Get.data._id)
            localStorage.setItem('LoginToken', Get.token)
        }
        else {
            alert(Get.message)
        }
        console.log(Get)
    }
    catch (e) {

        alert('Invalid username or password')
    }
}
function checkIfLoggedIn() {
    let token = localStorage.getItem("LoginToken")
    if (token) {
        fetchPosts();
    } else {
        window.location.href = "./logIn.html";
    }
}

function checkIfLoggedInAtLogin() {
    let token = localStorage.getItem("LoginToken")
    if (token) {
        window.location.href = "./index.html";
    }
}
function NavigateToComment(postId) {
    // console.log(userId)\frontEnd\pages\upload.html
    localStorage.setItem('postIdForComment', postId)
    window.location.href = './comments.html'
}

async function doComment() {
    if (Comment != null || Comment != '') {
        let postId = localStorage.getItem('postIdForComment')
        let userId = localStorage.getItem('user_id')
        let data = {
            postId: postId,
            userId: userId,
            comment: Comment
        }
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        }
        fetch('https://social-media-app-v1-final.herokuapp.com/comment', options)
        .then(()=>{
            window.location.href = "./index.html"
        })
    }
}
function fetchComment() {
    POSTS = JSON.parse(localStorage.getItem('posts'))
    let postId = localStorage.getItem('postIdForComment')
    let comments = POSTS.filter(el => el._id == postId)
    comments = comments[0]['comments']
    console.log(comments)
    const container = document.getElementById('commentcontainer');
    comments.forEach((result) => {
        // Construct card content
        let content;
        content =
            `
                <p class="para">${result.userId.name}</p>
            <p class="para">${result.data}</p>
              `;
        // Append newyly created card element to the container
        container.innerHTML += content;
    })
}
function handleFile() {
    PostFileData = document.getElementById("file").files[0]
    console.log(PostFileData)
}
function handlePostData() {
    PostData = document.getElementById("postdata").value
    console.log(PostData)
}
async function UploadPost() {
    const formData = new FormData()
    let isEmpty = false;
    let userId = localStorage.getItem("user_id")
    formData.append('userId', userId)
    if (PostData != null && PostData != '' && PostData != undefined) {
        formData.append("data", PostData)
        isEmpty = true;
    }
    if (PostFileData != null && PostFileData != '' && PostFileData != undefined) {
        formData.append("picture", PostFileData, PostFileData.name)
        isEmpty = true;
    }
    if (isEmpty) {

        try {
            axios({
                method: "post",
                url: "https://social-media-app-v1-final.herokuapp.com/newPost",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })
            alert('Done')
            window.location.href = "./index.html"
        } catch (error) {
            console.log(error)
        }
    }
    else {
        alert('please enter something to upload')
    }
}

async function like(postid) {
    try {
        await axios({
            method: "post",
            url: "https://social-media-app-v1-final.herokuapp.com/like",
            data: { postId: postid },
        })
        window.location.reload()
    } catch (error) {
        console.log(error)
    }
}

async function deletePost (postid) {
    try{
        console.log(postid)
        // await axios.delete('http://localhost:5000/deletePost',data)
        await axios({
            method: "delete",
            url: "https://social-media-app-v1-final.herokuapp.com/deletePost",
            data: { postid: postid },
        })
        // window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

const fetchPosts = async () => {
    let posts = await fetch('https://social-media-app-v1-final.herokuapp.com/getAllPosts')
    posts = await posts.json()
    localStorage.setItem('posts', JSON.stringify(posts));
    const container = document.getElementById('containers');
    posts.forEach((result) => {
        // Construct card content
        let content;
        if (result.picture && !result.data) {
            content =
                `
                <div class="post">
          
                <h4 class="heading">${result.userId.name}
                </h4>  <button class = "Del" type="button" name="${result._id}" onclick="deletePost(this.name)">Delete</button>
                <img src="https://social-media-app-v1-final.herokuapp.com/${result.picture}" alt="">
                <div class="image">
                <img src="./IMG/like.jpg" alt="" name="${result._id}" onclick="like(this.name)"><p>${result.totalLikes}</p>
                <img src="./IMG/comment.jpg" alt="" name="${result._id}" onclick="NavigateToComment(this.name)">
                </div>
                </div>
              `;
        }
        if (result.picture && result.data) {
            content =
                `
                <div class="post">
          
                <h4 class="heading">${result.userId.name}</h4>  
                <p>${result.data}</p>
                <button class = "Del" type="button" name="${result._id}" onclick="deletePost(this.name)">Delete</button>
                <img src="https://social-media-app-v1-final.herokuapp.com/${result.picture}" alt="">
                <div class="image">
                <img src="./IMG/like.jpg" alt="" name="${result._id}" onclick="like(this.name)"><p>${result.totalLikes}</p>
                <img src="./IMG/comment.jpg" alt="" name="${result._id}" onclick="NavigateToComment(this.name)">
                </div>
                </div>
              `;
        }
        if (!result.picture && result.data) {
            content =
                `
                <div class="post">
                
                <h4 class="heading">${result.userId.name}</h4> 
                <p>${result.data}</p>
                <button class = "Del" type="button" name="${result._id}" onclick="deletePost(this.name)">Delete</button>
                <div class="image">
                <img src="./IMG/like.jpg" alt="" name="${result._id}" onclick="like(this.name)"><p>${result.totalLikes}</p>
                <img src="./IMG/comment.jpg" alt="" name="${result._id}" onclick="NavigateToComment(this.name)">
                </div>
                </div>
              `;
        }

        // Append newyly created card element to the container
        container.innerHTML += content;
    })
}
