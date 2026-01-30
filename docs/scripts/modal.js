const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-img');
document.addEventListener('click', (e) => {
    if (e.target instanceof HTMLImageElement && e.target.classList.contains('expandable-img')) {
        modalImg.src = e.target.src;
        modal.style.display = 'block';
    }
    if (e.target == closeModalBtn) {
        modal.style.display = 'none';
    }
});
