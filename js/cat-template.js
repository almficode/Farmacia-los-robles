// Category page shared JS - loaded after animations.js
document.getElementById('menuBtn')?.addEventListener('click', function() {
  document.getElementById('mobMenu').classList.add('open');
  document.body.style.overflow = 'hidden';
});
