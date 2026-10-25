// ── Navigation ──────────────────────────────────────────────
const sectionTitles = {
  home: 'Hospital Home',
  dashboard: 'Dashboard',
  patients: 'Patients',
  doctors: 'Doctors',
  appointments: 'Appointments',
  billing: 'Billing',
  inventory: 'Inventory',
  reports: 'Reports',
  staff: 'Staff'
};

function showSection(id, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  const title = document.getElementById('page-title');
  if (title) title.textContent = sectionTitles[id] || id;
  const target = el || (event && event.currentTarget);
  if (target) target.classList.add('active');
}

const searchCatalog = [
  { section: 'patients', type: 'Patient', text: 'Alice Johnson • Diabetes • Dr. Patel' },
  { section: 'patients', type: 'Patient', text: 'Bob Smith • Hypertension • Dr. Kumar' },
  { section: 'patients', type: 'Patient', text: 'David Lee • Cardiac Arrest • Dr. Mehta' },
  { section: 'doctors', type: 'Doctor', text: 'Dr. Patel • Endocrinology • Available' },
  { section: 'doctors', type: 'Doctor', text: 'Dr. Sharma • Neurology • Available' },
  { section: 'appointments', type: 'Appointment', text: 'A004 • David Lee • Emergency review' },
  { section: 'billing', type: 'Billing', text: 'INV-002 • Bob Smith • Pending invoice' },
  { section: 'inventory', type: 'Inventory', text: 'Paracetamol • Low stock • 12 units left' },
  { section: 'staff', type: 'Staff', text: 'John Davis • Nurse • General Ward' }
];

function globalSearch(value) {
  const query = (value || '').trim().toLowerCase();
  const resultsBox = document.getElementById('search-results');
  if (!resultsBox) return;

  if (!query) {
    resultsBox.style.display = 'none';
    resultsBox.innerHTML = '';
    return;
  }

  const matches = searchCatalog.filter(item => item.text.toLowerCase().includes(query));

  if (!matches.length) {
    resultsBox.innerHTML = '<div class="search-empty">No matching patients, doctors, or records found.</div>';
    resultsBox.style.display = 'block';
    return;
  }

  resultsBox.innerHTML = matches.slice(0, 6).map(item => `
    <div class="search-result-item" onclick="const nav = [...document.querySelectorAll('.sidebar nav a')].find(a => (a.getAttribute('onclick') || '').includes('${item.section}')); showSection('${item.section}', nav); this.parentElement.style.display='none';">
      <strong>${item.type}</strong>
      <span>${item.text}</span>
    </div>
  `).join('');
  resultsBox.style.display = 'block';
}

function filterTable(tableId, value) {
  const table = document.getElementById(tableId)?.closest('table');
  if (!table) return;

  const query = (value || '').trim().toLowerCase();
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = (!query || text.includes(query)) ? '' : 'none';
  });
}

function toggleNotif(forceOpen) {
  const dropdown = document.getElementById('notif-dropdown');
  if (!dropdown) return;
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : dropdown.style.display !== 'block';
  dropdown.style.display = shouldOpen ? 'block' : 'none';
}

function quickAsk(question) {
  const input = document.getElementById('chat-input');
  if (!input) return;
  input.value = question;
  sendMessage();
}

const defaultTasks = [
  'Review ICU patient transfer list',
  'Confirm emergency medicine resupply',
  'Check pending billing approvals'
];

let hospitalTasks = [...defaultTasks].map(text => ({ text, done: false }));

function renderTasks() {
  const list = document.getElementById('task-list');
  if (!list) return;

  list.innerHTML = hospitalTasks.map((task, index) => `
    <li class="task-item ${task.done ? 'done' : ''}">
      <span class="task-text">${task.text}</span>
      <button class="task-toggle" data-index="${index}">${task.done ? 'Undo' : 'Done'}</button>
    </li>
  `).join('');
}

function addTask() {
  const input = document.getElementById('task-input');
  if (!input) return;

  const value = input.value.trim();
  if (!value) return;

  hospitalTasks.unshift({ text: value, done: false });
  input.value = '';
  renderTasks();
}

// ── Modal ────────────────────────────────────────────────────
const modalForms = {
  patient: `
    <input placeholder="Full Name" id="f-name"/>
    <input placeholder="Age" type="number" id="f-age"/>
    <select id="f-gender"><option>Male</option><option>Female</option><option>Other</option></select>
    <input placeholder="Condition" id="f-condition"/>
    <input placeholder="Assigned Doctor" id="f-doctor"/>
    <input placeholder="Phone" id="f-phone"/>
    <input placeholder="Status" id="f-status"/>`,
  doctor: `
    <input placeholder="Full Name" id="f-name"/>
    <input placeholder="Specialization" id="f-spec"/>
    <input placeholder="Experience (yrs)" type="number" id="f-exp"/>
    <input placeholder="Phone" id="f-phone"/>
    <input placeholder="Email" id="f-email"/>
    <input placeholder="Status" id="f-status"/>`,
  appointment: `
    <input placeholder="Patient Name" id="f-patient"/>
    <input placeholder="Doctor Name" id="f-doctor"/>
    <input type="date" id="f-date"/>
    <input type="time" id="f-time"/>
    <input placeholder="Appointment Type" id="f-type"/>
    <input placeholder="Status" id="f-status"/>`,
  inventory: `
    <input placeholder="Item Name" id="f-name"/>
    <input placeholder="Category" id="f-cat"/>
    <input placeholder="Stock" type="number" id="f-stock"/>
    <input placeholder="Unit" id="f-unit"/>
    <input type="date" id="f-expiry"/>
    <input placeholder="Status" id="f-status"/>`,
  staff: `
    <input placeholder="Full Name" id="f-name"/>
    <input placeholder="Role" id="f-role"/>
    <input placeholder="Department" id="f-dept"/>
    <input placeholder="Phone" id="f-phone"/>
    <input placeholder="Shift" id="f-shift"/>
    <input placeholder="Status" id="f-status"/>`,
  billing: `
    <input placeholder="Invoice ID" id="f-invoice"/>
    <input placeholder="Patient" id="f-patient"/>
    <input type="date" id="f-date"/>
    <input placeholder="Service" id="f-service"/>
    <input placeholder="Amount" id="f-amount"/>
    <input placeholder="Status" id="f-status"/>`
};

let currentModal = '';
let currentEditRow = null;

function openModal(type, row = null) {
  currentModal = type;
  currentEditRow = row;
  document.getElementById('modal-title').textContent =
    (row ? 'Edit ' : 'Add ') + type.charAt(0).toUpperCase() + type.slice(1);
  document.getElementById('modal-body').innerHTML = modalForms[type];

  const saveButton = document.getElementById('modal-save-btn');
  if (saveButton) saveButton.innerHTML = row ? '<i class="fa fa-save"></i> Update' : '<i class="fa fa-save"></i> Save';

  if (row) populateModalFields(type, row);
  document.getElementById('modal').classList.add('show');
}

function populateModalFields(type, row) {
  const cells = row.children;
  switch (type) {
    case 'patient':
      document.getElementById('f-name').value = cells[1].textContent;
      document.getElementById('f-age').value = cells[2].textContent;
      document.getElementById('f-gender').value = cells[3].textContent;
      document.getElementById('f-condition').value = cells[4].textContent;
      document.getElementById('f-doctor').value = cells[5].textContent;
      document.getElementById('f-phone').value = cells[6].textContent;
      document.getElementById('f-status').value = cells[7].textContent;
      break;
    case 'doctor':
      document.getElementById('f-name').value = cells[1].textContent;
      document.getElementById('f-spec').value = cells[2].textContent;
      document.getElementById('f-exp').value = cells[3].textContent.replace(/[^0-9]/g, '');
      document.getElementById('f-phone').value = cells[4].textContent;
      document.getElementById('f-email').value = cells[5].textContent;
      document.getElementById('f-status').value = cells[6].textContent;
      break;
    case 'appointment':
      document.getElementById('f-patient').value = cells[1].textContent;
      document.getElementById('f-doctor').value = cells[2].textContent;
      document.getElementById('f-date').value = cells[3].textContent;
      document.getElementById('f-time').value = cells[4].textContent;
      document.getElementById('f-type').value = cells[5].textContent;
      document.getElementById('f-status').value = cells[6].textContent;
      break;
    case 'inventory':
      document.getElementById('f-name').value = cells[1].textContent;
      document.getElementById('f-cat').value = cells[2].textContent;
      document.getElementById('f-stock').value = cells[3].textContent;
      document.getElementById('f-unit').value = cells[4].textContent;
      document.getElementById('f-expiry').value = cells[5].textContent === '—' ? '' : cells[5].textContent;
      document.getElementById('f-status').value = cells[6].textContent;
      break;
    case 'staff':
      document.getElementById('f-name').value = cells[1].textContent;
      document.getElementById('f-role').value = cells[2].textContent;
      document.getElementById('f-dept').value = cells[3].textContent;
      document.getElementById('f-phone').value = cells[4].textContent;
      document.getElementById('f-shift').value = cells[5].textContent;
      document.getElementById('f-status').value = cells[6].textContent;
      break;
    case 'billing':
      document.getElementById('f-invoice').value = cells[0].textContent;
      document.getElementById('f-patient').value = cells[1].textContent;
      document.getElementById('f-date').value = cells[2].textContent;
      document.getElementById('f-service').value = cells[3].textContent;
      document.getElementById('f-amount').value = cells[4].textContent;
      document.getElementById('f-status').value = cells[5].textContent;
      break;
  }
}

function closeModal(e) {
  if (!e || e.target.id === 'modal') {
    document.getElementById('modal').classList.remove('show');
    currentEditRow = null;
  }
}

function closeModalOverlay(e) {
  if (e.target.id === 'modal') closeModal(e);
}

function saveRecord() {
  if (!currentModal) return;

  const textValue = id => document.getElementById(id)?.value.trim() || '';

  switch (currentModal) {
    case 'patient': {
      const name = textValue('f-name');
      const age = textValue('f-age');
      const gender = textValue('f-gender');
      const condition = textValue('f-condition');
      const doctor = textValue('f-doctor');
      const phone = textValue('f-phone');
      const status = textValue('f-status');
      if (!name) { alert('Name is required.'); return; }
      if (currentEditRow) {
        const cells = currentEditRow.children;
        cells[1].textContent = name;
        cells[2].textContent = age;
        cells[3].textContent = gender;
        cells[4].textContent = condition;
        cells[5].textContent = doctor;
        cells[6].textContent = phone;
        cells[7].textContent = status;
      } else {
        const tbody = document.getElementById('patient-table-body');
        const id = 'P' + String(tbody.rows.length + 1).padStart(3, '0');
        tbody.insertAdjacentHTML('beforeend',
          `<tr><td>${id}</td><td>${name}</td><td>${age}</td><td>${gender}</td><td>${condition}</td><td>${doctor}</td><td>${phone}</td><td>${status}</td><td><button>Edit</button> <button>Delete</button></td></tr>`);
      }
      break;
    }
    case 'doctor': {
      const name = textValue('f-name');
      const spec = textValue('f-spec');
      const exp = textValue('f-exp');
      const phone = textValue('f-phone');
      const email = textValue('f-email');
      const status = textValue('f-status');
      if (!name) { alert('Name is required.'); return; }
      if (currentEditRow) {
        const cells = currentEditRow.children;
        cells[1].textContent = name;
        cells[2].textContent = spec;
        cells[3].textContent = exp ? `${exp} yrs` : '';
        cells[4].textContent = phone;
        cells[5].textContent = email;
        cells[6].textContent = status;
      } else {
        const tbody = document.getElementById('doctor-table-body');
        const id = 'D' + String(tbody.rows.length + 1).padStart(3, '0');
        tbody.insertAdjacentHTML('beforeend',
          `<tr><td>${id}</td><td>${name}</td><td>${spec}</td><td>${exp ? exp + ' yrs' : ''}</td><td>${phone}</td><td>${email}</td><td>${status}</td><td><button>Edit</button> <button>Delete</button></td></tr>`);
      }
      break;
    }
    case 'appointment': {
      const patient = textValue('f-patient');
      const doctor = textValue('f-doctor');
      const date = textValue('f-date');
      const time = textValue('f-time');
      const type = textValue('f-type');
      const status = textValue('f-status');
      if (!patient || !doctor) { alert('Patient and doctor are required.'); return; }
      if (currentEditRow) {
        const cells = currentEditRow.children;
        cells[1].textContent = patient;
        cells[2].textContent = doctor;
        cells[3].textContent = date;
        cells[4].textContent = time;
        cells[5].textContent = type;
        cells[6].textContent = status;
      } else {
        const tbody = document.getElementById('appt-table-body');
        const id = 'A' + String(tbody.rows.length + 1).padStart(3, '0');
        tbody.insertAdjacentHTML('beforeend',
          `<tr><td>${id}</td><td>${patient}</td><td>${doctor}</td><td>${date}</td><td>${time}</td><td>${type}</td><td>${status}</td><td><button>Edit</button> <button>Cancel</button></td></tr>`);
      }
      break;
    }
    case 'inventory': {
      const name = textValue('f-name');
      const category = textValue('f-cat');
      const stock = textValue('f-stock');
      const unit = textValue('f-unit');
      const expiry = textValue('f-expiry') || '—';
      const status = textValue('f-status');
      if (!name) { alert('Name is required.'); return; }
      if (currentEditRow) {
        const cells = currentEditRow.children;
        cells[1].textContent = name;
        cells[2].textContent = category;
        cells[3].textContent = stock;
        cells[4].textContent = unit;
        cells[5].textContent = expiry;
        cells[6].textContent = status;
      } else {
        const tbody = document.getElementById('inv-table-body');
        const id = 'I' + String(tbody.rows.length + 1).padStart(3, '0');
        tbody.insertAdjacentHTML('beforeend',
          `<tr><td>${id}</td><td>${name}</td><td>${category}</td><td>${stock}</td><td>${unit}</td><td>${expiry}</td><td>${status}</td><td><button>Edit</button> <button>Delete</button></td></tr>`);
      }
      break;
    }
    case 'staff': {
      const name = textValue('f-name');
      const role = textValue('f-role');
      const dept = textValue('f-dept');
      const phone = textValue('f-phone');
      const shift = textValue('f-shift');
      const status = textValue('f-status');
      if (!name) { alert('Name is required.'); return; }
      if (currentEditRow) {
        const cells = currentEditRow.children;
        cells[1].textContent = name;
        cells[2].textContent = role;
        cells[3].textContent = dept;
        cells[4].textContent = phone;
        cells[5].textContent = shift;
        cells[6].textContent = status;
      } else {
        const tbody = document.getElementById('staff-table-body');
        const id = 'S' + String(tbody.rows.length + 1).padStart(3, '0');
        tbody.insertAdjacentHTML('beforeend',
          `<tr><td>${id}</td><td>${name}</td><td>${role}</td><td>${dept}</td><td>${phone}</td><td>${shift}</td><td>${status}</td><td><button>Edit</button> <button>Delete</button></td></tr>`);
      }
      break;
    }
    case 'billing': {
      const invoice = textValue('f-invoice');
      const patient = textValue('f-patient');
      const date = textValue('f-date');
      const service = textValue('f-service');
      const amount = textValue('f-amount');
      const status = textValue('f-status');
      if (!invoice) { alert('Invoice ID is required.'); return; }
      if (currentEditRow) {
        const cells = currentEditRow.children;
        cells[0].textContent = invoice;
        cells[1].textContent = patient;
        cells[2].textContent = date;
        cells[3].textContent = service;
        cells[4].textContent = amount;
        cells[5].textContent = status;
      } else {
        const tbody = document.getElementById('billing-table-body');
        tbody.insertAdjacentHTML('beforeend',
          `<tr><td>${invoice}</td><td>${patient}</td><td>${date}</td><td>${service}</td><td>${amount}</td><td>${status}</td><td><button>Edit</button></td></tr>`);
      }
      break;
    }
  }

  document.getElementById('modal').classList.remove('show');
  currentEditRow = null;
}

function getRowType(row) {
  const section = row.closest('section');
  if (!section) return '';
  switch (section.id) {
    case 'patients': return 'patient';
    case 'doctors': return 'doctor';
    case 'appointments': return 'appointment';
    case 'billing': return 'billing';
    case 'inventory': return 'inventory';
    case 'staff': return 'staff';
  }
  return '';
}

function deleteRecord(row) {
  if (!row) return;
  if (!confirm('Are you sure you want to delete this record?')) return;
  row.remove();
  if (currentEditRow === row) currentEditRow = null;
}

document.addEventListener('click', event => {
  const taskToggle = event.target.closest('.task-toggle');
  if (taskToggle) {
    const index = Number(taskToggle.dataset.index);
    if (!Number.isNaN(index)) {
      hospitalTasks[index].done = !hospitalTasks[index].done;
      renderTasks();
    }
    return;
  }

  const addTaskBtn = event.target.closest('#add-task-btn');
  if (addTaskBtn) {
    addTask();
    return;
  }

  const button = event.target.closest('button');
  if (!button) {
    const dropdown = document.getElementById('notif-dropdown');
    if (dropdown && !event.target.closest('.notif-wrap')) {
      dropdown.style.display = 'none';
    }
    return;
  }

  const action = button.dataset.action || button.textContent.trim().toLowerCase();
  if (action === 'edit') {
    const row = button.closest('tr');
    if (!row) return;
    const type = getRowType(row);
    if (!type) return;
    event.preventDefault();
    openModal(type, row);
  }
  if (action === 'delete' || action === 'cancel') {
    const row = button.closest('tr');
    if (!row) return;
    const type = getRowType(row);
    if (!type) return;
    event.preventDefault();
    deleteRecord(row);
  }
});

document.addEventListener('keydown', event => {
  if (event.target && event.target.id === 'task-input' && event.key === 'Enter') {
    addTask();
  }
});

renderTasks();

// ── AI Chatbox ───────────────────────────────────────────────
let chatOpen = true;

function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chat-body').style.display = chatOpen ? 'flex' : 'none';
  document.getElementById('chat-toggle-icon').textContent = chatOpen ? '▲' : '▼';
}

const responses = {
  patient: "We currently have 1,240 registered patients. You can view and manage them in the Patients section.",
  doctor: "There are 86 doctors on staff across various specializations including Cardiology, Orthopedics, and Endocrinology.",
  appointment: "320 appointments are scheduled for today. Use the Appointments section to book or manage them.",
  bed: "There are currently 54 beds available in the hospital.",
  billing: "You can view all invoices and billing records in the Billing section.",
  emergency: "🚨 Emergency Line (24/7): +91 800-911-0000\nFor life-threatening situations call immediately!",
  hello: "Hello! How can I assist you with MediCare Hospital today?",
  hi: "Hi there! I'm MediBot. Ask me about patients, doctors, appointments, location, or billing.",
  help: "I can help with:\n• Patient info\n• Doctor directory\n• Appointments\n• Bed availability\n• Billing & invoices\n• Hospital location & contact\n• Emergency numbers\n• Working hours",
  hours: "🕐 OPD Hours:\nMon–Fri: 8:00 AM – 8:00 PM\nSaturday: 8:00 AM – 2:00 PM\nSunday: Closed\n\n🚨 Emergency & ICU: 24/7",
  location: "📍 MediCare General Hospital\nPlot No. 42, Health City Road\nBanjara Hills, Hyderabad\nTelangana – 500034, India\n\nClick 'Home' in the sidebar to see the map!",
  phone: "📞 Contact Numbers:\n• Reception: +91 800-123-4567\n• Emergency: +91 800-911-0000\n• Appointments: +91 800-111-2222\n• Email: info@medicare-hms.com",
  about: "🏥 MediCare General Hospital is a 500-bed multi-specialty hospital established in 1998. NABH Accredited & ISO 9001:2015 certified with 25+ specialties.",
  dept: "🏥 Our Departments:\nCardiology, Neurology, Orthopedics, Pediatrics, Ophthalmology, Dentistry, Pulmonology, Pathology, Radiology, Oncology, Gynecology, Nephrology",
  default: "I'm not sure about that. Try asking about patients, doctors, appointments, location, phone numbers, or emergency contacts."
};

function getBotReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('patient')) return responses.patient;
  if (m.includes('doctor') || m.includes('physician')) return responses.doctor;
  if (m.includes('appointment') || m.includes('schedule')) return responses.appointment;
  if (m.includes('bed') || m.includes('room')) return responses.bed;
  if (m.includes('bill') || m.includes('invoice') || m.includes('payment')) return responses.billing;
  if (m.includes('emergency') || m.includes('urgent') || m.includes('ambulance')) return responses.emergency;
  if (m.includes('location') || m.includes('address') || m.includes('where') || m.includes('map') || m.includes('direction')) return responses.location;
  if (m.includes('phone') || m.includes('number') || m.includes('call') || m.includes('contact') || m.includes('email')) return responses.phone;
  if (m.includes('hour') || m.includes('open') || m.includes('timing') || m.includes('opd')) return responses.hours;
  if (m.includes('about') || m.includes('hospital') || m.includes('accredit') || m.includes('history')) return responses.about;
  if (m.includes('department') || m.includes('specialt') || m.includes('service')) return responses.dept;
  if (m.includes('hello') || m.includes('hey')) return responses.hello;
  if (m.includes('hi')) return responses.hi;
  if (m.includes('help')) return responses.help;
  return responses.default;
}

function appendMsg(text, role) {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendMsg(text, 'user');

  const typing = appendMsg('MediBot is typing...', 'bot typing');
  setTimeout(() => {
    typing.remove();
    appendMsg(getBotReply(text), 'bot');
  }, 700);
}
