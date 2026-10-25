// Live Clock
function updateClock() {
  const el = document.getElementById('clock');
  if (el) el.textContent = new Date().toLocaleString('en-IN', { weekday:'short', day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' });
}
updateClock();
setInterval(updateClock, 1000);

// AI Chatbox
let chatOpen = true;
function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chat-body').style.display = chatOpen ? 'flex' : 'none';
  document.getElementById('ctoggle').textContent = chatOpen ? '▲' : '▼';
}

const botReplies = {
  patient:     'There are 1,240 registered patients. Critical patients are being monitored in ICU.',
  doctor:      'We have 86 doctors across 25+ specialties. Most are available today.',
  appointment: '320 appointments are scheduled today. Use the Appointments section to manage them.',
  bed:         '54 beds are currently available. ICU is at 90% capacity.',
  billing:     'Total billed this month: ₹40,00,000. Pending: ₹7,66,000. Overdue: ₹5,34,000.',
  emergency:   '🚨 Emergency Line (24/7): +91 800-911-0000. ICU is on standby.',
  location:    '📍 Plot 42, Health City Road, Banjara Hills, Hyderabad — 500034.',
  phone:       '📞 Reception: +91 800-123-4567\n🚨 Emergency: +91 800-911-0000\n📅 Appointments: +91 800-111-2222',
  hours:       '🕐 OPD: Mon–Fri 8AM–8PM, Sat 8AM–2PM, Sun Closed.\n🚨 Emergency & ICU: 24/7.',
  inventory:   'Paracetamol (12 units) and Insulin (8 units) are running low. Reorder needed.',
  staff:       'Currently 24 staff members are online. Total staff: 300+.',
  help:        'I can help with:\n• Patients & Doctors\n• Appointments & Queue\n• Billing & Invoices\n• Bed availability\n• Inventory & Stock\n• Location & Contact\n• Emergency numbers',
  hello:       'Hello! How can I assist you today?',
  hi:          'Hi there! Ask me anything about the hospital.',
  default:     'I\'m not sure about that. Try asking about patients, doctors, appointments, beds, billing, or emergency.'
};

function getBotReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('patient'))                              return botReplies.patient;
  if (m.includes('doctor') || m.includes('physician'))   return botReplies.doctor;
  if (m.includes('appointment') || m.includes('schedule')) return botReplies.appointment;
  if (m.includes('bed') || m.includes('ward') || m.includes('icu')) return botReplies.bed;
  if (m.includes('bill') || m.includes('invoice') || m.includes('payment')) return botReplies.billing;
  if (m.includes('emergency') || m.includes('ambulance')) return botReplies.emergency;
  if (m.includes('location') || m.includes('address') || m.includes('where')) return botReplies.location;
  if (m.includes('phone') || m.includes('contact') || m.includes('call') || m.includes('number')) return botReplies.phone;
  if (m.includes('hour') || m.includes('timing') || m.includes('opd') || m.includes('open')) return botReplies.hours;
  if (m.includes('stock') || m.includes('inventory') || m.includes('medicine')) return botReplies.inventory;
  if (m.includes('staff'))                               return botReplies.staff;
  if (m.includes('hello') || m.includes('hey'))          return botReplies.hello;
  if (m.includes('hi'))                                  return botReplies.hi;
  if (m.includes('help'))                                return botReplies.help;
  return botReplies.default;
}

function appendMsg(text, role) {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

function sendMsg() {
  const inp = document.getElementById('chat-input');
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  appendMsg(text, 'user');
  const typing = appendMsg('Typing...', 'bot');
  setTimeout(() => { typing.remove(); appendMsg(getBotReply(text), 'bot'); }, 600);
}
