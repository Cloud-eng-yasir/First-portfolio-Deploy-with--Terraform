const navToggle = document.getElementById('navToggle');
const navbar = document.getElementById('navbar');

navToggle?.addEventListener('click', () => {
  const expanded = navbar.classList.toggle('navbar--open');
  navToggle.setAttribute('aria-expanded', expanded.toString());
});

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
let tasks = JSON.parse(localStorage.getItem('portfolioTasks') || '[]');
let editingId = null;

function saveTasks() {
  localStorage.setItem('portfolioTasks', JSON.stringify(tasks));
}

function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = 'task-item';
    item.innerHTML = `
      <span>${task.text}</span>
      <div class="task-actions">
        <button type="button" class="edit-btn" data-id="${task.id}" aria-label="Edit task">✎</button>
        <button type="button" class="delete-btn" data-id="${task.id}" aria-label="Delete task">✕</button>
      </div>
    `;
    taskList.appendChild(item);
  });
}

function addTask(text) {
  tasks.push({ id: Date.now(), text });
  saveTasks();
  renderTasks();
}

function updateTask(id, newText) {
  tasks = tasks.map((task) => (task.id === id ? { ...task, text: newText } : task));
  saveTasks();
  renderTasks();
}

function removeTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

if (taskForm && taskInput) {
  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = taskInput.value.trim();
    if (!value) return;
    if (editingId) {
      updateTask(editingId, value);
      editingId = null;
    } else {
      addTask(value);
    }
    taskInput.value = '';
  });
}

if (taskList) {
  taskList.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const id = Number(target.dataset.id);
    if (target.classList.contains('edit-btn')) {
      const task = tasks.find((item) => item.id === id);
      if (task) {
        taskInput.value = task.text;
        editingId = id;
        taskInput.focus();
      }
    }
    if (target.classList.contains('delete-btn')) {
      removeTask(id);
    }
  });
}

const contactForm = document.getElementById('contactForm');
const contactNotice = document.getElementById('contactNotice');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');
    if (!(nameInput instanceof HTMLInputElement) || !(emailInput instanceof HTMLInputElement) || !(messageInput instanceof HTMLTextAreaElement)) {
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    if (!name || !email || !message) {
      return;
    }

    const phone = '923298594228';
    const text = `Hello Yasir, my name is ${name} (${email}). I would like to discuss: ${message}`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    if (contactNotice) {
      contactNotice.textContent = 'Message sent. We will reach you soon.';
    }
    contactForm.reset();
  });
}

function initScrollMotion() {
  const motionTargets = document.querySelectorAll(
    'section, .hero__info, .hero__profile-card, .info-card, .skill-card, .timeline-card, .education__card, .project-card, .project-app, .contact__text, .contact-form'
  );

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observerInstance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  motionTargets.forEach((target) => observer.observe(target));
}

window.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  initScrollMotion();
});
