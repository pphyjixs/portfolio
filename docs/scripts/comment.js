const commentForm = document.getElementById("commentForm");
const commentList = document.getElementById("commentList");
const errorMessage = document.getElementById("errorMessage");
const loadComments = () => {
    if (!commentList)
        return;
    const raw = localStorage.getItem("comments");
    const comments = raw ? JSON.parse(raw) : [];
    commentList.innerHTML = "";
    comments.forEach((comment) => {
        const liItem = document.createElement("li");
        liItem.innerHTML = `<strong>${comment.name}</strong> (${comment.email}): ${comment.message}`;
        commentList.appendChild(liItem);
    });
};
const validateForm = (name, email, message) => {
    if (!name || !email || !message) {
        if (errorMessage)
            errorMessage.textContent = "All fields are required";
        return false;
    }
    if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        if (errorMessage)
            errorMessage.textContent = "请输入有效的电子邮件地址。";
        return false;
    }
    return true;
};
const submitComment = (e) => {
    var _a, _b, _c, _d, _e, _f;
    e.preventDefault();
    if (!commentForm)
        return;
    const name = (_b = (_a = document.getElementById("formName")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
    const email = (_d = (_c = document.getElementById("formEmail")) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : "";
    const message = (_f = (_e = document.getElementById("formMessage")) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : "";
    if (validateForm(name, email, message)) {
        const raw = localStorage.getItem("comments");
        const comments = raw ? JSON.parse(raw) : [];
        comments.push({ name, email, message });
        localStorage.setItem("comments", JSON.stringify(comments));
        if (errorMessage)
            errorMessage.textContent = "";
        commentForm.reset();
        loadComments();
    }
};
loadComments();
if (commentForm) {
    commentForm.addEventListener("submit", submitComment);
}
