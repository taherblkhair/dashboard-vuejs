<script setup>
import { ref } from 'vue'

const settings = ref({
  notifications: true,
  emailUpdates: false,
  darkMode: false,
  language: 'en'
})

const showSuccessMessage = ref(false)

const handleSave = () => {
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}
</script>

<template>
  <div class="settings">
    <!-- Success notification -->
    <div v-if="showSuccessMessage" class="success-notification" role="alert">
      ✓ Settings saved successfully!
    </div>
    
    <div class="settings-card">
      <h2 class="settings-title">General Settings</h2>
      
      <div class="settings-group">
        <div class="setting-item">
          <div class="setting-info">
            <h3>Push Notifications</h3>
            <p>Receive push notifications for important updates</p>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="settings.notifications" />
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h3>Email Updates</h3>
            <p>Receive weekly email summaries</p>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="settings.emailUpdates" />
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h3>Dark Mode</h3>
            <p>Enable dark theme for the dashboard</p>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="settings.darkMode" />
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h3>Language</h3>
            <p>Select your preferred language</p>
          </div>
          <select v-model="settings.language" class="language-select">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>

      <div class="settings-actions">
        <button class="btn btn-primary" @click="handleSave">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings {
  max-width: 800px;
}

.success-notification {
  background-color: #d1fae5;
  color: #059669;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.settings-title {
  margin: 0 0 24px 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.setting-info h3 {
  margin: 0;
  font-size: 0.95rem;
  color: #1f2937;
}

.setting-info p {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

/* Toggle switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: #42b883;
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.language-select {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
}

.language-select:focus {
  outline: none;
  border-color: #42b883;
}

.settings-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary {
  background-color: #42b883;
  color: white;
}

.btn-primary:hover {
  background-color: #38a074;
}
</style>
