type CommentItem = {
  name: string;
  email: string;
  message: string;
};

const commentForm = document.getElementById("commentForm") as HTMLFormElement | null;
const commentList = document.getElementById("commentList") as HTMLUListElement | null;
const errorMessage = document.getElementById("errorMessage") as HTMLElement | null;

const loadComments = (): void => {
  if (!commentList) return;

  const raw = localStorage.getItem("comments");
  const comments: CommentItem[] = raw ? JSON.parse(raw) : [];

  commentList.innerHTML = "";
  comments.forEach((comment) => {
    const liItem = document.createElement("li");
    liItem.innerHTML = `<strong>${comment.name}</strong> (${comment.email}): ${comment.message}`;
    commentList.appendChild(liItem);
  });
};

const validateForm = (name: string, email: string, message: string): boolean => {
  if (!name || !email || !message) {
    if (errorMessage) errorMessage.textContent = "All fields are required";
    return false;
  }
  if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    if (errorMessage) errorMessage.textContent = "请输入有效的电子邮件地址。";
    return false;
  }
  return true;
};

const submitComment = (e: Event): void => {
  e.preventDefault();

  if (!commentForm) return;

  const name = (document.getElementById("formName") as HTMLInputElement | null)?.value ?? "";
  const email = (document.getElementById("formEmail") as HTMLInputElement | null)?.value ?? "";
  const message = (document.getElementById("formMessage") as HTMLTextAreaElement | null)?.value ?? "";

  if (validateForm(name, email, message)) {
    const raw = localStorage.getItem("comments");
    const comments: CommentItem[] = raw ? JSON.parse(raw) : [];
    comments.push({ name, email, message });
    localStorage.setItem("comments", JSON.stringify(comments));

    if (errorMessage) errorMessage.textContent = "";
    commentForm.reset();
    loadComments();
  }
};

loadComments();
if (commentForm) {
  commentForm.addEventListener("submit", submitComment);
}
