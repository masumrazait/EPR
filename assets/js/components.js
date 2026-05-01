// ====== ENHANCED COMPONENTS FUNCTIONALITY ======

// ====== TASK BOARD DRAG AND DROP ======
class TaskBoard {
    constructor() {
        this.draggedElement = null;
        this.draggedTaskId = null;
        this.initializeDragAndDrop();
    }

    initializeDragAndDrop() {
        // Use event delegation for dynamic content
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-card')) {
                this.handleDragStart(e);
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('task-card')) {
                this.handleDragEnd(e);
            }
        });

        document.addEventListener('dragover', (e) => {
            if (e.target.closest('.task-column')) {
                this.handleDragOver(e);
            }
        });

        document.addEventListener('drop', (e) => {
            if (e.target.closest('.task-column')) {
                this.handleDrop(e);
            }
        });

        document.addEventListener('dragleave', (e) => {
            if (e.target.closest('.task-column')) {
                this.handleDragLeave(e);
            }
        });
    }

    handleDragStart(e) {
        const taskCard = e.target;
        this.draggedElement = taskCard;
        this.draggedTaskId = taskCard.dataset.taskId;
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', taskCard.innerHTML);
        taskCard.classList.add('dragging');
        
        // Store original parent
        this.originalParent = taskCard.parentElement;
    }

    handleDragEnd(e) {
        const taskCard = e.target;
        taskCard.classList.remove('dragging');
        
        // Clean up all drag-over states
        document.querySelectorAll('.task-column').forEach(column => {
            column.classList.remove('drag-over');
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const column = e.target.closest('.task-column');
        if (column) {
            column.classList.add('drag-over');
            
            // Find the task list within the column
            const taskList = column.querySelector('.task-list');
            if (taskList) {
                const afterElement = this.getDragAfterElement(taskList, e.clientY);
                if (afterElement == null) {
                    taskList.appendChild(this.draggedElement);
                } else {
                    taskList.insertBefore(this.draggedElement, afterElement);
                }
            }
        }
    }

    handleDragLeave(e) {
        const column = e.target.closest('.task-column');
        if (column && !column.contains(e.relatedTarget)) {
            column.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        
        const column = e.target.closest('.task-column');
        if (column && this.draggedTaskId) {
            column.classList.remove('drag-over');
            
            const newStatus = column.dataset.status;
            this.updateTaskStatus(this.draggedTaskId, newStatus);
        }
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    updateTaskStatus(taskId, newStatus) {
        const task = AppState.tasks.find(t => t.id === taskId);
        if (task) {
            const oldStatus = task.status;
            task.status = newStatus;
            task.updatedAt = new Date().toISOString();
            
            saveData();
            updateTaskList();
            
            // Re-initialize drag and drop for new elements
            setTimeout(() => {
                this.initializeDragAndDrop();
            }, 100);
            
            showToast('success', 'Task Updated', `Task "${task.title}" moved from ${oldStatus} to ${newStatus}`);
        }
    }

    // Method to refresh drag and drop when tasks are updated
    refresh() {
        // Remove existing event listeners and re-add them
        this.initializeDragAndDrop();
    }
}

// ====== ENHANCED DASHBOARD CHARTS ======
class DashboardCharts {
    constructor() {
        this.weeklyChart = null;
        this.departmentChart = null;
        this.initializeCharts();
    }

    initializeCharts() {
        this.createWeeklyChart();
        this.createDepartmentChart();
        this.setupChartAnimations();
    }

    createWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        this.weeklyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Active Employees',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: 'rgb(14, 165, 233)',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: 'rgb(14, 165, 233)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        borderRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Active Employees: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(100, 116, 139, 0.1)'
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    }
                }
            }
        });
    }

    createDepartmentChart() {
        const ctx = document.getElementById('departmentChart');
        if (!ctx) return;

        this.departmentChart = new Chart(ctx, {
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
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            color: '#64748b',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        borderRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    setupChartAnimations() {
        // Add smooth animations when data updates
        Chart.defaults.animation.duration = 1000;
        Chart.defaults.animation.easing = 'easeInOutQuart';
    }

    updateCharts() {
        if (this.weeklyChart) {
            const weekData = this.getWeeklyActivityData();
            this.weeklyChart.data.datasets[0].data = weekData;
            this.weeklyChart.update();
        }

        if (this.departmentChart) {
            const deptData = this.getDepartmentDistribution();
            this.departmentChart.data.labels = deptData.labels;
            this.departmentChart.data.datasets[0].data = deptData.data;
            this.departmentChart.update();
        }
    }

    getWeeklyActivityData() {
        const weekData = [0, 0, 0, 0, 0, 0, 0];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - today.getDay() + i);
            const dateStr = date.toISOString().split('T')[0];
            
            const activeCount = AppState.timeRecords.filter(record => 
                record.date === dateStr && record.loginTime
            ).length;
            
            weekData[i] = activeCount;
        }
        
        return weekData;
    }

    getDepartmentDistribution() {
        const departments = {};
        AppState.employees.forEach(employee => {
            departments[employee.department] = (departments[employee.department] || 0) + 1;
        });
        
        return {
            labels: Object.keys(departments),
            data: Object.values(departments)
        };
    }
}

// ====== ENHANCED SEARCH AND FILTER ======
class AdvancedSearch {
    constructor() {
        this.initializeSearch();
    }

    initializeSearch() {
        this.setupEmployeeSearch();
        this.setupTimeSearch();
        this.setupLeaveSearch();
        this.setupTaskSearch();
    }

    setupEmployeeSearch() {
        const searchInput = document.getElementById('empSearch');
        const deptFilter = document.getElementById('deptFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterEmployees(e.target.value);
            });
        }
        
        if (deptFilter) {
            deptFilter.addEventListener('change', (e) => {
                this.filterEmployeesByDepartment(e.target.value);
            });
        }
    }

    setupTimeSearch() {
        const searchInput = document.getElementById('timeSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTimeRecords(e.target.value);
            });
        }
    }

    setupLeaveSearch() {
        const searchInput = document.getElementById('leaveSearch');
        const statusFilter = document.getElementById('leaveStatusFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterLeaveRequests(e.target.value);
            });
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterLeaveRequestsByStatus(e.target.value);
            });
        }
    }

    setupTaskSearch() {
        const searchInput = document.getElementById('taskSearch');
        const statusFilter = document.getElementById('taskStatusFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTasks(e.target.value);
            });
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterTasksByStatus(e.target.value);
            });
        }
    }

    filterEmployees(searchTerm) {
        const cards = document.querySelectorAll('.employee-card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    filterEmployeesByDepartment(department) {
        const cards = document.querySelectorAll('.employee-card');
        cards.forEach(card => {
            const deptElement = card.querySelector('.employee-department');
            card.style.display = !department || deptElement.textContent.includes(department) ? '' : 'none';
        });
    }

    filterTimeRecords(searchTerm) {
        const cards = document.querySelectorAll('.time-record-card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    filterLeaveRequests(searchTerm) {
        const cards = document.querySelectorAll('.leave-request-card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    filterLeaveRequestsByStatus(status) {
        const cards = document.querySelectorAll('.leave-request-card');
        cards.forEach(card => {
            card.style.display = !status || card.classList.contains(`status-${status.toLowerCase()}`) ? '' : 'none';
        });
    }

    filterTasks(searchTerm) {
        const cards = document.querySelectorAll('.task-card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    filterTasksByStatus(status) {
        const columns = document.querySelectorAll('.task-column');
        columns.forEach(column => {
            column.style.display = !status || column.dataset.status === status ? '' : 'none';
        });
    }
}

// ====== ENHANCED FORM VALIDATION ======
class FormValidator {
    constructor() {
        this.initializeValidation();
    }

    initializeValidation() {
        this.setupEmployeeFormValidation();
        this.setupTimeFormValidation();
        this.setupLeaveFormValidation();
        this.setupTaskFormValidation();
    }

    setupEmployeeFormValidation() {
        const form = document.getElementById('employeeForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                if (!this.validateEmployeeForm()) {
                    e.preventDefault();
                }
            });
        }
    }

    setupTimeFormValidation() {
        const form = document.getElementById('timeTrackingForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                if (!this.validateTimeForm()) {
                    e.preventDefault();
                }
            });
        }
    }

    setupLeaveFormValidation() {
        const form = document.getElementById('leaveForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                if (!this.validateLeaveForm()) {
                    e.preventDefault();
                }
            });
        }
    }

    setupTaskFormValidation() {
        const form = document.getElementById('taskForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                if (!this.validateTaskForm()) {
                    e.preventDefault();
                }
            });
        }
    }

    validateEmployeeForm() {
        const firstName = document.getElementById('empFirstName').value.trim();
        const lastName = document.getElementById('empLastName').value.trim();
        const email = document.getElementById('empEmail').value.trim();
        const phone = document.getElementById('empPhone').value.trim();
        
        if (!firstName || !lastName) {
            this.showError('Please enter both first and last name');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address');
            return false;
        }
        
        if (!this.isValidPhone(phone)) {
            this.showError('Please enter a valid phone number');
            return false;
        }
        
        return true;
    }

    validateTimeForm() {
        const empId = document.getElementById('empId').value.trim();
        const empName = document.getElementById('empName').value.trim();
        const date = document.getElementById('timeDate').value;
        const loginTime = document.getElementById('loginTime').value;
        
        if (!empId || !empName) {
            this.showError('Please enter employee ID and name');
            return false;
        }
        
        if (!date) {
            this.showError('Please select a date');
            return false;
        }
        
        if (!loginTime) {
            this.showError('Please enter login time');
            return false;
        }
        
        return true;
    }

    validateLeaveForm() {
        const employee = document.getElementById('leaveEmployee').value;
        const type = document.getElementById('leaveType').value;
        const startDate = document.getElementById('leaveStartDate').value;
        const endDate = document.getElementById('leaveEndDate').value;
        const manager = document.getElementById('leaveManager').value;
        const reason = document.getElementById('leaveReason').value.trim();
        
        if (!employee || !type || !startDate || !endDate || !manager || !reason) {
            this.showError('Please fill in all required fields');
            return false;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            this.showError('End date must be after start date');
            return false;
        }
        
        return true;
    }

    validateTaskForm() {
        const title = document.getElementById('taskTitle').value.trim();
        const assignee = document.getElementById('taskAssignee').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const description = document.getElementById('taskDescription').value.trim();
        
        if (!title || !assignee || !priority || !dueDate || !description) {
            this.showError('Please fill in all required fields');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.length >= 10;
    }

    showError(message) {
        showToast('error', 'Validation Error', message);
    }
}

// ====== ENHANCED DATA EXPORT ======
class DataExporter {
    constructor() {
        this.initializeExport();
    }

    initializeExport() {
        this.setupExportButtons();
    }

    setupExportButtons() {
        // Export time data as CSV
        const exportTimeBtn = document.getElementById('exportTimeData');
        if (exportTimeBtn) {
            exportTimeBtn.addEventListener('click', () => {
                this.exportTimeDataCSV();
            });
        }

        // Export all data
        const exportAllBtn = document.getElementById('exportAllData');
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => {
                this.exportAllData();
            });
        }
    }

    exportTimeDataCSV() {
        const csvContent = this.convertToCSV(AppState.timeRecords);
        this.downloadFile(csvContent, 'time-records.csv', 'text/csv');
        showToast('success', 'Export Successful', 'Time records exported as CSV');
    }

    exportAllData() {
        const data = {
            employees: AppState.employees,
            timeRecords: AppState.timeRecords,
            leaveRequests: AppState.leaveRequests,
            tasks: AppState.tasks,
            contacts: AppState.contacts,
            settings: AppState.settings,
            exportDate: new Date().toISOString()
        };
        
        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, `emptrack-data-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
        showToast('success', 'Export Successful', 'All data exported successfully');
    }

    convertToCSV(data) {
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

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// ====== ENHANCED NOTIFICATIONS ======
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
    }

    showNotification(type, title, message, duration = 5000) {
        // Remove old notifications if limit reached
        if (this.notifications.length >= this.maxNotifications) {
            this.removeNotification(this.notifications[0]);
        }

        const toastContainer = document.getElementById('toastContainer');
        
        const notification = document.createElement('div');
        notification.className = `toast ${type}`;
        notification.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${this.getToastIcon(type)}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="notificationManager.removeNotification(this.parentElement)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(notification);
        this.notifications.push(notification);
        
        // Auto remove after duration
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
    }

    removeNotification(notification) {
        if (notification && notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }
    }

    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    clearAllNotifications() {
        this.notifications.forEach(notification => {
            this.removeNotification(notification);
        });
    }
}

// ====== INITIALIZATION ======
let taskBoard;
let dashboardCharts;
let advancedSearch;
let formValidator;
let dataExporter;
let notificationManager;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize enhanced components
    taskBoard = new TaskBoard();
    dashboardCharts = new DashboardCharts();
    advancedSearch = new AdvancedSearch();
    formValidator = new FormValidator();
    dataExporter = new DataExporter();
    notificationManager = new NotificationManager();
    
    // Override global showToast function
    window.showToast = (type, title, message) => {
        notificationManager.showNotification(type, title, message);
    };
    
    // Update charts when page changes
    const originalNavigateToPage = window.navigateToPage;
    window.navigateToPage = function(page) {
        originalNavigateToPage(page);
        
        if (page === 'dashboard') {
            setTimeout(() => {
                dashboardCharts.updateCharts();
            }, 100);
        }
    };
});

// ====== UTILITY FUNCTIONS ======
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDateRelative(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS animation for slide out
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
