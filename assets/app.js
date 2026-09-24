const collections = [
  {
    key: 'casamentos',
    title: 'Casamentos',
    overline: '01 / HISTÓRIAS DE AMOR',
    image: 'assets/casamento.webp',
    alt: 'Casal recém-casado se abraça sob a luz dourada',
    description: 'Da ansiedade antes da cerimônia à pista cheia no final da noite. Uma coleção sobre gestos pequenos, pessoas queridas e a alegria de escolher caminhar juntos.',
    photos: ['assets/casamento.webp', 'assets/casamento-2.webp', 'assets/casamento-3.webp', 'assets/casamento-4.webp']
  },
  {
    key: 'formaturas',
    title: 'Formaturas',
    overline: '02 / NOVOS COMEÇOS',
    image: 'assets/formatura.webp',
    alt: 'Formanda celebra com sua família',
    description: 'Tem um mundo inteiro por trás de uma conquista: os dias difíceis, quem torceu junto e a coragem de continuar. Vamos guardar a celebração de tudo isso.',
    photos: ['assets/formatura.webp', 'assets/formatura-2.webp', 'assets/formatura-3.webp', 'assets/formatura-4.webp']
  },
  {
    key: 'gestantes',
    title: 'Gestantes & bebês',
    overline: '03 / VIDA QUE CHEGA',
    image: 'assets/gestante.webp',
    alt: 'Casal durante a espera de um bebê',
    description: 'A espera, o chá de bebê, os primeiros dias. Fotografias com delicadeza e tempo para acolher essa fase que passa tão depressa.',
    photos: ['assets/gestante.webp', 'assets/gestante-2.webp', 'assets/gestante-3.webp', 'assets/gestante-4.webp']
  },
  {
    key: 'familias',
    title: 'Famílias',
    overline: '04 / A VIDA AGORA',
    image: 'assets/familia.webp',
    alt: 'Família rindo em um jardim ao entardecer',
    description: 'O jeito de se abraçar, a risada conhecida, as pequenas aventuras de uma tarde juntos. Retratos para se reconhecer no que realmente importa.',
    photos: ['assets/familia.webp', 'assets/familia-2.webp', 'assets/familia-3.webp', 'assets/familia-4.webp']
  }
];

const mobileLayout = window.matchMedia('(max-width: 760px)');
const prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');
const calmMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* -------------------------------------------------------------
 * 1. Mobile Menu with Smooth Transition & Esc support
 * ------------------------------------------------------------- */
const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
let menuCloseTimer = null;

function openMobileMenu() {
  if (menuCloseTimer) clearTimeout(menuCloseTimer);
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Fechar menu');
  mobileNav.hidden = false;
  requestAnimationFrame(() => {
    mobileNav.classList.add('is-open');
  });
}

function closeMobileMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  mobileNav.classList.remove('is-open');
  menuCloseTimer = setTimeout(() => {
    mobileNav.hidden = true;
  }, 320);
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    closeMobileMenu();
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMobileMenu();
  }
});

document.addEventListener('click', event => {
  if (
    menuButton.getAttribute('aria-expanded') === 'true' &&
    !mobileNav.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    closeMobileMenu();
  }
});

/* -------------------------------------------------------------
 * 2. Collection Gallery Dialog Modal (macOS/iOS sheet feel)
 * ------------------------------------------------------------- */
const dialog = document.getElementById('collection-dialog');
const dialogPhoto = document.getElementById('dialog-photo');
let currentIndex = 0;
let currentPhotoIndex = 0;
let isDialogClosing = false;

function showPhoto(index) {
  currentPhotoIndex = index;
  const item = collections[currentIndex];
  const targetSrc = item.photos[index];
  
  if (dialogPhoto.src.endsWith(targetSrc)) {
    updateThumbnails(index);
    return;
  }

  if (!calmMotion.matches) {
    dialogPhoto.classList.add('is-switching');
  }

  const nextImg = new Image();
  nextImg.src = targetSrc;
  nextImg.onload = () => {
    dialogPhoto.src = targetSrc;
    dialogPhoto.alt = `${item.title}: fotografia ${index + 1} de ${item.photos.length}`;
    requestAnimationFrame(() => {
      dialogPhoto.classList.remove('is-switching');
    });
  };
  // Fallback in case image is already cached
  setTimeout(() => {
    dialogPhoto.src = targetSrc;
    dialogPhoto.classList.remove('is-switching');
  }, 120);

  updateThumbnails(index);
}

function updateThumbnails(activeIndex) {
  document.querySelectorAll('.dialog-thumbnails button').forEach((button, i) => {
    button.setAttribute('aria-pressed', String(i === activeIndex));
  });
}

function renderCollection(index) {
  currentIndex = (index + collections.length) % collections.length;
  currentPhotoIndex = 0;
  const item = collections[currentIndex];
  document.getElementById('dialog-overline').textContent = item.overline;
  document.getElementById('dialog-title').textContent = item.title;
  document.getElementById('dialog-description').textContent = item.description;
  
  const thumbnails = document.getElementById('dialog-thumbnails');
  thumbnails.replaceChildren();
  item.photos.forEach((src, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Ver fotografia ${i + 1} de ${item.title}`);
    button.setAttribute('aria-pressed', String(i === 0));
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    button.append(img);
    button.addEventListener('click', () => showPhoto(i));
    thumbnails.append(button);
  });
  showPhoto(0);
}

document.querySelectorAll('.carousel-item[data-category]').forEach(card => {
  card.addEventListener('click', () => {
    isDialogClosing = false;
    dialog.classList.remove('is-closing');
    const colIdx = collections.findIndex(item => item.key === card.dataset.category);
    if (colIdx >= 0) {
      renderCollection(colIdx);
      const photoIdx = parseInt(card.dataset.photoIdx, 10);
      if (!isNaN(photoIdx)) {
        showPhoto(photoIdx);
      }
      dialog.showModal();
      document.body.classList.add('dialog-open');
    }
  });
});

function closeDialog() {
  if (isDialogClosing || !dialog.open) return;
  isDialogClosing = true;

  if (calmMotion.matches) {
    dialog.close();
    document.body.classList.remove('dialog-open');
    isDialogClosing = false;
    return;
  }

  dialog.classList.add('is-closing');
  setTimeout(() => {
    dialog.close();
    dialog.classList.remove('is-closing');
    document.body.classList.remove('dialog-open');
    isDialogClosing = false;
  }, 240);
}

document.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => {
  if (event.target === dialog) closeDialog();
});
dialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeDialog();
});
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

document.getElementById('dialog-contact').addEventListener('click', closeDialog);

// Keyboard navigation inside modal gallery
document.addEventListener('keydown', event => {
  if (!dialog.open || isDialogClosing) return;
  const currentCollection = collections[currentIndex];
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    if (currentPhotoIndex < currentCollection.photos.length - 1) {
      showPhoto(currentPhotoIndex + 1);
    }
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    if (currentPhotoIndex > 0) {
      showPhoto(currentPhotoIndex - 1);
    }
  }
});

/* -------------------------------------------------------------
 * 3. Plan Auto-select in form
 * ------------------------------------------------------------- */
document.querySelectorAll('[data-plan]').forEach(link => {
  link.addEventListener('click', () => {
    const select = document.getElementById('type');
    const plan = link.dataset.plan;
    if (plan === 'Ensaio') select.value = 'Família';
    else if (plan === 'Celebração') select.value = 'Formatura';
    else select.value = 'Casamento';
  });
});

/* -------------------------------------------------------------
 * 4. Contact Form Submission & Copy Feedback
 * ------------------------------------------------------------- */
const form = document.getElementById('inquiry-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = `Olá! Meu nome é ${data.get('name')}.\n\nQuero fotografar: ${data.get('type')}\nMinha ideia, data ou cidade: ${data.get('message')}\n\nMeu e-mail para retorno: ${data.get('email')}`;
  document.getElementById('prepared-message').value = message;
  const result = document.getElementById('form-result');
  result.hidden = false;
  result.scrollIntoView({
    behavior: calmMotion.matches ? 'instant' : 'smooth',
    block: 'nearest'
  });
});

const copyBtn = document.getElementById('copy-message');
copyBtn.addEventListener('click', async () => {
  const text = document.getElementById('prepared-message').value;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    document.getElementById('prepared-message').select();
    document.execCommand('copy');
  }
  const originalText = copyBtn.textContent;
  copyBtn.textContent = 'Mensagem copiada ✓';
  copyBtn.style.backgroundColor = '#42553d';
  setTimeout(() => {
    copyBtn.textContent = originalText;
    copyBtn.style.removeProperty('background-color');
  }, 2200);
});

document.getElementById('year').textContent = new Date().getFullYear();

/* -------------------------------------------------------------
 * 5. Scroll Reveal IntersectionObserver
 * ------------------------------------------------------------- */
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}

/* -------------------------------------------------------------
 * 6. Category Carousels Navigation (Instagram-style Dots)
 * ------------------------------------------------------------- */
document.querySelectorAll('.category-block').forEach(block => {
  const carousel = block.querySelector('.category-carousel');
  const dots = [...block.querySelectorAll('.cat-dot')];
  const items = [...carousel.querySelectorAll('.carousel-item')];
  if (!items.length) return;

  function scrollToPhoto(index) {
    if (index < 0 || index >= items.length) return;
    const targetItem = items[index];
    const offset = targetItem.offsetLeft - carousel.offsetLeft;
    carousel.scrollTo({ left: offset, behavior: calmMotion.matches ? 'instant' : 'smooth' });
    updateActiveDot(index);
  }

  function updateActiveDot(index) {
    dots.forEach((dot, idx) => {
      const isActive = idx === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function onScroll() {
    const scrollLeft = carousel.scrollLeft;
    let closestIdx = 0;
    let minDiff = Infinity;
    items.forEach((item, idx) => {
      const diff = Math.abs(item.offsetLeft - carousel.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    updateActiveDot(closestIdx);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => scrollToPhoto(idx));
  });

  carousel.addEventListener('scroll', onScroll, { passive: true });
});

/* -------------------------------------------------------------
 * 7. Process Timeline on Mobile
 * ------------------------------------------------------------- */
const stepsTrack = document.querySelector('.steps');
const stepCards = [...stepsTrack.querySelectorAll('.step')];
let timelineFrame = 0;

function updateTimeline() {
  timelineFrame = 0;
  if (!mobileLayout.matches) {
    stepCards.forEach(card => card.classList.remove('is-current'));
    return;
  }
  const viewportCenter = window.innerHeight * 0.45;
  let activeIndex = 0;
  let minDistance = Infinity;
  stepCards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.top + rect.height / 2;
    const dist = Math.abs(cardCenter - viewportCenter);
    if (dist < minDistance) {
      minDistance = dist;
      activeIndex = index;
    }
  });
  stepCards.forEach((card, index) => card.classList.toggle('is-current', index === activeIndex));
}

function scheduleTimeline() {
  if (!timelineFrame) timelineFrame = requestAnimationFrame(updateTimeline);
}
window.addEventListener('scroll', scheduleTimeline, { passive: true });
window.addEventListener('resize', scheduleTimeline, { passive: true });
scheduleTimeline();

/* -------------------------------------------------------------
 * 8. Plans Carousel with Instagram-style Dots
 * ------------------------------------------------------------- */
const planTrack = document.querySelector('.plan-grid');
const planCards = [...planTrack.querySelectorAll('.plan')];
const planDots = [...document.querySelectorAll('.plan-dot')];
let activePlan = 1;
let planFrame = 0;

function centerPlan(index, behavior = 'smooth') {
  activePlan = Math.max(0, Math.min(planCards.length - 1, index));
  const card = planCards[activePlan];
  if (card) {
    const left = planTrack.scrollLeft + card.getBoundingClientRect().left - planTrack.getBoundingClientRect().left - (planTrack.clientWidth - card.clientWidth) / 2;
    planTrack.scrollTo({ left, behavior: calmMotion.matches ? 'auto' : behavior });
  }
  updatePlanState();
}

function updatePlanState() {
  if (!mobileLayout.matches) return;
  const center = planTrack.getBoundingClientRect().left + planTrack.clientWidth / 2;
  let nearest = 0;
  let distance = Infinity;
  planCards.forEach((card, index) => {
    const middle = card.getBoundingClientRect().left + card.clientWidth / 2;
    const delta = Math.abs(middle - center);
    if (delta < distance) {
      distance = delta;
      nearest = index;
    }
  });
  activePlan = nearest;
  planCards.forEach((card, index) => card.classList.toggle('is-active', index === nearest));
  planDots.forEach((dot, index) => {
    const isActive = index === nearest;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

planTrack.addEventListener('scroll', () => {
  if (!planFrame) planFrame = requestAnimationFrame(() => {
    planFrame = 0;
    updatePlanState();
  });
}, { passive: true });

planTrack.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    centerPlan(activePlan + (event.key === 'ArrowRight' ? 1 : -1));
  }
});

planDots.forEach((dot, index) => {
  dot.addEventListener('click', () => centerPlan(index));
});

planCards.forEach((card, index) => {
  card.addEventListener('click', (e) => {
    if (mobileLayout.matches && index !== activePlan && !e.target.closest('a, button')) {
      e.preventDefault();
      centerPlan(index);
    }
  });
});

let wasMobile = false;
function initializePlans() {
  if (mobileLayout.matches) {
    if (!wasMobile) centerPlan(1, 'auto');
    else centerPlan(activePlan, 'auto');
    wasMobile = true;
  } else {
    wasMobile = false;
    planCards.forEach(card => card.classList.remove('is-active'));
  }
}
requestAnimationFrame(initializePlans);
window.addEventListener('resize', () => {
  scheduleTimeline();
  initializePlans();
}, { passive: true });

/* -------------------------------------------------------------
 * 9. Smooth FAQ Details Accordion Animation
 * ------------------------------------------------------------- */
document.querySelectorAll('.faq-list details').forEach(details => {
  const summary = details.querySelector('summary');
  const content = details.querySelector('p');
  if (!summary || !content) return;

  summary.addEventListener('click', event => {
    if (calmMotion.matches) return; // Allow default instant behavior if reduced motion
    event.preventDefault();

    if (details.open) {
      // Smooth Close
      const startHeight = content.offsetHeight;
      content.style.maxHeight = `${startHeight}px`;
      content.style.opacity = '1';
      requestAnimationFrame(() => {
        content.style.transition = 'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease';
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
      });
      setTimeout(() => {
        details.removeAttribute('open');
        content.style.removeProperty('max-height');
        content.style.removeProperty('opacity');
        content.style.removeProperty('transition');
      }, 300);
    } else {
      // Smooth Open
      details.setAttribute('open', '');
      const targetHeight = content.scrollHeight;
      content.style.maxHeight = '0px';
      content.style.opacity = '0';
      requestAnimationFrame(() => {
        content.style.transition = 'max-height 0.34s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease';
        content.style.maxHeight = `${targetHeight}px`;
        content.style.opacity = '1';
      });
      setTimeout(() => {
        content.style.removeProperty('max-height');
        content.style.removeProperty('opacity');
        content.style.removeProperty('transition');
      }, 350);
    }
  });
});
