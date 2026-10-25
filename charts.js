// ── Chart.js Graph Initializations ──────────────────────────
// Called after DOM is ready. Each function targets a canvas ID.

function initAdminCharts() {
  const font = { family: "'Segoe UI', sans-serif", size: 11 };

  // 1. Monthly Patient Admissions — Bar Chart
  new Chart(document.getElementById('chartAdmissions'), {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'Admissions',
        data: [320,285,410,390,450,480,520,495,460,510,540,580],
        backgroundColor: 'rgba(21,101,192,0.75)',
        borderColor: '#1565c0',
        borderWidth: 1.5,
        borderRadius: 5
      },{
        label: 'Discharges',
        data: [300,270,395,375,430,460,500,475,440,490,520,555],
        backgroundColor: 'rgba(46,125,50,0.7)',
        borderColor: '#2e7d32',
        borderWidth: 1.5,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { font } } },
      scales: { x: { ticks: { font } }, y: { ticks: { font }, beginAtZero: true } }
    }
  });

  // 2. Revenue by Month — Line Chart
  new Chart(document.getElementById('chartRevenue'), {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'Revenue ($)',
        data: [38000,32000,45000,42000,50000,48000,55000,52000,49000,58000,61000,65000],
        borderColor: '#6a1b9a',
        backgroundColor: 'rgba(106,27,154,0.1)',
        tension: 0.4, fill: true, pointRadius: 4,
        pointBackgroundColor: '#6a1b9a'
      },{
        label: 'Expenses ($)',
        data: [22000,20000,26000,24000,28000,27000,30000,29000,27000,32000,34000,36000],
        borderColor: '#c62828',
        backgroundColor: 'rgba(198,40,40,0.08)',
        tension: 0.4, fill: true, pointRadius: 4,
        pointBackgroundColor: '#c62828'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { font } } },
      scales: { x: { ticks: { font } }, y: { ticks: { font, callback: v => '$'+v.toLocaleString() }, beginAtZero: false } }
    }
  });

  // 3. Department Patient Distribution — Doughnut
  new Chart(document.getElementById('chartDepts'), {
    type: 'doughnut',
    data: {
      labels: ['Cardiology','Neurology','Orthopedics','Pediatrics','Oncology','Gynecology','Others'],
      datasets: [{
        data: [220,145,180,210,95,130,260],
        backgroundColor: ['#1565c0','#6a1b9a','#e65100','#2e7d32','#c62828','#00695c','#78909c'],
        borderWidth: 2, borderColor: '#fff'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { font, padding: 12 } }
      },
      cutout: '60%'
    }
  });

  // 4. Appointment Status — Pie Chart
  new Chart(document.getElementById('chartApptStatus'), {
    type: 'pie',
    data: {
      labels: ['Completed','Pending','Cancelled','No-Show'],
      datasets: [{
        data: [245,48,18,9],
        backgroundColor: ['#2e7d32','#e65100','#c62828','#78909c'],
        borderWidth: 2, borderColor: '#fff'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font, padding: 10 } } }
    }
  });

  // 5. Bed Occupancy — Horizontal Bar
  new Chart(document.getElementById('chartBeds'), {
    type: 'bar',
    data: {
      labels: ['General Ward','ICU','Pediatrics','Maternity','Surgery','Orthopedics'],
      datasets: [{
        label: 'Occupied',
        data: [144,18,22,24,33,28],
        backgroundColor: ['#1565c0','#c62828','#2e7d32','#e65100','#6a1b9a','#00695c'],
        borderRadius: 4
      },{
        label: 'Available',
        data: [56,2,28,16,17,22],
        backgroundColor: 'rgba(200,200,200,0.4)',
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { font } } },
      scales: {
        x: { stacked: true, ticks: { font } },
        y: { stacked: true, ticks: { font } }
      }
    }
  });

  // 6. Weekly Appointments — Area Chart
  new Chart(document.getElementById('chartWeekly'), {
    type: 'line',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'This Week',
        data: [52,68,45,72,80,38,12],
        borderColor: '#1565c0',
        backgroundColor: 'rgba(21,101,192,0.15)',
        tension: 0.4, fill: true, pointRadius: 5,
        pointBackgroundColor: '#1565c0'
      },{
        label: 'Last Week',
        data: [48,60,50,65,75,42,10],
        borderColor: '#e65100',
        backgroundColor: 'rgba(230,81,0,0.08)',
        tension: 0.4, fill: true, pointRadius: 5,
        pointBackgroundColor: '#e65100',
        borderDash: [5,5]
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { font } } },
      scales: { x: { ticks: { font } }, y: { ticks: { font }, beginAtZero: true } }
    }
  });
}

function initDoctorCharts() {
  const font = { family: "'Segoe UI', sans-serif", size: 11 };

  // 1. My Patients by Condition — Doughnut
  new Chart(document.getElementById('chartMyPatients'), {
    type: 'doughnut',
    data: {
      labels: ['Diabetes','Hypertension','Cardiac','Fracture','Asthma','Neurology','Others'],
      datasets: [{
        data: [18,22,15,12,10,8,9],
        backgroundColor: ['#1565c0','#e65100','#c62828','#6a1b9a','#2e7d32','#00695c','#78909c'],
        borderWidth: 2, borderColor: '#fff'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'right', labels: { font, padding: 10 } } },
      cutout: '55%'
    }
  });

  // 2. Monthly Consultations — Bar
  new Chart(document.getElementById('chartConsultations'), {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
      datasets: [{
        label: 'Consultations',
        data: [85,92,78,105,98,112,94],
        backgroundColor: 'rgba(27,67,50,0.75)',
        borderColor: '#1b4332',
        borderWidth: 1.5,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { font } } },
      scales: { x: { ticks: { font } }, y: { ticks: { font }, beginAtZero: true } }
    }
  });

  // 3. Patient Recovery Rate — Line
  new Chart(document.getElementById('chartRecovery'), {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
      datasets: [{
        label: 'Recovery Rate (%)',
        data: [82,85,80,88,91,87,93],
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46,125,50,0.1)',
        tension: 0.4, fill: true, pointRadius: 5,
        pointBackgroundColor: '#2e7d32'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { font } } },
      scales: {
        x: { ticks: { font } },
        y: { ticks: { font, callback: v => v+'%' }, min: 70, max: 100 }
      }
    }
  });

  // 4. Appointment Types — Pie
  new Chart(document.getElementById('chartApptTypes'), {
    type: 'pie',
    data: {
      labels: ['Follow-up','New Patient','Emergency','Post-op','Procedure'],
      datasets: [{
        data: [38,25,12,15,10],
        backgroundColor: ['#1565c0','#2e7d32','#c62828','#e65100','#6a1b9a'],
        borderWidth: 2, borderColor: '#fff'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font, padding: 8 } } }
    }
  });
}
