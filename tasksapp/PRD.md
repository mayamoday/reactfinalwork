# Product Requirements Document (PRD)
## Task Manager Application

**Version:** 1.0  
**Date:** January 14, 2026  
**Project:** React 19 Task Manager with Vite  
**Status:** Planning Phase

---

## 1. Overview

### 1.1 Purpose
This document outlines the requirements for developing a Task Manager application using React 19 and Vite. The application will allow users to manage their daily tasks with features including adding, editing, deleting, filtering, and persisting tasks locally.

### 1.2 Scope
This is a single-page application (SPA) that runs entirely on the client-side with no backend integration. All data persistence will be handled through browser localStorage.

---

## 2. Technical Stack & Constraints

### 2.1 Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI Framework |
| Vite | Latest | Build Tool & Dev Server |
| JavaScript | ES6+ | Programming Language |
| CSS/CSS Modules | - | Styling |

### 2.2 Technical Constraints
- ✅ **MUST USE:** Functional Components only
- ✅ **MUST USE:** `useState` and `useEffect` hooks for state management
- ✅ **MUST USE:** Standard CSS or CSS Modules for styling
- ❌ **DO NOT USE:** Class Components
- ❌ **DO NOT USE:** Redux, Zustand, Context API, or any external state management
- ❌ **DO NOT USE:** React Router or any routing library
- ❌ **DO NOT USE:** UI component libraries (Material-UI, Ant Design, etc.)

---

## 3. Component Architecture

### 3.1 Component Hierarchy

```
App (Container Component)
├── TaskInput (Presentational Component)
├── TaskFilters (Presentational Component)
└── TaskList (Container Component)
    └── TaskItem (Presentational Component) [multiple instances]
```

### 3.2 Component Specifications

#### 3.2.1 App Component
**Responsibility:** Main application container and state orchestrator

**State Management:**
- `tasks`: Array of task objects
- `filter`: Current active filter ('all', 'active', 'completed')

**Key Functions:**
- `addTask(text)`: Adds a new task to the list
- `toggleTask(id)`: Toggles task completion status
- `editTask(id, newText)`: Updates task text
- `deleteTask(id)`: Removes a task from the list
- `setFilter(filterType)`: Changes the active filter

**Effects:**
- Load tasks from localStorage on mount
- Save tasks to localStorage whenever tasks array changes

**Props Passed Down:**
- To TaskInput: `onAddTask`
- To TaskFilters: `currentFilter`, `onFilterChange`, `activeTaskCount`
- To TaskList: `tasks`, `onToggle`, `onEdit`, `onDelete`

---

#### 3.2.2 TaskInput Component
**Responsibility:** User interface for adding new tasks

**Local State:**
- `inputValue`: Current text in the input field

**Props Received:**
- `onAddTask(text)`: Callback function to add task

**UI Elements:**
- Text input field for task description
- Submit button (or form submission on Enter key)

**Behavior:**
- Clear input after successful task addition
- Prevent empty task submission
- Handle form submission properly

---

#### 3.2.3 TaskFilters Component
**Responsibility:** Filter controls and active task counter

**Props Received:**
- `currentFilter`: Currently active filter ('all', 'active', 'completed')
- `onFilterChange(filterType)`: Callback to change filter
- `activeTaskCount`: Number of incomplete tasks

**UI Elements:**
- Three filter buttons: "All", "Active", "Completed"
- Visual indication of active filter (highlighted/different style)
- Counter display showing number of active tasks

**Behavior:**
- Highlight the currently selected filter button
- Update counter dynamically based on active tasks

---

#### 3.2.4 TaskList Component
**Responsibility:** Renders filtered list of tasks

**Props Received:**
- `tasks`: Array of task objects to display
- `onToggle(id)`: Callback to toggle task completion
- `onEdit(id, newText)`: Callback to edit task
- `onDelete(id)`: Callback to delete task

**Behavior:**
- Map through tasks array and render TaskItem for each
- Pass down appropriate callbacks to each TaskItem
- Handle empty state (when no tasks match filter)

---

#### 3.2.5 TaskItem Component
**Responsibility:** Individual task display and interaction

**Local State:**
- `isEditing`: Boolean to toggle edit mode
- `editText`: Temporary text value during editing

**Props Received:**
- `task`: Task object `{ id, text, completed }`
- `onToggle(id)`: Callback to toggle completion
- `onEdit(id, newText)`: Callback to save edited text
- `onDelete(id)`: Callback to delete task

**UI Elements:**
- Checkbox or toggle for completion status
- Task text (strikethrough if completed)
- Edit button/icon
- Delete button/icon
- Input field (when in edit mode)
- Save/Cancel buttons (when in edit mode)

**Behavior:**
- Toggle completion status on checkbox click
- Enter edit mode on edit button click
- Save changes and exit edit mode on save
- Cancel changes and exit edit mode on cancel
- Visual distinction between completed and active tasks

---

## 4. Data Model

### 4.1 Task Object Structure
```javascript
{
  id: string,        // Unique identifier (Date.now() or crypto.randomUUID())
  text: string,      // Task description
  completed: boolean // Completion status
}
```

### 4.2 Filter Types
- `'all'`: Show all tasks
- `'active'`: Show only incomplete tasks (completed: false)
- `'completed'`: Show only completed tasks (completed: true)

---

## 5. Functional Requirements

### 5.1 Core Features

#### FR-1: Add Task
- **Description:** User can create a new task with a text description
- **Acceptance Criteria:**
  - Input field accepts text
  - Task is added when form is submitted (Enter key or button click)
  - Input field is cleared after submission
  - Empty tasks are not added
  - New task appears in the list immediately
  - Task is saved to localStorage

#### FR-2: Toggle Task Completion
- **Description:** User can mark tasks as completed or active
- **Acceptance Criteria:**
  - Clicking checkbox/toggle updates task status
  - Completed tasks are visually distinct (e.g., strikethrough text)
  - Status change persists to localStorage
  - Counter updates to reflect new active task count

#### FR-3: Edit Task
- **Description:** User can modify the text of an existing task
- **Acceptance Criteria:**
  - Edit button enters edit mode for that task
  - Input field appears with current task text
  - User can modify the text
  - Save button commits the changes
  - Cancel button discards changes
  - Empty text is not allowed
  - Changes persist to localStorage

#### FR-4: Delete Task
- **Description:** User can remove a task from the list
- **Acceptance Criteria:**
  - Delete button removes the task
  - Task disappears from the list immediately
  - Deletion persists to localStorage
  - Counter updates if an active task was deleted

#### FR-5: Filter Tasks
- **Description:** User can filter tasks by status
- **Acceptance Criteria:**
  - Three filter buttons: "All", "Active", "Completed"
  - "All" shows all tasks
  - "Active" shows only incomplete tasks
  - "Completed" shows only completed tasks
  - Active filter button is visually highlighted
  - Filter state is maintained during operations

#### FR-6: Active Task Counter
- **Description:** Display count of incomplete tasks
- **Acceptance Criteria:**
  - Counter shows number of active (incomplete) tasks
  - Updates dynamically when tasks are added/deleted/toggled
  - Format: "X active task(s)" or similar

#### FR-7: Data Persistence
- **Description:** Tasks persist across browser sessions
- **Acceptance Criteria:**
  - Tasks are saved to localStorage on any change
  - Tasks are loaded from localStorage on app initialization
  - App works correctly with empty localStorage (new user)
  - LocalStorage key: "tasks" or "taskManagerTasks"

---

## 6. Non-Functional Requirements

### 6.1 Performance
- App should load in under 2 seconds
- UI operations should feel instantaneous (<100ms)
- No unnecessary re-renders

### 6.2 Code Quality
- Clean, readable code with meaningful variable names
- Comments explaining complex logic
- Proper component structure following React best practices
- Props down, events up pattern strictly followed
- No prop drilling beyond 2 levels (if needed, keep component hierarchy shallow)

### 6.3 User Experience
- Responsive design (works on mobile, tablet, desktop)
- Clean and intuitive UI
- Visual feedback for user actions
- Accessible controls (proper HTML semantics)

### 6.4 Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- LocalStorage support required

---

## 7. UI/UX Guidelines

### 7.1 Visual Design Principles
- Clean, minimalist interface
- Clear visual hierarchy
- Adequate spacing and padding
- Readable typography
- Consistent color scheme

### 7.2 Interactive Elements
- Hover states on buttons
- Focus states for accessibility
- Disabled states where appropriate
- Loading/transition states if needed

### 7.3 Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 8. Implementation Guidelines

### 8.1 File Structure
```
tasksapp/
├── src/
│   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── TaskInput.jsx
│   │   ├── TaskInput.css
│   │   ├── TaskFilters.jsx
│   │   ├── TaskFilters.css
│   │   ├── TaskList.jsx
│   │   ├── TaskList.css
│   │   ├── TaskItem.jsx
│   │   └── TaskItem.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

### 8.2 Code Standards
- Use functional components with hooks
- Destructure props at component entry
- Use meaningful prop names
- Add PropTypes or TypeScript types (optional but recommended)
- Keep components focused and single-responsibility
- Extract reusable logic where appropriate

### 8.3 State Management Pattern
```javascript
// In App.jsx
const [tasks, setTasks] = useState([]);
const [filter, setFilter] = useState('all');

// Load from localStorage
useEffect(() => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    setTasks(JSON.parse(savedTasks));
  }
}, []);

// Save to localStorage
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]);
```

### 8.4 ID Generation
Use one of these methods consistently:
```javascript
// Option 1: Date.now() + random
const id = `${Date.now()}-${Math.random()}`;

// Option 2: crypto.randomUUID() (modern browsers)
const id = crypto.randomUUID();
```

---

## 9. Acceptance Criteria & Testing

### 9.1 User Acceptance Tests

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| UAT-1 | Add a new task | Task appears in list, input clears |
| UAT-2 | Add empty task | Nothing happens, validation prevents |
| UAT-3 | Toggle task to completed | Task has strikethrough, counter decreases |
| UAT-4 | Toggle completed task to active | Strikethrough removed, counter increases |
| UAT-5 | Edit task text | Text updates, changes persist |
| UAT-6 | Cancel edit | Original text remains unchanged |
| UAT-7 | Delete task | Task removed from list |
| UAT-8 | Filter to Active | Only incomplete tasks shown |
| UAT-9 | Filter to Completed | Only completed tasks shown |
| UAT-10 | Filter to All | All tasks shown |
| UAT-11 | Refresh page | Tasks persist from localStorage |
| UAT-12 | First-time user | App works with no existing data |

---

## 10. Development Phases

### Phase 1: Project Setup ✓
- Initialize Vite project
- Set up React 19
- Configure project structure

### Phase 2: Core Components (MVP)
- Implement App component with basic state
- Implement TaskInput component
- Implement TaskList component
- Implement TaskItem component (read-only view)

### Phase 3: Task Operations
- Add task creation logic
- Add task deletion logic
- Add task toggle logic

### Phase 4: Advanced Features
- Implement edit functionality
- Implement TaskFilters component
- Add filtering logic

### Phase 5: Persistence
- Implement localStorage save
- Implement localStorage load

### Phase 6: Styling & Polish
- Apply CSS styling
- Ensure responsiveness
- Add visual feedback
- Polish UX details

### Phase 7: Testing & Refinement
- User acceptance testing
- Bug fixes
- Performance optimization
- Final code review

---

## 11. Known Limitations & Future Enhancements

### 11.1 Current Limitations
- No backend/server storage
- No multi-user support
- No task categories or tags
- No due dates or priorities
- No drag-and-drop reordering
- No undo/redo functionality

### 11.2 Potential Future Features
- Task categories/projects
- Due dates and reminders
- Task priorities
- Search functionality
- Bulk operations
- Import/Export tasks
- Dark mode
- Keyboard shortcuts
- Task notes/descriptions

---

## 12. Success Metrics

The project will be considered successful when:
- ✅ All 5 components are properly implemented
- ✅ All functional requirements (FR-1 through FR-7) work correctly
- ✅ All 12 User Acceptance Tests pass
- ✅ Code follows React best practices
- ✅ No technical constraints are violated
- ✅ UI is responsive and user-friendly
- ✅ Data persists across browser sessions

---

## Appendix A: React Best Practices Checklist

- [ ] Functional components only
- [ ] Proper use of useState for local state
- [ ] Proper use of useEffect for side effects
- [ ] Props passed down, events bubbled up
- [ ] No prop drilling issues
- [ ] Proper key props in lists
- [ ] Controlled components for forms
- [ ] Prevent default on form submissions
- [ ] Clean up effects if needed
- [ ] Meaningful component and variable names
- [ ] Comments for complex logic
- [ ] DRY (Don't Repeat Yourself) principle
- [ ] Single Responsibility Principle per component

---

## Appendix B: LocalStorage Schema

**Key:** `taskManagerTasks`

**Value:** JSON stringified array of task objects
```json
[
  {
    "id": "1705234567890-0.123456789",
    "text": "Complete project documentation",
    "completed": false
  },
  {
    "id": "1705234567891-0.987654321",
    "text": "Review pull requests",
    "completed": true
  }
]
```

---

**Document Status:** Ready for Development  
**Next Step:** Begin implementation according to Phase 2 (Core Components)

