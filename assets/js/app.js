// ====== APPLICATION STATE ======
const AppState = {
    currentPage: 'dashboard',
    theme: localStorage.getItem('theme') || 'light',
    employees: JSON.parse(localStorage.getItem('employees')) || [],
    timeRecords: JSON.parse(localStorage.getItem('timeRecords')) || [],
    leaveRequests: JSON.parse(localStorage.getItem('leaveRequests')) || [],
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    contacts: JSON.parse(localStorage.getItem('contacts')) || [],
    settings: JSON.parse(localStorage.getItem('settings')) || {
        companyName: 'EMP Tech',
        adminEmail: 'admin@mrtech.com',
        timeZone: 'UTC',
        language: 'en'
    }
};

// ====== AUTO-GENERATION FUNCTIONS ======
function generateEmpId() {
    const firstName = document.getElementById('empFirstName').value.trim();
    const lastName = document.getElementById('empLastName').value.trim();
    const empIdField = document.getElementById('empId');
    
    if (firstName && lastName) {
        // Generate MR ID: MR-0001, MR-0002, etc.
        const existingEmployees = AppState.employees.length;
        const nextId = existingEmployees + 1;
        const empId = `MR-${nextId.toString().padStart(4, '0')}`;
        empIdField.value = empId;
        return empId; // Return the generated ID
    } else {
        empIdField.value = '';
        return '';
    }
}

function generateEmail() {
    const firstName = document.getElementById('empFirstName').value.trim();
    const lastName = document.getElementById('empLastName').value.trim();
    const emailField = document.getElementById('empEmail');
    
    if (firstName && lastName) {
        // Generate email: firstname.lastname@mrtech.com
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mrtech.com`;
        emailField.value = email;
    } else {
        emailField.value = '';
    }
}

function validateEmail(email) {
    // Check if email ends with @mrtech.com
    return email.toLowerCase().endsWith('@mrtech.com');
}

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set initial theme
    document.documentElement.setAttribute('data-theme', AppState.theme);
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize forms
    initializeForms();
    
    // Initialize data tables
    initializeTables();
    
    // Initialize charts
    initializeCharts();
    
    // Load initial data
    loadInitialData();
    
    // Update dashboard
    updateDashboard();
    
    // Set current date/time defaults
    setCurrentDateTime();
}

// ====== NAVIGATION ======
function initializeNavigation() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateToPage(page);
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
}

function navigateToPage(page) {
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Update active page
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(page).classList.add('active');
    
    AppState.currentPage = page;
    
    // Close mobile menu
    document.getElementById('navMenu').classList.remove('active');
    
    // Page-specific initialization
    if (page === 'dashboard') {
        updateDashboard();
        updateCharts();
    } else if (page === 'employees') {
        updateEmployeeTable();
        updateEmployeeSelects();
    } else if (page === 'time-tracking') {
        updateTimeTable();
        updateTimeEmployeeSelect();
    } else if (page === 'leave') {
        updateLeaveTable();
        updateLeaveSelects();
    } else if (page === 'tasks') {
        updateTaskList();
        updateTaskSelects();
    } else if (page === 'team') {
        updateTeamGrid();
    } else if (page === 'reports') {
        updateReportsPage();
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    AppState.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    
    // Update theme icon
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ====== FORMS ======
function initializeForms() {
    // Employee Form
    const employeeForm = document.getElementById('employeeForm');
    employeeForm.addEventListener('submit', handleEmployeeSubmit);
    
    // Time Tracking Form
    const timeTrackingForm = document.getElementById('timeTrackingForm');
    timeTrackingForm.addEventListener('submit', handleTimeTrackingSubmit);
    
    // Leave Form
    const leaveForm = document.getElementById('leaveForm');
    leaveForm.addEventListener('submit', handleLeaveSubmit);
    
    // Task Form
    const taskForm = document.getElementById('taskForm');
    taskForm.addEventListener('submit', handleTaskSubmit);
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Profile Form
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', handleProfileSubmit);
    
    // Search and filter inputs
    initializeSearchFilters();
}

function handleEmployeeSubmit(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('empFirstName').value.trim();
    const lastName = document.getElementById('empLastName').value.trim();
    const email = document.getElementById('empEmail').value.trim();
    
    // Validate email domain
    if (!validateEmail(email)) {
        showToast('error', 'Invalid Email', 'Email must end with @mrtech.com domain');
        return;
    }
    
    const empId = generateEmpId();
    
    const employee = {
        id: Date.now().toString(),
        empId: empId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: document.getElementById('empPhone').value,
        department: document.getElementById('empDepartment').value,
        position: document.getElementById('empPosition').value,
        startDate: document.getElementById('empStartDate').value,
        salary: document.getElementById('empSalary').value,
        status: document.getElementById('empStatus').value,
        createdAt: new Date().toISOString()
    };
    
    AppState.employees.push(employee);
    saveData();
    
    showToast('success', 'Employee Added', `${employee.firstName} ${employee.lastName} has been added successfully.`);
    
    // Reset form
    e.target.reset();
    
    // Update tables and selects
    updateEmployeeTable();
    updateEmployeeSelects();
    updateDashboard();
}

function handleTimeTrackingSubmit(e) {
    e.preventDefault();
    
    const empId = document.getElementById('empId').value;
    const empName = document.getElementById('empName').value;
    const date = document.getElementById('timeDate').value;
    const loginTime = document.getElementById('loginTime').value;
    const logoutTime = document.getElementById('logoutTime').value;
    
    // Calculate total hours if both login and logout are provided
    let totalHours = 0;
    if (loginTime && logoutTime) {
        const login = new Date(`${date} ${loginTime}`);
        const logout = new Date(`${date} ${logoutTime}`);
        totalHours = ((logout - login) / (1000 * 60 * 60)).toFixed(2);
    }
    
    // Create new time record
    const timeRecord = {
        id: Date.now().toString(),
        empId: empId,
        empName: empName,
        date: date,
        loginTime: loginTime,
        logoutTime: logoutTime,
        totalHours: totalHours,
        createdAt: new Date().toISOString()
    };
    
    AppState.timeRecords.push(timeRecord);
    saveData();
    
    showToast('success', 'Time Recorded', `Time entry for ${empName} has been recorded successfully.`);
    
    // Reset form
    e.target.reset();
    setCurrentDateTime();
    
    // Update table
    updateTimeTable();
    updateDashboard();
}

function handleLeaveSubmit(e) {
    e.preventDefault();
    
    const employeeId = document.getElementById('leaveEmployee').value;
    const employee = AppState.employees.find(emp => emp.id === employeeId);
    const managerId = document.getElementById('leaveManager').value;
    const manager = AppState.employees.find(emp => emp.id === managerId);
    
    const leaveRequest = {
        id: Date.now().toString(),
        employeeId: employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        type: document.getElementById('leaveType').value,
        startDate: document.getElementById('leaveStartDate').value,
        endDate: document.getElementById('leaveEndDate').value,
        project: document.getElementById('leaveProject').value,
        managerId: managerId,
        managerName: `${manager.firstName} ${manager.lastName}`,
        reason: document.getElementById('leaveReason').value,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    
    // Calculate days
    const start = new Date(leaveRequest.startDate);
    const end = new Date(leaveRequest.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    leaveRequest.days = days;
    
    AppState.leaveRequests.push(leaveRequest);
    saveData();
    
    showToast('success', 'Leave Request Submitted', 'Your leave request has been submitted for approval.');
    
    // Reset form
    e.target.reset();
    
    // Update table
    updateLeaveTable();
    updateDashboard();
}

function handleTaskSubmit(e) {
    e.preventDefault();
    
    // Generate incremental Task ID
    const taskCount = AppState.tasks.length + 1;
    const taskId = `TASK-${taskCount.toString().padStart(4, '0')}`;
    
    const assigneeId = document.getElementById('taskAssignee').value;
    const assignee = AppState.employees.find(emp => emp.id === assigneeId);
    
    const task = {
        id: Date.now().toString(),
        taskId: taskId,
        title: document.getElementById('taskTitle').value,
        assigneeId: assigneeId,
        assigneeName: `${assignee.firstName} ${assignee.lastName}`,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value,
        status: document.getElementById('taskStatus').value,
        description: document.getElementById('taskDescription').value,
        createdAt: new Date().toISOString()
    };
    
    AppState.tasks.push(task);
    saveData();
    
    showToast('success', 'Task Created', `Task "${task.title}" has been assigned successfully.`);
    
    // Reset form
    e.target.reset();
    
    // Update task list
    updateTaskList();
    updateDashboard();
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const contact = {
        id: Date.now().toString(),
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value,
        createdAt: new Date().toISOString()
    };
    
    AppState.contacts.push(contact);
    saveData();
    
    showToast('success', 'Message Sent', 'Your message has been sent successfully. We will get back to you soon.');
    
    // Reset form
    e.target.reset();
}

function handleProfileSubmit(e) {
    e.preventDefault();
    
    AppState.settings = {
        companyName: document.getElementById('companyName').value,
        adminEmail: document.getElementById('adminEmail').value,
        timeZone: document.getElementById('timeZone').value,
        language: document.getElementById('languageSelect').value
    };
    
    saveData();
    
    showToast('success', 'Settings Saved', 'Your profile settings have been saved successfully.');
}

// ====== SEARCH AND FILTERS ======
function initializeSearchFilters() {
    // Employee search and filter
    document.getElementById('empSearch')?.addEventListener('input', (e) => {
        filterEmployees(e.target.value);
    });
    
    document.getElementById('deptFilter')?.addEventListener('change', (e) => {
        filterEmployeesByDepartment(e.target.value);
    });
    
    // Time tracking search
    document.getElementById('timeSearch')?.addEventListener('input', (e) => {
        filterTimeRecords(e.target.value);
    });
    
    // Leave search and filter
    document.getElementById('leaveSearch')?.addEventListener('input', (e) => {
        filterLeaveRequests(e.target.value);
    });
    
    document.getElementById('leaveStatusFilter')?.addEventListener('change', (e) => {
        filterLeaveRequestsByStatus(e.target.value);
    });
    
    // Task search and filter
    document.getElementById('taskSearch')?.addEventListener('input', (e) => {
        filterTasks(e.target.value);
    });
    
    document.getElementById('taskStatusFilter')?.addEventListener('change', (e) => {
        filterTasksByStatus(e.target.value);
    });
}

// ====== TABLES ======
function initializeTables() {
    updateEmployeeTable();
    updateTimeTable();
    updateLeaveTable();
    updateTaskList();
}

function updateEmployeeTable() {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';
    
    AppState.employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.empId || '-'}</td>
            <td>
                <div class="employee-info">
                    <div class="employee-avatar">${getInitials(employee.firstName, employee.lastName)}</div>
                    <div class="employee-details">
                        <div class="employee-name">${employee.firstName} ${employee.lastName}</div>
                        <div class="employee-position">${employee.position}</div>
                    </div>
                </div>
            </td>
            <td>${employee.email}</td>
            <td><span class="badge badge-primary">${employee.department}</span></td>
            <td>${employee.position}</td>
            <td><span class="badge badge-${getEmployeeStatusClass(employee.status)}">${employee.status}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editEmployee('${employee.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${employee.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateTimeTable() {
    const tbody = document.getElementById('timeTableBody');
    tbody.innerHTML = '';
    
    AppState.timeRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.empId || '-'}</td>
            <td>${record.empName || '-'}</td>
            <td>${formatDate(record.date)}</td>
            <td>${record.loginTime || '-'}</td>
            <td>${record.logoutTime || '-'}</td>
            <td>${record.totalHours ? `${record.totalHours}h` : '-'}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editTimeRecord('${record.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTimeRecord('${record.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateLeaveTable() {
    const tbody = document.getElementById('leaveTableBody');
    tbody.innerHTML = '';
    
    AppState.leaveRequests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.employeeName}</td>
            <td>${request.type}</td>
            <td>${formatDate(request.startDate)}</td>
            <td>${formatDate(request.endDate)}</td>
            <td>${request.days} days</td>
            <td>${request.managerName}</td>
            <td><span class="badge badge-${getStatusClass(request.status)}">${request.status}</span></td>
            <td>
                <button class="btn btn-sm btn-success" onclick="approveLeave('${request.id}')" ${request.status !== 'Pending' ? 'disabled' : ''}>
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="rejectLeave('${request.id}')" ${request.status !== 'Pending' ? 'disabled' : ''}>
                    <i class="fas fa-times"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="editLeaveRequest('${request.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateTaskList() {
    const tbody = document.getElementById('taskTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    AppState.tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.taskId || 'TASK-' + task.id.substring(0, 4)}</td>
            <td>${task.title}</td>
            <td>${task.assigneeName}</td>
            <td><span class="badge badge-${getPriorityBadgeClass(task.priority)}">${task.priority}</span></td>
            <td><span class="badge badge-${getStatusBadgeClass(task.status)}">${task.status}</span></td>
            <td>${formatDate(task.dueDate)}</td>
            <td>${task.description.length > 50 ? task.description.substring(0, 50) + '...' : task.description}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editTask('${task.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask('${task.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getStatusBadgeClass(status) {
    const classes = {
        'Pending': 'warning',
        'In Progress': 'info',
        'Completed': 'success'
    };
    return classes[status] || 'secondary';
}

function createTaskCard(task) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card priority-${task.priority.toLowerCase()}`;
    taskCard.dataset.taskId = task.id;
    
    const assigneeInitials = getInitials(task.assigneeName.split(' ')[0] || '', task.assigneeName.split(' ')[1] || '');
    const daysUntilDue = getDaysUntilDue(task.dueDate);
    const dueDateColor = getDueDateColor(daysUntilDue);
    
    taskCard.innerHTML = `
        <div class="task-card-header">
            <div class="task-card-title">${task.title}</div>
            <div class="task-actions">
                <button class="task-action-btn" onclick="editTask('${task.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-action-btn" onclick="deleteTask('${task.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="task-card-meta">
            <span class="badge badge-${getPriorityBadgeClass(task.priority)}">${task.priority}</span>
            <span style="color: ${dueDateColor}">
                <i class="fas fa-calendar"></i> ${formatDate(task.dueDate)}
                ${daysUntilDue !== null ? `(${daysUntilDue}d)` : ''}
            </span>
        </div>
        <div class="task-card-description">
            ${task.description.length > 100 ? task.description.substring(0, 100) + '...' : task.description}
        </div>
        <div class="task-card-footer">
            <div class="task-assignee">
                <div class="task-assignee-avatar">${assigneeInitials}</div>
                <span>${task.assigneeName}</span>
            </div>
        </div>
    `;
    
    return taskCard;
}

function getDaysUntilDue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function getDueDateColor(days) {
    if (days === null) return '#64748b';
    if (days < 0) return '#ef4444'; // Overdue - red
    if (days <= 1) return '#f59e0b'; // Due today/tomorrow - orange
    if (days <= 3) return '#eab308'; // Due soon - yellow
    return '#22c55e'; // Plenty of time - green
}

function getPriorityBadgeClass(priority) {
    const classes = {
        'Low': 'success',
        'Medium': 'warning',
        'High': 'danger',
        'Critical': 'danger'
    };
    return classes[priority] || 'secondary';
}

// ====== TEAM GRID ======
function updateTeamGrid() {
    const teamGrid = document.getElementById('teamGrid');
    teamGrid.innerHTML = '';
    
    // Group employees by department
    const departments = {};
    AppState.employees.forEach(employee => {
        if (!departments[employee.department]) {
            departments[employee.department] = [];
        }
        departments[employee.department].push(employee);
    });
    
    // Create department cards
    Object.keys(departments).forEach(dept => {
        const deptCard = document.createElement('div');
        deptCard.className = 'team-department';
        
        const deptTitle = document.createElement('h3');
        deptTitle.className = 'department-title';
        deptTitle.textContent = dept;
        deptCard.appendChild(deptTitle);
        
        const membersList = document.createElement('div');
        membersList.className = 'team-members';
        
        departments[dept].forEach(employee => {
            const member = document.createElement('div');
            member.className = 'team-member';
            member.innerHTML = `
                <div class="member-avatar">${getInitials(employee.firstName, employee.lastName)}</div>
                <div class="member-info">
                    <div class="member-name">${employee.firstName} ${employee.lastName}</div>
                    <div class="member-position">${employee.position}</div>
                </div>
            `;
            membersList.appendChild(member);
        });
        
        deptCard.appendChild(membersList);
        teamGrid.appendChild(deptCard);
    });
}

// ====== SELECTS ======
function updateEmployeeSelects() {
    const selects = [
        'timeEmployeeSelect',
        'leaveEmployee',
        'leaveManager',
        'taskAssignee'
    ];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select Employee</option>';
            
            AppState.employees.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.id;
                option.textContent = `${employee.firstName} ${employee.lastName} (${employee.empId || 'No ID'})`;
                select.appendChild(option);
            });
            
            select.value = currentValue;
            
            // Auto-fill Employee ID when employee is selected
            select.addEventListener('change', function() {
                const selectedEmployee = AppState.employees.find(emp => emp.id === this.value);
                if (selectedEmployee && selectedEmployee.empId) {
                    document.getElementById('empId').value = selectedEmployee.empId;
                    document.getElementById('empName').value = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
                }
            });
        }
    });
}

function updateTimeEmployeeSelect() {
    const select = document.getElementById('timeEmployee');
    if (select) {
        select.innerHTML = '<option value="">Select Employee</option>';
        
        AppState.employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = `${employee.firstName} ${employee.lastName} (${employee.empId || 'No ID'})`;
            select.appendChild(option);
        });
        
        // Auto-fill Employee ID when employee is selected
        select.addEventListener('change', function() {
            const selectedEmployee = AppState.employees.find(emp => emp.id === this.value);
            if (selectedEmployee && selectedEmployee.empId) {
                document.getElementById('empId').value = selectedEmployee.empId;
                document.getElementById('empName').value = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
            }
        });
    }
}

function updateLeaveSelects() {
    updateEmployeeSelects();
}

function updateTaskSelects() {
    updateEmployeeSelects();
}

// ====== DASHBOARD ======
function updateDashboard() {
    // Update statistics
    document.getElementById('totalEmployees').textContent = AppState.employees.length;
    
    // Calculate active today
    const today = new Date().toISOString().split('T')[0];
    const activeToday = AppState.timeRecords.filter(record => 
        record.date === today && record.clockIn
    ).length;
    document.getElementById('activeToday').textContent = activeToday;
    
    // Calculate pending leaves
    const pendingLeaves = AppState.leaveRequests.filter(request => 
        request.status === 'Pending'
    ).length;
    document.getElementById('pendingLeaves').textContent = pendingLeaves;
    
    // Calculate total tasks
    document.getElementById('totalTasks').textContent = AppState.tasks.length;
    
    // Update recent activity
    updateRecentActivity();
}

function updateRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    activityList.innerHTML = '';
    
    // Get recent activities from all data sources
    const activities = [];
    
    // Add recent time records
    AppState.timeRecords.slice(-5).reverse().forEach(record => {
        activities.push({
            type: 'time',
            icon: 'fa-clock',
            color: 'primary',
            text: `${record.employeeName} clocked ${record.clockIn ? 'in' : 'out'}`,
            time: formatDateTime(record.createdAt)
        });
    });
    
    // Add recent leave requests
    AppState.leaveRequests.slice(-5).reverse().forEach(request => {
        activities.push({
            type: 'leave',
            icon: 'fa-calendar-alt',
            color: 'warning',
            text: `${request.employeeName} submitted leave request`,
            time: formatDateTime(request.createdAt)
        });
    });
    
    // Add recent tasks
    AppState.tasks.slice(-5).reverse().forEach(task => {
        activities.push({
            type: 'task',
            icon: 'fa-tasks',
            color: 'info',
            text: `Task "${task.title}" assigned to ${task.assigneeName}`,
            time: formatDateTime(task.createdAt)
        });
    });
    
    // Sort by time and display latest 5
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    activities.slice(0, 5).forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon" style="background: var(--${activity.color}-500)">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${formatRelativeTime(activity.time)}</div>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
    
    if (activities.length === 0) {
        activityList.innerHTML = '<p class="text-center text-muted">No recent activity</p>';
    }
}

// ====== CHARTS ======
let weeklyChart, departmentChart;

function initializeCharts() {
    // Weekly Activity Chart
    const weeklyCtx = document.getElementById('weeklyChart');
    if (weeklyCtx) {
        weeklyChart = new Chart(weeklyCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Active Employees',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: 'rgb(14, 165, 233)',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Department Distribution Chart
    const departmentCtx = document.getElementById('departmentChart');
    if (departmentCtx) {
        departmentChart = new Chart(departmentCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        'rgb(14, 165, 233)',
                        'rgb(34, 197, 94)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)',
                        'rgb(59, 130, 246)',
                        'rgb(168, 85, 247)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function updateCharts() {
    // Update weekly chart
    if (weeklyChart) {
        const weekData = getWeeklyActivityData();
        weeklyChart.data.datasets[0].data = weekData;
        weeklyChart.update();
    }
    
    // Update department chart
    if (departmentChart) {
        const deptData = getDepartmentDistribution();
        departmentChart.data.labels = deptData.labels;
        departmentChart.data.datasets[0].data = deptData.data;
        departmentChart.update();
    }
}

function getWeeklyActivityData() {
    const weekData = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - today.getDay() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const activeCount = AppState.timeRecords.filter(record => 
            record.date === dateStr && record.clockIn
        ).length;
        
        weekData[i] = activeCount;
    }
    
    return weekData;
}

function getDepartmentDistribution() {
    const departments = {};
    AppState.employees.forEach(employee => {
        departments[employee.department] = (departments[employee.department] || 0) + 1;
    });
    
    return {
        labels: Object.keys(departments),
        data: Object.values(departments)
    };
}

// ====== DATA MANAGEMENT ======
function saveData() {
    localStorage.setItem('employees', JSON.stringify(AppState.employees));
    localStorage.setItem('timeRecords', JSON.stringify(AppState.timeRecords));
    localStorage.setItem('leaveRequests', JSON.stringify(AppState.leaveRequests));
    localStorage.setItem('tasks', JSON.stringify(AppState.tasks));
    localStorage.setItem('contacts', JSON.stringify(AppState.contacts));
    localStorage.setItem('settings', JSON.stringify(AppState.settings));
}

function loadInitialData() {
    // Load sample data if empty
    if (AppState.employees.length === 0) {
        loadSampleData();
    }
    
    // Ensure time records start with zero
    if (AppState.timeRecords.length === 0) {
        AppState.timeRecords = [];
        saveData();
    }
    
    // Ensure data persistence on page load
    loadDataFromStorage();
    
    // Initialize all selects
    updateEmployeeSelects();
}

function loadDataFromStorage() {
    // Load all data from localStorage to ensure persistence
    AppState.employees = JSON.parse(localStorage.getItem('employees')) || [];
    AppState.timeRecords = JSON.parse(localStorage.getItem('timeRecords')) || [];
    AppState.leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    AppState.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    AppState.contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    AppState.settings = JSON.parse(localStorage.getItem('settings')) || {
        companyName: 'EMP Tech',
        adminEmail: 'admin@mrtech.com',
        timeZone: 'UTC',
        language: 'en'
    };
}

function loadSampleData() {
    // Sample employees
    const sampleEmployees = [
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            phone: '+1234567890',
            department: 'Engineering',
            position: 'Senior Developer',
            startDate: '2023-01-15',
            salary: 85000,
            status: 'Active',
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@company.com',
            phone: '+1234567891',
            department: 'Sales',
            position: 'Sales Manager',
            startDate: '2022-06-01',
            salary: 75000,
            status: 'Active',
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.johnson@company.com',
            phone: '+1234567892',
            department: 'Marketing',
            position: 'Marketing Specialist',
            startDate: '2023-03-10',
            salary: 65000,
            status: 'Active',
            createdAt: new Date().toISOString()
        }
    ];
    
    AppState.employees = sampleEmployees;
    saveData();
    
    // Update all selects
    updateEmployeeSelects();
}

// ====== EXPORT/IMPORT ======
function exportData() {
    const data = {
        employees: AppState.employees,
        timeRecords: AppState.timeRecords,
        leaveRequests: AppState.leaveRequests,
        tasks: AppState.tasks,
        contacts: AppState.contacts,
        settings: AppState.settings,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emptrack-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('success', 'Data Exported', 'All data has been exported successfully.');
}

function exportToCSV(data, filename) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function exportReport() {
    const reportType = document.getElementById('reportType').value;
    let data = [];
    let filename = '';
    
    switch(reportType) {
        case 'overview':
            data = AppState.employees;
            filename = 'employees-overview.csv';
            break;
        case 'attendance':
            data = AppState.timeRecords;
            filename = 'attendance-report.csv';
            break;
        case 'productivity':
            data = AppState.tasks.map(task => ({
                employeeName: task.assigneeName,
                taskTitle: task.title,
                status: task.status,
                dueDate: task.dueDate
            }));
            filename = 'productivity-report.csv';
            break;
        default:
            showToast('error', 'Export Error', 'Please select a report type');
            return;
    }
    
    exportToCSV(data, filename);
}

// ====== REPORTS FUNCTIONS ======
function updateReportsPage() {
    // Update all report metrics and charts when navigating to reports page
    calculateReportMetrics();
    updateReportsTable();
    updateReportCharts();
}

function generateReport() {
    const dateRange = document.getElementById('reportDateRange').value;
    const department = document.getElementById('reportDepartment').value;
    const reportType = document.getElementById('reportType').value;
    
    // Calculate metrics based on filters
    calculateReportMetrics(dateRange, department);
    
    // Update the reports table
    updateReportsTable(department);
    
    // Update charts
    updateReportCharts();
    
    showToast('success', 'Report Generated', 'Report has been generated successfully.');
}

function refreshReports() {
    calculateReportMetrics();
    updateReportsTable();
    updateReportCharts();
    showToast('success', 'Reports Refreshed', 'All report data has been refreshed.');
}

function calculateReportMetrics(dateRange = '30', department = '') {
    // Calculate Total Work Hours
    let totalHours = 0;
    let filteredTimeRecords = AppState.timeRecords;
    
    if (dateRange !== 'custom') {
        const days = parseInt(dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        filteredTimeRecords = AppState.timeRecords.filter(record => {
            return new Date(record.date) >= cutoffDate;
        });
    }
    
    // Calculate total hours from time records
    filteredTimeRecords.forEach(record => {
        if (record.loginTime && record.logoutTime) {
            const login = new Date(`2000-01-01T${record.loginTime}`);
            const logout = new Date(`2000-01-01T${record.logoutTime}`);
            const hours = (logout - login) / (1000 * 60 * 60);
            if (hours > 0) totalHours += hours;
        }
    });
    
    document.getElementById('totalWorkHours').textContent = Math.round(totalHours);
    
    // Calculate Average Attendance
    const totalEmployees = AppState.employees.length;
    const presentEmployees = filteredTimeRecords.filter(record => record.status === 'Present').length;
    const avgAttendance = totalEmployees > 0 ? Math.round((presentEmployees / totalEmployees) * 100) : 0;
    document.getElementById('avgAttendance').textContent = avgAttendance + '%';
    
    // Calculate Task Completion Rate
    let filteredTasks = AppState.tasks;
    if (department) {
        filteredTasks = AppState.tasks.filter(task => {
            const employee = AppState.employees.find(emp => emp.id === task.assigneeId);
            return employee && employee.department === department;
        });
    }
    
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(task => task.status === 'Completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    document.getElementById('taskCompletion').textContent = completionRate + '%';
    
    // Calculate Leave Utilization
    let filteredLeaves = AppState.leaveRequests;
    if (dateRange !== 'custom') {
        const days = parseInt(dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        filteredLeaves = AppState.leaveRequests.filter(leave => {
            return new Date(leave.startDate) >= cutoffDate;
        });
    }
    
    const approvedLeaves = filteredLeaves.filter(leave => leave.status === 'Approved').length;
    const totalWorkingDays = totalEmployees * 22; // Approximate working days per month
    const leaveUtilization = totalWorkingDays > 0 ? Math.round((approvedLeaves / totalWorkingDays) * 100) : 0;
    document.getElementById('leaveUtilization').textContent = leaveUtilization + '%';
}

function updateReportsTable(department = '') {
    const tbody = document.getElementById('reportsTableBody');
    tbody.innerHTML = '';
    
    // Filter employees by department if specified
    let filteredEmployees = AppState.employees;
    if (department) {
        filteredEmployees = AppState.employees.filter(emp => emp.department === department);
    }
    
    if (filteredEmployees.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" style="text-align: center;">No data available</td>';
        tbody.appendChild(row);
        return;
    }
    
    filteredEmployees.forEach(employee => {
        // Calculate work hours for this employee
        const employeeTimeRecords = AppState.timeRecords.filter(record => record.employeeId === employee.id);
        let workHours = 0;
        employeeTimeRecords.forEach(record => {
            if (record.loginTime && record.logoutTime) {
                const login = new Date(`2000-01-01T${record.loginTime}`);
                const logout = new Date(`2000-01-01T${record.logoutTime}`);
                const hours = (logout - login) / (1000 * 60 * 60);
                if (hours > 0) workHours += hours;
            }
        });
        
        // Calculate attendance rate
        const totalDays = employeeTimeRecords.length;
        const presentDays = employeeTimeRecords.filter(record => record.status === 'Present').length;
        const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
        
        // Calculate tasks completed
        const employeeTasks = AppState.tasks.filter(task => task.assigneeId === employee.id);
        const tasksCompleted = employeeTasks.filter(task => task.status === 'Completed').length;
        
        // Calculate performance score (simplified)
        const performanceScore = Math.round((attendanceRate * 0.4) + ((tasksCompleted / Math.max(employeeTasks.length, 1)) * 100 * 0.6));
        
        // Determine trend
        const trend = performanceScore >= 80 ? 'up' : performanceScore >= 60 ? 'stable' : 'down';
        const trendIcon = trend === 'up' ? 'fa-arrow-up' : trend === 'down' ? 'fa-arrow-down' : 'fa-minus';
        const trendColor = trend === 'up' ? 'positive' : trend === 'down' ? 'negative' : 'neutral';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="employee-info">
                    <div class="employee-avatar">${getInitials(employee.firstName, employee.lastName)}</div>
                    <div class="employee-details">
                        <div class="employee-name">${employee.firstName} ${employee.lastName}</div>
                    </div>
                </div>
            </td>
            <td><span class="badge badge-primary">${employee.department}</span></td>
            <td>${Math.round(workHours)}</td>
            <td>${attendanceRate}%</td>
            <td>${tasksCompleted}</td>
            <td>${performanceScore}</td>
            <td><i class="fas ${trendIcon} ${trendColor}"></i></td>
        `;
        tbody.appendChild(row);
    });
}

function updateReportCharts() {
    // Update attendance trends chart
    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
        const weeklyData = getWeeklyAttendanceData();
        updateAttendanceChart(attendanceCtx, weeklyData);
    }
    
    // Update department performance chart
    const deptCtx = document.getElementById('deptPerformanceChart');
    if (deptCtx) {
        const deptData = getDepartmentPerformanceData();
        updateDeptPerformanceChart(deptCtx, deptData);
    }
    
    // Update task distribution chart
    const taskCtx = document.getElementById('taskDistributionChart');
    if (taskCtx) {
        const taskData = getTaskDistributionData();
        updateTaskDistributionChart(taskCtx, taskData);
    }
    
    // Update leave analysis chart
    const leaveCtx = document.getElementById('leaveAnalysisChart');
    if (leaveCtx) {
        const leaveData = getLeaveAnalysisData();
        updateLeaveAnalysisChart(leaveCtx, leaveData);
    }
}

function getWeeklyAttendanceData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(day => {
        const dayRecords = AppState.timeRecords.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getDay() === days.indexOf(day) + 1;
        });
        return dayRecords.filter(r => r.status === 'Present').length;
    });
    return { labels: days, data: data };
}

function getDepartmentPerformanceData() {
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
    const data = departments.map(dept => {
        const deptEmployees = AppState.employees.filter(emp => emp.department === dept);
        return deptEmployees.length;
    });
    return { labels: departments, data: data };
}

function getTaskDistributionData() {
    const statuses = ['Pending', 'In Progress', 'Completed', 'Overdue'];
    const data = statuses.map(status => {
        return AppState.tasks.filter(task => task.status === status).length;
    });
    return { labels: statuses, data: data };
}

function getLeaveAnalysisData() {
    const types = ['Annual', 'Sick', 'Personal', 'Other'];
    const data = types.map(type => {
        return AppState.leaveRequests.filter(leave => leave.type === type && leave.status === 'Approved').length;
    });
    return { labels: types, data: data };
}

function updateAttendanceChart(ctx, data) {
    if (window.attendanceChartInstance) {
        window.attendanceChartInstance.destroy();
    }
    
    window.attendanceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Attendance',
                data: data.data,
                borderColor: 'var(--primary-500)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function updateDeptPerformanceChart(ctx, data) {
    if (window.deptChartInstance) {
        window.deptChartInstance.destroy();
    }
    
    window.deptChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: [
                    'var(--primary-500)',
                    'var(--success-500)',
                    'var(--warning-500)',
                    'var(--danger-500)',
                    'var(--secondary-500)',
                    'var(--accent-500)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12 }
                }
            }
        }
    });
}

function updateTaskDistributionChart(ctx, data) {
    if (window.taskChartInstance) {
        window.taskChartInstance.destroy();
    }
    
    window.taskChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Tasks',
                data: data.data,
                backgroundColor: [
                    'var(--warning-500)',
                    'var(--primary-500)',
                    'var(--success-500)',
                    'var(--danger-500)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function updateLeaveAnalysisChart(ctx, data) {
    if (window.leaveChartInstance) {
        window.leaveChartInstance.destroy();
    }
    
    window.leaveChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: [
                    'var(--primary-500)',
                    'var(--success-500)',
                    'var(--warning-500)',
                    'var(--secondary-500)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12 }
                }
            }
        }
    });
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => {
        return headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value}"` : value;
        }).join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
}

// ====== UTILITY FUNCTIONS ======
function showToast(type, title, message) {
    const toastContainer = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${getToastIcon(type)}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

function getStatusClass(status) {
    const classes = {
        'Pending': 'warning',
        'Approved': 'success',
        'Rejected': 'danger',
        'Active': 'success',
        'On Leave': 'warning',
        'Terminated': 'danger'
    };
    return classes[status] || 'secondary';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

function getInitials(firstName, lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function setCurrentDateTime() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    // Set default values for date input
    const timeDate = document.getElementById('timeDate');
    if (timeDate && !timeDate.value) timeDate.value = dateStr;
}

// ====== CRUD OPERATIONS ======
function editEmployee(id) {
    const employee = AppState.employees.find(emp => emp.id === id);
    if (!employee) return;
    
    // Fill form with employee data
    document.getElementById('empFirstName').value = employee.firstName;
    document.getElementById('empLastName').value = employee.lastName;
    document.getElementById('empEmail').value = employee.email;
    document.getElementById('empPhone').value = employee.phone;
    document.getElementById('empDepartment').value = employee.department;
    document.getElementById('empPosition').value = employee.position;
    document.getElementById('empStartDate').value = employee.startDate;
    document.getElementById('empSalary').value = employee.salary;
    document.getElementById('empStatus').value = employee.status;
    
    // Remove the old employee
    AppState.employees = AppState.employees.filter(emp => emp.id !== id);
    
    // Navigate to employees page
    navigateToPage('employees');
    
    showToast('info', 'Edit Mode', 'Update the form and submit to save changes.');
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        AppState.employees = AppState.employees.filter(emp => emp.id !== id);
        saveData();
        updateEmployeeTable();
        updateEmployeeSelects();
        updateDashboard();
        showToast('success', 'Employee Deleted', 'Employee has been deleted successfully.');
    }
}

function editTimeRecord(id) {
    const record = AppState.timeRecords.find(rec => rec.id === id);
    if (!record) return;
    
    // Fill form with record data
    document.getElementById('empId').value = record.empId || '';
    document.getElementById('empName').value = record.empName || '';
    document.getElementById('timeDate').value = record.date;
    document.getElementById('loginTime').value = record.loginTime || '';
    document.getElementById('logoutTime').value = record.logoutTime || '';
    
    // Remove the old record
    AppState.timeRecords = AppState.timeRecords.filter(rec => rec.id !== id);
    
    // Navigate to time tracking page
    navigateToPage('time-tracking');
    
    showToast('info', 'Edit Mode', 'Update the form and submit to save changes.');
}

function deleteTimeRecord(id) {
    if (confirm('Are you sure you want to delete this time record?')) {
        AppState.timeRecords = AppState.timeRecords.filter(rec => rec.id !== id);
        saveData();
        updateTimeTable();
        updateDashboard();
        showToast('success', 'Time Record Deleted', 'Time record has been deleted successfully.');
    }
}

function approveLeave(id) {
    const request = AppState.leaveRequests.find(req => req.id === id);
    if (request) {
        request.status = 'Approved';
        saveData();
        updateLeaveTable();
        updateDashboard();
        showToast('success', 'Leave Approved', 'Leave request has been approved.');
    }
}

function rejectLeave(id) {
    const request = AppState.leaveRequests.find(req => req.id === id);
    if (request) {
        request.status = 'Rejected';
        saveData();
        updateLeaveTable();
        updateDashboard();
        showToast('warning', 'Leave Rejected', 'Leave request has been rejected.');
    }
}

function editLeaveRequest(id) {
    const request = AppState.leaveRequests.find(req => req.id === id);
    if (!request) return;
    
    // Fill form with request data
    document.getElementById('leaveEmployee').value = request.employeeId;
    document.getElementById('leaveType').value = request.type;
    document.getElementById('leaveStartDate').value = request.startDate;
    document.getElementById('leaveEndDate').value = request.endDate;
    document.getElementById('leaveProject').value = request.project || '';
    document.getElementById('leaveManager').value = request.managerId;
    document.getElementById('leaveReason').value = request.reason;
    
    // Remove the old request
    AppState.leaveRequests = AppState.leaveRequests.filter(req => req.id !== id);
    
    // Navigate to leave page
    navigateToPage('leave');
    
    showToast('info', 'Edit Mode', 'Update the form and submit to save changes.');
}

function editTask(id) {
    const task = AppState.tasks.find(t => t.id === id);
    if (!task) return;
    
    // Fill form with task data
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskAssignee').value = task.assigneeId;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskDueDate').value = task.dueDate;
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskDescription').value = task.description;
    
    // Remove the old task
    AppState.tasks = AppState.tasks.filter(t => t.id !== id);
    
    // Navigate to tasks page
    navigateToPage('tasks');
    
    showToast('info', 'Edit Mode', 'Update the form and submit to save changes.');
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        AppState.tasks = AppState.tasks.filter(t => t.id !== id);
        saveData();
        updateTaskList();
        updateDashboard();
        showToast('success', 'Task Deleted', 'Task has been deleted successfully.');
    }
}

// ====== FILTER FUNCTIONS ======
function filterEmployees(searchTerm) {
    const rows = document.querySelectorAll('#employeeTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}

function filterEmployeesByDepartment(department) {
    const rows = document.querySelectorAll('#employeeTableBody tr');
    rows.forEach(row => {
        const deptCell = row.cells[2];
        row.style.display = !department || deptCell.textContent.includes(department) ? '' : 'none';
    });
}

function filterTimeRecords(searchTerm) {
    const rows = document.querySelectorAll('#timeTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}

function filterLeaveRequests(searchTerm) {
    const rows = document.querySelectorAll('#leaveTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}

function filterLeaveRequestsByStatus(status) {
    const rows = document.querySelectorAll('#leaveTableBody tr');
    rows.forEach(row => {
        const statusCell = row.cells[6];
        row.style.display = !status || statusCell.textContent.includes(status) ? '' : 'none';
    });
}

function filterTasks(searchTerm) {
    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach(task => {
        const text = task.textContent.toLowerCase();
        task.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}

function filterTasksByStatus(status) {
    const columns = document.querySelectorAll('.task-column');
    columns.forEach(column => {
        column.style.display = !status || column.dataset.status === status ? '' : 'none';
    });
}

// ====== EVENT LISTENERS FOR DATA MANAGEMENT ======
document.addEventListener('DOMContentLoaded', () => {
    // Export all data
    document.getElementById('exportAllData')?.addEventListener('click', exportData);
    
    // Export time data as CSV
    document.getElementById('exportTimeData')?.addEventListener('click', () => {
        exportToCSV(AppState.timeRecords, 'time-records.csv');
    });
    
    // Import data
    document.getElementById('importData')?.addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    
    document.getElementById('importFile')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    AppState.employees = data.employees || [];
                    AppState.timeRecords = data.timeRecords || [];
                    AppState.leaveRequests = data.leaveRequests || [];
                    AppState.tasks = data.tasks || [];
                    AppState.contacts = data.contacts || [];
                    AppState.settings = data.settings || AppState.settings;
                    
                    saveData();
                    updateDashboard();
                    updateEmployeeTable();
                    updateTimeTable();
                    updateLeaveTable();
                    updateTaskList();
                    updateEmployeeSelects();
                    
                    showToast('success', 'Data Imported', 'Data has been imported successfully.');
                } catch (error) {
                    showToast('error', 'Import Failed', 'Invalid file format.');
                }
            };
            reader.readAsText(file);
        }
    });
    
    // Clear all data
    document.getElementById('clearAllData')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            if (confirm('This will permanently delete all employees, time records, leave requests, and tasks. Are you absolutely sure?')) {
                AppState.employees = [];
                AppState.timeRecords = [];
                AppState.leaveRequests = [];
                AppState.tasks = [];
                AppState.contacts = [];
                
                saveData();
                updateDashboard();
                updateEmployeeTable();
                updateTimeTable();
                updateLeaveTable();
                updateTaskList();
                updateEmployeeSelects();
                
                showToast('warning', 'Data Cleared', 'All data has been cleared successfully.');
            }
        }
    });
    
    // Theme select
    document.getElementById('themeSelect')?.addEventListener('change', (e) => {
        const theme = e.target.value;
        document.documentElement.setAttribute('data-theme', theme);
        AppState.theme = theme;
        localStorage.setItem('theme', theme);
        
        // Update theme icon
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    });
    
    // Set initial theme select value
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = AppState.theme;
    }
});

// ====== MODAL FUNCTIONS ======
function showModal(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmOk = document.getElementById('confirmOk');
    const confirmCancel = document.getElementById('confirmCancel');
    
    confirmMessage.textContent = message;
    modal.classList.add('active');
    
    const handleConfirm = () => {
        modal.classList.remove('active');
        if (onConfirm) onConfirm();
        cleanup();
    };
    
    const handleCancel = () => {
        modal.classList.remove('active');
        cleanup();
    };
    
    const cleanup = () => {
        confirmOk.removeEventListener('click', handleConfirm);
        confirmCancel.removeEventListener('click', handleCancel);
    };
    
    confirmOk.addEventListener('click', handleConfirm);
    confirmCancel.addEventListener('click', handleCancel);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            handleCancel();
        }
    });
}

// ====== UTILITY FUNCTIONS ======
// Additional utility functions can be added here
