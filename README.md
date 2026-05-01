# EmpTrack - Enterprise Employee Management System

A comprehensive, modern, and responsive employee management system built with vanilla JavaScript, HTML5, and CSS3. Features time tracking, employee management, leave requests, task management, and real-time analytics.

## 🌟 Features

### Core Functionality
- **🏠 Home Dashboard** - Real-time analytics with interactive charts
- **⏰ Time Tracking** - Simple 5-field time entry system with automatic hour calculation
- **👥 Employee Management** - Complete CRUD operations with department organization
- **📅 Leave Management** - Request/approval workflow with status tracking
- **📋 Task Management** - Drag-and-drop Kanban board with priority levels
- **👥 Team Organization** - Department-wise team structure visualization
- **📧 Contact System** - Professional contact form and office information
- **⚙️ Settings** - Profile configuration and data management

### Advanced Features
- **📊 Interactive Charts** - Weekly activity and department distribution
- **🔍 Advanced Search** - Real-time filtering across all modules
- **💾 Data Persistence** - Local storage with export/import functionality
- **🌙 Dark Mode** - Complete theme switching capability
- **📱 Responsive Design** - Mobile-friendly with adaptive layouts
- **✨ Animations** - Smooth transitions and micro-interactions
- **🔔 Notifications** - Non-intrusive toast notifications
- **📤 Export Options** - CSV and JSON data export

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/emptrack.git
   cd emptrack
   ```

2. Open `index.html` in your web browser:
   ```bash
   # Simply double-click index.html or use:
   open index.html  # macOS
   start index.html  # Windows
   ```

3. The application is ready to use!

## 📁 Project Structure

```
emptrack/
├── index.html                 # Main application file
├── assets/
│   ├── css/
│   │   ├── main.css          # Core styles and themes
│   │   └── components.css    # Enhanced component styles
│   ├── js/
│   │   ├── app.js            # Main application logic
│   │   └── components.js     # Enhanced components and interactions
│   └── images/               # Static images and icons
├── components/               # Reusable component templates
├── pages/                   # Page-specific templates
├── utils/                   # Utility functions
└── README.md               # This file
```

## 🎯 Usage Guide

### Time Tracking
1. Navigate to **Timing** from the navigation menu
2. Fill in the 5 required fields:
   - Employee ID
   - Employee Name
   - Date
   - Login Time
   - Logout Time
3. Total hours are automatically calculated
4. Records are saved instantly and appear in the table below

### Employee Management
1. Go to **Employees** section
2. Click "Add Employee" to register new staff
3. Use search and filters to find specific employees
4. Edit or delete employee records as needed

### Task Management
1. Navigate to **Tasks** section
2. Create tasks with title, assignee, priority, and due date
3. Use the drag-and-drop board to change task status
4. Tasks are organized into: Pending, In Progress, and Completed

### Leave Management
1. Access **Leave** section
2. Submit leave requests with type, dates, and reason
3. Managers can approve/reject requests
4. Track status of all leave applications

## 🎨 Design Features

### Visual Design
- **Modern UI** - Clean, professional interface with gradient backgrounds
- **Color System** - Comprehensive color palette with semantic meaning
- **Typography** - Inter font family for optimal readability
- **Icons** - Font Awesome integration throughout

### User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode** - Toggle between light and dark themes
- **Animations** - Smooth transitions and hover effects
- **Loading States** - Skeleton loaders and progress indicators
- **Form Validation** - Real-time validation with helpful error messages

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup and modern features
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **JavaScript ES6+** - Modern JavaScript with classes and modules
- **Chart.js** - Interactive data visualization
- **Font Awesome** - Professional icon library

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- **Optimized Assets** - Minified CSS and JavaScript
- **Lazy Loading** - Components load as needed
- **Efficient DOM** - Minimal DOM manipulation
- **Local Storage** - Fast data persistence

## 📊 Data Management

### Storage
- **Local Storage** - All data persists between sessions
- **Export Options** - Download data as CSV or JSON
- **Import Capability** - Restore data from backup files
- **Auto-save** - Changes saved automatically

### Data Structure
```javascript
{
  employees: [...],
  timeRecords: [...],
  leaveRequests: [...],
  tasks: [...],
  contacts: [...],
  settings: {...}
}
```

## 🔒 Security Features

- **Client-side Only** - No server communication required
- **Local Storage** - Data stays on user's device
- **Input Validation** - All user inputs are validated
- **XSS Protection** - Safe DOM manipulation practices

## 🌐 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main` or `gh-pages`)
4. Access at `https://username.github.io/emptrack`

### Netlify/Vercel
1. Connect repository to platform
2. Configure build settings (if needed)
3. Deploy automatically on push

### Custom Server
1. Upload files to web server
2. Ensure proper MIME types are configured
3. Access through your domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test on multiple browsers
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues
- **Data not saving**: Check browser local storage settings
- **Charts not displaying**: Ensure Chart.js CDN is accessible
- **Mobile layout issues**: Refresh browser cache

### Getting Help
- Create an issue on GitHub
- Check existing issues and discussions
- Review documentation and examples

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Complete employee management system
- ✅ Time tracking with 5-field entry
- ✅ Task management with drag-and-drop
- ✅ Leave management system
- ✅ Responsive design and themes
- ✅ Data export/import functionality
- ✅ Interactive dashboard with charts

## 🌟 Acknowledgments

- **Font Awesome** - Professional icon library
- **Chart.js** - Data visualization library
- **Inter Font** - Modern typography
- **Google Fonts** - Web font hosting

---

**EmpTrack** - Simplifying employee management with modern technology.

Made with ❤️ for efficient workforce management.
