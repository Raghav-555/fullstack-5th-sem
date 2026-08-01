/**
 * Content Studio View Component
 * Demonstrates Dynamic UI Element Rendering Based on RBAC Permissions
 */

import { authStore } from '../authState.js';
import { INITIAL_ARTICLES, PERMISSIONS } from '../utils/mockData.js';
import { showToast } from '../components/toast.js';

// Local Storage Persistence Helper
function getStoredArticles() {
  const stored = localStorage.getItem('jwt_rbac_articles');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  localStorage.setItem('jwt_rbac_articles', JSON.stringify(INITIAL_ARTICLES));
  return [...INITIAL_ARTICLES];
}

function saveArticles(articles) {
  localStorage.setItem('jwt_rbac_articles', JSON.stringify(articles));
}

export function renderContentView() {
  const articles = getStoredArticles();
  const canCreate = authStore.hasPermission(PERMISSIONS.CREATE_CONTENT);
  const canEdit = authStore.hasPermission(PERMISSIONS.EDIT_CONTENT);
  const canDelete = authStore.hasPermission(PERMISSIONS.DELETE_CONTENT);

  const role = authStore.user ? authStore.user.role : 'Guest';

  return `
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <h2><i class="fa-solid fa-layer-group" style="color:var(--role-editor);"></i> Content Management Studio</h2>
        <p>Demonstrating conditional UI rendering & RBAC action control (Persisted in Local Storage)</p>
      </div>

      <div style="display:flex; gap:0.6rem;">
        <button class="btn btn-secondary" id="btn-reset-articles" title="Reset content to initial lab state">
          <i class="fa-solid fa-rotate-left"></i> Reset Articles
        </button>

        <!-- Action Button Conditioned on create:content permission -->
        <button class="btn btn-primary" id="btn-create-article" ${!canCreate ? 'disabled title="Requires create:content permission (Admin or Editor role)"' : ''}>
          <i class="fa-solid ${canCreate ? 'fa-plus' : 'fa-lock'}"></i> Create New Article
        </button>
      </div>
    </div>

    <!-- Active RBAC Permissions Banner -->
    <div class="glass-card" style="margin-bottom:1.5rem; padding:1rem 1.25rem; display:flex; align-items:center; justify-content:space-between;">
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <span class="role-pill ${role.toLowerCase()}"><i class="fa-solid fa-user-shield"></i> ${role}</span>
        <span style="font-size:0.85rem; color:var(--text-muted);">
          Current UI capabilities:
        </span>
      </div>

      <div style="display:flex; gap:0.75rem; font-size:0.78rem;">
        <span style="color: ${canCreate ? 'var(--success)' : 'var(--text-dim)'};">
          <i class="fa-solid ${canCreate ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> Create
        </span>
        <span style="color: ${canEdit ? 'var(--success)' : 'var(--text-dim)'};">
          <i class="fa-solid ${canEdit ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> Edit
        </span>
        <span style="color: ${canDelete ? 'var(--success)' : 'var(--text-dim)'}; font-weight:${canDelete ? '700' : '400'};">
          <i class="fa-solid ${canDelete ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> Delete (Admin Only)
        </span>
      </div>
    </div>

    <!-- Articles List -->
    <div style="display:grid; gap:1.25rem;">
      ${articles.map(art => `
        <div class="glass-card" style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.4rem;">
              <span style="background:#e0e7ff; color:var(--primary); padding:0.15rem 0.6rem; border-radius:4px; font-size:0.72rem; font-weight:700;">
                ${art.category}
              </span>
              <span style="font-size:0.78rem; color:var(--text-dim);"><i class="fa-regular fa-calendar"></i> ${art.date}</span>
              <span style="font-size:0.78rem; color:var(--text-dim);"><i class="fa-regular fa-user"></i> ${art.author}</span>
            </div>
            <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">${art.title}</h3>
            <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">${art.summary}</p>
          </div>

          <div style="display:flex; gap:0.5rem; flex-shrink:0; margin-left:1rem;">
            <!-- Edit Button Conditioned on edit:content -->
            <button class="btn btn-secondary btn-sm btn-edit-art" data-id="${art.id}" ${!canEdit ? 'disabled title="Requires edit:content permission"' : ''}>
              <i class="fa-solid ${canEdit ? 'fa-pen' : 'fa-lock'}"></i> Edit
            </button>

            <!-- Delete Button Conditioned on delete:content (ADMIN ONLY) -->
            <button class="btn btn-danger btn-sm btn-delete-art" data-id="${art.id}" ${!canDelete ? 'disabled title="Requires delete:content permission (Admin only)"' : ''}>
              <i class="fa-solid ${canDelete ? 'fa-trash' : 'fa-lock'}"></i> Delete
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

export function attachContentEventListeners() {
  const btnReset = document.getElementById('btn-reset-articles');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      saveArticles(INITIAL_ARTICLES);
      showToast('Articles reset to initial lab state!', 'info');
      authStore.notify();
    });
  }

  const btnCreate = document.getElementById('btn-create-article');
  if (btnCreate) {
    btnCreate.addEventListener('click', () => {
      if (!authStore.hasPermission(PERMISSIONS.CREATE_CONTENT)) {
        showToast('403 Forbidden: Missing create:content permission', 'danger');
        return;
      }
      const title = prompt("Enter Article Title:");
      if (title && title.trim()) {
        const articles = getStoredArticles();
        articles.unshift({
          id: `art-${Date.now()}`,
          title: title.trim(),
          category: 'Admin Created',
          author: authStore.user.name,
          date: new Date().toISOString().split('T')[0],
          summary: 'Newly created content item saved & persisted in local storage.'
        });
        saveArticles(articles);
        showToast('Article created and persisted across refreshes!', 'success');
        authStore.notify();
      }
    });
  }

  document.querySelectorAll('.btn-delete-art').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!authStore.hasPermission(PERMISSIONS.DELETE_CONTENT)) {
        showToast('403 Forbidden: Missing delete:content permission! Admin role required.', 'danger');
        return;
      }
      const id = e.currentTarget.getAttribute('data-id');
      let articles = getStoredArticles();
      articles = articles.filter(a => a.id !== id);
      saveArticles(articles);
      showToast('Article deleted and persisted!', 'success');
      authStore.notify();
    });
  });

  document.querySelectorAll('.btn-edit-art').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!authStore.hasPermission(PERMISSIONS.EDIT_CONTENT)) {
        showToast('403 Forbidden: Missing edit:content permission', 'danger');
        return;
      }
      const id = e.currentTarget.getAttribute('data-id');
      let articles = getStoredArticles();
      const art = articles.find(a => a.id === id);
      if (art) {
        const newTitle = prompt("Edit Article Title:", art.title);
        if (newTitle && newTitle.trim()) {
          art.title = newTitle.trim();
          saveArticles(articles);
          showToast('Article updated and saved!', 'success');
          authStore.notify();
        }
      }
    });
  });
}
