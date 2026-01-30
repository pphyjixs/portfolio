var commentForm = document.getElementById('commentForm');
var commentList = document.getElementById('commentList');
var errorMessage = document.getElementById('errorMessage');
var loadComments = function () {
    var comments = JSON.parse(localStorage.getItem('comments')) || [];
    if (!commentList)
        return;
    commentList.innerHTML = '';
    comments.forEach(function (cmt) {
        var liItem = document.createElement('li');
        liItem.innerHTML = "<strong>".concat(cmt.name, "</strong> (").concat(cmt.email, "): ").concat(cmt.comment);
        commentList.appendChild(liItem);
    });
};
var validateForm = function (name, email, message) {
    if (!name || !email || !message) {
        errorMessage.textContent = '所有字段均为必填项';
        return false;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        errorMessage.textContent = '请输入有效的电子邮件地址。';
        return false;
    }
    return true;
};
var submitComment = function (e) {
    e.preventDefault();
    var name = document.getElementById('formName').value;
    var email = document.getElementById('formEmail').value;
    var message = document.getElementById('formMessage').value;
    if (validateForm(name, email, message)) {
        var comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push({ name: name, email: email, comment: message });
        localStorage.setItem('comments', JSON.stringify(comments));
        errorMessage.textContent = '';
        commentForm.reset();
        loadComments();
    }
};
loadComments();
if (commentForm) {
    commentForm.addEventListener('submit', submitComment);
}
