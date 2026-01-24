const commentForm = document.getElementById ("commentForm");
const commentList = document.getElementById ("commentList");
const errorMessage = document.getElementById ("errorMessage");

const loadComments = ()=> {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    commentList.innerHTML = "";
    comments.forEach((comment)=> {
        const liItem = document.createElement("li");
        liItem.innerHTML = `<strong>${comment.name}</strong> (${comment.email}): ${comment.message}`;
        commentList.appendChild(liItem);
    })
}

const validateForm = (name,email,message) =>{
    if (!name || !email || !message) {
        errorMessage.textContent = "All fields are required";
        return false;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        errorMessage.textContent = '请输入有效的电子邮件地址。';
        return false;
    }
    return true;
}

const submitComment =(e)=> {
    e.preventDefault();

    const name = document.getElementById("formName").value;
    const email = document.getElementById("formEmail").value;
    const message = document.getElementById("formMessage").value;
    if (validateForm (name,email,message)) {
        const comments = JSON.parse (localStorage.getItem("comments"))||[];
        comments.push ({name,email,message});
        localStorage.setItem("comments",JSON.stringify(comments));
        errorMessage.textContent = "";
        commentForm.reset();
        loadComments();
    }
}

loadComments();
commentForm.addEventListener("submit",submitComment);