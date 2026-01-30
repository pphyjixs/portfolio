const modal = document.getElementById('modal') as HTMLDivElement | null;
const closeModalBtn = document.getElementById('close-modal') as HTMLButtonElement | null;
const modalImg = document.getElementById('modal-img') as HTMLImageElement | null;

document.addEventListener ('click', (e: Event) =>{
    if (e.target instanceof HTMLImageElement && e.target.classList.contains ('expandable-img')) {
        modalImg.src = e.target.src;
        modal.style.display = 'block';
    }
    if (e.target == closeModalBtn) {
        modal.style.display = 'none';
    }
})